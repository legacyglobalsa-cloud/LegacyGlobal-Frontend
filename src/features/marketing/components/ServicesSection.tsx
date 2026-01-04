import { Button } from '@/components/ui/button';
import { 
  Brain, 
  Code2, 
  Cloud, 
  LineChart, 
  Shield, 
  Workflow,
  ArrowRight 
} from 'lucide-react';

const ServicesSection = () => {
  const services = [
    {
      icon: Brain,
      title: 'AI & Machine Learning',
      description: 'Custom AI solutions, predictive analytics, and intelligent automation to transform your business operations.',
      features: ['Natural Language Processing', 'Computer Vision', 'Predictive Models'],
      bgClass: 'bg-[#0f0f0f]', // Deep Onyx
    },
    {
      icon: Code2,
      title: 'Software Development',
      description: 'End-to-end software engineering from concept to deployment, built with modern architectures.',
      features: ['Web Applications', 'Mobile Solutions', 'API Development'],
      bgClass: 'bg-[#141414]', // Dark Gray
    },
    {
      icon: Cloud,
      title: 'Cloud Infrastructure',
      description: 'Scalable, secure cloud solutions designed for performance and cost optimization.',
      features: ['Cloud Migration', 'DevOps', 'Multi-Cloud Strategy'],
      bgClass: 'bg-[#0B1120]', // Dark Slate/Navy
    },
    {
      icon: LineChart,
      title: 'Data Analytics',
      description: 'Transform raw data into actionable insights with advanced analytics and visualization.',
      features: ['Business Intelligence', 'Real-time Dashboards', 'Data Warehousing'],
      bgClass: 'bg-[#1c1917]', // Dark Warm Stone
    },
    {
      icon: Shield,
      title: 'Cybersecurity',
      description: 'Comprehensive security solutions to protect your digital assets and ensure compliance.',
      features: ['Threat Detection', 'Compliance', 'Security Audits'],
      bgClass: 'bg-[#161616]', // Neutral Dark
    },
    {
      icon: Workflow,
      title: 'Process Automation',
      description: 'Streamline workflows and eliminate repetitive tasks with intelligent automation.',
      features: ['RPA Solutions', 'Workflow Optimization', 'Integration Services'],
      bgClass: 'bg-[#0f1110]', // Deep Forest/Black hint
    },
  ];

  return (
    <section id="services" className="py-24 md:py-32 bg-secondary/30 relative">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block text-primary font-semibold text-sm uppercase tracking-wider mb-4">
            Our Services
          </span>
          <h2 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl mb-6">
            <span className="text-foreground">Comprehensive Solutions for</span>{' '}
            <span className="text-gradient-gold">Modern Enterprises</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            From AI-powered automation to enterprise security, we deliver end-to-end 
            technology solutions tailored to your business needs.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <div
              key={service.title}
              className={`group ${service.bgClass} p-8 rounded-[2rem] hover:-translate-y-2 transition-all duration-500 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] flex flex-col`}
            >
              {/* Icon */}
              <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center mb-8 group-hover:bg-white/10 transition-all duration-500 group-hover:scale-105 shrink-0 shadow-inner">
                <service.icon className="w-8 h-8 text-yellow-500" />
              </div>

              {/* Content */}
              <h3 className="font-display font-bold text-2xl text-white mb-4 group-hover:text-yellow-400 transition-colors">
                {service.title}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-8 font-light border-b border-white/5 pb-8">
                {service.description}
              </p>

              {/* Features */}
              <ul className="space-y-3 mb-8 flex-grow">
                {service.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm text-gray-500 group-hover:text-gray-300 transition-colors">
                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-500/50 mt-1.5 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              {/* Link */}
              <a
                href="#"
                className="inline-flex items-center gap-2 text-white/50 text-sm font-semibold group-hover:text-yellow-500 transition-all duration-300 mt-auto uppercase tracking-wider group-hover:gap-3"
              >
                Learn More
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <Button variant="hero" size="lg">
            View All Services
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
