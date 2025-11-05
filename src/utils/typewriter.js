// Utilities to support typing HTML strings while keeping tags intact
// We treat HTML tags as zero-width for typing purposes and ensure result HTML is valid by closing any open tags.

const SELF_CLOSING = new Set(['br', 'hr', 'img', 'input', 'meta', 'link', 'source']);

export function sliceHtmlByTextCount(html, visibleCountTarget) {
  let visible = 0;
  let i = 0;
  const n = html.length;
  let out = '';
  const stack = [];

  const pushTag = (tagName) => {
    if (!SELF_CLOSING.has(tagName)) stack.push(tagName);
  };
  const popTag = (tagName) => {
    const idx = stack.lastIndexOf(tagName);
    if (idx !== -1) stack.splice(idx, 1);
  };

  while (i < n && visible < visibleCountTarget) {
    const ch = html[i];
    if (ch === '<') {
      // Read full tag
      const end = html.indexOf('>', i + 1);
      if (end === -1) break; // malformed; bail out
      const tagContent = html.slice(i + 1, end).trim();
      const isClosing = tagContent.startsWith('/');
      const isSelfClose = tagContent.endsWith('/') || SELF_CLOSING.has(tagContent.split(/[\s/>]/)[0].replace('/', '').toLowerCase());
      // Update stack
      if (isClosing) {
        const name = tagContent.slice(1).split(/[\s>]/)[0].toLowerCase();
        popTag(name);
      } else if (!isSelfClose) {
        const name = tagContent.split(/[\s>]/)[0].toLowerCase();
        pushTag(name);
      }
      out += html.slice(i, end + 1);
      i = end + 1;
      continue;
    }
    if (ch === '&') {
      // HTML entity; treat as one visible char
      const end = html.indexOf(';', i + 1);
      if (end !== -1) {
        out += html.slice(i, end + 1);
        i = end + 1;
        visible += 1;
        continue;
      }
    }
    // Regular char
    out += ch;
    i += 1;
    visible += 1;
  }

  // Close any open tags in reverse order
  if (i < n || visible >= visibleCountTarget) {
    for (let j = stack.length - 1; j >= 0; j -= 1) {
      out += `</${stack[j]}>`;
    }
  }

  return { html: out, visibleCount: visible };
}
