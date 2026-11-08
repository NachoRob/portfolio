---
title: Gator — agregador RSS en TypeScript
summary: CLI multiusuario que registra feeds RSS, los sigue y ejecuta un agregador periódico que guarda los posts en PostgreSQL.
category: fullstack
year: 2026
featured: true
order: 7
stack: [TypeScript, Node.js 22, PostgreSQL, Drizzle ORM, fast-xml-parser, tsx]
flow:
  - label: CLI
    detail: register · addfeed · follow
  - label: agg <interval>
    detail: un feed por tick
  - label: fast-xml-parser
  - label: PostgreSQL
    detail: Drizzle ORM
  - label: browse
    detail: posts recientes
repo: https://github.com/NachoRob/gator_rss_feed
---

## Problema

Seguir varios feeds RSS desde la terminal, con múltiples usuarios locales que comparten feeds, y mantener los posts actualizados sin saturar los servidores de origen.

## Arquitectura y stack

- **CLI en TypeScript** ejecutada con `tsx`, con comandos como `register`, `addfeed`, `follow`, `agg` y `browse`.
- **PostgreSQL + Drizzle ORM** con migraciones generadas desde el esquema (`users`, `feeds`, `feeds_follows`, `posts`).
- **Parsing** de RSS con `fast-xml-parser`.
- **Configuración** en `~/.gatorconfig.json`, fuera del repositorio, porque contiene la cadena de conexión.

## Decisiones técnicas

- **Un feed por intervalo.** Cada tick del agregador obtiene el feed con el `last_fetched_at` más antiguo, lo que reparte la carga y evita golpear a todos los servidores a la vez.
- **Formato de intervalo explícito** (`500ms`, `30s`, `1m`, `1h`) validado por la CLI.
- **Borrado en cascada** de feeds, follows y posts al eliminar usuarios, útil en desarrollo.
- **Migraciones versionadas** con `drizzle-kit generate` y `drizzle-kit migrate`.

## Impacto

Backend en TypeScript con tipado de punta a punta, modelado relacional y un proceso de larga duración que coordina trabajo periódico.
