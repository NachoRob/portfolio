---
title: Agente de SEO programático
summary: Agente en producción que, desde Google Chat, investiga keywords en Search Console, propone un plan de URLs y redacta cada página con validación automática y aprobación humana.
category: ai
year: 2026
featured: true
order: 1
stack: [Python, Google ADK, Gemini 2.5 Pro/Flash, Vertex AI, MCP, Cloud Run, Firestore, Google Chat API, Google Sheets API]
flow:
  - label: Google Chat
    detail: el equipo conversa con el agente
  - label: Etapa A · keywords
    detail: Search Console vía MCP + scoring
  - label: Aprobación humana
    detail: en la Sheet del cliente
  - label: Etapa B · plan de URLs
    detail: hubs, patrones y slugs
  - label: Etapa C · contenido
    detail: redactor → juez → similitud
  - label: Entregable
    detail: 8 pestañas en Google Sheets
metrics:
  - { label: Tests unitarios, value: '260' }
  - { label: Pestañas de entregable, value: '8' }
repo: https://github.com/NachoRob/seo-programmatic-agent
context: Open source · en producción en D2B Inteligencia Digital
---

## Problema

El SEO programático crea muchas páginas a partir de un mismo patrón (por ejemplo, un servicio en cada ciudad). Hecho a mano, el flujo implica cruzar keywords con lo que el sitio ya posiciona, decidir qué páginas crear y cuáles optimizar, escribir cada una sin que terminen siendo copias entre sí y armar title, meta, schema y enlaces internos. Si se deja todo a un LLM, el resultado es irreproducible y difícil de auditar.

## Arquitectura y stack

El equipo de SEO usa el agente como un compañero más en **Google Chat**: le pasa la Sheet del cliente, el sitio, sus keywords y sus datos reales, y el agente avanza por etapas.

- **Agente conversacional** con Google ADK sobre Gemini 2.5 Pro, con herramientas pequeñas: revisar el sitio, leer páginas, analizar keywords, planificar URLs y generar contenido. Se puede volver a cualquier paso ("cambiemos las keywords").
- **Search Console vía MCP**, descubierto desde Agent Registry junto a los demás servidores MCP del equipo.
- **Orquestador por etapas** con estado explícito: `NEW → esperando aprobación de keywords → esperando aprobación de URLs → DONE`.
- **Producción:** Cloud Run con app de Google Chat; estado de cada run, locks e historial de conversación en Firestore; memoria por cliente.

## Decisiones técnicas

- **Lo determinista va en código, no en el LLM.** Normalización y deduplicación de keywords, cruce con Search Console, scoring 0-100 con pesos configurables por cliente, ruteo (crear, optimizar o descartar) y generación de slugs corren en un motor sin LLM, reproducible y testeable.
- **El juez no es el redactor.** El contenido lo escribe Gemini 2.5 Pro y lo evalúa Gemini 2.5 Flash; la configuración rechaza usar el mismo modelo para ambos roles.
- **Detector de copias.** Cada página se compara contra las ya aprobadas del mismo patrón; si la similitud supera el umbral, se reintenta con las observaciones. Tras los reintentos queda marcada para revisión humana.
- **Humano en el loop.** Dos aprobaciones explícitas (keywords y plan de URLs) antes de gastar en redacción.
- **El límite de 30 s de Google Chat.** El turno corre en segundo plano: si termina a tiempo responde directo; si no, avisa y publica el resultado después. Un lock compartido evita dos turnos a la vez en la misma conversación.
- **Estado que sobrevive.** El run se guarda comprimido en Firestore, así que puede pasar días entre aprobaciones aunque Cloud Run recicle instancias.

## Impacto

Está en producción y lo usa el equipo de SEO de D2B. Convierte un flujo manual de varios pasos en una conversación, y deja en la Sheet del cliente un entregable completo: keywords, plan de URLs, contenido, on-page, schema, enlaces internos y descartados.
