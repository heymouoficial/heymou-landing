"use client"

import {
  SiGoogle,
  SiFigma,
  SiVercel,
  SiFramer,
  SiSlack,
  SiTelegram,
  SiWhatsapp,
  SiNotion,
  SiGithub,
  SiVsco,
  SiNextdotjs,
  SiTailwindcss,
  SiPython,
} from "react-icons/si";

const icons = [
  { name: "Google", component: SiGoogle },
  { name: "Figma", component: SiFigma },
  { name: "Vercel", component: SiVercel },
  { name: "Framer", component: SiFramer },
  { name: "Slack", component: SiSlack },
  { name: "Telegram", component: SiTelegram },
  { name: "Whatsapp", component: SiWhatsapp },
  { name: "Notion", component: SiNotion },
  { name: "Github", component: SiGithub },
  { name: "VS Code", component: SiVsco },
  { name: "Next.js", component: SiNextdotjs },
  { name: "Tailwind CSS", component: SiTailwindcss },
  { name: "Python", component: SiPython },
];

export function LogoCarousel() {
  return (
    <div className="w-full py-12">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-base font-medium text-center text-muted-foreground mb-8">
          Tecnologías y herramientas que domino
        </h2>
        <div className="flex justify-center items-center gap-x-12 gap-y-8 flex-wrap">
          {icons.map((Icon, index) => (
            <div key={index} className="opacity-60 hover:opacity-100 transition-opacity duration-300" title={Icon.name}>
              <Icon.component className="w-7 h-7 text-foreground" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
