/** Prefija rutas internas con `base` (GitHub Pages sirve el sitio en /portfolio/). */
export function href(path = ''): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const clean = path.replace(/^\//, '');
  return `${base}/${clean}`;
}
