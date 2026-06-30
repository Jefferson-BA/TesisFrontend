# DeParraSpitz — Catering & Eventos

Sitio web desarrollado para **DeParraSpitz**, una empresa real de catering y eventos, como parte de nuestro proyecto de tesis universitaria. El objetivo fue digitalizar la presencia del negocio y darle a sus clientes una forma moderna de conocer el menú, cotizar servicios y gestionar reservas.

> **Experiencias gastronómicas premium** — Transformamos celebraciones en momentos inolvidables con buffets exclusivos, carnes premium y atención personalizada.

## Sobre el proyecto

Este proyecto de tesis consistió en diseñar y desarrollar la página web de DeParraSpitz, una empresa de catering y parrillas para eventos, con el fin de digitalizar su proceso de contratación de servicios. La plataforma permite a los usuarios:

- Conocer el menú y los estilos de cocina disponibles
- Solicitar cotizaciones personalizadas según el tipo de evento
- Gestionar reservas
- Acceder a un sistema de cuentas con distintos niveles de acceso (cliente / administrador)

## Funcionalidades del frontend

- Landing page con presentación del servicio y estadísticas (+500 eventos atendidos, estilos de cocina, personalización al 100%)
- Sección de menú y catálogo de servicios
- Sistema de reservas
- Registro de usuarios con validación de formularios
- Middleware con control de acceso basado en roles
- Notificaciones en tiempo real (toasts) para feedback al usuario
- Diseño responsive con iteraciones de mejora visual

## Stack tecnológico

| Tecnología | Uso |
|---|---|
| **Astro** | Framework principal del proyecto |
| **TypeScript** | Lógica de componentes y tipado estático |
| **CSS** | Estilos y diseño responsive |
| **JavaScript** | Interactividad puntual |

## Mi rol en el proyecto

Estuve a cargo del **desarrollo completo del frontend**, incluyendo:

- Arquitectura de componentes y estructura del proyecto en Astro
- Implementación de las vistas principales (inicio, menú, reservas, registro)
- Integración del sistema de notificaciones (Sonner)
- Desarrollo del middleware de control de acceso por roles
- Validación de formularios de registro
- Iteraciones de diseño UI/UX para mejorar la experiencia del usuario

## Cómo correrlo localmente

```bash
# Clonar el repositorio
git clone https://github.com/Jefferson-BA/TesisFrontend.git
cd TesisFrontend

# Instalar dependencias
npm install

# Levantar el servidor de desarrollo
npm run dev
```

El proyecto estará disponible en `http://localhost:4321` (puerto por defecto de Astro).

## Estructura del proyecto

```
TesisFrontend/
├── src/
│   ├── components/
│   ├── layouts/
│   ├── pages/
│   └── middleware.ts
├── public/
├── package.json
└── tsconfig.json
```

## Sobre el proyecto

Desarrollado como tesis universitaria para un cliente real, con el objetivo de entregar una solución web funcional y lista para producción — no solo un prototipo académico.
