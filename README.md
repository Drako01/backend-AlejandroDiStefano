<h1 align="center">Programación Backend</h1><br><br>
<p align="center"> 
<img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTY0JeyLTcn-kwLcHWl0gf3XzfFnot6eshV2ms8RVkEmzZst74I4X24PO8KCT7inFz46W0&usqp=CAU" alt="backend" />
</p><br>
 <h2 align="center">Lenguaje y Herramientas</h2>
 <br><br>
 <p align="center"> 
 <a href="https://www.w3.org/html/" target="_blank"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/html5/html5-original-wordmark.svg" alt="html5" width="90" height="90"/></a> 
 <a href="https://www.w3schools.com/css/" target="_blank"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/css3/css3-original-wordmark.svg" alt="css3" width="90" height="90"/></a> 
 <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/javascript/javascript-original.svg" alt="Javascript" width="90" height="90"/></a> 
<a href="https://www.typescriptlang.org/" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/typescript/typescript-original.svg" alt="typescript" width="90" height="90"/> </a> 
</p>
<br>
 <p align="center"> 
<a href="https://www.mongodb.com/" target="_blank" rel="Drako01"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/mongodb/mongodb-original-wordmark.svg" alt="mongodb.com"  height="120"/> </a>
<a href="https://www.express.com/" target="_blank" rel="Drako01"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/express/express-original-wordmark.svg" alt="express.com"  height="120"/> </a>
 <a href="https://reactjs.org/" target="_blank" rel="Drako01"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original-wordmark.svg" alt="react" height="120"/> </a>
 <a href="https://nodejs.org/" target="_blank" rel="Drako01"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/nodejs/nodejs-original-wordmark.svg" alt="nodejs"  height="120"/> </a>
 
</p>
<br><br>




---
<br><br>

---

## Descripción del Proyecto: E-commerce Backend

Este proyecto es un backend completo para una aplicación de e-commerce, desarrollado con Node.js y Express, y utilizando MongoDB como base de datos. La aplicación permite la gestión de productos, carritos de compras, niveles de usuario, y cuenta con diversas características de seguridad y funcionalidad avanzada, como la integración de una pasarela de pagos. Las vistas se han implementado utilizando Handlebars para ofrecer una experiencia de usuario dinámica y eficiente.

### Características Principales

1. **Gestión de Productos**:
    - CRUD (Crear, Leer, Actualizar, Eliminar) de productos.
    - Categorías y subcategorías de productos.
    - Gestión de inventario y precios.

2. **Carrito de Compras**:
    - Añadir, actualizar y eliminar productos en el carrito.
    - Persistencia de carritos de compras para usuarios autenticados.

3. **Niveles de Usuario**:
    - Roles de usuario: administrador, vendedor y cliente.
    - Control de acceso basado en roles para ciertas rutas y acciones.

4. **Seguridad**:
    - Autenticación y autorización de usuarios utilizando JSON Web Tokens (JWT).
    - Encriptación de contraseñas utilizando bcrypt.
    - Protección contra ataques comunes como XSS y CSRF.

5. **Pasarela de Pagos**:
    - Integración con pasarelas de pago populares para procesar transacciones.
    - Gestión de órdenes y confirmaciones de pago.

6. **Middlewares**:
    - Middlewares personalizados para la validación de datos, autenticación de usuarios, y manejo de errores.
    - Logger para el registro de actividades y errores.

7. **Arquitectura por Capas**:
    - **Controladores**: Manejan las solicitudes HTTP y responden con los datos apropiados.
    - **Modelos**: Definen la estructura de los datos y las operaciones de la base de datos.
    - **Servicios**: Contienen la lógica de negocio y operaciones complejas.
    - **Middlewares**: Gestión de autenticación, validación y manejo de errores.
    - **Config**: Configuración de la aplicación, incluyendo variables de entorno y configuraciones de la base de datos.
    - **Test**: Pruebas unitarias y de integración para asegurar la calidad y funcionalidad del código.

### Tecnologías Utilizadas

- **Node.js**: Entorno de ejecución para JavaScript en el servidor.
- **Express**: Framework web para Node.js que facilita la creación de aplicaciones web y APIs.
- **MongoDB**: Base de datos NoSQL orientada a documentos.
- **Mongoose**: ODM (Object Data Modeling) para MongoDB, que facilita la interacción con la base de datos.
- **Handlebars**: Motor de plantillas para generar vistas dinámicas en HTML.
- **JWT**: JSON Web Tokens para la autenticación y autorización.
- **bcrypt**: Librería para el hash de contraseñas.
- **Pasarelas de Pago**: Integración con servicios de pago como Stripe o PayPal.
- **Jest/Mocha**: Frameworks de testing para realizar pruebas unitarias y de integración.

### Configuración del Proyecto

El proyecto se organiza de la siguiente manera:

- **src/server**: Carpeta principal del servidor.
  - **controllers**: Contiene los controladores de la aplicación.
  - **models**: Define los esquemas y modelos de MongoDB.
  - **services**: Contiene la lógica de negocio.
  - **middlewares**: Middlewares para validación, autenticación, etc.
  - **config**: Archivos de configuración y variables de entorno.
  - **views**: Plantillas Handlebars para las vistas.
  - **tests**: Pruebas unitarias y de integración.

### Ejecución del Proyecto

Para ejecutar el proyecto, sigue estos pasos:

1. **Instalación de Dependencias**:
    ```bash
    npm install
    ```

2. **Configuración de Variables de Entorno**:
    Crea un archivo `.env` con las variables necesarias como la URL de MongoDB, las claves para JWT, y las credenciales de la pasarela de pagos.

3. **Ejecución del Servidor**:
    ```bash
    npm start
    ```
4. **Ejecución del Módulo de Test**:
    ```bash
    npm test
    ```


### Documentación de API

La documentación de la API se encuentra disponible y es accesible a través de Swagger en la ruta:
  ```
  http://localhost:8080/docs-api
  ```

Esta documentación proporciona detalles sobre todas las rutas disponibles, los métodos HTTP soportados, y los datos esperados.

---


<br><br>

<p align="center"> 
    <img src="https://jobs.coderhouse.com/assets/logos_coderhouse.png" alt="CoderHouse"  height="100"/>
</p>



---


### Autor: Alejandro Daniel Di Stefano

---
