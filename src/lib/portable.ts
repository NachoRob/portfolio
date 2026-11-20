/** Utilidades sobre el Portable Text que llega de Sanity. */
import { toPlainText } from 'astro-portabletext';

export type PortableNode = { _type: string; _key?: string | undefined; [key: string]: unknown };

export interface Heading {
  id: string;
  text: string;
  level: 2 | 3;
}

function slugify(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Asigna un `anchor` único a cada h2/h3 (lo usa PtHeading como `id`) y
 * devuelve la lista para la tabla de contenidos.
 */
export function withAnchors(body: PortableNode[]): { body: PortableNode[]; headings: Heading[] } {
  const seen = new Map<string, number>();
  const headings: Heading[] = [];

  const anchored = body.map((node) => {
    if (node._type !== 'block' || (node['style'] !== 'h2' && node['style'] !== 'h3')) return node;

    const text = toPlainText(node as never).trim();
    const base = slugify(text) || 'seccion';
    const count = seen.get(base) ?? 0;
    seen.set(base, count + 1);
    const id = count === 0 ? base : `${base}-${count + 1}`;

    headings.push({ id, text, level: node['style'] === 'h2' ? 2 : 3 });
    return { ...node, anchor: id };
  });

  return { body: anchored, headings };
}

/** Minutos de lectura a ~220 palabras por minuto (texto técnico en español). */
export function readingMinutes(body: PortableNode[]): number {
  const text = body
    .map((node) => (node._type === 'block' ? toPlainText(node as never) : String(node['code'] ?? '')))
    .join(' ');
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}
