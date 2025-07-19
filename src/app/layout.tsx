import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const cabinetGrotesk = localFont({
  src: [
    {
      path: "../../public/fonts/cabinet-grotesk/CabinetGrotesk-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/cabinet-grotesk/CabinetGrotesk-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/cabinet-grotesk/CabinetGrotesk-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-cabinet-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  title: "HeyMou - Claridad en la Complejidad Digital",
  description: "Consultor estratégico, visionario y tecnológico. Transformo ideas audaces en ecosistemas digitales funcionales, humanos y minimalistas.",
  keywords: ["consultoría", "estrategia digital", "arquitectura", "minimalismo", "tecnología"],
  authors: [{ name: "HeyMou" }],
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <body className={`${cabinetGrotesk.variable} font-sans antialiased bg-background text-foreground`}>
        {children}
      </body>
    </html>
  );
}
