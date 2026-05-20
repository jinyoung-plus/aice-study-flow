// Minimal markdown renderer that supports:
// - fenced code blocks ```lang ... ``` (with monospace + bg)
// - inline `code`
// - paragraphs
// Safe: it escapes HTML.
function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[c]!));
}

export function Markdown({ source }: { source: string }) {
  const parts: React.ReactNode[] = [];
  const lines = source.split(/\r?\n/);
  let i = 0;
  let key = 0;
  while (i < lines.length) {
    const m = /^```(\w*)\s*$/.exec(lines[i]);
    if (m) {
      const lang = m[1];
      i++;
      const buf: string[] = [];
      while (i < lines.length && !/^```\s*$/.test(lines[i])) {
        buf.push(lines[i]); i++;
      }
      if (i < lines.length) i++; // skip closing
      parts.push(
        <pre key={key++} className="my-3 overflow-x-auto rounded-md bg-slate-900 p-4 text-[13px] leading-relaxed text-slate-100">
          <code className={`font-mono ${lang ? `language-${lang}` : ""}`}>{buf.join("\n")}</code>
        </pre>
      );
      continue;
    }
    // Group consecutive non-blank lines into a paragraph
    const buf: string[] = [];
    while (i < lines.length && lines[i].trim() !== "" && !/^```/.test(lines[i])) {
      buf.push(lines[i]); i++;
    }
    if (buf.length) {
      const text = buf.join(" ");
      // inline code
      const segs = text.split(/(`[^`]+`)/g);
      parts.push(
        <p key={key++} className="my-2 text-[15px] leading-7 text-slate-800">
          {segs.map((s, idx) =>
            s.startsWith("`") && s.endsWith("`") ? (
              <code key={idx} className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[13px] text-indigo-700">
                {s.slice(1, -1)}
              </code>
            ) : (
              <span key={idx} dangerouslySetInnerHTML={{ __html: escapeHtml(s) }} />
            )
          )}
        </p>
      );
    }
    // blank lines
    while (i < lines.length && lines[i].trim() === "") i++;
  }
  return <div>{parts}</div>;
}
