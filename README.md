"# DeParraSpitz Frontend

Frontend del sistema de gestión y comercio digital para un restaurante/catering premium. Este proyecto está desarrollado con Astro + React y combina renderizado orientado a páginas con componentes interactivos para autenticación, menú, reservas, checkout, perfil de usuario, dashboard administrativo y gestión de promociones.

## Índice

- [Resumen del proyecto](#resumen-del-proyecto)
- [Tecnologías principales](#tecnologías-principales)
- [Arquitectura general](#arquitectura-general)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Flujos principales](#flujos-principales)
- [Patrones de desarrollo](#patrones-de-desarrollo)
- [Configuración del entorno](#configuración-del-entorno)
- [Scripts disponibles](#scripts-disponibles)
- [Cómo ejecutar el proyecto](#cómo-ejecutar-el-proyecto)
- [Rutas principales](#rutas-principales)
- [Notas de rendimiento y UX](#notas-de-rendimiento-y-ux)
- [Consideraciones importantes](#consideraciones-importantes)
- [Roadmap sugerido](#roadmap-sugerido)

## Resumen del proyecto

Este frontend permite:

- gestionar la autenticación de clientes, admins y superadmins
- mostrar una landing page pública con branding, promociones y servicios
- explorar el menú de catering
- reservar eventos y servicios gastronómicos
- usar un carrito de compras y flujo de checkout
- consultar el perfil del usuario y sus pedidos
- gestionar dashboards administrativos para operaciones
- administrar promociones, reservas, productos y configuración

La aplicación se separa en dos grandes áreas:

- zona pública / cliente: landing, menú, reservas, perfil, carrito y checkout
- zona administrativa: dashboard, pedidos, productos, promociones, categorías, reservas y configuración

## Tecnologías principales

- Astro 5
- React 19
- TypeScript
- Tailwind CSS
- Zustand
- TanStack Query
- Framer Motion
- Axios
- Sonner
- shadcn/ui + Radix UI
- Lucide React

## Arquitectura general

El proyecto combina dos enfoques:

1. Astro para páginas y layout base
2. React para componentes complejos y formularios interactivos

Esto permite mantener una base rápida, con SSR/SSG y al mismo tiempo entregar experiencia dinámica en módulos como:

- login y registro
- menú interactivo
- reservas por pasos
- chatbot
- dashboard administrativo
- checkout

## Estructura del proyecto

```text
src/
├── api/
│   └── axios.ts
├── components/
│   ├── shared/
│   └── ui/
├── hooks/
│   └── use-mobile.ts
├── layouts/
│   ├── AdminLayout.astro
│   ├── AdminLayoutReact.tsx
│   └── UserLayout.astro
├── lib/
│   └── utils.ts
├── modules/
│   ├── admin/
│   │   ├── categorias/
│   │   ├── configuracion/
│   │   ├── dashboard/
│   │   ├── pedidos/
│   │   ├── productos/
│   │   ├── promociones/
│   │   ├── reservas/
│   │   ├── shared/
│   │   └── usuarios/
│   ├── auth/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── schemas/
│   │   ├── services/
│   │   └── store/
│   ├── payments/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── interfaces/
│   │   └── services/
│   ├── superadmin/
│   └── user/
│       ├── carrito/
│       ├── chatbot/
│       ├── checkout/
│       ├── components/
│       ├── hooks/
│       ├── Inicio/
│       ├── menu/
│       ├── reservas/
│       ├── services/
│       └── shared/
├── pages/
│   ├── admin/
│   ├── superadmin/
│   ├── user/
│   ├── cart.astro
│   ├── checkout.astro
│   ├── index.astro
│   ├── login.astro
│   ├── menu.astro
│   ├── register.astro
│   ├── reservas.astro
│   └── ...
├── styles/
│   └── globals.css
├── types/
│   └── culqi.d.ts
├── middleware.ts
└── env.d.ts (si existe según configuración)
```

## Flujos principales

### 1. Autenticación

Se encuentra principalmente en:

- `src/modules/auth/components/LoginForm.tsx`
- `src/modules/auth/components/RegisterForm.tsx`
- `src/modules/auth/hooks/useLogin.ts`
- `src/modules/auth/hooks/useSignup.ts`
- `src/modules/auth/store/authStore.ts`

La sesión del usuario se maneja con Zustand y se persiste en localStorage. El token se reutiliza en peticiones HTTP mediante interceptores de Axios.

### 2. Cliente público

Este bloque cubre la experiencia del cliente final:

- landing page con hero, servicios y testimonios
- menú de productos
- reservas de eventos
- carrito de compras
- checkout
- perfil del usuario

Componentes clave:

- `src/modules/user/shared/components/PublicNavbar.tsx`
- `src/modules/user/menu/components/MenuProducts.tsx`
- `src/modules/user/reservas/components/ReservationWizard.tsx`
- `src/modules/user/chatbot/components/ChatbotWidget.tsx`

### 3. Administración

El área administrativa incluye:

- dashboard
- pedidos
- productos
- categorías
- promociones
- reservas internas
- configuración

La navegación del panel de administración vive en:

- `src/components/shared/AppSidebar.tsx`
- `src/layouts/AdminLayout.astro`
- `src/layouts/AdminLayoutReact.tsx`

### 4. Pagos y reserva

Hay un flujo específico para pagos y confirmación de reservas con integración a Culqi:

- `src/modules/payments/components/CulqiPayment.tsx`
- `src/modules/payments/hooks/usePayOrder.ts`

## Patrones de desarrollo

### Estado global

Se usa Zustand para guardar información compartida entre módulos, por ejemplo:

- usuario autenticado
- token
- promociones
- carrito

Archivos relevantes:

- `src/modules/auth/store/authStore.ts`
- `src/modules/auth/store/promoStore.ts`

### API y autenticación

La configuración base de Axios está centralizada en:

- `src/api/axios.ts`

Se incluye:

- baseURL para el backend
- interceptor de requests con Authorization
- interceptor de respuestas para manejar errores 401
- limpieza automática de sesión si el token expira

### Diseño de UI

La carpeta `src/components/ui` concentra componentes reutilizables con estilo shadcn-like:

- `button.tsx`
- `card.tsx`
- `dialog.tsx`
- `input.tsx`
- `label.tsx`
- `select.tsx`
- `table.tsx`
- `sidebar.tsx`
- `skeleton.tsx`
- `tooltip.tsx`

### Arquitectura por módulos

Cada dominio funcional está organizado en estructura modular con:

- `components/`
- `hooks/`
- `interfaces/`
- `services/`
- `store/` cuando aplica

Esto facilita crecimiento, mantenimiento y separación de responsabilidades.

## Configuración del entorno

### Requisitos

- Node.js 18 o superior
- npm
- acceso a un backend funcional en localhost:3000

### Configuración actual

El proyecto usa Astro en modo servidor y la configuración principal está en:

- `astro.config.mjs`

Entre puntos importantes:

- `output: "server"`
- puerto `4321`
- alias `@` apuntando a `src/`
- prefetch habilitado
- integración con React

### Variables de entorno

Actualmente hay valores fijos como:

```ts
baseURL: 'http://localhost:3000'
```

Se recomienda mover esto a variables de entorno para facilitar despliegue y entorno de producción.

## Scripts disponibles

En `package.json` se tienen estos scripts:

```json
{
  "scripts": {
    "dev": "astro dev --port 4321",
    "build": "astro build",
    "preview": "astro preview",
    "astro": "astro"
  }
}
```

## Cómo ejecutar el proyecto

1. Instalar dependencias:

```bash
npm install
```

2. Iniciar servidor de desarrollo:

```bash
npm run dev
```

3. Abrir la aplicación:

```text
http://localhost:4321
```

## Rutas principales

### Rutas públicas

- `/` — home / landing page
- `/menu` — menú
- `/reservas` — reserva de evento
- `/cart` — carrito
- `/checkout` — checkout
- `/login` — inicio de sesión
- `/register` — registro

### Rutas del usuario autenticado

- `/user/profile` — perfil
- `/user/pagar-reserva` — pago de reserva

### Rutas admin

- `/admin/dashboard`
- `/admin/pedidos`
- `/admin/productos`
- `/admin/categorias`
- `/admin/promociones`
- `/admin/reservas`
- `/admin/configuracion`

### Rutas superadmin

- `/superadmin/dashboard`
- `/superadmin/manage-admins`
- `/superadmin/settings`

## Notas de rendimiento y UX

El proyecto ya incorpora varias buenas prácticas de rendimiento:

- Astro para renderizado rápido
- prefetch de rutas habilitado
- componentes con hidratación diferida (`client:visible`, `client:idle`)
- `ClientRouter` para navegación entre páginas sin recarga completa
- `transition:persist` para mantener componentes globales estables

Recomendaciones adicionales:

- usar `client:visible` para contenido más pesado
- usar `client:idle` para widgets no críticos
- evitar hidratar layout o widgets globales innecesarios en todas las rutas
- mantener navegación interna con `<a href>` y Astro Router

## Consideraciones importantes

### 1. Seguridad y autorización

El archivo `src/middleware.ts` protege rutas según el rol del usuario:

- admin y superadmin pueden entrar a rutas admin
- solo superadmin puede acceder a rutas superadmin
- no autenticados son redirigidos a `/login`

### 2. Autenticación local

La sesión actual se persiste con localStorage. Esto es funcional para una MVP, pero en producción puede ser recomendable migrar a:

- cookies seguras httpOnly
- refresh tokens
- mecanismos más seguros de autenticación

### 3. Backend externo

La app depende de un backend externo corriendo en localhost:3000; esto debería gestionarse con `.env` para entornos de desarrollo y producción.

### 4. Mejoras futuras

- mover endpoints a variables de entorno
- añadir tests unitarios e integración
- reforzar manejo de errores globales
- mejorar accesibilidad y diseño responsive
- separar aún más lógica de negocio por servicios

## Roadmap sugerido

- migrar URLs del backend a variables de entorno
- centralizar todas las consultas API en servicios dedicados
- reforzar validaciones con Zod
- añadir pruebas de UI y flujos críticos
- optimizar tiempos de carga y carga inicial de componentes
- preparar despliegue en entorno de producción

## Conclusión

Este proyecto está bien estructurado como una frontend moderno para restaurante/catering con varias interfaces y roles de acceso. La base tecnológica es sólida y el código está organizado por módulos funcionales, lo que permite crecer y mantener el sistema con relativa facilidad.

---

Proyecto desarrollado para gestionar el lado visual y operativo de una experiencia gastronómica con venta, reservas y administración interna.
" 
