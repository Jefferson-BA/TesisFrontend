# DeParraSpitz Frontend

Aplicación de catering y restaurante con Astro 7, React 19 y TypeScript. Incluye catálogo, carrito, reservas, pagos con Culqi, perfil y paneles de administración.

## Requisitos y arranque

- Node.js 22.23.4 o superior dentro de la rama 22, o Node.js 24 o superior.
- npm y el backend NestJS disponible. Para el desarrollo local, el backend está en `C:/Miproyect/backend/backend`.
- Copiar `.env.example` a `.env` y configurar los valores de cada entorno.

```sh
npm ci
npm run dev
```

Frontend: `http://localhost:4321`. El backend utiliza `http://localhost:3000` en desarrollo.

## Variables de entorno

- `API_URL`: dirección del backend que utiliza el servidor Astro. Es privada. En desarrollo admite localhost; en producción debe configurarse. Como compatibilidad temporal también se admite `PUBLIC_API_URL`.
- `PUBLIC_ASSET_URL`: origen públrevisa el proyecto completo y revisa lo que ya esta hecho y lo que faltariaico para resolver las imágenes relativas del catálogo.
- `PUBLIC_API_URL`: origen público del backend para el chatbot, que no envía credenciales y mantiene la limitación por IP de Nest. Debe estar permitido por el CORS del backend.
- `PUBLIC_CULQI_KEY`: llave **pública** de Culqi. Las llaves privadas permanecen exclusivamente en el backend.

No incluir contraseñas, llaves privadas ni secretos en variables con prefijo `PUBLIC_`. En Vercel configurar estas variables antes de compilar y ejecutar el servidor.

## Arquitectura

`src/pages` contiene rutas Astro y endpoints del servidor. Las páginas presentan componentes React desde módulos por dominio:

```text
src/
  api/                  clientes HTTP autenticado y público
  server/               comunicación privada con Nest y cookies
  components/ui/        componentes reutilizables
  components/shared/    proveedores y navegación compartida
  layouts/              layouts Astro y React
  lib/                  errores, URLs de imágenes, caché y estado del cliente
  modules/
    auth/               autenticación y estado único de sesión
    cart/               carrito persistido
    catalog/            productos, categorías y consultas compartidas
    orders/             órdenes y estado del pago
    payments/           un único flujo Culqi y cargador del SDK
    promotions/         contratos, servicios y cálculo de descuentos
    reservations/       contratos, validación y servicios de reservas
    admin/              pantallas de administración
    superadmin/         pantallas y operaciones de superadministración
    user/               pantallas públicas y del cliente
  pages/api/session.ts  inicio, consulta y cierre de sesión
  pages/api/backend/    proxy restringido hacia Nest
  middleware.ts         autorización de páginas con sesión verificada
```

Las pantallas públicas y administrativas comparten los dominios; el carrito y el catálogo no dependen de módulos administrativos. El modal de promociones y la vista de impresión de cocina están separados de sus pantallas principales.

## Sesión y autorización

1. El navegador envía las credenciales a `POST /api/session`.
2. Astro consulta `POST /auth/login` de Nest y valida su respuesta.
3. El JWT permanece en una cookie `HttpOnly`, `SameSite=Lax` y `Secure` bajo HTTPS. No se devuelve al navegador como JSON ni se guarda en localStorage.
4. Las llamadas autenticadas pasan por `/api/backend/*`; Astro añade el encabezado Bearer desde la cookie.
5. El middleware verifica `GET /auth/profile` antes de abrir páginas privadas. Las cookies `user-role` y los roles guardados en el navegador no conceden acceso.
6. `DELETE /api/session` elimina la cookie. Después se limpian usuario, caché y carrito. Si falla la petición de cierre, la UI informa el error.

Nest conserva la validación de JWT, cuenta activa y roles en cada endpoint. El vencimiento efectivo lo determina el JWT, aunque la cookie tenga una duración máxima de siete días. El cierre local no implementa revocación de un JWT que ya se hubiera extraído fuera de la aplicación.

Las mutaciones del proxy y de sesión verifican el origen de la petición. Las respuestas privadas llevan `Cache-Control: no-store`. Una caída temporal del backend no se confunde con un cierre de sesión.

Tras migrar desde la versión anterior, se requiere iniciar sesión nuevamente. Las claves heredadas `auth-storage`, `token` y `user` se eliminan al consultar la sesión. El carrito de un visitante se conserva al iniciar sesión.

## Reservas y pagos

- El wizard valida contacto, catálogo, fecha en horario de Lima, hora, dirección, invitados y consentimientos antes del envío.
- Nombre, correo, teléfono, tipo de evento y método preferido se conservan como un resumen en `additionalNotes`, porque el DTO actual de Nest no tiene columnas de contacto independientes. No se envían campos desconocidos ni valores de relleno.
- El checkout directo exige dirección y ciudad y utiliza `paymentMethod: card`, según el enum del backend.
- El importe enviado a Culqi proviene de `order.totalAmount`, calculado por Nest. El pago de reservas no utiliza el parámetro `amount` de la URL.
- Ambos flujos usan el mismo componente de pago. Ante una respuesta incierta, se consulta `/orders/:id/payment-status`; un evento del SDK por sí solo no confirma un cobro.
- Las denegaciones explícitas de Culqi se registran como intentos fallidos, incluso si la pasarela devuelve HTTP 200. Una tarjeta que devuelve `authentication_required` exige el flujo de autenticación 3DS; la interfaz todavía no integra ese desafío. Ese caso se informa con un mensaje específico y no como un fallo temporal 503. La conciliación también recupera intentos antiguos que quedaron pendientes por esa denegación.
- El servidor vuelve a comprobar el importe, la propiedad de la orden y su estado. Las pruebas automatizadas no realizan cobros reales.

## Estado y consultas

Zustand mantiene el usuario en memoria y el carrito persistido. React Query comparte una caché por navegador entre islas React y crea una caché independiente durante SSR. Al cambiar o cerrar la sesión se limpia la caché privada. El dashboard es una única isla React y no modifica tarjetas mediante IDs del DOM.

Los servicios normalizan las respuestas. El catálogo recorre todas las páginas del endpoint de productos. Los errores se muestran separados de los estados vacíos, con reintento donde corresponde. Los descuentos se recalculan incluso cuando la lista de promociones activas está vacía.

## Validación y mantenimiento

```sh
npm run check          # tipos y plantillas Astro
npm run lint           # hooks, tipos y código sin variables sin usar
npm test               # regresiones sin backend ni pasarela reales
npm run build          # compilación con adaptador Vercel
npm run validate       # las cuatro comprobaciones anteriores
npm run format:check   # formato de código
npm audit              # dependencias y avisos publicados
```

`package-lock.json` debe permanecer versionado y se instala con `npm ci`. Las versiones transitivas de `glob`, `minimatch` y `path-to-regexp` se fijan mediante overrides a ramas corregidas; al actualizar Vercel o el tooling hay que revisar si siguen siendo necesarios. Las utilidades CSS de shadcn están en `src/styles/ui-variants.css`, con su licencia, sin instalar el CLI completo en producción.

Se rechaza `any` explícito mediante ESLint. Los datos externos se modelan con tipos de dominio y los errores se reciben como `unknown`.

## Correcciones de la revisión del 3 de noviembre de 2026

1. Autorización: verificación de sesión real en lugar de confiar en una cookie de rol.
2. Sesión: una sola fuente de usuario y cierre consistente en las dos áreas.
3. Promociones: restauración de precios y etiquetas al agotarse las promociones activas.
4. Dependencias: versiones compatibles, lockfile y actualización de Astro e integraciones.
5. Login: validación de respuesta y eliminación de logs que exponían el token.
6. Reservas: validación por pasos y conservación de contacto sin incumplir el DTO.
7. Entorno: URLs configurables e imágenes resueltas desde un helper compartido.
8. Errores: fallos diferenciados de resultados vacíos y opciones de reintento.
9. Módulos: dominios compartidos separados de las pantallas administrativas.
10. Responsabilidades: modal de promociones, impresión de cocina y pasarela separados.
11. Tipos y datos: eliminación de `any`, servicios tipados y caché compartida.
12. Calidad: lint, comprobación de tipos, pruebas de regresión, formato y documentación.

En el backend se amplió únicamente el perfil autenticado para devolver campos públicos actuales (nombre, correo, rol, teléfono y dirección) y se añadieron pruebas de esa respuesta. Se conservaron los cambios previos existentes en ese repositorio. No se ejecutaron migraciones, semillas ni modificaciones de datos como parte de esta revisión.

La migración de dependencias siguió las [guías oficiales de Astro 6](https://docs.astro.build/en/guides/upgrade-to/v6/) y [Astro 7](https://docs.astro.build/en/guides/upgrade-to/v7/).
