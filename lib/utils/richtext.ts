import { slugify } from './slugify';

/**
 * Blog content may be either legacy Markdown or HTML authored in the CMS
 * (CKEditor). These helpers let the renderer support both transparently.
 */

export function isHtmlContent(content: string): boolean {
  return /<\/?(p|div|h[1-6]|ul|ol|li|br|strong|em|blockquote|table|img|a|span|figure)\b[^>]*>/i.test(
    content
  );
}

export type HtmlHeading = { level: 2 | 3; text: string; id: string };

export function extractHtmlHeadings(html: string): HtmlHeading[] {
  const items: HtmlHeading[] = [];
  const re = /<h([23])\b[^>]*>([\s\S]*?)<\/h\1>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) {
    const level = Number(m[1]) as 2 | 3;
    const text = m[2].replace(/<[^>]+>/g, '').trim();
    if (text) items.push({ level, text, id: slugify(text) });
  }
  return items;
}

/** Inject id attributes on h2/h3 so in-page TOC anchors resolve. */
export function addHeadingIds(html: string): string {
  return html.replace(
    /<h([23])\b([^>]*)>([\s\S]*?)<\/h\1>/gi,
    (full, lvl: string, attrs: string, inner: string) => {
      if (/\bid=/.test(attrs)) return full;
      const text = inner.replace(/<[^>]+>/g, '').trim();
      return `<h${lvl}${attrs} id="${slugify(text)}">${inner}</h${lvl}>`;
    }
  );
}
