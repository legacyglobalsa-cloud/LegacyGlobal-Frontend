import { Shield, Globe, Zap, Users } from "lucide-react";

const AboutSection = () => {
  const features = [
    {
      icon: Globe,
      title: "Global Reach",
      description:
        "Operating across multiple continents with localized expertise and global standards.",
    },
    {
      icon: Zap,
      title: "AI Innovation",
      description:
        "Leveraging cutting-edge artificial intelligence to automate and optimize business processes.",
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description:
        "Bank-grade security protocols protecting your most sensitive business data.",
    },
    {
      icon: Users,
      title: "Expert Teams",
      description:
        "World-class professionals dedicated to your success and growth.",
    },
  ];

  return (
    <section id="about" className="py-24 md:py-32 relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial-gold opacity-30 blur-3xl pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div>
            <span className="inline-block text-primary font-semibold text-sm uppercase tracking-wider mb-4">
              About Legacy Global
            </span>
            <h2 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl mb-6">
              <span className="text-foreground">Pioneering the Future of</span>{" "}
              <span className="text-gradient-gold">Digital Excellence</span>
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              Legacy Global is a premier technology and advisory firm
              specializing in IT solutions, AI-powered automation, and strategic
              business consulting. We partner with enterprises to drive digital
              transformation, optimize operations, and unlock unprecedented
              growth.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Our mission is to empower businesses with innovative technology
              solutions that deliver measurable results. From startup
              acceleration to enterprise-scale deployments, we bring expertise,
              precision, and a commitment to excellence.
            </p>
          </div>

          {/* Right Content - Feature Grid */}
          <div className="grid sm:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="group bg-[#121212] p-8 rounded-[2rem] border border-white/5 hover:border-yellow-500/30 transition-all duration-500 hover:-translate-y-1"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-14 h-14 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center mb-6 group-hover:bg-zinc-800 transition-all duration-500 group-hover:scale-110">
                  <feature.icon className="w-7 h-7 text-yellow-500" />
                </div>
                <h3 className="font-display font-bold text-lg text-white mb-3 group-hover:text-yellow-400 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed font-light">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
