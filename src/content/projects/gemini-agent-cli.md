---
title: Gemini Autonomous Software Engineer Agent
summary: Agente de IA que explora un repositorio, analiza el código, ejecuta scripts y aplica correcciones dentro de un directorio de trabajo restringido.
category: ai
year: 2026
featured: true
order: 3
stack: [Python 3.11, Gemini 2.0 Flash, Google GenAI SDK, Function Calling, uv]
flow:
  - label: Observe
    detail: lee el repositorio
  - label: Analyze
    detail: construye contexto
  - label: Select tool
    detail: function calling
  - label: Execute
    detail: sandbox
  - label: Evaluate
    detail: itera hasta resolver
repo: https://github.com/NachoRob/gemini-agent-cli
context: Proyecto personal
---

## Problema

Un modelo de lenguaje por sí solo no puede depurar un proyecto real: necesita leer archivos, ejecutar código, observar el resultado y volver a intentarlo. El objetivo fue construir la **capa de orquestación** de un agente de programación que pudiera resolver tareas como *«arregla el bug de la calculadora: 3 + 7 * 2 no debería ser 20»* con intervención humana mínima.

## Arquitectura y stack

- **Modelo:** Google Gemini 2.0 Flash a través del Google GenAI SDK.
- **Bucle agéntico:** Observe → Analyze → Select Tool → Execute → Evaluate, repetido hasta completar la tarea.
- **Herramientas expuestas vía function calling:** navegación de directorios, lectura de archivos, escritura de cambios puntuales y ejecución de scripts Python.
- **Contexto:** historial de conversación y salidas de herramientas durante la sesión para razonar en varios pasos.
- **Entorno:** Python 3.11+ y `uv` como gestor de paquetes.

## Decisiones técnicas

- **Sandbox por diseño.** Todas las operaciones de archivos quedan restringidas a un directorio de trabajo designado, lo que reduce el riesgo de cambios no deseados fuera del proyecto objetivo.
- **Validación por ejecución.** El agente ejecuta los scripts tras cada cambio y usa esa salida como señal para el siguiente paso, en lugar de confiar solo en el razonamiento del modelo.
- **Herramientas explícitas.** Cada capacidad es una función declarada, lo que hace el comportamiento del agente auditable y fácil de extender.

## Impacto

Implementación práctica de los patrones que hoy sostienen a los agentes de programación: razonamiento iterativo, selección de herramientas y gestión de contexto, con límites operativos claros. Sirve como base para experimentar con flujos autónomos de forma segura.
