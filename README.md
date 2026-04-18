# 🌸 FlowersNotes — Sistema de Pedidos Florales

Aplicación web completa para gestión y pedidos de arreglos florales.  
**Frontend HTML** + **Backend Node.js/Express** + **Base de datos SQLite** (sql.js).

---

## 🚀 Cómo ejecutar

### 1. Instalar dependencias
```bash
npm install
```

### 2. Iniciar el servidor
```bash
node server.js
```

### 3. Abrir en el navegador
```
http://localhost:3001/login.html
```

---

## 🔑 Credenciales de prueba

| Rol | Email | Contraseña |
|-----|-------|------------|
| **Admin** | admin@flowersnotes.com | Admin1234! |
| **Cliente** | Regístrate desde la app | Mínimo 6 caracteres |

---

## 📁 Estructura del proyecto

```
FLOWERNOTESSSSSSSSS/
├── server.js              ← Backend Node.js (punto de entrada)
├── package.json
├── flowernotes.db         ← Base de datos SQLite (se crea automáticamente)
│
├── login.html             ← Página de login / registro
├── client/
│   └── tienda.html        ← Tienda para clientes
└── admin/
    └── index.html         ← Panel de administración
```

---

## 🌐 Rutas de la API

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| POST | `/api/login` | Iniciar sesión | — |
| POST | `/api/registro` | Registrar cliente | — |
| GET | `/api/products` | Ver catálogo | Cliente/Admin |
| POST | `/api/products` | Crear producto | Admin |
| PUT | `/api/products/:id` | Editar producto | Admin |
| DELETE | `/api/products/:id` | Eliminar producto | Admin |
| GET | `/api/orders` | Ver pedidos | Cliente/Admin |
| POST | `/api/orders` | Crear pedido | Cliente |
| PUT | `/api/orders/:id` | Cambiar estado | Admin |
| GET | `/api/clients` | Ver clientes | Admin |
| POST | `/api/notes` | Agregar nota | Cliente |
| GET | `/api/notes` | Ver notas | Admin |

---

## ✨ Funcionalidades

### Cliente
- ✅ Login y registro con validación
- ✅ Catálogo de flores con búsqueda y filtros por categoría
- ✅ Carrito de compras con control de stock
- ✅ Notas personalizadas para arreglos
- ✅ Historial de pedidos con estados

### Admin
- ✅ Dashboard con estadísticas (pedidos, ingresos, clientes)
- ✅ Gestión completa de pedidos (Pendiente → Pagado / Declinado)
- ✅ CRUD de productos (crear, editar, eliminar)
- ✅ Lista de clientes con total gastado
- ✅ Notas de los clientes

---

## 🛠 Tecnologías

- **Backend:** Node.js, Express, sql.js (SQLite), bcryptjs, jsonwebtoken
- **Frontend:** HTML5, CSS3 (variables), JavaScript vanilla
- **Fuentes:** Poppins + Playfair Display (Google Fonts)
- **Íconos:** Material Symbols (Google)
