# NachoDev

Portafolio personal de **Ignacio Robles**: agentes de IA, sistemas RAG, data engineering en Google Cloud y desarrollo full-stack.

> **Construir. Entender. Compartir.**

🌐 [nachorobles.dev](https://nachorobles.dev/)

## Stack

- **Astro 6** — sitio estático, cero JavaScript por defecto (scripts mínimos: menú móvil, modo claro/oscuro y, en los artículos, tabla de contenidos y botón de copiar).
- **Sanity** — CMS del blog. El Studio vive en `studio/`; el sitio lee los artículos en build con una consulta GROQ por HTTP (sin SDK en el cliente).
- **CSS propio** — tokens como variables CSS en `src/styles/global.css` y estilos locales (`<style>`) en cada componente. Sin frameworks de CSS.
- **TypeScript** en modo `strictest`.
- **Content Collections** con esquemas Zod: `projects` y `articles` (Markdown) y `posts` (loader propio contra Sanity).
- Fuentes autoalojadas vía Fontsource (Montserrat, Inter, JetBrains Mono, variables).

## Desarrollo

Requiere Node.js ≥ 22.12.

```bash
npm install
npm run dev       # http://localhost:4321/
npm run build     # astro check + build en ./dist
npm run preview
```

## Estructura

```
src/
├── assets/            imágenes procesadas por astro:assets (foto, capturas)
├── components/
│   ├── ui/            primitivas: Button, Badge, Card, Icon, Logo, FlowDiagram…
│   ├── sections/      secciones de la home
│   ├── portable/      bloques del cuerpo de un artículo (título, imagen, código)
│   ├── ArticleList.astro, PostToc.astro
│   ├── Navbar.astro
│   └── Footer.astro
├── content/
│   ├── projects/      un .md por caso de estudio
│   └── articles/      enlaces a artículos en otras plataformas (ver _plantilla.md)
├── content.config.ts  esquemas Zod de las colecciones
├── data/site.ts       perfil, enlaces, experiencia y formación
├── data/sanity.ts     projectId y dataset de Sanity (lo comparten sitio y Studio)
├── layouts/Base.astro SEO, Open Graph, JSON-LD
├── lib/sanity.ts      consulta GROQ + loader de `posts`
├── lib/articles.ts    lista única de artículos (Sanity + enlaces externos)
├── pages/             index, proyectos/[id], blog/, blog/[slug], rss.xml, 404
└── styles/global.css  design tokens + estilos base
studio/                Sanity Studio (paquete aparte, con su propio package.json)
└── schemaTypes/post.ts  esquema del artículo
```

### Agregar un proyecto

Crea `src/content/projects/mi-proyecto.md`. El frontmatter se valida al compilar:

```yaml
title: Nombre del proyecto
summary: Una o dos frases (máx. 220 caracteres).
category: ai # ai | fullstack | data | web
year: 2026
featured: false
order: 10
stack: [Python, BigQuery]
flow: # opcional: se dibuja como diagrama de arquitectura
  - { label: Ingesta, detail: Cloud Storage }
  - { label: Modelo }
metrics: # opcional: solo valores publicados y verificables
  - { label: Accuracy, value: '0.91' }
repo: https://github.com/NachoRob/…
```

El cuerpo sigue la estructura **Problema → Arquitectura y stack → Decisiones técnicas → Impacto**.

## Blog con Sanity

Los artículos se escriben en Sanity Studio y el sitio los lee **al compilar**: `src/lib/sanity.ts` consulta los documentos `post` publicados y genera `/blog/` y `/blog/<slug>/`. Los borradores no salen (la API pública solo entrega lo publicado).

### Puesta en marcha (una sola vez)

1. **Crear el proyecto.** En `studio/`:
   ```bash
   cd studio
   npm install
   npx sanity login
   npx sanity projects create "NachoDev" --dataset production --dataset-visibility public
   ```
   También sirve crearlo en [sanity.io/manage](https://www.sanity.io/manage). El dataset debe ser **público** (el build lee sin token).
2. **Pegar el `projectId`** en `src/data/sanity.ts`. Es el único lugar: lo usan el sitio y el Studio. No es un secreto.
3. **Probar el Studio en local:** `npm run dev` dentro de `studio/` → http://localhost:3333.
4. **Publicar el Studio:** `npm run deploy` dentro de `studio/` → queda en `https://<nombre>.sanity.studio`.
5. **Reconstruir el sitio al publicar.** El contenido se lee en build, así que cada publicación necesita un despliegue:
   - En GitHub, crea un *fine-grained token* limitado a este repositorio con permiso **Contents: Read and write** (lo exige el endpoint `dispatches`).
   - En sanity.io/manage → API → Webhooks, crea uno con:
     - URL: `https://api.github.com/repos/NachoRob/portfolio/dispatches`
     - Dataset: `production` · Trigger: create, update, delete · Filter: `_type == "post"`
     - Projection: `{"event_type": "sanity-publish"}`
     - Headers: `Authorization: Bearer <token>`, `Accept: application/vnd.github+json`
   - El workflow `deploy.yml` ya escucha ese evento (`repository_dispatch`).

### Escribir

- **Artículo propio:** en el Studio, crea un «Artículo», escribe el cuerpo y publica. Títulos H2/H3 arman la tabla de contenidos; los bloques de código se resaltan en build (Shiki).
- **Artículo en otra plataforma:** completa «URL externa» y «Plataforma»; la tarjeta enlaza fuera y no se genera página. Los tres enlaces actuales siguen como Markdown en `src/content/articles/` y conviven con los de Sanity.
- Si cambias un campo en `studio/schemaTypes/post.ts`, actualiza la consulta en `src/lib/sanity.ts` y el esquema `posts` en `src/content.config.ts`.

Mientras `projectId` esté vacío, el sitio compila igual, sin artículos de Sanity.

## NachoDev Design System v1.0

Todos los valores viven en `src/styles/global.css` como variables CSS (`--surface`, `--fg-muted`, `--font-display`…). Los componentes las usan en sus `<style>` locales, nunca HEX directos.

**Dirección visual:** clásica y plana. Una columna de lectura, retícula de puntos, filas-enlace con borde y sombra sólida desplazada al pasar el cursor.

**Modo oscuro y claro:** el sitio sigue la preferencia del sistema (`color-scheme: light dark`) y cada token define sus dos valores con `light-dark(claro, oscuro)`. El botón de la barra superior cambia `<meta name="color-scheme">` —no clases— y guarda el modo en `localStorage` solo cuando difiere del sistema; al volver a coincidir, se borra y el sitio sigue al sistema otra vez. En oscuro el fondo es `--navy`; en claro, `--gray-50`.

**Tiles de color (proyectos y contacto):** estilo link-in-bio, planos, con borde y sombra sólida desplazada (navy en claro, blanca en oscuro). Solo colores de la paleta, cada uno con su color de texto: IA → `--blue` + blanco (5.17:1), datos → `--sky` + navy (6.5:1), web → `--navy` + blanco, full-stack → `--white` + navy, contacto → `--blue` + blanco.

**Paleta de marca**

| Token | Valor | Uso |
| --- | --- | --- |
| `--navy` | `#0B1F3A` | Principal: barra, footer, tarjetas de proyectos, títulos y texto principal |
| `--blue` | `#2563EB` | Secundario: CTAs, enlaces, subrayados de sección |
| `--sky` | `#60A5FA` | Acento: detalles sobre fondo navy |
| `--white` | `#FFFFFF` | Tarjetas claras, texto sobre navy |
| `--gray-50` | `#F3F4F6` | Fondo de página |
| `--gray-700` | `#374151` | Texto secundario |

Derivados (para estados y contraste): `--brand-hover` `#1D4ED8`, `--brand-pressed` `#1E40AF`, `--fg-muted` `#4B5563`, `--on-navy-secondary` `#D6E2F3`, `--line` `#E5E7EB`, `--line-strong` `#CBD5E1`, `--elevated` `#E8EFFC`.

**Tipografía:** Montserrat (títulos), Inter (texto e interfaz), JetBrains Mono (código y metadatos).

**Contraste verificado (WCAG AA):** navy sobre blanco 16:1; `#374151` sobre `#F3F4F6` 9.4:1; botón primario (blanco sobre `#2563EB`) 5.17:1; enlaces `#1D4ED8` 6.7:1; sobre navy, `#60A5FA` 6.4:1 y `#D6E2F3` 13:1. Lighthouse Accessibility: 100.

## Despliegue

GitHub Pages mediante `.github/workflows/deploy.yml`. Para activarlo, en **Settings → Pages → Source** selecciona **GitHub Actions**.

El sitio se publica en **https://nachorobles.dev/**. En `astro.config.mjs`, `site` apunta a ese dominio y `base` es `/`. En **Settings → Pages → Custom domain** debe figurar `nachorobles.dev`, con **Enforce HTTPS** activado cuando el certificado esté disponible.

---

Ignacio Robles · [GitHub](https://github.com/NachoRob) · [LinkedIn](https://www.linkedin.com/in/ignacioroblesr/)
