import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import { test } from "node:test";

const exporter = resolve(import.meta.dirname, "contact-csv.mjs");
const contact = { team: "Front desk", name: "Ada", email: "ada@example.test" };

function runExporter(input, args = []) {
  return new Promise((resolveResult, reject) => {
    const child = execFile(process.execPath, [exporter, ...args], {
      cwd: tmpdir(),
      encoding: "utf8",
      signal: AbortSignal.timeout(5_000),
      timeout: 5_000,
      maxBuffer: 1024 * 1024,
    }, (error, stdout, stderr) => {
      // Timeouts, signals, output limits, and spawn errors are test failures,
      // not successful demonstrations of the exporter's validation behavior.
      if (error && (error.killed || error.signal || typeof error.code !== "number")) {
        reject(error);
        return;
      }
      resolveResult({ code: error ? error.code : 0, stdout, stderr });
    });
    child.stdin.on("error", (error) => {
      if (error.code !== "EPIPE") reject(error);
    });
    child.stdin.end(input);
  });
}

function assertFailure(result, message) {
  assert.equal(result.code, 1);
  assert.equal(result.stdout, "");
  assert.match(result.stderr, /^contact-csv: [^\r\n]+\n$/);
  assert.match(result.stderr, message);
}

test("empty array produces only the header", async () => {
  assert.deepEqual(await runExporter("[]"), { code: 0, stdout: "team,name,email\n", stderr: "" });
});

test("preserves row order and fixes column order, ignoring unrelated properties", async () => {
  const result = await runExporter(JSON.stringify([
    { email: "z@example.test", name: "Zoe", team: "Stage", ignored: "not exported" },
    contact,
  ]));
  assert.deepEqual(result, {
    code: 0,
    stdout: "team,name,email\nStage,Zoe,z@example.test\nFront desk,Ada,ada@example.test\n",
    stderr: "",
  });
});

test("--sort=name orders contacts alphabetically without case affecting order", async () => {
  const result = await runExporter(JSON.stringify([
    { ...contact, name: "Zoe" },
    { ...contact, name: "bob" },
    { ...contact, name: "Ada" },
    { ...contact, name: "CHARLIE" },
    { ...contact, name: "aaron" },
  ]), ["--sort=name"]);
  assert.deepEqual(result, {
    code: 0,
    stdout: "team,name,email\nFront desk,aaron,ada@example.test\nFront desk,Ada,ada@example.test\nFront desk,bob,ada@example.test\nFront desk,CHARLIE,ada@example.test\nFront desk,Zoe,ada@example.test\n",
    stderr: "",
  });
});

const equalNameContacts = [
  { team: "Z", name: "bob", email: "z@example.test" },
  { team: "Y", name: "ADA", email: "y@example.test" },
  { team: "A", name: "BOB", email: "a@example.test" },
  { team: "B", name: "Ada", email: "b@example.test" },
  { team: "M", name: "Bob", email: "m@example.test" },
];

test("equal names retain their original relative order across case variants", async () => {
  const result = await runExporter(JSON.stringify(equalNameContacts), ["--sort=name"]);
  assert.deepEqual(result, {
    code: 0,
    stdout: "team,name,email\nY,ADA,y@example.test\nB,Ada,b@example.test\nZ,bob,z@example.test\nA,BOB,a@example.test\nM,Bob,m@example.test\n",
    stderr: "",
  });
});

test("without the flag, the same mixed-case contacts remain in input order", async () => {
  const result = await runExporter(JSON.stringify(equalNameContacts));
  assert.deepEqual(result, {
    code: 0,
    stdout: "team,name,email\nZ,bob,z@example.test\nY,ADA,y@example.test\nA,BOB,a@example.test\nB,Ada,b@example.test\nM,Bob,m@example.test\n",
    stderr: "",
  });
});

test("sorting preserves all accepted field text and CSV escaping", async () => {
  const result = await runExporter(JSON.stringify([
    { team: "  Stage  ", name: '  zoe "Z"\n', email: " zoe@example.test " },
    { team: "Front,desk", name: "  Ada, A ", email: " ada@example.test " },
  ]), ["--sort=name"]);
  assert.deepEqual(result, {
    code: 0,
    stdout: 'team,name,email\n"Front,desk","  Ada, A ", ada@example.test \n  Stage  ,"  zoe ""Z""\n", zoe@example.test \n',
    stderr: "",
  });
});

test("--sort=name still emits only the header for an empty array", async () => {
  assert.deepEqual(await runExporter("[]", ["--sort=name"]), { code: 0, stdout: "team,name,email\n", stderr: "" });
});

test("sorting validates rows before sorting or writing CSV", async () => {
  const result = await runExporter(JSON.stringify([contact, { ...contact, name: null }]), ["--sort=name"]);
  assertFailure(result, /Row 2: name must be a nonempty string/);
});

test("escapes commas, doubles quotes, and preserves LF, CR, and CRLF inside cells", async () => {
  const result = await runExporter(JSON.stringify([
    { team: "Front,desk", name: 'Ada "Ace"\nLovelace', email: 'ada,"ace"@example.test' },
    { team: "Stage\rCrew", name: "Grace\r\nHopper", email: "grace\nhopper@example.test" },
  ]));
  assert.deepEqual(result, {
    code: 0,
    stdout: 'team,name,email\n"Front,desk","Ada ""Ace""\nLovelace","ada,""ace""@example.test"\n"Stage\rCrew","Grace\r\nHopper","grace\nhopper@example.test"\n',
    stderr: "",
  });
});

test("preserves accepted whitespace and Unicode without imposing email-format validation", async () => {
  const result = await runExporter(JSON.stringify([{ team: "  Réception  ", name: "李", email: " front desk " }]));
  assert.deepEqual(result, { code: 0, stdout: "team,name,email\n  Réception  ,李, front desk \n", stderr: "" });
});

for (const input of ["", "[{", "[] trailing text"]) {
  test(`malformed JSON fails concisely: ${JSON.stringify(input)}`, async () => {
    assertFailure(await runExporter(input), /Malformed JSON/);
  });
}

for (const value of [null, {}, "contacts", 42, true]) {
  test(`non-array JSON is rejected: ${JSON.stringify(value)}`, async () => {
    assertFailure(await runExporter(JSON.stringify(value)), /Expected a JSON array/);
  });
}

for (const row of [null, [], "contact", 42, true]) {
  test(`non-object row is rejected without partial output: ${JSON.stringify(row)}`, async () => {
    assertFailure(await runExporter(JSON.stringify([contact, row])), /Row 2 must be an object/);
  });
}

for (const field of ["team", "name", "email"]) {
  for (const invalid of [undefined, null, false, 0, "", " \t\n "]) {
    test(`${field} rejects ${JSON.stringify(invalid)} without partial output`, async () => {
      const result = await runExporter(JSON.stringify([contact, { ...contact, [field]: invalid }]));
      assertFailure(result, new RegExp(`Row 2: ${field} must be a nonempty string`));
    });
  }
}

for (const args of [
  ["--help"], ["--format", "csv"], ["contacts.json"], ["--"], ["--", "contacts.json"],
  ["--sort"], ["--sort=email"], ["--sort=NAME"], ["--sort="],
  ["--sort=name", "--sort=name"], ["--sort=name", "--help"], ["--sort=name", "contacts.json"], ["--sort=name", "--"],
]) {
  test(`unsupported arguments fail before reading malformed input: ${JSON.stringify(args)}`, async () => {
    assertFailure(await runExporter("not JSON", args), /Unsupported command-line arguments/);
  });
}
