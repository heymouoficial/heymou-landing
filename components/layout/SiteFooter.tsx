'use client';

import Link from 'next/link';

import { useTranslation } from '../../src/hooks/useTranslation';

export default function SiteFooter() {
    const { locale } = useTranslation();
    const currentYear = 2025; // Fixed year to avoid hydration mismatch

    // Social media links
    const socialPlatforms = [
        { name: 'Facebook', href: 'https://facebook.com/heymouoficial', iconPath: '/icons/facebook-icon.svg' },
        { name: 'Instagram', href: 'https://instagram.com/heymouoficial', iconPath: '/icons/instagram-icon.svg' },
        { name: 'TikTok', href: 'https://tiktok.com/@heymouoficial', iconPath: '/icons/tiktok-icon.svg' },
        { name: 'Twitter', href: 'https://twitter.com/heymouoficial', iconPath: '/icons/twitter-icon.svg' },
        { name: 'GitHub', href: 'https://github.com/heymouoficial', iconPath: '/icons/github-icon.svg' },
        { name: 'LinkedIn', href: 'https://linkedin.com/in/heymouoficial', iconPath: '/icons/linkedin-icon.svg' },
    ];

    return (
        <footer className="bg-black mt-16 border-t border-white/10 lg:mt-24">
            {/* Container con máximo 1200px y padding lateral */}
            <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-4">

                {/* Top Footer - Layout exacto de Figma */}
                <div className="flex flex-col gap-8 py-12 min-h-[200px] lg:flex-row lg:justify-between lg:items-start lg:py-16 lg:min-h-[150px]">

                    {/* Left Side - Brand */}
                    <div className="flex flex-col gap-6 max-w-xs lg:gap-8 lg:max-w-sm lg:flex-shrink-0">
                        {/* Logo HeyMou como texto */}
                        <Link href={`/${locale}`} className="inline-block hover:opacity-80 transition-opacity">
                            <h2 className="text-white text-2xl font-semibold lg:text-3xl">HeyMou</h2>
                        </Link>

                        {/* Description Text - Exacto como Figma */}
                        <div className="text-white text-sm leading-relaxed lg:text-base">
                            <p>Transformando sueños en realidad digital.</p>
                            <p>Tu aliado tecnológico para materializar</p>
                            <p>ideas ambiciosas.</p>
                        </div>
                    </div>

                    {/* Right Side - Social & Navigation */}
                    <div className="flex flex-col items-start gap-6 lg:flex-shrink-0 lg:gap-8 lg:items-end">

                        {/* Social Icons - Exacto como Figma */}
                        <div className="flex items-center gap-4 lg:gap-6">
                            {socialPlatforms.map((platform) => (
                                <a
                                    key={platform.name}
                                    href={platform.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:opacity-80 transition-opacity"
                                    aria-label={platform.name}
                                >
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={platform.iconPath}
                                        alt={`${platform.name} icon`}
                                        className="w-4 h-4 lg:w-5 lg:h-5"
                                        style={{
                                            filter: 'brightness(0) saturate(100%) invert(100%)'
                                        }}
                                    />
                                </a>
                            ))}
                        </div>

                        {/* Footer Menu - Horizontal como Figma */}
                        <nav className="flex flex-wrap items-center gap-4 lg:gap-8">
                            <Link
                                href={`/${locale}`}
                                className="text-white text-sm hover:text-primary transition-colors lg:text-base"
                            >
                                {locale === 'es' ? 'Inicio' : 'Home'}
                            </Link>
                            <a
                                href={`/${locale}#servicios`}
                                className="text-white text-sm hover:text-primary transition-colors lg:text-base"
                            >
                                {locale === 'es' ? 'Servicios' : 'Services'}
                            </a>
                            <a
                                href={`/${locale}#casos-exito`}
                                className="text-white text-sm hover:text-primary transition-colors lg:text-base"
                            >
                                {locale === 'es' ? 'Casos de Éxito' : 'Success Stories'}
                            </a>
                            <a
                                href={`/${locale}#blog`}
                                className="text-white text-sm hover:text-primary transition-colors lg:text-base"
                            >
                                Blog
                            </a>
                            <a
                                href={`/${locale}#contacto`}
                                className="text-white text-sm hover:text-primary transition-colors lg:text-base"
                            >
                                {locale === 'es' ? 'Contacto' : 'Contact'}
                            </a>
                        </nav>
                    </div>
                </div>

                {/* Divider Line */}
                <div className="border-t border-white/20"></div>

                {/* Bottom Section - Exacto como Figma */}
                <div className="flex flex-col gap-4 py-6 lg:flex-row lg:justify-between lg:items-center lg:py-8">

                    {/* Left - Legal Links */}
                    <div className="flex flex-col items-start gap-3 lg:flex-row lg:items-center lg:gap-6">
                        <Link
                            href={`/${locale}/privacidad`}
                            className="text-white text-sm hover:text-primary transition-colors"
                        >
                            {locale === 'es' ? 'Política de Privacidad' : 'Privacy Policy'}
                        </Link>
                        <Link
                            href={`/${locale}/terminos`}
                            className="text-white text-sm hover:text-primary transition-colors"
                        >
                            {locale === 'es' ? 'Términos de Servicio' : 'Terms of Service'}
                        </Link>
                    </div>

                    {/* Right - Copyright */}
                    <p className="text-white text-sm text-left lg:text-right">
                        © {currentYear} HeyMou. {locale === 'es' ? 'Todos los derechos reservados.' : 'All rights reserved.'}
                    </p>
                </div>
            </div>
        </footer>
    );
}