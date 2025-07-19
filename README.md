# HeyMou - Landing Page

Bienvenido al repositorio de la landing page de HeyMou, una aplicación moderna desarrollada con Next.js 14, Tailwind CSS y ShadCN UI.

## 🚀 Características

- **Diseño Brutalista** con tipografía Cabinet Grotesk
- **Totalmente Responsive** para todos los dispositivos
- **Formulario de Contacto** con validación
- **Integración con BuildShip** para webhooks
- **Optimizado para SEO** y rendimiento

## 🛠️ Tecnologías

- **Framework**: Next.js 14 (App Router)
- **Estilos**: Tailwind CSS
- **Componentes UI**: ShadCN
- **Tipografía**: Cabinet Grotesk
- **Tipado**: TypeScript
- **Formularios**: React Hook Form
- **Validación**: Zod

## 🚀 Empezando

### Requisitos previos

- Node.js 18.0 o superior
- pnpm (recomendado) o npm/yarn

### Instalación

1. Clona el repositorio:

   ```bash
   git clone git@github.com:MosheQuantum/heymou.git
   cd heymou
   ```

2. Instala las dependencias:

   ```bash
   pnpm install
   # o
   npm install
   ```

3. Configura las variables de entorno:

   ```bash
   cp .env.example .env.local
   # Edita el archivo .env.local con tus credenciales
   ```

4. Inicia el servidor de desarrollo:

   ```bash
   pnpm dev
   # o
   npm run dev
   ```

5. Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 🏗️ Estructura del Proyecto

```text
src/
├── app/                 # Rutas de Next.js
├── components/          # Componentes reutilizables
├── hooks/               # Custom Hooks
├── lib/                 # Utilidades y configuraciones
├── public/              # Archivos estáticos
└── types/               # Definiciones de TypeScript
```

## 🌐 Despliegue

El proyecto está configurado para ser desplegado en Vercel. Simplemente conecta tu repositorio de GitHub y configura las variables de entorno necesarias.

## 🤝 Contribución

1. Haz un fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Haz commit de tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Haz push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más información.

---

Desarrollado con ❤️ por [Mou](https://github.com/MosheQuantum)
