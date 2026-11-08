---
title: Soft Jobs
summary: Aplicación full-stack de registro y autenticación de usuarios con cliente React y API REST en Express, PostgreSQL y JWT.
category: fullstack
year: 2026
featured: true
order: 5
stack: [React, Vite, React Router, Node.js, Express, PostgreSQL, bcryptjs, JWT]
flow:
  - label: React + Vite
    detail: cliente
  - label: Express API
    detail: REST
  - label: bcryptjs
    detail: hash de contraseñas
  - label: PostgreSQL
    detail: tabla usuarios
  - label: JWT
    detail: sesión firmada
repo: https://github.com/NachoRob/softjobs
---

## Problema

Registrar, autenticar y consultar usuarios de forma segura: las contraseñas no pueden guardarse en texto plano y las rutas privadas deben validar la identidad de quien las consulta.

## Arquitectura y stack

El repositorio separa dos aplicaciones:

- **`frontend/`** — cliente React con Vite, React Router, Axios y Bootstrap, más los scripts SQL para crear la base de datos.
- **`backend/`** — API REST con Node.js, Express y PostgreSQL mediante `pg`.

| Método | Ruta | Descripción |
| --- | --- | --- |
| `POST` | `/usuarios` | Registra un usuario |
| `POST` | `/login` | Autentica y devuelve un token JWT |

## Decisiones técnicas

- **Contraseñas con `bcryptjs`.** Se almacenan como hash, nunca en texto plano.
- **Autenticación sin estado con JWT.** El token se firma con una clave definida en variables de entorno.
- **Credenciales fuera del código.** La conexión a PostgreSQL y la clave JWT se configuran en `backend/.env`, que no se versiona.
- **Esquema reproducible.** Un script DDL crea la base `softjobs` y la tabla `usuarios`.

## Impacto

Ciclo completo de autenticación en una aplicación separada en cliente y API, con las medidas de seguridad que exige un producto real: contraseñas con hash, tokens firmados y validación de identidad en las rutas privadas.
