/**
 * Lista única de artículos para la home, /blog/ y el RSS.
 * Une dos fuentes: los escritos en Sanity (`posts`) y los enlaces a otras
 * plataformas que aún viven como Markdown (`articles`).
 */
import { getCollection } from 'astro:content';
import { sanity } from '../data/sanity';
import { articleTopics } from './taxonomy';
import { href } from './url';

export const sources = { propio: 'NachoDev', medium: 'Medium', d2b: 'Blog D2B', devto: 'DEV' } as const;

export interface ArticleItem {
  id: string;
  title: string;
  description: string;
  pubDate: Date;
  topic: keyof typeof articleTopics;
  lang: 'es' | 'en';
  source: keyof typeof sources;
  /** Página propia en /blog/<slug>/ o URL de la plataforma externa. */
  href: string;
  external: boolean;
}

/** Artículos de Sanity. Sin proyecto configurado no se consulta la colección (evita el aviso de «colección vacía»). */
export async function getPosts() {
  return sanity.projectId ? getCollection('posts') : [];
}

export async function getArticles(): Promise<ArticleItem[]> {
  const [posts, links] = await Promise.all([
    getPosts(),
    // Un artículo en Markdown sin `url` no tiene página a la que enlazar.
    getCollection('articles', ({ data }) => !data.draft && Boolean(data.url)),
  ]);

  const items: ArticleItem[] = [
    ...posts.map(({ id, data }): ArticleItem => ({
      id,
      title: data.title,
      description: data.description,
      pubDate: data.pubDate,
      topic: data.topic,
      lang: data.lang,
      source: data.url ? (data.source ?? 'propio') : 'propio',
      href: data.url ?? href(`blog/${id}/`),
      external: Boolean(data.url),
    })),
    ...links.map(({ id, data }): ArticleItem => ({
      id,
      title: data.title,
      description: data.description,
      pubDate: data.pubDate,
      topic: data.topic,
      lang: data.lang,
      source: data.source,
      href: data.url!,
      external: true,
    })),
  ];

  return items.toSorted((a, b) => b.pubDate.valueOf() - a.pubDate.valueOf());
}

export const formatDate = new Intl.DateTimeFormat('es-CL', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
}).format;
