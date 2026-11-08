# NachoDev

Portafolio personal de **Ignacio Robles**: agentes de IA, sistemas RAG, data engineering en Google Cloud y desarrollo full-stack.

> **Construir. Entender. Compartir.**

🌐 [nachorob.github.io/portfolio](https://nachorob.github.io/portfolio/)

## Stack

- **Astro 6** — sitio estático, cero JavaScript por defecto (solo el menú móvil usa un script mínimo).
- **CSS propio** — tokens como variables CSS en `src/styles/global.css` y estilos locales (`<style>`) en cada componente. Sin frameworks de CSS.
- **TypeScript** en modo `strictest`.
- **Content Collections** con esquemas Zod para proyectos y artículos.
- Fuentes autoalojadas vía Fontsource (Montserrat, Inter, JetBrains Mono, variables).

## Desarrollo

Requiere Node.js ≥ 22.12.

```bash
npm install
npm run dev       # http://localhost:4321/portfolio/
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
│   ├── Navbar.astro
│   └── Footer.astro
├── content/
│   ├── projects/      un .md por caso de estudio
│   └── articles/      artículos (ver _plantilla.md)
├── content.config.ts  esquemas Zod de las colecciones
├── data/site.ts       perfil, enlaces, experiencia y formación
├── layouts/Base.astro SEO, Open Graph, JSON-LD
├── pages/             index, proyectos/[id], 404
└── styles/global.css  design tokens + estilos base
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

### Publicar un artículo

Copia `src/content/articles/_plantilla.md` sin el guion bajo y cambia `draft: false`.

## NachoDev Design System v1.0

Todos los valores viven en `src/styles/global.css` como variables CSS (`--surface`, `--fg-muted`, `--font-display`…). Los componentes las usan en sus `<style>` locales, nunca HEX directos.

**Dirección visual:** clásica y plana. Una columna de lectura, retícula de puntos, filas-enlace con borde y sombra sólida desplazada al pasar el cursor.

**Modo oscuro y claro:** el sitio sigue la preferencia del sistema, y el botón de la barra superior la cambia (se guarda en `localStorage`). En oscuro el fondo es `--navy`; en claro, `--gray-50`. Los valores de cada modo están en `:root[data-theme='dark']` y `:root[data-theme='light']`.

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

---

Ignacio Robles · [GitHub](https://github.com/NachoRob) · [LinkedIn](https://www.linkedin.com/in/ignacioroblesr/)
