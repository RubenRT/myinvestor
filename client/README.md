# MyInvestor — Front-end Challenge

Aplicación front-end en React para la plataforma de gestión de fondos de inversión de MyInvestor. Consume la API REST proporcionada (Express 5 + TypeScript) para mostrar fondos, gestionar una cartera y ejecutar operaciones de compra, venta y traspaso.

## Cómo correr el proyecto localmente

### Requisitos previos

- **Node.js** >= 24.5.0
- **npm** o **yarn** (el proyecto incluye Yarn 4.5.1 como packageManager)

### 1. Iniciar el servidor API

```bash
# Desde la raíz del proyecto
npm start
```

El servidor se levanta en `http://localhost:3000` con hot-reload (`node --watch`). La documentación Swagger está disponible en `http://localhost:3000/api-docs`.

### 2. Iniciar el cliente

```bash
cd client
npm install
npm run dev
```

El front-end se levanta en `http://localhost:5173`. Las llamadas a `/api/*` se redirigen automáticamente al puerto 3000 mediante el proxy de Vite.

### 3. Build de producción

```bash
cd client
npm run build    # Comprobación de tipos + build con Vite
npm run preview  # Sirve el build en local
```

### 4. Tests

```bash
# Tests unitarios e integración (Vitest)
cd client
npm test              # Ejecución única (~166 tests, ~4s)
npm run test:watch    # Modo watch

# Tests E2E (Playwright) — requiere ambos servidores corriendo
npx playwright test   # Desde la raíz del proyecto (~15 tests)
```

---

## Funcionalidades implementadas

### Listado de fondos (`/`)

- Tabla paginada con 80 fondos (10 por página)
- **8 columnas ordenables**: nombre, símbolo, categoría, valor, YTD, 1A, 3A, 5A
- Estado de paginación y ordenación persistido en la URL (`?page=2&sort=name:asc`), lo que permite compartir enlaces y navegar con el historial del navegador
- Menú de acciones por fondo con opción "Comprar"
- Scroll horizontal en móvil para mantener la legibilidad

### Compra de fondos

- Modal nativo con `<dialog>` que muestra el nombre del fondo
- Formulario con validación en tiempo real (React Hook Form + Zod):
  - La cantidad debe ser mayor que 0
  - El valor total no puede superar 10.000 €
- Previsualización en vivo del importe total (cantidad × valor unitario)
- Input de moneda con sufijo EUR
- Notificaciones toast de éxito/error

### Cartera (`/portfolio`)

- Posiciones agrupadas por categoría: Mercado monetario, Global, Tecnología, Salud
- Ordenación alfabética dentro de cada categoría
- Muestra valor total y porcentaje de ganancia/pérdida (YTD) por posición
- Interfaz con pestañas: "Fondos" (funcional), "Órdenes" (placeholder), "Traspasos en curso" (deshabilitado)
- Estado vacío con enlace al explorador de fondos

### Venta de fondos

- Modal con validación:
  - La cantidad debe ser mayor que 0
  - No se puede vender más de lo que se posee
- Notificaciones toast de éxito/error

### Traspaso entre fondos

- Traspaso entre posiciones de la cartera
- Destino restringido a fondos ya presentes en la cartera (el fondo origen se excluye del selector)
- Validación:
  - La cantidad debe ser mayor que 0
  - No se puede traspasar más de lo que se posee
  - El fondo origen y destino deben ser diferentes
- Notificaciones toast de éxito/error

### Extras

- Paginación inteligente con elipsis para navegación eficiente
- Error boundary global con UI de fallback y botón de recarga
- Formateo de moneda y porcentajes con locale `es-ES`
- 181 tests en total (166 unitarios/integración + 15 E2E)

---

## Decisiones técnicas

### Stack tecnológico

| Tecnología | Versión | Justificación |
|------------|---------|---------------|
| **React** | 19 | Biblioteca UI moderna con hooks |
| **Vite** | 7 | Dev server rápido con HMR, soporte nativo de ESM. |
| **TypeScript** | 5.9 | Tipado estricto (`strict: true`) en todo el proyecto |
| **React Router** | 7 | Enrutamiento cliente con `useSearchParams` para estado de paginación/ordenación en URL |
| **React Query** | 5 | Gestión de estado del servidor con caché, refetch automático e invalidación tras mutaciones |
| **Zustand** | 5 | Estado de UI ligero (solo notificaciones). El estado del servidor vive exclusivamente en React Query |
| **React Hook Form + Zod** | 7 / 4 | Formularios no controlados (sin re-renders por pulsación de tecla) con validación type-safe |
| **CSS Modules** | — | Estilos scoped por componente, CSS puro sin coste en runtime |
| **Vitest + Testing Library** | 4 | Testing unitario/integración rápido con jsdom |
| **MSW** | 2 | Mocking de red a nivel de service worker para tests |
| **Playwright** | 1.58 | Tests E2E con Chromium |

### Decisiones de arquitectura

- **React Query como única fuente de verdad para datos del servidor**: todo el estado del servidor vive en la caché de React Query. Zustand se usa deliberadamente solo para estado de UI (notificaciones).

- **Patrón Adapter en el API**: los servicios (`services/`) hacen llamadas puras a la API sin transformaciones. Los adaptadores (`adapters/`) transforman los datos: convierten decimales a porcentajes, códigos de categoría a etiquetas en español, y enriquecen las posiciones de la cartera cruzando datos con el listado de fondos.

- **Schemas Zod**: las validaciones se crean con funciones factory (`createBuySchema(fundValue)`, `createSellSchema(maxQuantity)`) en lugar de schemas estáticos, permitiendo restricciones dinámicas basadas en el contexto (valor del fondo, cantidad en cartera).

- **Hook factory para mutaciones** (`usePortfolioMutation`): centraliza la lógica de invalidación de caché e notificaciones, eliminando duplicación entre los hooks de compra, venta y traspaso.

- **`<dialog>` nativo para modales**: HTML semántico sin dependencias de terceros para modales.

- **Proxy de Vite**: las llamadas a `/api/*` se redirigen al servidor Express, evitando problemas de CORS en desarrollo y manteniendo URLs limpias.

- **Estado en URL**: paginación y ordenación se almacenan en query params (`?page=2&sort=name:asc`), lo que permite compartir URLs, refrescar la página sin perder estado y usar la navegación del navegador (atrás/adelante).

### Estructura del proyecto

```
client/src/
├── types/           — Interfaces TypeScript (Fund, Portfolio, API responses)
├── services/        — Cliente API y llamadas a endpoints
├── adapters/        — Transformaciones de respuestas de la API
├── hooks/           — Hooks de React Query (queries + mutations)
├── stores/          — Stores Zustand (estado de UI)
├── validation/      — Schemas Zod para validación de formularios
├── components/
│   ├── ui/          — Componentes reutilizables (Button, Modal, Pagination, Toast, etc.)
│   ├── funds/       — Listado de fondos, modal de compra
│   └── portfolio/   — Cartera, modales de venta y traspaso
├── utils/           — Helpers de formateo, constantes
├── styles/          — CSS global, custom properties
└── test/            — Setup de tests, fixtures, mocks MSW

---

## Qué mejoraría con más tiempo

- **Skeleton screens**: reemplazar los indicadores de carga basados en texto por esqueletos animados que reflejen la estructura del contenido, mejorando la percepción de velocidad.
- **Búsqueda y filtrado de fondos**: añadir filtro por categoría y búsqueda por nombre/símbolo en el listado de fondos.
- **Virtual scrolling**: para datasets más grandes, implementar virtualización de la tabla (e.g., TanStack Virtual) para mantener el rendimiento.
- **Internacionalización (i18n)**: preparar la app para múltiples idiomas con una librería como react-i18next, ya que actualmente las cadenas están hardcodeadas en español.
- **Optimistic updates**: aplicar actualizaciones optimistas en las mutaciones de compra/venta para mejorar la experiencia percibida por el usuario, revertiendo si la API falla.
- **CI/CD**: configurar un pipeline de integración continua que ejecute linting, tests unitarios y E2E en cada push/PR.
- **Testing**: revisión profunda de todos los tests creados y la arquitectura creada para el testing.