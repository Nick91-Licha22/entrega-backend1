# 🛒 SYN Verdulería - Final Backend Project

Este es el proyecto final para el curso de Backend de Coderhouse. Consiste en un sistema de E-commerce completo enfocado en una verdulería, implementando una arquitectura profesional con persistencia en base de datos, seguridad y manejo de transacciones.

## 🚀 Tecnologías Utilizadas

* **Node.js & Express:** Motor principal del servidor.
* **MongoDB & Mongoose:** Base de datos NoSQL y modelado de datos.
* **Passport & JWT:** Sistema de autenticación y manejo de sesiones mediante cookies.
* **Bcrypt:** Hasheo de contraseñas para máxima seguridad.
* **Handlebars:** Motor de plantillas para el renderizado de vistas dinámicas.
* **SweetAlert2:** Notificaciones interactivas para el usuario.

## 🛠️ Funcionalidades Implementadas

### 🔑 Autenticación y Autorización
- **Registro y Login:** Los usuarios pueden crearse una cuenta y loguearse.
- **JWT (JSON Web Token):** Las sesiones se manejan mediante tokens almacenados en cookies seguras (`httpOnly`).
- **Passport:** Middleware para la protección de rutas.
- **Estrategia Current:** Ruta `/api/sessions/current` para validar al usuario activo.

### 🍎 Gestión de Productos
- Catálogo dinámico renderizado desde MongoDB.
- Sistema de **Paginación** con filtros por categoría.
- Visualización de stock en tiempo real.

### 🛒 Carrito de Compras
- Cada usuario tiene un carrito único asignado al registrarse.
- Funcionalidades de **Agregar**, **Quitar** y **Vaciar** productos.
- Persistencia total: el carrito no se pierde al cerrar sesión.

### 🎫 Proceso de Compra (Ticket)
- Al finalizar la compra, el sistema verifica el **stock disponible**.
- Se descuenta el stock de los productos comprados.
- Se genera un **Ticket de Compra** con un código único (`uuid`), fecha, monto total y el email del comprador.
- Los productos que no tenían stock suficiente permanecen en el carrito para una futura compra.

