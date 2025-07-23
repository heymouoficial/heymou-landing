import { SiteHeader } from '../../../components/layout/SiteHeader';
import HeroSection from '../../../components/sections/HeroSection';
import ServicesSection from '../../../components/sections/ServicesSection';

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main>
        <HeroSection />
        <ServicesSection />
      </main>
    </div>
  );
}