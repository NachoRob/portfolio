import { defineArrayMember, defineField, defineType } from 'sanity';
import { articleTopics } from '../../src/lib/taxonomy';

/**
 * Artículo del blog. El sitio lo lee en build (src/lib/sanity.ts): si cambias
 * un nombre de campo aquí, actualiza la consulta GROQ y el esquema Zod de
 * `posts` en src/content.config.ts.
 */
export const post = defineType({
  name: 'post',
  title: 'Artículo',
  type: 'document',
  groups: [
    { name: 'content', title: 'Contenido', default: true },
    { name: 'meta', title: 'Metadatos' },
    { name: 'external', title: 'Publicado en otro sitio' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Título',
      type: 'string',
      group: 'content',
      validation: (rule) => rule.required().max(120),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      description: 'Parte final de la URL: nachorobles.dev/blog/<slug>/',
      type: 'slug',
      group: 'content',
      options: { source: 'title', maxLength: 80 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Resumen',
      description: 'Una o dos frases. Se usa en la tarjeta del artículo y como meta description.',
      type: 'text',
      rows: 3,
      group: 'content',
      validation: (rule) => rule.required().max(200),
    }),
    defineField({
      name: 'cover',
      title: 'Imagen de portada',
      description: 'Opcional. También se usa como imagen al compartir el enlace.',
      type: 'image',
      group: 'content',
      fields: [
        defineField({
          name: 'alt',
          title: 'Texto alternativo',
          description: 'Describe la imagen para quien no puede verla.',
          type: 'string',
          validation: (rule) => rule.required(),
        }),
      ],
    }),
    defineField({
      name: 'body',
      title: 'Cuerpo',
      type: 'array',
      group: 'content',
      of: [
        defineArrayMember({
          type: 'block',
          // h1 queda reservado para el título del artículo.
          styles: [
            { title: 'Párrafo', value: 'normal' },
            { title: 'Título (H2)', value: 'h2' },
            { title: 'Subtítulo (H3)', value: 'h3' },
            { title: 'Cita', value: 'blockquote' },
          ],
          lists: [
            { title: 'Viñetas', value: 'bullet' },
            { title: 'Numerada', value: 'number' },
          ],
          marks: {
            decorators: [
              { title: 'Negrita', value: 'strong' },
              { title: 'Cursiva', value: 'em' },
              { title: 'Código', value: 'code' },
            ],
            annotations: [
              defineArrayMember({
                name: 'link',
                title: 'Enlace',
                type: 'object',
                fields: [
                  defineField({
                    name: 'href',
                    title: 'URL',
                    type: 'url',
                    validation: (rule) =>
                      rule.required().uri({ allowRelative: true, scheme: ['http', 'https', 'mailto'] }),
                  }),
                ],
              }),
            ],
          },
        }),
        defineArrayMember({
          type: 'image',
          fields: [
            defineField({
              name: 'alt',
              title: 'Texto alternativo',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({ name: 'caption', title: 'Pie de imagen', type: 'string' }),
          ],
        }),
        defineArrayMember({
          type: 'code',
          title: 'Bloque de código',
          options: {
            withFilename: true,
            language: 'typescript',
            languageAlternatives: [
              { title: 'TypeScript', value: 'typescript' },
              { title: 'JavaScript', value: 'javascript' },
              { title: 'Python', value: 'python' },
              { title: 'SQL', value: 'sql' },
              { title: 'Shell', value: 'sh' },
              { title: 'JSON', value: 'json' },
              { title: 'YAML', value: 'yaml' },
              { title: 'HTML', value: 'html' },
              { title: 'CSS', value: 'css' },
              { title: 'Texto', value: 'text' },
            ],
          },
        }),
      ],
      validation: (rule) =>
        rule.custom((body, context) => {
          const external = (context.document as { externalUrl?: string } | undefined)?.externalUrl;
          if (external || (Array.isArray(body) && body.length > 0)) return true;
          return 'Escribe el artículo, o indica la URL externa donde está publicado.';
        }),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Fecha de publicación',
      type: 'datetime',
      group: 'meta',
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'updatedAt',
      title: 'Última actualización',
      description: 'Solo si el contenido cambió de forma relevante después de publicarlo.',
      type: 'datetime',
      group: 'meta',
    }),
    defineField({
      name: 'topic',
      title: 'Tema',
      type: 'string',
      group: 'meta',
      options: {
        list: Object.entries(articleTopics).map(([value, title]) => ({ value, title })),
        layout: 'radio',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'tags',
      title: 'Etiquetas',
      type: 'array',
      group: 'meta',
      of: [defineArrayMember({ type: 'string' })],
      options: { layout: 'tags' },
    }),
    defineField({
      name: 'lang',
      title: 'Idioma',
      type: 'string',
      group: 'meta',
      options: {
        list: [
          { title: 'Español', value: 'es' },
          { title: 'Inglés', value: 'en' },
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'es',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'externalUrl',
      title: 'URL externa',
      description:
        'Si el artículo vive en otra plataforma, la tarjeta enlaza a esta URL y no se genera página en el sitio.',
      type: 'url',
      group: 'external',
    }),
    defineField({
      name: 'source',
      title: 'Plataforma',
      type: 'string',
      group: 'external',
      options: {
        list: [
          { title: 'Medium', value: 'medium' },
          { title: 'Blog D2B', value: 'd2b' },
          { title: 'DEV', value: 'devto' },
        ],
      },
      hidden: ({ document }) => !document?.externalUrl,
    }),
  ],
  orderings: [
    {
      title: 'Más recientes',
      name: 'publishedAtDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
  ],
  preview: {
    select: { title: 'title', date: 'publishedAt', media: 'cover', externalUrl: 'externalUrl' },
    prepare: ({ title, date, media, externalUrl }) => ({
      title,
      media,
      subtitle: [date ? new Date(date).toLocaleDateString('es-CL') : 'Sin fecha', externalUrl && 'externo']
        .filter(Boolean)
        .join(' · '),
    }),
  },
});
