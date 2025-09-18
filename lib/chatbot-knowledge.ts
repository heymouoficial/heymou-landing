// Base de conocimiento del chatbot HeyMou
export interface KnowledgeItem {
  keywords: string[];
  response: {
    es: string;
    en: string;
  };
  category: 'services' | 'about' | 'contact' | 'pricing' | 'process' | 'technology' | 'general';
}

export const knowledgeBase: KnowledgeItem[] = [
  // Servicios principales
  {
    keywords: ['servicios', 'services', 'qué haces', 'what do you do', 'consultoría', 'consulting'],
    category: 'services',
    response: {
      es: `¡Excelente pregunta! Ofrezco consultoría tecnológica integral con estos servicios principales:

🎯 **Consultoría Estratégica** - Roadmaps tecnológicos y arquitectura de soluciones
💻 **Desarrollo Full-Stack** - Aplicaciones web y móviles escalables  
⚡ **Automatización** - Workflows inteligentes con BuildShip y herramientas no-code
👨‍🏫 **Mentoría Técnica** - Acompañamiento para equipos y emprendedores

¿Te interesa algún servicio en particular?`,
      en: `Great question! I offer comprehensive technology consulting with these main services:

🎯 **Strategic Consulting** - Technology roadmaps and solution architecture
💻 **Full-Stack Development** - Scalable web and mobile applications
⚡ **Automation** - Smart workflows with BuildShip and no-code tools  
👨‍🏫 **Technical Mentoring** - Support for teams and entrepreneurs

Are you interested in any particular service?`
    }
  },

  // Sobre HeyMou
  {
    keywords: ['quién eres', 'who are you', 'sobre ti', 'about you', 'heymou', 'moisés', 'mou'],
    category: 'about',
    response: {
      es: `¡Hola! Soy Moisés, pero todos me conocen como **Mou**. Soy tu aliado tecnológico con más de 15 años transformando ideas ambiciosas en realidades digitales.

🚀 **Mi misión**: Ser el puente entre emprendedores visionarios y la tecnología que necesitan para triunfar.

💡 **Mi enfoque**: No trabajo con plantillas. Cada proyecto es único y merece una estrategia personalizada que refleje la esencia de tu marca.

🤝 **Mi compromiso**: Voy más allá de la entrega del proyecto. Soy tu aliado a largo plazo.

¿Tienes algún proyecto en mente?`,
      en: `Hello! I'm Moisés, but everyone knows me as **Mou**. I'm your technology ally with over 15 years transforming ambitious ideas into digital realities.

🚀 **My mission**: To be the bridge between visionary entrepreneurs and the technology they need to succeed.

💡 **My approach**: I don't work with templates. Each project is unique and deserves a personalized strategy that reflects your brand's essence.

🤝 **My commitment**: I go beyond project delivery. I'm your long-term ally.

Do you have any project in mind?`
    }
  },

  // Proceso de trabajo
  {
    keywords: ['proceso', 'process', 'cómo trabajas', 'how do you work', 'metodología', 'methodology'],
    category: 'process',
    response: {
      es: `Mi proceso está diseñado para maximizar el éxito de tu proyecto:

**1. 🎯 Descubrimiento**
- Entendemos tu visión y objetivos
- Analizamos tu mercado y audiencia
- Definimos el alcance del proyecto

**2. 🏗️ Estrategia & Diseño**
- Creamos el roadmap tecnológico
- Diseñamos la arquitectura de la solución
- Planificamos las fases de desarrollo

**3. ⚡ Desarrollo & Testing**
- Desarrollo iterativo con feedback constante
- Testing riguroso en cada fase
- Optimización de performance

**4. 🚀 Lanzamiento & Soporte**
- Deploy profesional
- Capacitación del equipo
- Soporte continuo post-lanzamiento

¿Te gustaría agendar una consulta para hablar de tu proyecto?`,
      en: `My process is designed to maximize your project's success:

**1. 🎯 Discovery**
- Understand your vision and objectives
- Analyze your market and audience
- Define project scope

**2. 🏗️ Strategy & Design**
- Create technology roadmap
- Design solution architecture
- Plan development phases

**3. ⚡ Development & Testing**
- Iterative development with constant feedback
- Rigorous testing at each phase
- Performance optimization

**4. 🚀 Launch & Support**
- Professional deployment
- Team training
- Continuous post-launch support

Would you like to schedule a consultation to discuss your project?`
    }
  },

  // Tecnologías
  {
    keywords: ['tecnologías', 'technologies', 'stack', 'herramientas', 'tools', 'nextjs', 'react', 'buildship'],
    category: 'technology',
    response: {
      es: `Trabajo con las mejores tecnologías del mercado para garantizar soluciones robustas y escalables:

**Frontend:**
- Next.js 14+ con App Router
- React 18+ con TypeScript
- Tailwind CSS para diseños modernos
- Framer Motion para animaciones

**Backend & Servicios:**
- Next.js API Routes
- BuildShip para workflows complejos
- Supabase para bases de datos
- Vercel para deployment

**Automatización:**
- BuildShip (workflows visuales)
- Zapier para integraciones
- APIs personalizadas

**¿Hay alguna tecnología específica que te interese para tu proyecto?**`,
      en: `I work with the best market technologies to guarantee robust and scalable solutions:

**Frontend:**
- Next.js 14+ with App Router
- React 18+ with TypeScript
- Tailwind CSS for modern designs
- Framer Motion for animations

**Backend & Services:**
- Next.js API Routes
- BuildShip for complex workflows
- Supabase for databases
- Vercel for deployment

**Automation:**
- BuildShip (visual workflows)
- Zapier for integrations
- Custom APIs

**Is there any specific technology you're interested in for your project?**`
    }
  },

  // Precios y presupuestos
  {
    keywords: ['precio', 'price', 'costo', 'cost', 'presupuesto', 'budget', 'cuánto cuesta', 'how much'],
    category: 'pricing',
    response: {
      es: `Los precios varían según la complejidad y alcance de cada proyecto. Trabajo con diferentes modalidades:

**💼 Consultoría Estratégica**
- Sesiones de 1-2 horas para roadmaps y arquitectura
- Ideal para validar ideas y definir estrategias

**🚀 Proyectos Completos**
- Desarrollo full-stack personalizado
- Desde MVPs hasta plataformas complejas
- Incluye diseño, desarrollo y deployment

**⚡ Automatización**
- Workflows con BuildShip/Zapier
- Integraciones entre sistemas
- Optimización de procesos

**👨‍🏫 Mentoría Técnica**
- Acompañamiento para equipos
- Revisión de código y arquitectura

Para darte un presupuesto preciso, necesito conocer más detalles de tu proyecto. ¿Te gustaría agendar una consulta gratuita de 30 minutos?`,
      en: `Prices vary according to the complexity and scope of each project. I work with different modalities:

**💼 Strategic Consulting**
- 1-2 hour sessions for roadmaps and architecture
- Ideal for validating ideas and defining strategies

**🚀 Complete Projects**
- Custom full-stack development
- From MVPs to complex platforms
- Includes design, development and deployment

**⚡ Automation**
- Workflows with BuildShip/Zapier
- System integrations
- Process optimization

**👨‍🏫 Technical Mentoring**
- Team support
- Code and architecture review

To give you an accurate quote, I need to know more details about your project. Would you like to schedule a free 30-minute consultation?`
    }
  },

  // Contacto
  {
    keywords: ['contacto', 'contact', 'agendar', 'schedule', 'reunión', 'meeting', 'consulta', 'consultation'],
    category: 'contact',
    response: {
      es: `¡Perfecto! Hay varias formas de conectar conmigo:

**📅 Consultoría Gratuita:**
[Cal.com - 30 min gratuitos](https://cal.com/heymou/consultoria-gratis)

**📧 Email directo:**
soymoisesvera@gmail.com

**💼 LinkedIn:**
[linkedin.com/in/heymou](https://linkedin.com/in/heymou)

**🌐 Sitio web:**
[heymou.com](https://heymou.com)

**¿Prefieres que te contacte por algún medio específico?** También puedes contarme brevemente sobre tu proyecto aquí y te daré algunas recomendaciones iniciales.`,
      en: `Perfect! There are several ways to connect with me:

**📅 Free Consultation:**
[Cal.com - 30 free minutes](https://cal.com/heymou/consultoria-gratis)

**📧 Direct email:**
soymoisesvera@gmail.com

**💼 LinkedIn:**
[linkedin.com/in/heymou](https://linkedin.com/in/heymou)

**🌐 Website:**
[heymou.com](https://heymou.com)

**Would you prefer me to contact you through any specific medium?** You can also briefly tell me about your project here and I'll give you some initial recommendations.`
    }
  },

  // Casos de éxito
  {
    keywords: ['casos', 'cases', 'éxito', 'success', 'ejemplos', 'examples', 'portfolio', 'proyectos', 'projects'],
    category: 'general',
    response: {
      es: `He tenido el privilegio de trabajar con emprendedores increíbles en diversos sectores:

**🏥 HealthTech**
- Plataforma de telemedicina con 10,000+ usuarios
- Reducción del 40% en tiempos de consulta

**🛒 E-commerce**
- Marketplace B2B con automatización completa
- Aumento del 300% en conversiones

**📚 EdTech**
- Plataforma educativa con IA personalizada
- 95% de satisfacción de usuarios

**🏢 SaaS B2B**
- Sistema de gestión empresarial
- ROI del 250% en el primer año

**💡 Startups**
- Múltiples MVPs que consiguieron funding
- Desde idea hasta producto escalable

¿Tu proyecto se parece a alguno de estos? Me encantaría conocer más detalles.`,
      en: `I've had the privilege of working with incredible entrepreneurs across various sectors:

**🏥 HealthTech**
- Telemedicine platform with 10,000+ users
- 40% reduction in consultation times

**🛒 E-commerce**
- B2B marketplace with complete automation
- 300% increase in conversions

**📚 EdTech**
- Educational platform with personalized AI
- 95% user satisfaction

**🏢 B2B SaaS**
- Business management system
- 250% ROI in the first year

**💡 Startups**
- Multiple MVPs that secured funding
- From idea to scalable product

Does your project resemble any of these? I'd love to know more details.`
    }
  },

  // Respuestas generales
  {
    keywords: ['hola', 'hello', 'hi', 'hey', 'buenos días', 'good morning', 'buenas tardes', 'good afternoon'],
    category: 'general',
    response: {
      es: `¡Hola! 👋 Soy el asistente de HeyMou, tu aliado tecnológico.

Estoy aquí para ayudarte con cualquier duda sobre:
• Servicios de consultoría tecnológica
• Desarrollo de proyectos
• Automatización de procesos
• Mentoría técnica
• Precios y presupuestos

**¿En qué puedo ayudarte hoy?** Puedes preguntarme lo que necesites o contarme sobre tu proyecto.`,
      en: `Hello! 👋 I'm HeyMou's assistant, your technology ally.

I'm here to help you with any questions about:
• Technology consulting services
• Project development
• Process automation
• Technical mentoring
• Pricing and budgets

**How can I help you today?** You can ask me anything you need or tell me about your project.`
    }
  },

  // Respuesta por defecto
  {
    keywords: ['default'],
    category: 'general',
    response: {
      es: `Interesante pregunta. Aunque no tengo información específica sobre eso, puedo ayudarte con:

🎯 **Consultoría tecnológica** - Estrategias y roadmaps
💻 **Desarrollo de proyectos** - Web, móvil, automatización
👨‍🏫 **Mentoría técnica** - Acompañamiento especializado
📞 **Contacto directo** - Para consultas específicas

¿Te gustaría que te conecte directamente con Mou para una consulta personalizada? Puedes agendar 30 minutos gratuitos en [cal.com/heymou/consultoria-gratis](https://cal.com/heymou/consultoria-gratis)

**¿Hay algo específico sobre tecnología o tu proyecto en lo que pueda ayudarte?**`,
      en: `Interesting question. Although I don't have specific information about that, I can help you with:

🎯 **Technology consulting** - Strategies and roadmaps
💻 **Project development** - Web, mobile, automation
👨‍🏫 **Technical mentoring** - Specialized support
📞 **Direct contact** - For specific consultations

Would you like me to connect you directly with Mou for a personalized consultation? You can schedule 30 free minutes at [cal.com/heymou/consultoria-gratis](https://cal.com/heymou/consultoria-gratis)

**Is there something specific about technology or your project I can help you with?**`
    }
  }
];

// Función para encontrar la mejor respuesta
export function findBestResponse(message: string, locale: 'es' | 'en' = 'es'): string {
  const normalizedMessage = message.toLowerCase().trim();
  
  // Buscar coincidencias exactas primero
  for (const item of knowledgeBase) {
    for (const keyword of item.keywords) {
      if (normalizedMessage.includes(keyword.toLowerCase())) {
        return item.response[locale];
      }
    }
  }
  
  // Si no encuentra coincidencias, usar respuesta por defecto
  const defaultResponse = knowledgeBase.find(item => item.keywords.includes('default'));
  return defaultResponse?.response[locale] || 'Lo siento, no pude entender tu pregunta. ¿Podrías reformularla?';
}

// Función para obtener sugerencias de preguntas
export function getSuggestedQuestions(locale: 'es' | 'en' = 'es'): string[] {
  if (locale === 'es') {
    return [
      '¿Qué servicios ofreces?',
      '¿Cuál es tu proceso de trabajo?',
      '¿Qué tecnologías usas?',
      '¿Cuánto cuesta un proyecto?',
      '¿Puedes mostrarme casos de éxito?',
      '¿Cómo puedo contactarte?'
    ];
  } else {
    return [
      'What services do you offer?',
      'What is your work process?',
      'What technologies do you use?',
      'How much does a project cost?',
      'Can you show me success cases?',
      'How can I contact you?'
    ];
  }
}