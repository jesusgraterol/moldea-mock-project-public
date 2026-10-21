import { parseArgs } from "node:util";

const columns = ["team", "name", "email"];

function escapeCell(value) {
  return /[",\r\n]/.test(value) ? `"${value.replaceAll('"', '""')}"` : value;
}

async function main() {
  let sortByName = false;
  try {
    const { values, tokens } = parseArgs({ options: { sort: { type: "string" } }, tokens: true });
    if (tokens.length > 1 || tokens.some((token) => token.kind !== "option" || token.name !== "sort")
      || (values.sort !== undefined && values.sort !== "name")) {
      throw new Error("Only --sort=name is supported.");
    }
    sortByName = values.sort === "name";
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

  for (const [index, row] of rows.entries()) {
    if (row === null || typeof row !== "object" || Array.isArray(row)) {
      throw new Error(`Row ${index + 1} must be an object.`);
    }
    for (const column of columns) {
      if (typeof row[column] !== "string" || row[column].trim().length === 0) {
        throw new Error(`Row ${index + 1}: ${column} must be a nonempty string.`);
      }
    }
  }

  // Ignore case, not accents. Pin the locale so host settings do not change
  // alphabetical order; the stable sort retains input order for equal names.
  const collator = new Intl.Collator("en", { sensitivity: "accent" });
  const orderedRows = sortByName ? rows.toSorted((left, right) => collator.compare(left.name, right.name)) : rows;
  const lines = [columns.join(","), ...orderedRows.map((row) => columns.map((column) => escapeCell(row[column])).join(","))];

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
