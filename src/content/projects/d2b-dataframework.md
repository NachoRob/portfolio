---
title: D2B Data Framework
summary: Librería Python open source que unifica la extracción de datos de 14 plataformas de marketing y analítica, con carga a BigQuery, control de frescura y forecasting.
category: data
year: 2025
featured: true
order: 2
stack: [Python 3.11+, BigQuery, GA4 Data API, Meta Graph API, Google Sheets, Prophet, pytest, GitHub Actions]
flow:
  - label: APIs de origen
    detail: Meta, GA4, LinkedIn, TikTok, X…
  - label: Conectores d2b_data
    detail: una clase por plataforma
  - label: load_guard
    detail: ¿ya se cargó hoy?
  - label: BigQuery · Sheets
    detail: DataFrames de pandas
  - label: Forecasting
    detail: Prophet (opcional)
metrics:
  - { label: Conectores, value: '14' }
  - { label: Suites de tests, value: '19' }
  - { label: Versión, value: '0.3.0' }
repo: https://github.com/D2B-Innovation-Org/d2b_dataframework
context: Open source · D2B Innovation · lo guío y mantengo
---

## Problema

Cada cliente de una agencia de datos vive en una mezcla distinta de plataformas: Meta Ads, GA4, LinkedIn, TikTok, Search Console, HubSpot, Shopify. Cada API tiene su autenticación, su paginación y su forma de devolver los datos. Sin una capa común, cada pipeline nuevo vuelve a escribir el mismo código de extracción, y cada cambio de API rompe varios scripts a la vez.

## Arquitectura y stack

`d2b_data` es un paquete Python instalable con `pip` directamente desde GitHub. Expone **una clase por plataforma**, y todas devuelven `pandas.DataFrame`, así que el destino (BigQuery, Google Sheets o un modelo) no depende de dónde vinieron los datos.

| Área | Conectores |
| --- | --- |
| Paid media | Facebook Marketing, LinkedIn Ads, TikTok Ads, X Ads |
| Orgánico | Facebook, Instagram, LinkedIn, YouTube |
| Analítica | GA4 (incluye tiempo real), Search Console |
| Negocio | HubSpot, Shopify |
| Destinos | BigQuery, Google Sheets |

Encima de los conectores hay utilidades transversales: manejo de tokens OAuth2 (`Google_Token_MNG`), un logger de workflow con alertas por webhook, conversión de zonas horarias y un módulo de forecasting con Meta Prophet.

## Decisiones técnicas

- **Imports explícitos por submódulo.** `import d2b_data` no carga ningún SDK de terceros; cada conector se importa por separado. Instalar el paquete nunca obliga a traer todas las dependencias.
- **Forecasting como extra opcional.** Prophet compila Stan y tarda en instalarse, así que vive en `pip install "d2b_data[forecasting]"`. La API tiene dos niveles: `get_forecast(30)` sin configuración, o `forecast()` con estacionalidades, feriados de Chile, regresores externos e intervalos de confianza.
- **`load_guard`: idempotencia sin perder datos.** Cada carga exitosa deja una fila por cuenta en una tabla de control en BigQuery. Antes de llamar a la API, la función revisa si esa cuenta ya se cargó hoy después de la hora de corte y, si es así, se salta la llamada. Varias corridas al día sirven de respaldo sin repetir consumo de API. Si la tabla de control falla, el módulo responde «no cargado» y la carga ocurre igual: se puede perder el ahorro, nunca datos.
- **Deprecaciones ordenadas.** Al renombrar parámetros (`verbose_logger` → `logger`), el nombre antiguo sigue funcionando con un `DeprecationWarning`, para que los pipelines en producción migren sin romperse.
- **Tests y releases automatizados.** Suites de `pytest` por conector y dos workflows de GitHub Actions: uno corre los tests y otro publica las releases.

## Impacto

Es la base común sobre la que se construyen los pipelines de datos del equipo: un conector nuevo se escribe una vez y queda disponible para todos los proyectos. Al ser open source bajo licencia MIT, cualquiera puede instalarlo y conectarlo a sus propias cuentas.
