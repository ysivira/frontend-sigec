# Proyecto SIGEC - Frontend (Portal de Asesores)

**Sistema de Gestión de Cotizaciones - Medicina Privada**

Este repositorio contiene el **Frontend** de la aplicación SIGEC, una Single Page Application (SPA) desarrollada en **React (Vite)** que permite a los asesores comerciales gestionar clientes y generar cotizaciones de planes de salud de manera dinámica.

---

## 🚀 Características Principales

* **🔐 Autenticación Segura:** Sistema de Login y Registro integrado con JWT. Manejo de sesión y protección de rutas privadas.
* **📊 Dashboard Administrativo:** Panel visual con métricas rápidas y accesos directos.
* **📝 Cotizador Dinámico:** Formulario paso a paso para generar cotizaciones, calcular precios según edad/plan y descargar el PDF.
* **🎨 UI/UX Moderna:** Diseño limpio y responsivo utilizando **Material-UI (MUI)**.
* **📱 Totalmente Responsivo:** Adaptable a dispositivos móviles, tablets y escritorio.
* **🔗 Conexión API:** Capa de servicios centralizada con **Axios** para la comunicación con el Backend.

---

## 🛠️ Tecnologías Utilizadas

* **Core:** React.js + Vite (Build tool rápido y ligero).
* **Enrutamiento:** React Router DOM v6.
* **Estilos y Componentes:** Material-UI (MUI) v5.
* **Peticiones HTTP:** Axios (con interceptores para manejo de tokens).
* **Manejo de PDF:** Integración con la generación de documentos del backend.

---

## ⚙️ Instalación y Configuración

Sigue estos pasos para levantar el proyecto en tu entorno local.

### 1. Requisitos Previos
* Node.js (v14 o superior).
* Tener el **Backend de SIGEC** ejecutándose localmente en el puerto `5000`.
    * Repositorio Backend: [https://github.com/ysivira/backend-sigec](https://github.com/ysivira/backend-sigec)

### 2. Clonar e Instalar
 
    git clone [https://github.com/ysivira/frontend-sigec](https://github.com/ysivira/frontend-sigec)
   
    Accede a la carpeta del proyecto e instala las dependencias cd frontend-sigec
        npm install 
       
3. Variables de Entorno (.env)
Es crucial configurar la URL del backend para que la aplicación funcione.

Crea un archivo .env en la raíz del proyecto.
VITE_API_URL=http://localhost:5000/api

4. Ejecutar el Proyecto
Para iniciar el servidor de desarrollo (Vite):

   