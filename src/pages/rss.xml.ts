import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { getArticles } from '@/lib/articles';
import { articleTopics } from '@/lib/taxonomy';
import { site } from '@/data/site';

export const GET: APIRoute = async (context) => {
  const articles = await getArticles();

  return rss({
    title: `Blog de ${site.brand}`,
    description: 'Artículos de Ignacio Robles sobre AI engineering, agentes, analítica y Google Cloud.',
    site: context.site!,
    items: articles.map((a) => ({
      title: a.title,
      description: a.description,
      pubDate: a.pubDate,
      // Los internos son rutas relativas al sitio; los externos ya son URLs absolutas.
      link: a.href,
      categories: [articleTopics[a.topic]],
    })),
    customData: `<language>${site.lang}</language>`,
  });
};
