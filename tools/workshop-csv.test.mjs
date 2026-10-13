import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const script = fileURLToPath(new URL("./workshop-csv.mjs", import.meta.url));

function run(input, args = []) {
  return spawnSync(process.execPath, [script, ...args], { input, encoding: "utf8" });
}

function assertFailure(input, message, args = []) {
  const result = run(input, args);
  assert.equal(result.error, undefined);
  assert.equal(result.signal, null);
  assert.equal(result.status, 1);
  assert.equal(result.stdout, "", "Invalid input must not produce partial CSV");
  assert.match(result.stderr, message);
  assert.equal(result.stderr.trim().split("\n").length, 1, "Errors stay concise");
  assert.doesNotMatch(result.stderr, /\bat .*\.mjs:\d+/);
  return result;
}

test("writes the header and preserves input row order, Unicode, and zero seats", () => {
  const result = run(JSON.stringify([
    { workshop: "Woodworking", name: "Zoë", seats: 3 },
    { workshop: "Repairs", name: "Ana", seats: 0 },
    { workshop: "Painting", name: "Kai", seats: 12 },
  ]));
  assert.equal(result.status, 0);
  assert.equal(result.stderr, "");
  assert.equal(result.stdout, "workshop,name,seats\nWoodworking,Zoë,3\nRepairs,Ana,0\nPainting,Kai,12\n");
});

test("an empty array produces only the header with or without sorting", () => {
  for (const args of [[], ["--sort=name"]]) {
    const result = run("[]", args);
    assert.equal(result.status, 0);
    assert.equal(result.stderr, "");
    assert.equal(result.stdout, "workshop,name,seats\n");
  }
});

test("--sort=name sorts alphabetically without regard to case, while the default retains input order", () => {
  const input = JSON.stringify([
    { workshop: "First", name: "zoe", seats: 1 },
    { workshop: "Second", name: "Bob", seats: 2 },
    { workshop: "Third", name: "ana", seats: 3 },
    { workshop: "Fourth", name: "ALICE", seats: 4 },
  ]);
  const original = run(input);
  assert.equal(original.status, 0);
  assert.equal(original.stderr, "");
  assert.equal(original.stdout, "workshop,name,seats\nFirst,zoe,1\nSecond,Bob,2\nThird,ana,3\nFourth,ALICE,4\n");

  const sorted = run(input, ["--sort=name"]);
  assert.equal(sorted.status, 0);
  assert.equal(sorted.stderr, "");
  assert.equal(sorted.stdout, "workshop,name,seats\nFourth,ALICE,4\nThird,ana,3\nSecond,Bob,2\nFirst,zoe,1\n");
});

test("--sort=name preserves original order for equal names, including case-only differences", () => {
  const result = run(JSON.stringify([
    { workshop: "First", name: "Pat", seats: 1 },
    { workshop: "Second", name: "pat", seats: 2 },
    { workshop: "Earlier alphabetically", name: "Ana", seats: 3 },
    { workshop: "Third", name: "Pat", seats: 4 },
    { workshop: "Fourth", name: "PAT", seats: 5 },
  ]), ["--sort=name"]);
  assert.equal(result.status, 0);
  assert.equal(result.stderr, "");
  assert.equal(result.stdout, "workshop,name,seats\nEarlier alphabetically,Ana,3\nFirst,Pat,1\nSecond,pat,2\nThird,Pat,4\nFourth,PAT,5\n");
});

test("sorted rows still escape commas, quotes, and newlines", () => {
  const result = run(JSON.stringify([
    { workshop: 'First,"Z"', name: "zoe\nZ", seats: 2 },
    { workshop: "Second\nrow", name: 'Ana, "A"', seats: 1 },
  ]), ["--sort=name"]);
  assert.equal(result.status, 0);
  assert.equal(result.stderr, "");
  assert.equal(result.stdout, 'workshop,name,seats\n"Second\nrow","Ana, ""A""",1\n"First,""Z""","zoe\nZ",2\n');
});

test("unsupported arguments fail clearly, including when mixed with --sort=name", () => {
  for (const arg of ["--sort=workshop", "--sort=Name", "--sort", "--unknown", "records.json"]) {
    for (const args of [[arg], ["--sort=name", arg]]) {
      const result = assertFailure("[]", /Unsupported argument/, args);
      assert.equal(result.stderr, `workshop-csv: Unsupported argument ${JSON.stringify(arg)}; only --sort=name is supported.\n`);
    }
  }
  assertFailure("", /Unsupported argument "--unknown"/, ["--unknown"]);
});

test("escapes commas, quotes, and LF or CRLF inside either string column", () => {
  const result = run(JSON.stringify([
    { workshop: 'Saw, "sand"', name: "Lee\nKim", seats: 2 },
    { workshop: "Repair\r\ndesk", name: 'Ana, "A"', seats: 1 },
    { workshop: "", name: '"', seats: 0 },
  ]));
  assert.equal(result.status, 0);
  assert.equal(result.stderr, "");
  assert.equal(result.stdout,
    'workshop,name,seats\n"Saw, ""sand""","Lee\nKim",2\n"Repair\r\ndesk","Ana, ""A""",1\n,"""",0\n');
});

test("malformed JSON fails with a concise error", () => {
  for (const input of ["", "[", "[{}", "not JSON", '[{"seats": NaN}]']) {
    assertFailure(input, /Invalid JSON input\./);
  }
});

test("non-array JSON fails", () => {
  for (const value of [null, {}, "workshop", 3, true]) {
    assertFailure(JSON.stringify(value), /Expected a JSON array\./);
  }
});

test("malformed rows and missing or incorrectly typed fields fail", () => {
  for (const row of [
    null, [], "workshop", 1, {},
    { name: "Ana", seats: 1 },
    { workshop: "Repairs", seats: 1 },
    { workshop: "Repairs", name: "Ana" },
    { workshop: 1, name: "Ana", seats: 1 },
    { workshop: "Repairs", name: null, seats: 1 },
    { workshop: "Repairs", name: "Ana", seats: "1" },
    { workshop: "Repairs", name: "Ana", seats: -1 },
    { workshop: "Repairs", name: "Ana", seats: 1.5 },
    { workshop: "Repairs", name: "Ana", seats: Number.MAX_SAFE_INTEGER + 1 },
  ]) {
    assertFailure(JSON.stringify([row]), /Row 1: expected string workshop\/name and non-negative integer seats\./);
  }
});

test("a later invalid row reports its position without emitting earlier rows", () => {
  for (const args of [[], ["--sort=name"]]) {
    assertFailure(JSON.stringify([
      { workshop: "Repairs", name: "Zoë", seats: 2 },
      { workshop: "Painting", name: "Ana", seats: null },
    ]), /Row 2:/, args);
  }
});
