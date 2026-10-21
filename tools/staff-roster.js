function parsePeople(text) {
  let people;
  try {
    people = JSON.parse(text);
  } catch (error) {
    throw new Error(`stdin: invalid JSON (${error.message}).`, { cause: error });
  }
  if (!Array.isArray(people)) throw new Error('stdin: expected a JSON array of people.');
  people.forEach((person, index) => {
    if (person === null || typeof person !== 'object' || Array.isArray(person)) {
      throw new Error(`stdin: people[${index}] must be an object.`);
    }
    for (const field of ['name', 'role']) {
      if (typeof person[field] !== 'string' || person[field].trim().length === 0) {
        throw new Error(`stdin: people[${index}].${field} must be a non-empty string.`);
      }
    }
  });
  return people;
}

function cell(text) {
  return text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('\\', '\\\\')
    .replaceAll('|', '\\|')
    .replace(/\r\n|[\r\n\u2028\u2029]/g, '<br>');
}

try {
  process.stdin.setEncoding('utf8');
  let text = '';
  for await (const chunk of process.stdin) text += chunk;
  const people = parsePeople(text);
  const lines = ['| Name | Role |', '| --- | --- |'];
  for (const person of people) lines.push(`| ${cell(person.name)} | ${cell(person.role)} |`);
  console.log(lines.join('\n'));
} catch (error) {
  console.error(`staff-roster: ${error.message}`);
  process.exitCode = 2;
}
