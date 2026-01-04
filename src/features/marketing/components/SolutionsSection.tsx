import { Building2, Rocket, Briefcase, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SolutionsSection = () => {
  const solutions = [
    {
      icon: Building2,
      title: 'Enterprise Solutions',
      description: 'Scalable technology infrastructure and digital transformation strategies for large organizations seeking operational excellence.',
      color: 'from-primary to-gold-light',
    },
    {
      icon: Rocket,
      title: 'Startup Acceleration',
      description: 'Fast-track your startup with MVP development, go-to-market strategies, and investor-ready technology foundations.',
      color: 'from-gold-dark to-primary',
    },
    {
      icon: Briefcase,
      title: 'SMB Optimization',
      description: 'Cost-effective solutions designed for small and medium businesses to compete with enterprise-level capabilities.',
      color: 'from-primary to-champagne',
    },
    {
      icon: GraduationCap,
      title: 'Training & Advisory',
      description: 'Expert consulting, workshops, and knowledge transfer to build internal capabilities and drive innovation.',
      color: 'from-gold-light to-primary',
    },
  ];

  return (
    <section id="solutions" className="py-24 md:py-32 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block text-primary font-semibold text-sm uppercase tracking-wider mb-4">
            Tailored Solutions
          </span>
          <h2 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl mb-6">
            <span className="text-foreground">Solutions Designed for</span>{' '}
            <span className="text-gradient-gold">Every Stage</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Whether you're a startup finding your footing or an enterprise scaling globally, 
            we have the expertise to accelerate your journey.
          </p>
        </div>

        {/* Solutions Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {solutions.map((solution, index) => (
            <div
              key={solution.title}
              className="group relative bg-card border border-border rounded-3xl p-8 md:p-10 overflow-hidden transition-all duration-500 hover:border-primary/40"
            >
              {/* Gradient background on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${solution.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
              
              {/* Icon */}
              <div className="relative z-10 w-16 h-16 rounded-2xl bg-gradient-gold flex items-center justify-center mb-6 shadow-glow-subtle group-hover:shadow-glow transition-all duration-500 group-hover:scale-110">
                <solution.icon className="w-8 h-8 text-primary-foreground" />
              </div>

              {/* Content */}
              <h3 className="relative z-10 font-display font-bold text-2xl text-foreground mb-4">
                {solution.title}
              </h3>
              <p className="relative z-10 text-muted-foreground text-base leading-relaxed mb-6">
                {solution.description}
              </p>

              {/* Button */}
              <Button variant="outline" className="relative z-10 group-hover:bg-primary/10">
                Explore Solution
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SolutionsSection;
