---
title: Detección de fake news con LSTM y Word2Vec
summary: Red recurrente (BiLSTM + LSTM apiladas) sobre embeddings Word2Vec preentrenados que clasifica noticias reales y falsas con 88.6% de accuracy y AUC 0.94 en test.
category: data
year: 2026
featured: true
order: 4
stack: [Python, TensorFlow / Keras, Word2Vec (Google News 300d), gensim, scikit-learn, XGBoost, pandas]
flow:
  - label: Texto de la noticia
    detail: 6.340 artículos, clases balanceadas
  - label: Tokenización
    detail: vocabulario 80k · padding 80
  - label: Embedding Word2Vec
    detail: 300d congelado (transfer learning)
  - label: BiLSTM(64) → LSTM(32) → LSTM(16)
    detail: Dropout entre capas
  - label: Dense + sigmoid
    detail: FAKE / REAL
metrics:
  - { label: Accuracy (test), value: '88.6%' }
  - { label: AUC-ROC, value: '0.944' }
  - { label: F1 macro, value: '0.89' }
repo: https://github.com/NachoRob/fake-news-popularity-prediction
---

## Problema

Distinguir noticias reales de falsas solo a partir del texto. El orden de las palabras importa («no es cierto que…» no significa lo mismo que «es cierto que…»), así que un modelo de bolsa de palabras se queda corto: hace falta un modelo que lea la secuencia.

## Arquitectura y stack

- **Datos:** 6.340 noticias en inglés, prácticamente balanceadas (3.186 FAKE y 3.154 REAL), con split 67/33 estratificado: 4.247 para entrenamiento y 2.093 para test.
- **Representación:** tokenizador con vocabulario de 80.000 palabras, token `<OOV>` y secuencias de largo 80.
- **Transfer learning:** capa de embedding inicializada con **Word2Vec de Google News** (300 dimensiones) y **congelada**. De los 20,5 millones de parámetros del modelo, solo 211 mil se entrenan.
- **Red recurrente:** `Bidirectional(LSTM(64))` → `LSTM(32)` → `LSTM(16)`, con Dropout de 0.3–0.4 entre capas, y una cabeza densa con salida sigmoide.
- **Entrenamiento:** Adam, batch de 64, máximo 20 épocas, con `EarlyStopping` (paciencia 3, restaurando los mejores pesos) y `ModelCheckpoint`.

## Decisiones técnicas

- **Congelar los embeddings.** Con poco más de 4 mil textos de entrenamiento, ajustar 20 millones de pesos de embedding sobreajusta. Congelarlos conserva la semántica aprendida sobre 3 millones de palabras y deja el aprendizaje a las capas recurrentes.
- **Una capa bidireccional primero.** Lee cada noticia en ambos sentidos para capturar contexto antes y después de cada palabra; las LSTM siguientes condensan la secuencia.
- **Regularizar en vez de agrandar.** Dropout en cada capa y early stopping: el monitoreo mostró divergencia entre train y validación, y restaurar los mejores pesos evita quedarse con un modelo sobreajustado.
- **Evaluar más allá del accuracy.** Curva ROC, matriz de confusión y reporte por clase: precision y recall quedan equilibrados (0.88–0.89) en ambas clases, sin sesgo hacia una de ellas.

## Segunda parte: cuándo una red neuronal no es la respuesta

El mismo proyecto incluye un problema de regresión tabular: predecir cuántas veces se comparte un artículo de Mashable. Tras limpiar outliers con IQR y eliminar variables con correlación |r| > 0.7, comparé cuatro enfoques en el mismo split:

| Modelo | R² (test) |
| --- | --- |
| XGBoost (GridSearch, 5 folds) | 0.146 |
| Random Forest (GridSearch, 5 folds) | 0.134 |
| Red neuronal densa (512 → 384 → 256, Dropout) | 0.083 |
| Bagging heterogéneo (árbol + Ridge + KNN) | −0.228 |

En datos tabulares, los ensambles de árboles superaron a la red neuronal. Y el R² bajo de todos los modelos dice algo más importante: la popularidad de un artículo depende de factores que no están en sus metadatos, y eso también es un resultado.

## Impacto

El modelo de texto alcanza **88.6% de accuracy y AUC 0.944** en datos que no vio durante el entrenamiento, con un diseño pensado para pocos datos: transfer learning, regularización y early stopping. La comparación tabular muestra el criterio complementario: elegir el modelo por evidencia, no por moda.
