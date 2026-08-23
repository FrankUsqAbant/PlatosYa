# PlatoYa 🍽️✨
> **Plataforma Full Stack de Pedidos Gastronómicos con Gestión de Cocina en Tiempo Real**

<p align="center">
  <img src="./frontend/public/images/Principal.webp" alt="PlatoYa Banner Principal" width="100%" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js_15-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js 15" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/MongoDB_Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socketdotio&logoColor=white" alt="Socket.io" />
  <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel" />
</p>

---

## 🌟 Características Principales

- **🎨 Diseño Gourmet Dark Luxury:** Interfaz inmersiva desarrollada con Vanilla CSS Tokens, Glassmorphism, animaciones micro-interactivas y tipografía *Outfit / Plus Jakarta Sans*.
- **⚡ Optimización WebP Ultraligera:** Reducción del 85% en el peso de assets gráficos para tiempos de carga instantáneos.
- **🔄 Sincronización en Tiempo Real (WebSockets):** Tablero Kanban interactivo para cocineros con actualización bidireccional automática de estados de comandas (`pendiente` ➔ `en_preparacion` ➔ `listo` ➔ `entregado`).
- **🛡️ Arquitectura Segura & Robusta:** 
  - Cálculo y validación de precios en el servidor contra alteración de pedidos (*Price Tampering*).
  - Autenticación con JWT + Auth.js v5 y control de acceso basado en roles (RBAC).
  - Sanitización de inputs, validación estricta de ObjectIDs y protección contra ataques DoS/Fingerprinting.
- **☁️ Despliegue 24/7 de Alta Disponibilidad:** Frontend en **Vercel**, Backend en **Render** (con monitor keep-alive) y persistencia permanente en **MongoDB Atlas**.

---

## 🏛️ Arquitectura del Sistema

```text
┌───────────────────────────┐         Socket.IO / REST API        ┌───────────────────────────┐
│     Frontend (Vercel)     │ ◄─────────────────────────────────► │     Backend (Render)      │
│  - Next.js 15 App Router  │                                     │  - Express.js + Node.js   │
│  - Auth.js v5 / Client UI │                                     │  - Socket.IO Server       │
└───────────────────────────┘                                     └─────────────┬─────────────┘
                                                                                │ Mongoose
                                                                                ▼
                                                                  ┌───────────────────────────┐
                                                                  │ MongoDB Atlas (Cloud M0)  │
                                                                  │  - Users, Platos, Pedidos │
                                                                  └───────────────────────────┘
```

---

## 🔑 Credenciales de Demostración

| Rol | Correo Electrónico | Contraseña | Vistas y Permisos |
| :--- | :--- | :--- | :--- |
| **👤 Cliente** | `cliente@platoya.com` | `cliente123` | Explorar menú, filtros, carrito, checkout y seguimiento de pedidos |
| **👨‍🍳 Cocinero** | `cocinero@platoya.com` | `cocinero123` | Tablero Kanban de cocina con gestión de comandas en vivo |

---

## 🚀 Inicio Rápido en Local

### 1. Clonar el repositorio
```bash
git clone https://github.com/FrankUsqAbant/PlatosYa.git
cd PlatosYa
```

### 2. Iniciar el Backend
```bash
cd backend
npm install
npm run dev
```
> *Nota: Por defecto, si no se especifica `MONGODB_URI`, el backend levanta automáticamente un servidor MongoDB en memoria con datos semilla precargados.*

### 3. Iniciar el Frontend
En una nueva terminal:
```bash
cd frontend
npm install
npm run dev
```
Abre [http://localhost:3000](http://localhost:3000) en tu navegador para interactuar con la plataforma.

---

## 📚 Endpoints Principales de la API

| Método | Endpoint | Acceso | Descripción |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Público | Verificación del estado del servidor |
| `POST` | `/api/auth/login` | Público | Autenticación y generación de JWT |
| `POST` | `/api/auth/register` | Público | Registro de usuarios (`cliente` o `cocinero`) |
| `GET` | `/api/platos` | Público | Listar platos con filtro opcional por categoría |
| `POST` | `/api/pedidos` | Cliente | Crear un nuevo pedido con validación de precios |
| `GET` | `/api/pedidos` | Autenticado | Ver pedidos (Cliente: propios / Cocinero: todos) |
| `PATCH` | `/api/pedidos/:id/estado` | Cocinero | Actualizar el estado de la comanda y emitir socket |

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Desarrollado con excelencia técnica y pasión por el diseño moderno.
