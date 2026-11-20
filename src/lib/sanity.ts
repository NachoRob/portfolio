/**
 * Lectura de Sanity en build. Sin SDK: una consulta GROQ por HTTP contra la API
 * pública del dataset (solo documentos publicados), así el sitio sigue sin
 * JavaScript de cliente ni dependencias de runtime.
 */
import type { Loader } from 'astro/loaders';
import { sanity } from '../data/sanity';

/** Si renombras un campo en studio/schemaTypes/post.ts, actualiza esta consulta. */
const POSTS_QUERY = /* groq */ `
*[_type == "post" && defined(slug.current)] | order(publishedAt desc) {
  title,
  "slug": slug.current,
  description,
  "pubDate": publishedAt,
  "updatedDate": updatedAt,
  topic,
  tags,
  lang,
  "url": externalUrl,
  source,
  "cover": select(defined(cover.asset) => cover {
    alt,
    "url": asset->url,
    "width": asset->metadata.dimensions.width,
    "height": asset->metadata.dimensions.height
  }),
  body[] {
    ...,
    _type == "image" => {
      ...,
      "url": asset->url,
      "width": asset->metadata.dimensions.width,
      "height": asset->metadata.dimensions.height
    }
  }
}`;

async function sanityFetch<T>(query: string): Promise<T> {
  const { projectId, dataset, apiVersion } = sanity;
  const url = new URL(`https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}`);
  url.searchParams.set('query', query);
  url.searchParams.set('perspective', 'published');

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Sanity respondió ${res.status} ${res.statusText}: ${await res.text()}`);
  }
  const { result } = (await res.json()) as { result: T };
  return result;
}

/** Content Layer loader: un entry por artículo publicado, con el slug como id. */
export function sanityPosts(): Loader {
  return {
    name: 'sanity-posts',
    async load({ store, parseData, generateDigest, logger }) {
      if (!sanity.projectId) {
        logger.warn('Sin projectId en src/data/sanity.ts: se compila sin artículos de Sanity.');
        store.clear();
        return;
      }

      // Si Sanity falla, el build falla: mejor no desplegar que publicar un blog vacío.
      const docs = await sanityFetch<({ slug: string } & Record<string, unknown>)[]>(POSTS_QUERY);
      store.clear();
      for (const doc of docs) {
        const data = await parseData({ id: doc.slug, data: doc });
        store.set({ id: doc.slug, data, digest: generateDigest(doc) });
      }
      logger.info(`${docs.length} artículo(s) cargados desde Sanity.`);
    },
  };
}

/** URL del CDN de imágenes de Sanity redimensionada; `auto=format` sirve AVIF/WebP según el navegador. */
export function sanityImage(url: string, width: number): string {
  return `${url}?w=${width}&fit=max&auto=format&q=75`;
}

/** `srcset` con los anchos que no superan el original. */
export function sanitySrcset(url: string, originalWidth: number, widths = [480, 736, 1100, 1472]): string {
  const usable = widths.filter((w) => w < originalWidth);
  return [...usable, Math.min(originalWidth, 2000)].map((w) => `${sanityImage(url, w)} ${w}w`).join(', ');
}
