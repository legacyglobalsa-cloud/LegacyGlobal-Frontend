import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';
import CosmicBackground from '@/components/effects/CosmicBackground';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Cosmic Background */}
      <CosmicBackground />
      
      {/* Dark Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/40 z-0 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 border border-primary rounded-full px-4 py-2 mb-6 mt-24 md:mt-0 animate-fade-in-up">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-white">Supporting Vision 2030</span>
        </div>

        {/* Main Headline */}
        <h1 className="font-display font-bold text-3xl sm:text-5xl md:text-6xl lg:text-7xl leading-tight mb-4 md:mb-6 animate-fade-in-up animation-delay-200">
          <span className="text-white">Bridging Nations</span>
          <br />
          <span className="text-gradient-gold">Building Gateways</span>
        </h1>

        {/* Subheadline */}
        <div className="text-base md:text-xl max-w-3xl mx-auto mb-8 md:mb-10 animate-fade-in-up animation-delay-400">
          <span className="text-white font-semibold">"We deliver business opportunities to your doorstep!"</span>
          <br />
          <div className="text-gray-200 mt-2 text-sm md:text-base">Legacy Global is a premier B2B gateway-builder and Project Consultancy firm specializing in bridging the gap between businesses with integrity and excellence.</div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up animation-delay-600">
          <Button variant="hero" className="group h-12 px-8 text-base md:h-14 md:px-10 md:text-lg">
            Explore Solutions
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Button>
          <Button variant="glass" className="text-white h-12 px-8 text-base md:h-14 md:px-10 md:text-lg">
            Learn More
          </Button>
        </div>

        {/* Stats */}
        <div className="hidden md:grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10 mt-20 animate-fade-in-up animation-delay-800">
          {[
            { value: '50+', label: 'Global Partners' },
            { value: '200+', label: 'Projects Delivered' },
            { value: '98%', label: 'Client Satisfaction' },
            { value: '24/7', label: 'Support Available' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-display font-bold text-3xl md:text-4xl text-gradient-gold mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-gray-200">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
