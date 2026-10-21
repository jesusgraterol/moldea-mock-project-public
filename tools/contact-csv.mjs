import { parseArgs } from "node:util";

const columns = ["team", "name", "email"];

function escapeCell(value) {
  return /[",\r\n]/.test(value) ? `"${value.replaceAll('"', '""')}"` : value;
}

async function main() {
  try {
    const { tokens } = parseArgs({ options: {}, tokens: true });
    if (tokens.length !== 0) throw new Error("No arguments are supported.");
  } catch {
    throw new Error("Unsupported command-line arguments.");
  }

  let input = "";
  try {
    process.stdin.setEncoding("utf8");
    for await (const chunk of process.stdin) input += chunk;
  } catch {
    throw new Error("Unable to read stdin.");
  }

  let rows;
  try {
    rows = JSON.parse(input);
  } catch {
    throw new Error("Malformed JSON.");
  }
  if (!Array.isArray(rows)) throw new Error("Expected a JSON array.");

  const lines = [columns.join(",")];
  for (const [index, row] of rows.entries()) {
    if (row === null || typeof row !== "object" || Array.isArray(row)) {
      throw new Error(`Row ${index + 1} must be an object.`);
    }
    for (const column of columns) {
      if (typeof row[column] !== "string" || row[column].trim().length === 0) {
        throw new Error(`Row ${index + 1}: ${column} must be a nonempty string.`);
      }
    }
    lines.push(columns.map((column) => escapeCell(row[column])).join(","));
  }

  // Emit only after every row is valid; failures never leave partial CSV.
  await new Promise((resolve, reject) => {
    const fail = () => reject(new Error("Unable to write CSV."));
    process.stdout.once("error", fail);
    process.stdout.write(`${lines.join("\n")}\n`, (error) => error ? fail() : resolve());
  });
}

try {
  await main();
} catch (error) {
  console.error(`contact-csv: ${error instanceof Error ? error.message : "Export failed."}`);
  process.exitCode = 1;
}
