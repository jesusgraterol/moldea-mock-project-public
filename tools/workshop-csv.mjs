#!/usr/bin/env node
import { readFileSync } from "node:fs";

function csvField(value) {
  const text = String(value);
  return /[",\r\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function toCsv(input) {
  let rows;
  try {
    rows = JSON.parse(input);
  } catch {
    throw new Error("Invalid JSON input.");
  }
  if (!Array.isArray(rows)) throw new Error("Expected a JSON array.");

  // Validate every row before writing, so failures never produce partial CSV.
  const lines = rows.map((row, index) => {
    if (row === null || typeof row !== "object" || Array.isArray(row)
      || typeof row.workshop !== "string" || typeof row.name !== "string"
      || !Number.isSafeInteger(row.seats) || row.seats < 0) {
      throw new Error(`Row ${index + 1}: expected string workshop/name and non-negative integer seats.`);
    }
    return [row.workshop, row.name, row.seats].map(csvField).join(",");
  });
  return ["workshop,name,seats", ...lines].join("\n") + "\n";
}

try {
  process.stdout.write(toCsv(readFileSync(0, "utf8")));
} catch (error) {
  process.stderr.write(`workshop-csv: ${error.message}\n`);
  process.exitCode = 1;
}
