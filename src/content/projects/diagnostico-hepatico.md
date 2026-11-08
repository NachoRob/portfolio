---
title: Modelo predictivo de diagnóstico hepático
summary: Clasificador de hepatitis, fibrosis y cirrosis a partir de biomarcadores enzimáticos de donantes de sangre, con Elastic Net y XGBoost optimizado.
category: data
year: 2026
featured: true
order: 6
stack: [Python, pandas, scikit-learn, XGBoost, GridSearchCV, Seaborn]
flow:
  - label: Biomarcadores
    detail: ALB, ALT, AST, GGT…
  - label: Preprocesamiento
  - label: LogReg Elastic Net
    detail: 200 combinaciones
  - label: XGBoost
    detail: GridSearchCV L1/L2
  - label: Selección
    detail: XGBoost
metrics:
  - label: Accuracy
    value: '0.96'
  - label: F1 clase positiva
    value: '0.86'
repo: https://github.com/NachoRob/modelo-predictivo-diagnostico-hepatico
---

## Problema

Identificar donantes de sangre sospechosos de patologías hepáticas (hepatitis, fibrosis y cirrosis) a partir de variables clínicas y enzimáticas recolectadas en laboratorio.

## Arquitectura y stack

- **Datos:** mediciones de enzimas hepáticas (ALB, ALP, ALT, AST, BIL, CHE, CHOL, CREA, GGT, PROT) y factores demográficos.
- **Modelo lineal:** Logistic Regression CV con regularización **Elastic Net**, explorando 200 combinaciones de `C` y `l1_ratio`.
- **Ensamble:** XGBoost optimizado con `GridSearchCV` y penalizaciones L1 y L2.
- **Stack:** Python, pandas, NumPy, scikit-learn, XGBoost, Matplotlib y Seaborn.

## Decisiones técnicas

- **Comparar un modelo interpretable con un ensamble.** El modelo lineal explica qué variables importan; XGBoost maximiza el desempeño.
- **Dejar que la regularización decida.** Ambos modelos convergieron hacia una penalización tipo **Ridge (L2)**: el dataset no requería eliminar variables, sino amortiguar el efecto de valores atípicos en enzimas como AST y BIL.
- **Modelo final:** XGBoost Classifier optimizado (`learning_rate` 1.66, `reg_lambda` 1.77, `reg_alpha` 0.0).

## Impacto

| Métrica | Valor |
| --- | --- |
| Accuracy | 0.96 |
| F1-Score (clase 1) | 0.86 |

**AST** resultó el predictor dominante en el ensamble; **GGT** y **ALP** actúan como variables de soporte en el modelo lineal. Edad y sexo tuvieron una contribución marginal frente a los biomarcadores directos.
