import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const script = fileURLToPath(new URL("./workshop-csv.mjs", import.meta.url));

function run(input) {
  return spawnSync(process.execPath, [script], { input, encoding: "utf8" });
}

function assertFailure(input, message) {
  const result = run(input);
  assert.equal(result.error, undefined);
  assert.equal(result.signal, null);
  assert.equal(result.status, 1);
  assert.equal(result.stdout, "", "Invalid input must not produce partial CSV");
  assert.match(result.stderr, message);
  assert.equal(result.stderr.trim().split("\n").length, 1, "Errors stay concise");
  assert.doesNotMatch(result.stderr, /\bat .*\.mjs:\d+/);
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

test("an empty array produces only the header", () => {
  const result = run("[]");
  assert.equal(result.status, 0);
  assert.equal(result.stderr, "");
  assert.equal(result.stdout, "workshop,name,seats\n");
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
  assertFailure(JSON.stringify([
    { workshop: "Repairs", name: "Ana", seats: 2 },
    { workshop: "Painting", name: "Kai", seats: null },
  ]), /Row 2:/);
});
