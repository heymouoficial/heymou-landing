# HeyMou - Tu Aliado Tecnológico

[![Next.js](https://img.shields.io/badge/Next.js-14+-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=flat-square&logo=vercel)](https://vercel.com/)

> **Landing page oficial de HeyMou** - Plataforma de consultoría tecnológica que transforma ideas ambiciosas en resultados tangibles.

## 🌟 Características

- **🌐 Bilingüe**: Soporte nativo para español e inglés
- **⚡ Performance**: Optimizado para Core Web Vitals
- **📱 Responsive**: Diseño adaptativo para todos los dispositivos
- **🤖 IA Integrada**: Chatbot inteligente para asistencia
- **📊 Analytics**: Tracking avanzado de conversiones
- **🔒 Seguro**: Implementación con mejores prácticas de seguridad

## 🚀 Stack Tecnológico

### Frontend

- **Next.js 14+** con App Router
- **TypeScript** en modo estricto
- **React 18+** con hooks modernos
- **Tailwind CSS** para estilos utility-first
- **Framer Motion** para animaciones
- **next-intl** para internacionalización

### Backend & Servicios

- **Next.js API Routes** para endpoints
- **BuildShip** para workflows complejos
- **Supabase** para base de datos y autenticación

### Herramientas de Desarrollo

- **ESLint** con configuración estricta
- **Prettier** para formateo consistente
- **TypeScript** modo estricto habilitado

## 📁 Estructura del Proyecto

``
/
├── app/                    # Next.js App Router
│   ├── [locale]/          # Rutas internacionalizadas
│   ├── api/               # API routes
│   └── globals.css        # Estilos globales
├── components/            # Componentes React reutilizables
│   ├── ui/               # Componentes UI básicos
│   ├── layout/           # Componentes de layout
│   ├── forms/            # Formularios
│   └── sections/         # Secciones de página
├── lib/                  # Utilidades y configuraciones
├── types/                # Definiciones TypeScript
├── locales/              # Archivos de traducción
│   ├── es/              # Traducciones en español
│   └── en/              # Traducciones en inglés
└── public/               # Assets estáticos
``

## 🛠️ Desarrollo Local

### Prerrequisitos

- Node.js 18+
- npm o yarn
- Git

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/heymouoficial/heymou-landing.git
cd heymou-landing

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus configuraciones

# Iniciar servidor de desarrollo
npm run dev
```

### Scripts Disponibles

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build para producción
npm run start        # Servidor de producción
npm run lint         # Ejecutar ESLint
npm run lint:fix     # Corregir errores de ESLint
npm run type-check   # Verificación de tipos TypeScript
```

## 🌐 Internacionalización

El proyecto soporta español e inglés con detección automática de idioma:

- **Español**: `/es/` (por defecto)
- **Inglés**: `/en/`

### Estructura de Traducciones

``
/locales/
├── es/
│   ├── common.json      # Traducciones comunes
│   ├── navigation.json  # Navegación
│   └── homepage.json    # Página principal
└── en/
    └── [misma estructura]
``

## 📊 Performance

### Objetivos Core Web Vitals

- **LCP** (Largest Contentful Paint): < 2.5s
- **FID** (First Input Delay): < 100ms
- **CLS** (Cumulative Layout Shift): < 0.1

### Optimizaciones Implementadas

- Componente Next.js Image para optimización automática
- Generación estática para contenido
- Code splitting automático
- Lazy loading de componentes

## 🔧 Configuración

### Variables de Entorno Requeridas

```bash
# Site Configuration
NEXT_PUBLIC_SITE_URL=https://heymou.com

# Analytics (opcional)
NEXT_PUBLIC_GA_ID=your_google_analytics_id
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=your_domain

# BuildShip Integration (para funcionalidades avanzadas)
BUILDSHIP_API_KEY=your_buildship_api_key
BUILDSHIP_CONTACT_ENDPOINT=your_contact_endpoint
```

## 🚀 Despliegue

### Vercel (Recomendado)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/heymouoficial/heymou-landing)

1. Conecta tu repositorio con Vercel
2. Configura las variables de entorno
3. Deploy automático en cada push a `main`

### Otros Proveedores

El proyecto es compatible con cualquier proveedor que soporte Next.js:

- Netlify
- AWS Amplify
- Railway
- Render

## 📱 Funcionalidades

### 🏠 Página Principal

- Hero section con llamada a la acción
- Sección de servicios
- Historias de éxito
- Blog con tips tecnológicos
- Formulario de contacto

### 🤖 Chatbot Inteligente

- Asistencia automatizada
- Soporte bilingüe
- Integración con IA
- Historial de conversaciones

### 📝 Formulario de Contacto

- Validación en tiempo real
- Campos personalizados por tipo de proyecto
- Integración con sistema de CRM
- Notificaciones automáticas

### 📊 Analytics

- Tracking de conversiones
- Métricas de performance
- Análisis de comportamiento
- Reportes automáticos

## 🎨 Diseño

### Principios de Diseño

- **Minimalista**: Enfoque en contenido esencial
- **Profesional**: Transmite confianza y expertise
- **Accesible**: Cumple estándares WCAG
- **Responsive**: Optimizado para todos los dispositivos

### Paleta de Colores

- **Primario**: Azul tecnológico
- **Secundario**: Gris moderno
- **Acentos**: Verde para CTAs
- **Neutros**: Escala de grises

## 🏢 Sobre Este Proyecto

Esta es la landing page oficial de **HeyMou**, mi marca personal de consultoría tecnológica. El proyecto forma parte de mi estrategia de marca y presencia digital como aliado tecnológico para emprendedores visionarios.

### 🎯 Propósito

- Mostrar mis servicios de consultoría tecnológica
- Generar leads cualificados de potenciales clientes
- Establecer autoridad y expertise en el sector tech
- Proporcionar valor a través de contenido educativo

## 📄 Derechos de Autor

© 2024 HeyMou - Todos los derechos reservados.

Este proyecto es la landing page oficial de mi marca personal de consultoría tecnológica. El código fuente está disponible para referencia técnica, pero el contenido, diseño y marca están protegidos por derechos de autor.

## 📞 Contacto Profesional

¿Necesitas un aliado tecnológico para tu proyecto?

- **Website**: [heymou.com](https://heymou.com)
- **Email**: <hola@heymou.com>
- **LinkedIn**: [Moisés (Mou)](https://linkedin.com/in/heymou)
- **Calendly**: [Agenda una consulta](https://calendly.com/heymou)

### 🚀 Servicios Disponibles

- **Consultoría Estratégica** - Roadmaps tecnológicos y arquitectura de soluciones
- **Desarrollo Full-Stack** - Aplicaciones web y móviles escalables
- **Automatización** - Workflows inteligentes con BuildShip y herramientas no-code
- **Mentoría Técnica** - Acompañamiento para equipos y emprendedores

## 🛠️ Stack Tecnológico

Construido con las mejores herramientas del mercado:

- [Next.js](https://nextjs.org/) - Framework React de producción
- [TypeScript](https://www.typescriptlang.org/) - Tipado estático para JavaScript
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS utility-first
- [Framer Motion](https://www.framer.com/motion/) - Animaciones fluidas
- [BuildShip](https://buildship.app/) - Backend workflows sin código
- [Supabase](https://supabase.com/) - Base de datos y autenticación
- [Vercel](https://vercel.com/) - Hosting y deployment

---

***Desarrollado por Moisés (Mou) - Tu Aliado Tecnológico**

*Transformando ideas ambiciosas en resultados tangibles desde 2009**
