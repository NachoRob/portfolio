/**
 * Conexión con Sanity. Fuente única para el sitio (loader de `posts`) y el Studio (`/studio`).
 *
 * `projectId` no es un secreto: identifica el proyecto y viaja en cada URL de la API.
 * Mientras esté vacío, el sitio compila sin artículos de Sanity.
 */
export const sanity: {
  projectId: string;
  dataset: string;
  apiVersion: string;
} = {
  // PENDIENTE: pega aquí el ID que entrega `npx sanity init` o sanity.io/manage.
  projectId: "ykkusxy3",
  dataset: "production",
  apiVersion: "2025-02-19",
};
