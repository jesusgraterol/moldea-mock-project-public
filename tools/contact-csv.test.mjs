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

for (const args of [["--help"], ["--format", "csv"], ["contacts.json"], ["--"], ["--", "contacts.json"]]) {
  test(`unsupported arguments fail before reading malformed input: ${JSON.stringify(args)}`, async () => {
    assertFailure(await runExporter("not JSON", args), /Unsupported command-line arguments/);
  });
}
