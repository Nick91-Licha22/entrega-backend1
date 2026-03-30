# Ecommerce Backend - Entrega Final (Re-entrega)

Este proyecto es una plataforma de Ecommerce robusta desarrollada con **Node.js, Express y MongoDB**, siguiendo una arquitectura profesional de capas.

## 🛠️ Mejoras y Correcciones Realizadas

En esta versión se han corregido los puntos señalados en la entrega anterior, asegurando el desacoplamiento total de los componentes:

1.  **Modelo de Capas (Routing -> Controller -> Repository -> DAO):** Se eliminó la dependencia directa de los modelos de Mongoose en las rutas. Ahora la comunicación fluye a través de controladores y repositorios.
2.  **Patrón Repository:** Implementado para centralizar la lógica de acceso a datos y permitir una fácil transición entre diferentes orígenes de datos si fuera necesario.
3.  **DAO Completo:** Se enriquecieron los Data Access Objects con métodos CRUD completos, incluyendo un sistema de `populate` en carritos para asegurar la disponibilidad de datos de stock y precio.
4.  **Sistema de Recuperación de Contraseña:** Implementado con envío de correos vía **Nodemailer**. Incluye validación de token (expira en 1h) y restricción para no repetir la contraseña anterior.
5.  **DTO (Data Transfer Object):** La ruta `/api/sessions/current` ahora utiliza un `UserDTO` para filtrar información sensible antes de enviarla al cliente.
6.  **Middleware de Autorización:** Se mejoró el sistema de roles para permitir validaciones por array, restringiendo acciones de Administrador y Usuario según la consigna.
7.  **Lógica de Ticket y Compra:** Se implementó el modelo de `Tickets` y un proceso de compra que verifica stock, resta cantidades, genera el comprobante y mantiene en el carrito solo los productos sin disponibilidad.

## 🚀 Instalación y Uso

1. Clonar el repositorio.
2. Ejecutar `npm install`.
3. Configurar el archivo `.env` con las variables: `JWT_SECRET`, `MONGO_URL`, `MAIL_USER` y `MAIL_PASS`.
4. Iniciar con `npm start` en el puerto 8080.