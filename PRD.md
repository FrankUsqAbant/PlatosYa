# Product Requirements Document (PRD) - PlatoYa

## 1. Introducción
**PlatoYa** es un sistema integral de pedidos para restaurantes diseñado para optimizar el flujo de trabajo entre los clientes que realizan pedidos y el personal de cocina que los prepara. El sistema consta de una aplicación web orientada al usuario final y una interfaz especializada en tiempo real para la gestión en la cocina.

## 2. Objetivos del Producto
- **Para los clientes:** Proveer una experiencia fluida e intuitiva para explorar el menú, agregar productos al carrito y pagar digitalmente de manera segura.
- **Para la cocina:** Proveer un tablero de control (Kanban) en tiempo real para gestionar los pedidos entrantes y visualizar el flujo de preparación sin necesidad de recargar la página.
- **Para la administración:** Centralizar los pedidos y ofrecer una infraestructura desplegada en la nube con alta disponibilidad.

## 3. Arquitectura y Stack Tecnológico
El proyecto se divide en dos componentes principales estructurados en un Monorepo o repositorios enlazados lógicamente:

### Frontend
- **Framework:** Next.js 15 (App Router).
- **Estilos:** CSS Modules con diseño Premium (Glassmorphism, animaciones fluidas, paletas de colores modernos).
- **Autenticación:** NextAuth.js v5 (Auth.js) para manejo de sesiones con JSON Web Tokens (JWT).
- **Pagos:** Integración con PayPal SDK (`@paypal/react-paypal-js`).
- **Interacción UI (Cocina):** Drag and Drop implementado con `@hello-pangea/dnd` para un tablero Kanban.
- **Tiempo Real:** Cliente de `socket.io-client`.

### Backend
- **Entorno:** Node.js con Express.js.
- **Base de Datos:** MongoDB Atlas (Mongoose ODM).
- **Tiempo Real:** Socket.IO Server para la comunicación bidireccional inmediata de nuevos pedidos y cambios de estado.
- **Seguridad:** Encriptación de contraseñas con `bcryptjs`, autenticación de endpoints mediante JWT, CORS restrictivo.

### Infraestructura
- **Plataforma Cloud:** Railway.app.
- **Gestión de variables:** `.env` encriptados y proveídos de forma inyectada a los contenedores.
- **Flujo de despliegue:** Los directorios `backend` y `frontend` están configurados para compilarse y desplegarse como servicios independientes.

## 4. Funcionalidades Principales (Features)

### 4.1 Autenticación y Autorización
- Registro de usuarios y control de acceso basado en roles (`cliente` vs `cocinero`).
- Redirección automática de acuerdo con el nivel de permisos.

### 4.2 Menú y Catálogo
- Listado de platillos divididos por categorías (Entradas, Platos Fuertes, Postres, Bebidas).
- Interfaz visual atractiva con tarjetas para cada platillo.

### 4.3 Carrito y Checkout
- Estado global manejado a nivel cliente para el carrito de compras.
- Cálculo de totales.
- Pasarela de pago conectada al Sandbox de PayPal.

### 4.4 Tablero de Cocina (Kitchen Board)
- Estructura Kanban con 4 columnas obligatorias:
  1. **Pendiente**
  2. **En Preparación**
  3. **Listo**
  4. **Entregado**
- Arrastre y soltado de tarjetas de pedidos entre columnas con cursores e íconos interactivos (`GripVertical`).
- Actualización en tiempo real a través de WebSockets (si el cliente emite una orden, aparece inmediatamente en el tablero).

## 5. Casos de Uso Críticos
1. **El usuario hace un pedido:** Entra al menú -> Añade platillos -> Pasa al checkout -> Paga con PayPal -> La orden se guarda en MongoDB y se notifica al backend vía API.
2. **La cocina recibe un pedido:** El backend recibe la orden -> Emite un evento WebSocket `pedido:nuevo` -> El frontend del cocinero recibe el evento -> Se añade una tarjeta a la columna "Pendiente".
3. **El cocinero actualiza la orden:** El cocinero arrastra la tarjeta a "En Preparación" -> El frontend notifica vía API el cambio -> La API emite un evento `pedido:actualizado` -> Se sincroniza en cualquier otra pantalla conectada.

## 6. Estado Actual y Despliegue
- El código se encuentra totalmente contenerizado y configurado mediante `npm ci` para despliegues inmutables.
- **Frontend URL:** [Desplegado en Railway]
- **Backend URL:** [Desplegado en Railway]
- **Base de Datos:** Cluster MongoDB Atlas conectado y con lista de IPs abiertas (`0.0.0.0/0`) para acomodar las IP dinámicas de los contenedores PaaS.

## 7. Futuras Mejoras (V2)
- Paneles de análisis de datos para ver platillos más vendidos (Dashboard Administrativo).
- Historial de pedidos para el cliente.
- Notificaciones Push o SMS al cliente cuando la orden pase a estado "Listo".
- Múltiples pasarelas de pago (Stripe, MercadoPago).
