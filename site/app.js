const packet = JSON.parse(document.getElementById('case-data').textContent);

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

const reviewList = document.getElementById('reviews');
for (const [index, review] of packet.reviews.entries()) {
  const card = element('article', 'review-card');
  const header = element('div', 'review-header');
  const number = element('span', 'review-number', String(index + 1).padStart(2, '0'));
  const titleGroup = element('div', 'review-title-group');
  titleGroup.append(element('h3', '', review.name), element('p', '', review.scope));
  header.append(number, titleGroup, element('span', 'review-state', review.state));
  card.append(header);

  const columns = element('div', 'review-content');
  const findings = element('section', 'finding-section');
  findings.append(element('h4', '', 'Findings'));
  const findingList = element('ul', 'finding-list');
  for (const finding of review.findings) {
    const item = element('li');
    item.append(element('p', '', finding.text));
    const sources = element('div', 'sources');
    for (const file of finding.source.split(' · ')) {
      const link = element('a', '', file);
      link.href = `./evidence/${file}`;
      link.target = '_blank';
      link.rel = 'noopener';
      sources.append(link);
    }
    item.append(sources);
    findingList.append(item);
  }
  findings.append(findingList);

  const questions = element('section', 'question-section');
  questions.append(element('h4', '', 'Open questions'));
  const questionList = element('ul', 'question-list');
  for (const question of review.questions) questionList.append(element('li', '', question));
  questions.append(questionList);
  columns.append(findings, questions);
  card.append(columns);
  if (review.internalNote) {
    const note = element('div', 'internal-note');
    note.append(element('strong', '', 'Staff escalation note'), element('p', '', review.internalNote));
    card.append(note);
  }
  reviewList.append(card);
}

document.getElementById('reply-recipient').textContent = packet.reply.recipient;
document.getElementById('reply-subject').textContent = packet.reply.subject;
const replyBody = document.getElementById('reply-body');
for (const paragraph of packet.reply.paragraphs) replyBody.append(element('p', '', paragraph));
