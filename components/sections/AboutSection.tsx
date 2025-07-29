'use client';

import { motion, Variants } from 'framer-motion';
import { Code, Heart, Lightbulb, Users, Award, Target } from 'lucide-react';

import { useTranslation } from '../../src/hooks/useTranslation';
import { GlowCard } from '../ui/spotlight-card';
import { Component as GlassIcon } from '../ui/glass-icons';

// Animation variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
    filter: 'blur(5px)'
  },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0)',
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 20,
      delay: 0.1 + (i * 0.1)
    }
  })
};

export default function AboutSection() {
  const { locale } = useTranslation();

  const stats = [
    {
      number: '15+',
      label: locale === 'es' ? 'Años de Experiencia' : 'Years of Experience',
      icon: Award,
    },
    {
      number: '70+',
      label: locale === 'es' ? 'Proyectos Completados' : 'Completed Projects',
      icon: Target,
    },
    {
      number: '100%',
      label: locale === 'es' ? 'Clientes Satisfechos' : 'Satisfied Clients',
      icon: Heart,
    },
  ];

  const values = [
    {
      icon: Code,
      title: locale === 'es' ? 'Excelencia Técnica' : 'Technical Excellence',
      description: locale === 'es'
        ? 'Cada línea de código está pensada para crear soluciones robustas, escalables y mantenibles que perduren en el tiempo.'
        : 'Every line of code is designed to create robust, scalable and maintainable solutions that stand the test of time.',
    },
    {
      icon: Heart,
      title: locale === 'es' ? 'Pasión por el Detalle' : 'Passion for Detail',
      description: locale === 'es'
        ? 'Creo que los pequeños detalles hacen la diferencia. Cada pixel, cada interacción, cada funcionalidad importa.'
        : 'I believe that small details make the difference. Every pixel, every interaction, every functionality matters.',
    },
    {
      icon: Lightbulb,
      title: locale === 'es' ? 'Innovación Constante' : 'Constant Innovation',
      description: locale === 'es'
        ? 'Siempre explorando nuevas tecnologías y metodologías para ofrecer soluciones que marquen la diferencia.'
        : 'Always exploring new technologies and methodologies to offer solutions that make a difference.',
    },
    {
      icon: Users,
      title: locale === 'es' ? 'Colaboración Genuina' : 'Genuine Collaboration',
      description: locale === 'es'
        ? 'No soy solo un proveedor, soy tu aliado tecnológico. Trabajamos juntos para materializar tu visión.'
        : 'I\'m not just a provider, I\'m your technology ally. We work together to materialize your vision.',
    },
  ];

  return (
    <section className="py-24 scroll-mt-20">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={containerVariants}
        >
          <motion.div
            className="inline-block bg-foreground/5 text-foreground/80 text-sm font-medium px-4 py-1.5 rounded-full mb-4"
            custom={0}
            variants={itemVariants}
          >
            {locale === 'es' ? 'Sobre Mí' : 'About Me'}
          </motion.div>

          <motion.h2
            className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-foreground"
            custom={1}
            variants={itemVariants}
          >
            {locale === 'es' ? 'Tu Aliado Tecnológico de Confianza' : 'Your Trusted Technology Ally'}
          </motion.h2>

          <motion.p
            className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
            custom={2}
            variants={itemVariants}
          >
            {locale === 'es'
              ? 'Durante más de 15 años, he ayudado a emprendedores visionarios a transformar sus ideas más ambiciosas en realidades digitales que impactan y trascienden.'
              : 'For over 15 years, I have helped visionary entrepreneurs transform their most ambitious ideas into digital realities that impact and transcend.'
            }
          </motion.p>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={containerVariants}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              custom={index}
              variants={itemVariants}
            >
              <GlowCard customSize={true} className="text-center p-8 h-full">
                <div className="flex flex-col items-center justify-center h-full">
                  <GlassIcon
                    items={[{
                      icon: <stat.icon className="w-8 h-8 text-white" />,
                      color: "blue",
                    }]}
                    className="!grid-cols-1 !gap-0 !py-0 mb-4"
                  />
                  <div className="text-4xl font-bold text-primary mb-2">{stat.number}</div>
                  <div className="text-muted-foreground text-sm">{stat.label}</div>
                </div>
              </GlowCard>
            </motion.div>
          ))}
        </motion.div>

        {/* Story Section */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-24"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={containerVariants}
        >
          <motion.div custom={0} variants={itemVariants}>
            <h3 className="text-2xl font-bold mb-6">
              {locale === 'es' ? 'Mi Historia' : 'My Story'}
            </h3>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                {locale === 'es'
                  ? 'Todo comenzó con una simple curiosidad: ¿cómo la tecnología puede transformar ideas en realidades que impacten positivamente a las personas? Esta pregunta ha guiado mi carrera durante más de 15 años.'
                  : 'It all started with a simple curiosity: how can technology transform ideas into realities that positively impact people? This question has guided my career for over 15 years.'
                }
              </p>
              <p>
                {locale === 'es'
                  ? 'He tenido el privilegio de trabajar con emprendedores increíbles, desde startups que apenas comenzaban hasta empresas establecidas que buscaban reinventarse. Cada proyecto ha sido una oportunidad de aprender, crecer y perfeccionar mi enfoque.'
                  : 'I have had the privilege of working with incredible entrepreneurs, from startups just beginning to established companies looking to reinvent themselves. Each project has been an opportunity to learn, grow and perfect my approach.'
                }
              </p>
            </div>
          </motion.div>

          <motion.div custom={1} variants={itemVariants}>
            <h3 className="text-2xl font-bold mb-6">
              {locale === 'es' ? 'Mi Enfoque' : 'My Approach'}
            </h3>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                {locale === 'es'
                  ? 'Creo firmemente que la tecnología debe ser un medio, no un fin. Mi enfoque siempre parte de entender profundamente tu visión, tus objetivos y las necesidades reales de tu audiencia.'
                  : 'I firmly believe that technology should be a means, not an end. My approach always starts from deeply understanding your vision, your objectives and the real needs of your audience.'
                }
              </p>
              <p>
                {locale === 'es'
                  ? 'No trabajo con plantillas ni soluciones genéricas. Cada proyecto es único y merece una estrategia personalizada que refleje la esencia de tu marca y conecte auténticamente con tu mercado.'
                  : 'I don\'t work with templates or generic solutions. Each project is unique and deserves a personalized strategy that reflects the essence of your brand and authentically connects with your market.'
                }
              </p>
              <p>
                {locale === 'es'
                  ? 'Mi compromiso va más allá de la entrega del proyecto. Soy tu aliado a largo plazo, acompañándote en el crecimiento y evolución de tu solución digital.'
                  : 'My commitment goes beyond project delivery. I am your long-term ally, accompanying you in the growth and evolution of your digital solution.'
                }
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* Values Section */}
        <motion.div
          className="mb-0"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={containerVariants}
        >
          <motion.h3
            className="text-2xl font-bold text-center mb-12"
            custom={0}
            variants={itemVariants}
          >
            {locale === 'es' ? 'Mis Valores' : 'My Values'}
          </motion.h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                custom={index + 1}
                variants={itemVariants}
              >
                <GlowCard customSize={true} className="p-6 h-full group">
                  <div className="flex flex-col h-full">
                    <GlassIcon
                      items={[{
                        icon: <value.icon className="w-6 h-6 text-white" />,
                        color: "blue",
                      }]}
                      className="!grid-cols-1 !gap-0 !py-0 mb-4"
                    />
                    <h4 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                      {value.title}
                    </h4>
                    <p className="text-muted-foreground leading-relaxed flex-grow">
                      {value.description}
                    </p>
                  </div>
                </GlowCard>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}