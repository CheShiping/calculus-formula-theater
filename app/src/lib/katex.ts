import katex from 'katex';

/**
 * Render a TeX expression into a DOM node using KaTeX.
 * Throws if the expression is invalid — caller should wrap in error boundary.
 */
export function renderKatex(tex: string, displayMode = false): string {
  return katex.renderToString(tex, {
    displayMode,
    throwOnError: false,
    output: 'html',
    strict: 'ignore',
  });
}

/**
 * Scan a text node containing `$...$` and `$$...$$` and render math in place.
 * Returns the HTML string with KaTeX-rendered math embedded.
 */
export function renderMixedText(text: string): string {
  // $$...$$ first (display mode), then $...$ (inline)
  return text
    .replace(/\$\$([\s\S]+?)\$\$/g, (_, tex: string) => renderKatex(tex, true))
    .replace(/\$([^\$\n]+?)\$/g, (_, tex: string) => renderKatex(tex, false));
}
