# 🍎 Proyecto Ecommerce - SYN Verdulería (Backend II)

##  Primera Entrega - Backend 2
Este proyecto es un sistema de ecommerce para una verdulería que incluye gestión de productos, carritos y un sistema completo de usuarios con autenticación y autorización.

###  Tecnologías Utilizadas
* **Node.js & Express**
* **MongoDB & Mongoose** (Base de datos NoSQL)
* **Passport & JWT** (Autenticación basada en Cookies)
* **Bcrypt** (Encriptación de contraseñas)
* **Handlebars** (Motor de plantillas)
* **Socket.io** (Actualizaciones en tiempo real)

---

###  Funcionalidades de Seguridad Implementadas

1. **Modelo de Usuario:** Se implementó el modelo `User` con campos de nombre, apellido, email (único), edad, contraseña, rol y referencia a un carrito.
2. **Encriptación:** Se utiliza `bcrypt.hashSync` para asegurar que las contraseñas nunca se guarden en texto plano.
3. **Estrategia Passport-JWT:** Se configuró Passport para extraer el token de autenticación directamente desde las Cookies del navegador (`coderCookieToken`).
4. **Endpoint `/current`:** Ruta protegida que valida el JWT del usuario logueado y devuelve su información.

---

###  Cómo ejecutar el proyecto
1. Clonar el repositorio.
2. Ejecutar `npm install` para instalar las dependencias.
3. Crear un archivo `.env` en la raíz con las variables
   ```env