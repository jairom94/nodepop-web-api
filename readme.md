# 🛍️ NodePop Web

Web interface to manage products for the authenticated user using the NodePop API. It allows you to create, view, and delete products with image uploads and custom tags.

---

## 🚀 Instalación

Install the project dependencies with:

```bash
npm install
 ```

 On first deploy you can use the next commando to initialize the database:

 ```sh
 npm run initDB
 ```

> User to login default

 - email: user1@mail.com
- password: 1234

 <img src="assets-readme/login.png" width="200" alt="login view">

> Add a product

<img src="assets-readme/add-product.png" width="200" alt="login view">

 > To delete a product you must do hover on image product

 <img src="assets-readme/delete-product.png" width="200" alt="delete a product">


 ## 🧾 NodePop API

NodePop es una API RESTful diseñada para gestionar productos de usuarios autenticados. Permite crear, consultar, actualizar parcialmente, modificar completamente y eliminar productos, con soporte para carga de imágenes y asignación de etiquetas personalizadas.

### ✨ Funcionalidades principales

- Registro e inicio de sesión con autenticación por token
- CRUD completo para productos con imágenes
- Validación de datos y manejo de errores
- Documentación interactiva con Swagger UI

### 📚 Documentación

Puedes explorar la documentación completa e interactuar con los endpoints desde Swagger UI:

👉 [http://localhost:3000/api-doc/](http://localhost:3000/api-doc/)