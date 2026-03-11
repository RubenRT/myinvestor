# Defensa Técnica del Desarrollo Front-End

## Índice

1. [Contexto del proyecto](#1-contexto-del-proyecto)
2. [Análisis previo y planificación](#2-análisis-previo-y-planificación)
3. [Selección tecnológica](#3-selección-tecnológica)
4. [Arquitectura de la aplicación](#4-arquitectura-de-la-aplicación)
5. [Decisiones de diseño clave](#5-decisiones-de-diseño-clave)
6. [Implementación por funcionalidad](#6-implementación-por-funcionalidad)
7. [Validación y formularios](#7-validación-y-formularios)
8. [Gestión de estado](#8-gestión-de-estado)
9. [Estilos y diseño responsivo](#9-estilos-y-diseño-responsivo)
10. [Manejo de errores](#10-manejo-de-errores)
11. [Testing](#11-testing)
12. [Trade-offs y limitaciones conocidas](#12-trade-offs-y-limitaciones-conocidas)
13. [Conclusión](#13-conclusión)

---

## 1. Contexto del proyecto

El reto consiste en desarrollar un front-end en React que consuma una API REST ya proporcionada (Express 5 + TypeScript) para la gestión de fondos de inversión. La API expone endpoints para listar fondos, comprar, vender, traspasar y consultar el portfolio. El estado del portfolio es in-memory en el servidor — no hay base de datos.

Las funcionalidades requeridas, por orden de prioridad, son:

1. **Listado de fondos** con paginación y ordenación
2. **Compra de fondos** con validación (máximo 10.000 €)
3. **Vista de cartera** agrupada por categoría
4. **Venta de participaciones** con validación de posición disponible
5. **Traspaso entre fondos** con validación cruzada

---

## 2. Análisis previo y planificación

Antes de escribir una línea de código, se realizó un análisis exhaustivo del backend:

- Se leyó el código completo del servidor (`app.ts`, `data/funds.ts`, `utils.ts`) para entender la forma exacta de cada request/response, las reglas de validación del servidor y el comportamiento de las mutaciones.
- Se identificó una carencia clave: el endpoint `/portfolio` devuelve `{ id, name, quantity, totalValue }` pero **no incluye `category`**. Esto determina la necesidad de un mecanismo de enriquecimiento en el front-end, cruzando los datos del portfolio con la lista completa de fondos.
- Se analizaron las capturas de referencia para entender la estructura visual esperada.

Esta fase previa evitó retrabajos y permitió diseñar la arquitectura con conocimiento completo del contrato de la API.

---

## 3. Selección tecnológica

Cada dependencia elegida tiene una justificación concreta. No se incluyó ninguna librería "por si acaso".

### Vite (en lugar de CRA o Next.js)

Se eligió Vite como bundler por tres razones:
- **No se necesita SSR** — Next.js añadiría complejidad innecesaria para una SPA pura.
- **Velocidad de desarrollo** — HMR instantáneo, arranque en milisegundos.
- **Proxy nativo** — Vite permite configurar un proxy en desarrollo para evitar problemas de CORS, sin necesidad de middleware adicional.

### React Query (en lugar de Redux / Context API)

React Query fue la elección para gestionar el estado del servidor. Las alternativas descartadas:

| Alternativa | Por qué se descartó |
|-------------|---------------------|
| **Redux Toolkit Query** | Más boilerplate para un proyecto de este tamaño. La configuración de slices, el store global y los middlewares no aportan valor cuando toda la data proviene de una API simple. |
| **Context API + useReducer** | No ofrece cache, refetch automático, ni invalidación. Habría que reimplementar manualmente lo que React Query ya resuelve. |
| **SWR** | Similar a React Query, pero con menos control sobre invalidación de queries y mutaciones. React Query tiene un modelo de mutaciones más explícito y maduro. |

React Query aporta:
- **Cache con stale time configurable** (30s por defecto, 5 min para la lista completa de fondos)
- **Invalidación declarativa** — tras comprar/vender/traspasar, se invalida `['portfolio']` y React Query refetcha automáticamente
- **Retry automático** — 1 reintento configurado para queries fallidas
- **Query keys tipadas** — permiten granularidad en el cache (diferentes combinaciones de página/sort son entradas independientes)

### Zustand (solo para UI state)

Se eligió Zustand exclusivamente para el estado de UI (notificaciones toast). Se descartó usarlo para estado del servidor para evitar el anti-patrón de duplicar la fuente de verdad — ese rol lo cumple React Query.

¿Por qué Zustand y no Context API para las notificaciones?
- Context provoca re-renders en todos los consumidores cuando cambia cualquier valor. Zustand usa selectores granulares.
- La API de Zustand es más ergonómica: `useNotificationStore()` es una línea.
- No necesita un Provider wrapper — reduce el anidamiento en el árbol de componentes.

### React Hook Form + Zod

- **React Hook Form**: formularios no controlados internamente, lo que evita re-renders en cada keystroke. Fundamental para inputs numéricos donde el usuario escribe cifras.
- **Zod v4**: esquemas de validación type-safe y componibles. Se integra con React Hook Form mediante `@hookform/resolvers/zod`.
- **Alternativa descartada (Formik)**: más pesado, formularios controlados por defecto, peor rendimiento con validación en tiempo real.

### CSS Modules (en lugar de Tailwind, styled-components, etc.)

- **CSS puro** — sin runtime de JavaScript, sin dependencias adicionales.
- **Scoping automático** — evita colisiones de nombres de clase sin convenciones manuales como BEM.
- **CSS custom properties** — variables globales para colores, espaciados y tipografía garantizan consistencia visual sin preprocesador.
- Se priorizó la simplicidad: no hay necesidad de un framework de estilos completo para una aplicación de dos páginas.

---

## 4. Arquitectura de la aplicación

La aplicación sigue una arquitectura por capas con responsabilidades claramente separadas:

```
┌─────────────────────────────────────────────────┐
│                  Componentes                     │
│     (FundList, Portfolio, Modales, UI)           │
├─────────────────────────────────────────────────┤
│                    Hooks                         │
│   (useFunds, usePortfolio, useBuyFund, ...)      │
├─────────────────────────────────────────────────┤
│                  Adaptadores                     │
│    (fund.adapter, portfolio.adapter)             │
├─────────────────────────────────────────────────┤
│                  Servicios                       │
│     (ApiClient, funds.service, portfolio.service)│
├─────────────────────────────────────────────────┤
│                     API                          │
│           (Express backend :3000)                │
└─────────────────────────────────────────────────┘
```

### ¿Por qué esta separación?

**Servicios** — Funciones puras que hacen llamadas HTTP y devuelven las respuestas tipadas. No contienen lógica de negocio ni transformaciones de datos. Esto permite testearlas de forma aislada mockeando `fetch`.

**Adaptadores** — Transforman los datos en la frontera entre la API y la UI. Por ejemplo, la API devuelve la rentabilidad como decimal (`0.05`) pero la UI necesita porcentaje (`5.00`). Esta transformación vive en el adaptador, no en el componente. Ventajas:
- Si la API cambia su formato, solo hay que tocar el adaptador.
- Los componentes trabajan con datos ya formateados para presentación.
- Es testeable unitariamente sin montar componentes.

**Hooks** — Encapsulan la integración con React Query. Cada hook define su query key, su función de fetch, y (para mutaciones) la invalidación de cache y las notificaciones. Los componentes no conocen los detalles de cache ni fetch.

**Componentes** — Solo se ocupan de renderizar y gestionar interacción local. Divididos en:
- `ui/` — componentes genéricos reutilizables (Button, Modal, Pagination, etc.)
- `funds/` — componentes específicos del listado de fondos
- `portfolio/` — componentes específicos de la cartera

### Estructura de directorios

```
client/src/
  types/           → Interfaces TypeScript (mirrors del servidor)
  services/        → Capa HTTP (fetch wrappers tipados)
  adapters/        → Transformación de datos API → UI
  hooks/           → React Query queries + mutations
  stores/          → Zustand (solo notificaciones)
  validation/      → Esquemas Zod para formularios
  components/
    ui/            → Button, Modal, CurrencyInput, Pagination, etc.
    funds/         → FundList, BuyFundModal
    portfolio/     → Portfolio, PortfolioGroup, PortfolioItem, SellFundModal, TransferFundModal
  utils/           → Constantes, formateo de moneda/porcentaje
  styles/          → CSS global, custom properties
```

Cada componente tiene su propio directorio con `ComponentName.tsx` y `ComponentName.module.css`. Esto mantiene los estilos colocados junto al componente que los usa.

---

## 5. Decisiones de diseño clave

### Proxy de Vite en lugar de URL directa a la API

El front-end llama a `/api/funds`, y el dev server de Vite lo reescribe a `http://localhost:3000/funds`. Esto:
- Elimina problemas de CORS en desarrollo.
- Centraliza la configuración de la URL de la API en un solo lugar (`vite.config.ts`).
- El prefijo `/api` es estándar para despliegues en producción con un reverse proxy (nginx, etc.).

### Estado de navegación en la URL

La paginación y el ordenamiento del listado de fondos se almacenan en los search params de la URL (`?page=2&sort=name:asc`) mediante `useSearchParams` de React Router. Esto ofrece:
- El estado sobrevive a un refresh de la página.
- Las URLs son compartibles y bookmarkeables.
- La navegación del navegador (atrás/adelante) funciona naturalmente.
- No hace falta estado adicional en Zustand ni useState.

### `<dialog>` nativo para modales

Se usa el elemento HTML5 `<dialog>` con `showModal()` / `close()` en lugar de librerías como Headless UI o Radix. Razones:
- Proporciona backdrop, trap de foco y cierre con Escape **sin JavaScript adicional**.
- Es HTML semántico — accesible por defecto.
- Cumple con la recomendación del enunciado de preferir elementos nativos.

### Patrón adaptador para las fronteras de la API

La API devuelve la rentabilidad como decimales (`YTD: 0.05` = 5%). Los componentes necesitan el valor como porcentaje. En lugar de hacer `value * 100` disperso por los componentes, el adaptador centraliza esta transformación:

```typescript
// fund.adapter.ts
formattedYTD: fund.profitability.YTD * 100
```

Igualmente, el endpoint `/portfolio` no devuelve `category`. El adaptador de portfolio cruza los datos con la lista de fondos para enriquecer cada item con su categoría, valor unitario y porcentaje de ganancia. Si el fondo no se encuentra (caso defensivo), se usan valores por defecto seguros.

### Esquemas de validación dinámicos

Los esquemas de Zod se crean mediante funciones factoría, no como constantes estáticas:

```typescript
createBuySchema(fundValue)       // El límite depende del valor del fondo
createSellSchema(maxQuantity)    // El máximo depende de la posición actual
createTransferSchema(max, from)  // Excluye el fondo origen del destino
```

Esto permite que las reglas de validación se adapten al contexto de cada operación sin duplicar lógica.

---

## 6. Implementación por funcionalidad

### Listado de fondos

Implementado como tabla HTML con columnas ordenables. Cada cabecera es un componente `SortableHeader` que cicla entre tres estados: sin orden → ascendente → descendente → sin orden.

El formato de ordenamiento (`campo:dirección`) coincide exactamente con lo que espera la API (`name:asc`, `profitability.YTD:desc`), evitando transformaciones intermedias.

Al cambiar el criterio de ordenación, la paginación se reinicia a la página 1 — un detalle pequeño pero importante para la experiencia de usuario.

### Compra de fondos

Modal con formulario que muestra:
- Nombre y valor del fondo seleccionado
- Input numérico para la cantidad de participaciones
- Cálculo en tiempo real del importe total (`cantidad × valor unitario`)
- Validación: cantidad > 0 y total ≤ 10.000 €
- Botón deshabilitado durante la mutación con texto "Comprando..."

Al completar la compra, se resetea el formulario, se cierra el modal, se invalida la query del portfolio y se muestra un toast de confirmación.

### Vista de cartera

La cartera agrupa los fondos por categoría siguiendo un orden predefinido: Mercado monetario → Global → Tecnología → Salud. Dentro de cada grupo, los fondos se ordenan alfabéticamente.

El enriquecimiento de datos se hace así:
1. `usePortfolio()` trae los items del portfolio
2. `useAllFunds()` trae todos los fondos (para obtener la categoría)
3. `enrichPortfolioItem()` cruza ambos conjuntos
4. `groupPortfolioByCategory()` agrupa y ordena

Se muestra un estado vacío con enlace al listado de fondos cuando la cartera no tiene posiciones.

### Venta y traspaso

Ambos modales siguen el mismo patrón que el de compra:
- **Venta**: limita la cantidad a la posición actual. Botón con variante `danger` para indicar acción destructiva.
- **Traspaso**: incluye un dropdown de fondos destino (excluyendo el origen) con validación cruzada (`toFundId ≠ fromFundId`).

---

## 7. Validación y formularios

La validación se implementa en dos niveles:

**Nivel cliente (Zod + React Hook Form):**
- Feedback instantáneo al usuario sin round-trip al servidor
- Mensajes en español: "El importe total no puede superar 10.000 EUR", "No puedes vender más de X participaciones", etc.
- Validaciones complejas con `.refine()` para reglas que dependen de múltiples campos

**Nivel servidor (Express):**
- Actúa como última línea de defensa
- Rechaza cantidades ≤ 0, posiciones insuficientes, traspasos al mismo fondo, fondos inexistentes

Esta doble validación es intencional: el cliente valida para UX (feedback rápido), el servidor valida para seguridad (nunca se confía en el cliente).

---

## 8. Gestión de estado

Se usan tres tipos de estado distintos, cada uno con su herramienta adecuada:

| Tipo de estado | Herramienta | Ejemplo |
|---------------|-------------|---------|
| **Estado del servidor** | React Query | Lista de fondos, portfolio, resultado de mutaciones |
| **Estado de formulario** | React Hook Form | Valores de inputs, errores de validación |
| **Estado de UI** | Zustand | Notificaciones toast |
| **Estado de navegación** | URL Search Params | Página actual, criterio de ordenación |
| **Estado local** | useState | Modal abierto/cerrado, menú desplegable activo |

Esta separación evita el anti-patrón más común en aplicaciones React: meter todo en un store global. Cada tipo de estado vive donde tiene sentido, con la herramienta que mejor lo gestiona.

### Invalidación de cache tras mutaciones

Después de cada operación (comprar, vender, traspasar), se invalida la query key `['portfolio']`. React Query refetcha automáticamente el portfolio actualizado del servidor. No se actualiza el estado local manualmente — esto garantiza que la UI siempre refleja el estado real del servidor.

```typescript
onSuccess: () => {
  queryClient.invalidateQueries({ queryKey: ['portfolio'] });
  addNotification('success', 'Compra realizada con éxito');
}
```

---

## 9. Estilos y diseño responsivo

### Sistema de diseño

Se definieron CSS custom properties en `variables.css` para:
- **Colores**: primario (#0052cc), éxito, peligro, texto, fondo, bordes
- **Espaciado**: escala de xs (4px) a 2xl (48px)
- **Tipografía**: sistema de fuentes nativo, 6 tamaños de fuente
- **Sombras y bordes**: tres niveles de sombra, tres niveles de border-radius

Esto garantiza consistencia visual sin necesidad de un framework CSS completo.

### Responsive

Enfoque **mobile-first** con un breakpoint principal a 768px:
- La tabla de fondos usa scroll horizontal (`overflow-x: auto`) en pantallas pequeñas.
- La navegación reduce padding y tamaño de fuente en móvil.
- Los items del portfolio se adaptan con padding reducido.
- Layout principal centrado con `max-width: 1200px`.

### Accesibilidad

- `aria-sort` en cabeceras de tabla ordenables
- `aria-live="polite"` en el contenedor de notificaciones
- `role="menu"` y `role="menuitem"` en menús de acción
- Clase utilitaria `.sr-only` para texto solo visible por lectores de pantalla
- `<dialog>` nativo con trap de foco integrado

---

## 10. Manejo de errores

Se implementan cuatro niveles de manejo de errores:

1. **Errores de API** — El `ApiClient` captura respuestas no-ok, extrae el mensaje de error del body JSON y lanza un `Error` estándar. Los consumidores reciben un error limpio, no un objeto `Response`.

2. **Errores de queries** — React Query reintenta automáticamente (1 reintento). Si falla definitivamente, el error está disponible en el hook para mostrarlo en la UI.

3. **Errores de mutaciones** — Se capturan en los hooks de mutación y se muestran como notificaciones toast de tipo `error`. El usuario ve un mensaje claro sin bloquear la aplicación.

4. **Errores de render** — Un `ErrorBoundary` envuelve las `<Routes>` en `App.tsx`. Si un componente lanza un error durante el render, el boundary lo captura y muestra un fallback ("Algo ha salido mal") con opción de recargar. El header y la navegación permanecen funcionales.

---

## 11. Testing

### Infraestructura

- **Vitest** como test runner — integración nativa con Vite, misma configuración de resolución de módulos y alias.
- **jsdom** como entorno — necesario para tests de servicios que usan `fetch` y `URL`.
- **@testing-library/jest-dom** — matchers adicionales para aserciones de DOM.

### Cobertura de tests (56 tests, 8 ficheros)

| Capa | Tests | Qué se verifica |
|------|-------|-----------------|
| Validación (buy) | 8 | Límite de €10.000, cantidades positivas, fraccionarias, dependencia del valor del fondo |
| Validación (sell) | 7 | Máximo = posición actual, valores límite |
| Validación (transfer) | 8 | Rechazo mismo fondo, campo destino requerido, máximo |
| Adaptador (fund) | 6 | Conversión decimal→porcentaje (×100), etiquetas de categoría, valores negativos |
| Adaptador (portfolio) | 7 | Enriquecimiento con/sin datos de fondo, agrupación por categoría, orden alfabético |
| Formato (utils) | 10 | Formateo EUR/USD, porcentajes, números con locale es-ES |
| Servicio (funds) | 8 | Construcción de URLs, query params, body de POST, propagación de errores, encoding de IDs |
| Servicio (portfolio) | 2 | Endpoint correcto, manejo de errores |

### Por qué se testea lo que se testea

Se priorizaron las capas con **lógica pura** que no dependen de React:

- **Esquemas de validación** — Son las reglas de negocio del front-end. Un fallo aquí permitiría operaciones inválidas. Los tests cubren valores límite y casos edge.
- **Adaptadores** — Transforman datos de la API. Si la multiplicación por 100 falla o la agrupación ordena incorrectamente, toda la UI muestra datos erróneos.
- **Servicios** — Verifican que las llamadas HTTP se construyen correctamente (URLs, bodies, headers). Se mockea `fetch` para no depender del servidor.
- **Utilidades de formato** — El formateo de moneda depende del locale. Los tests verifican que `Intl.NumberFormat` produce los resultados esperados en el entorno de test.

**No se testearon componentes React** en esta fase. Los tests de componentes (rendering, interacción) requerirían React Testing Library con más setup y serían tests de integración más que unitarios. Se priorizó la cobertura de lógica pura por su mayor valor/esfuerzo.

---

## 12. Trade-offs y limitaciones conocidas

### `useAllFunds` con limit=100

El hook `useAllFunds` pide `page=1&limit=100` para construir un `Map<id, Fund>` que enriquece los items del portfolio. Esto funciona porque el dataset tiene ~50 fondos. Si el catálogo creciera significativamente, habría que:
- Paginar la petición, o
- Pedir al backend que enriquezca el endpoint `/portfolio` con la categoría.

Se aceptó este trade-off porque simplifoca considerablemente el código del front-end y el dataset es estático.

### Transfer modal limitado a fondos del portfolio

El modal de traspaso solo muestra como destino los fondos ya presentes en la cartera. La API permite traspasar a cualquier fondo existente (creando una nueva posición). Se priorizó la UX del caso más común sobre la cobertura completa de la API.

### Sin persistencia de estado entre recargas

El portfolio es in-memory en el servidor. Un restart del servidor resetea todo. Esto es inherente al diseño del backend proporcionado, no un defecto del front-end.

### Locale de formateo en tests

Los formatters `Intl.NumberFormat` producen output ligeramente diferente en Node.js (jsdom) vs navegadores reales. Los tests usan aserciones con `toContain` en lugar de igualdad exacta para ser resilientes a estas diferencias.

---

## 13. Conclusión

El front-end se construyó con estas prioridades:

1. **Corrección** — Validación en dos niveles, re-fetch tras mutaciones, manejo de errores en cuatro capas.
2. **Mantenibilidad** — Separación de responsabilidades estricta, cada capa testeable de forma aislada.
3. **Simplicidad** — Cero dependencias innecesarias, CSS puro, elementos HTML nativos.
4. **Experiencia de usuario** — Feedback inmediato en formularios, notificaciones toast, estado de carga, navegación por URL.
5. **Calidad** — 56 tests unitarios cubriendo lógica de negocio, transformaciones y servicios.

Cada decisión técnica responde a un requisito concreto del proyecto o a un principio de ingeniería — no se añadió complejidad especulativa ni abstracciones prematuras.
