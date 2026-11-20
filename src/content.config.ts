import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { sanityPosts } from './lib/sanity';

/**
 * Casos de estudio técnicos.
 * El cuerpo Markdown sigue la estructura: Problema → Arquitectura y stack
 * → Decisiones técnicas → Impacto. Solo datos verificables en el repo.
 */
const projects = defineCollection({
  loader: glob({ base: './src/content/projects', pattern: '**/[^_]*.md' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      summary: z.string().max(220),
      category: z.enum(['ai', 'fullstack', 'data', 'web']),
      year: z.number().int().min(2015).max(2100).optional(),
      featured: z.boolean().default(false),
      order: z.number().default(100),
      stack: z.array(z.string()).min(1),
      /** Flujo verificable a partir del README del proyecto. Se dibuja como diagrama. */
      flow: z
        .array(z.object({ label: z.string(), detail: z.string().optional() }))
        .min(2)
        .max(7)
        .optional(),
      /** Métricas tal como aparecen en el README del repositorio. */
      metrics: z
        .array(z.object({ label: z.string(), value: z.string() }))
        .max(4)
        .optional(),
      repo: z.url().optional(),
      demo: z.url().optional(),
      cover: image().optional(),
      coverAlt: z.string().optional(),
      context: z.string().optional(),
    }),
});

/**
 * Enlaces a artículos publicados en otras plataformas (Medium, blog de D2B…).
 * Los artículos propios se escriben en Sanity: ver la colección `posts`.
 */
const articles = defineCollection({
  loader: glob({ base: './src/content/articles', pattern: '**/[^_]*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    description: z.string().max(200),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    topic: z.enum(['ai-engineering', 'agentes', 'backend', 'google-cloud', 'aeo']),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(true),
    /** Artículo publicado en otra plataforma: la tarjeta enlaza a esta URL. */
    url: z.url().optional(),
    /** Dónde vive el artículo. `propio` = escrito en este sitio. */
    source: z.enum(['propio', 'medium', 'd2b', 'devto']).default('propio'),
    lang: z.enum(['es', 'en']).default('es'),
  }),
});

const topic = z.enum(['ai-engineering', 'agentes', 'backend', 'google-cloud', 'aeo']);

const sanityImage = z.object({
  url: z.url(),
  width: z.number(),
  height: z.number(),
  alt: z.string().nullish(),
  caption: z.string().nullish(),
});

/**
 * Artículos escritos en Sanity Studio (carpeta /studio). Se leen en build.
 * GROQ devuelve `null` en los campos vacíos: por eso `nullish` + valor por defecto.
 */
const posts = defineCollection({
  loader: sanityPosts(),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().nullish(),
    topic,
    tags: z
      .array(z.string())
      .nullish()
      .transform((v) => v ?? []),
    lang: z
      .enum(['es', 'en'])
      .nullish()
      .transform((v) => v ?? 'es'),
    cover: sanityImage.nullish(),
    /** Portable Text. Se renderiza con astro-portabletext. */
    body: z
      .array(z.looseObject({ _type: z.string(), _key: z.string().optional() }))
      .nullish()
      .transform((v) => v ?? []),
    /** Publicado en otra plataforma: enlaza fuera y no genera página. */
    url: z.url().nullish(),
    source: z.enum(['medium', 'd2b', 'devto']).nullish(),
  }),
});

export const collections = { projects, articles, posts };
