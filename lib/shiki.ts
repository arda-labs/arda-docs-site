import { createHighlighter, type Highlighter } from 'shiki';

let highlighterPromise: Promise<Highlighter> | null = null;

async function getHighlighter(): Promise<Highlighter> {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: ['github-dark-dimmed'],
      langs: ['json', 'bash', 'go', 'typescript', 'http'],
    });
  }
  return highlighterPromise;
}

export async function highlightCode(code: string, lang: 'json' | 'bash' | 'go' | 'typescript' | 'http' | string): Promise<string> {
  try {
    const highlighter = await getHighlighter();
    const validLangs = ['json', 'bash', 'go', 'typescript', 'http'];
    const resolvedLang = validLangs.includes(lang) ? lang : 'json';

    return highlighter.codeToHtml(code.trim(), {
      lang: resolvedLang,
      theme: 'github-dark-dimmed',
    });
  } catch (err) {
    console.error('Shiki highlight error:', err);
    return `<pre class="shiki"><code>${escapeHtml(code)}</code></pre>`;
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
