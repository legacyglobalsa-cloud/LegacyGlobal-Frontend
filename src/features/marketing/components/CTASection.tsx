import { Button } from '@/components/ui/button';
import { ArrowRight, Mail, Phone, MapPin } from 'lucide-react';

const CTASection = () => {
  return (
    <section id="contact" className="py-24 md:py-32 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/20 to-background" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial-gold opacity-20 blur-3xl" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div>
            <span className="inline-block text-primary font-semibold text-sm uppercase tracking-wider mb-4">
              Get Started Today
            </span>
            <h2 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl mb-6">
              <span className="text-foreground">Ready to Transform</span>{' '}
              <span className="text-gradient-gold">Your Business?</span>
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              Let's discuss how Legacy Global can help you achieve your digital transformation goals. 
              Our team of experts is ready to create customized solutions for your unique challenges.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <span className="text-foreground">contact@legacyglobal.com</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <span className="text-foreground">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <span className="text-foreground">Global Headquarters</span>
              </div>
            </div>
          </div>

          {/* Right Content - Contact Form */}
          <div className="gradient-border">
            <div className="bg-card rounded-3xl p-8 md:p-10">
              <h3 className="font-display font-semibold text-2xl text-foreground mb-6">
                Schedule a Consultation
              </h3>
              
              <form className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 rounded-xl bg-secondary border border-border focus:border-primary/60 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all text-foreground placeholder:text-muted-foreground"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 rounded-xl bg-secondary border border-border focus:border-primary/60 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all text-foreground placeholder:text-muted-foreground"
                      placeholder="Doe"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 rounded-xl bg-secondary border border-border focus:border-primary/60 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all text-foreground placeholder:text-muted-foreground"
                    placeholder="john@company.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Company
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-xl bg-secondary border border-border focus:border-primary/60 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all text-foreground placeholder:text-muted-foreground"
                    placeholder="Your Company"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Message
                  </label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl bg-secondary border border-border focus:border-primary/60 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all text-foreground placeholder:text-muted-foreground resize-none"
                    placeholder="Tell us about your project..."
                  />
                </div>
                
                <Button variant="hero" size="lg" className="w-full">
                  Send Message
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
