import { Briefcase, Users, BarChart3, Handshake, Building2, CheckCircle2, Shield, ArrowRight, Search, FileCheck, CreditCard, Headphones, ClipboardCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import AnimatedBackground from "@/components/effects/AnimatedBackground";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Define the services data based on the corporate profile
const services = [
  {
    icon: Briefcase,
    title: "Buyer/Client Representation",
    desc: "Sourcing and pre-qualifying providers to secure the best opportunities aligned with strategic goals.",
    image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=1000&auto=format&fit=crop",
    color: "bg-red-500/10 border-red-500/30",
  },
  {
    icon: Users,
    title: "Seller/Service Provider Representation",
    desc: "Generating leads and providing sales support to help providers reach qualified buyers efficiently.",
    image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=1000&auto=format&fit=crop",
    color: "bg-green-500/10 border-green-500/30",
  },
  {
    icon: BarChart3,
    title: "Consultancy on Market Analysis",
    desc: "Providing industry insights and data-driven decisions to position your business competitively.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop",
    color: "bg-blue-500/10 border-blue-500/30",
  },
  {
    icon: Handshake,
    title: "Transaction Support",
    desc: "Streamlining logistics, negotiations, and secured payment handling from inquiry to closing.",
    image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=1000&auto=format&fit=crop",
    color: "bg-yellow-500/10 border-yellow-500/30",
  },
  {
    icon: Building2,
    title: "Business Planning & Expansion",
    desc: "Tailored growth strategies and regulatory guidance for market entry and long-term scalability.",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1000&auto=format&fit=crop",
    color: "bg-purple-500/10 border-purple-500/30",
  },
  {
    icon: Shield,
    title: "Verified Due Diligence",
    desc: "A rigorous process to verify all parties, ensuring secure, trustworthy transactions and minimizing risk.",
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=1000&auto=format&fit=crop",
    color: "bg-cyan-500/10 border-cyan-500/30",
  },
];

const steps = [
  { step: "1", title: "Initial Inquiry", desc: "Starting the conversation", image: "/ClientWorkFlowIcons/Intial_Inquiry.png", icon: Search },
  { step: "2", title: "Verification", desc: "Rigorous due diligence process", image: "/ClientWorkFlowIcons/Verification.png", icon: ClipboardCheck },
  { step: "3", title: "Documentation", desc: "Ensuring all paperwork is ready", image: "/ClientWorkFlowIcons/Documentation.png", icon: FileCheck },
  { step: "4", title: "Matching & Sourcing", desc: "Finding the right partners", image: "/ClientWorkFlowIcons/Matching.png", icon: Users },
  { step: "5", title: "Negotiation", desc: "Agreement and terms setup", image: "/ClientWorkFlowIcons/Negotiation.png", icon: Handshake },
  { step: "6", title: "Payment", desc: "Fulfillment and delivery", image: "/ClientWorkFlowIcons/Payment.png", icon: CreditCard },
  { step: "7", title: "QA & Compliance", desc: "Securing quality standards", image: "/ClientWorkFlowIcons/QA.png", icon: CheckCircle2 },
  { step: "8", title: "After-Sales Support", desc: "Ongoing partnership support", image: "/ClientWorkFlowIcons/ChatSupport.png", icon: Headphones },
];

export default function Services() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Reveal header content
    gsap.from(".header-content > *", {
      opacity: 0,
      y: 30,
      stagger: 0.2,
      duration: 1,
      ease: "power3.out"
    });

    // Services cards - animate per item for better precision
    const cards = gsap.utils.toArray(".service-card");
    cards.forEach((card: any) => {
      gsap.from(card, {
        opacity: 0,
        y: 60,
        scale: 0.9,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: card,
          start: "top 85%",
          toggleActions: "play none none none",
          once: true
        }
      });
    });

    // 3-Row Marquee Animations
    gsap.to(".marquee-row-left", {
      xPercent: -50,
      repeat: -1,
      duration: 25,
      ease: "none",
    });

    gsap.fromTo(".marquee-row-right", 
      { xPercent: -50 },
      {
        xPercent: 0,
        repeat: -1,
        duration: 30,
        ease: "none",
      }
    );

    // Workflow steps - specialized entrance
    const workflowSteps = gsap.utils.toArray(".workflow-step");
    workflowSteps.forEach((step: any, i: number) => {
      gsap.from(step, {
        opacity: 0,
        y: 40,
        duration: 0.8,
        delay: i * 0.1,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: step,
          start: "top 90%",
          once: true
        }
      });
    });

    // Cleanup and refresh
    ScrollTrigger.refresh();
  }, { scope: containerRef });

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden" ref={containerRef}>
      {/* Background Ambience and Noise Overlay */}
      <div className="absolute inset-0 z-0 opacity-70 bg-[url('/noise.png')] pointer-events-none" />
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-black via-black to-[#0a0a0a] pointer-events-none" />
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[150px] opacity-20 pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-white/5 rounded-full blur-[100px] opacity-10 pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 pt-32 pb-16 md:pt-40 md:pb-20">
        


        {/* ------------------- CORE SERVICES - PREMIUM GRID ------------------- */}
        <section className="mb-32">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Our Core <span className="text-gradient-gold">Service Offerings</span>
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto uppercase tracking-[0.3em] text-xs font-semibold">Specialized B2B Strategic Solutions</p>
          </div>
          
          <div className="services-grid grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {services.map((svc, i) => {
              const IconDynamic = svc.icon;
              return (
                <div 
                  key={svc.title}
                  className="service-card group relative h-[500px] rounded-[2.5rem] overflow-hidden transition-all duration-700 hover:-translate-y-2"
                >
                  {/* Background Image with sophisticated masking */}
                  <div className="absolute inset-0 z-0">
                    <img
                      src={svc.image}
                      alt={svc.title}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-40 grayscale group-hover:grayscale-0"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
                  </div>

                  {/* Border Glow */}
                  <div className="absolute inset-0 rounded-[2.5rem] border border-white/5 group-hover:border-primary/30 transition-colors duration-500 z-10" />
                  
                  {/* Card Content */}
                  <div className="relative z-20 h-full p-8 flex flex-col justify-end">
                    <div className="mb-6 transform transition-transform duration-500 group-hover:-translate-y-2">
                      <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-black transition-all duration-500 shadow-xl shadow-primary/5">
                        <IconDynamic className="size-6 text-primary group-hover:text-inherit" />
                      </div>
                      <h3 className="text-2xl font-bold mb-3 text-white">
                        {svc.title}
                      </h3>
                      <p className="text-gray-400 leading-relaxed text-sm opacity-90 group-hover:text-gray-100 transition-colors duration-500">
                        {svc.desc}
                      </p>
                    </div>

                    <div className="pt-6 border-t border-white/5 flex items-center justify-between opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                      <Link to="/contact">
                        <Button variant="link" className="text-primary p-0 font-bold tracking-widest text-xs uppercase flex items-center gap-2 hover:gap-3 transition-all">
                          Get Started <ArrowRight className="size-4" />
                        </Button>
                      </Link>
                      <span className="text-[10px] text-white/20 font-mono tracking-widest uppercase">L-Global // 0{i + 1}</span>
                    </div>
                  </div>

                  {/* Top-Right Decorative Element */}
                  <div className="absolute top-8 right-8 z-20">
                    <div className="w-2 h-2 rounded-full bg-primary/20 group-hover:bg-primary transition-all duration-500 animate-pulse" />
                  </div>
                </div>
              )
            })}
          </div>
        </section>
        
        <hr className="border-t border-white/10 my-16 md:my-32" />

        {/* --- BUSINESS SECTORS WE SERVE (3-Row Marquee) --- */}
        <section className="sectors-section relative mb-24 overflow-hidden py-24 bg-gradient-to-br from-[#F5B51E] via-[#FFD700] to-[#D9A216] rounded-[4rem] mx-2 md:mx-6 shadow-[0_30px_60px_-15px_rgba(245,181,30,0.4)] border border-white/20">
          <div className="container mx-auto px-6 mb-16 relative z-20">
            <h2 className="text-4xl md:text-6xl font-black text-center text-black tracking-tight">
              BUSINESS <span className="opacity-70">SECTORS WE SERVE</span> 
            </h2>
            <div className="w-24 h-1 bg-black/20 mx-auto mt-6 rounded-full" />
          </div>

          <div className="marquee-wrapper relative flex flex-col gap-8 py-4 z-20">
            {[
              { 
                id: 1, 
                direction: "left",
                items: ["Oil & Gas Trading", "Commodities Trading", "Manpower Supply", "Real Estate Industry", "Construction Projects"] 
              },
              { 
                id: 2, 
                direction: "right",
                items: ["Technology & Innovation", "Logistics & Warehousing", "Facility Management", "Business Acquisition", "Manufacturing"] 
              },
              { 
                id: 3, 
                direction: "left",
                items: ["Energy Solutions", "Supply Chain Mgmt", "Global Partnerships", "Import & Export", "Investment Advisory"] 
              }
            ].map((row) => (
              <div 
                key={row.id} 
                className="marquee-container relative flex overflow-hidden py-2"
                onMouseEnter={(e) => {
                  const inner = e.currentTarget.querySelector(".marquee-inner");
                  if (inner) {
                    gsap.getTweensOf(inner).forEach(t => gsap.to(t, { timeScale: 0, duration: 0.5, ease: "power2.out" }));
                  }
                }}
                onMouseLeave={(e) => {
                  const inner = e.currentTarget.querySelector(".marquee-inner");
                  if (inner) {
                    gsap.getTweensOf(inner).forEach(t => gsap.to(t, { timeScale: 1, duration: 0.5, ease: "power2.in" }));
                  }
                }}
              >
                <div className={`marquee-inner flex whitespace-nowrap marquee-row-${row.direction}`}>
                  {/* First Track */}
                  <div className="marquee-content flex gap-8 px-4">
                    {row.items.concat(row.items).map((item, idx) => (
                      <div 
                          key={`${row.id}-${idx}`}
                          className="inline-flex items-center gap-5 px-12 py-7 bg-black border border-white/10 rounded-3xl hover:border-white/30 hover:bg-[#111] transition-all duration-300 shadow-2xl group"
                      >
                        <div className="size-12 rounded-full bg-[#F5B51E]/10 flex items-center justify-center border border-[#F5B51E]/30 group-hover:bg-[#F5B51E] group-hover:text-black transition-all">
                          <CheckCircle2 className="size-6 text-[#F5B51E] group-hover:text-inherit transition-transform group-hover:scale-110" />
                        </div>
                        <span className="text-xl font-black tracking-tight text-white uppercase italic">{item}</span>
                      </div>
                    ))}
                  </div>
                  {/* Second Track for seamless loop */}
                  <div className="marquee-content flex gap-8 px-4" aria-hidden="true">
                    {row.items.concat(row.items).map((item, idx) => (
                      <div 
                          key={`loop-${row.id}-${idx}`}
                          className="inline-flex items-center gap-5 px-12 py-7 bg-black border border-white/10 rounded-3xl hover:border-white/30 hover:bg-[#111] transition-all duration-300 shadow-2xl group"
                      >
                        <div className="size-12 rounded-full bg-[#F5B51E]/10 flex items-center justify-center border border-[#F5B51E]/30 group-hover:bg-[#F5B51E] group-hover:text-black transition-all">
                          <CheckCircle2 className="size-6 text-[#F5B51E] group-hover:text-inherit transition-transform group-hover:scale-110" />
                        </div>
                        <span className="text-xl font-black tracking-tight text-white uppercase italic">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            {/* Fading Edge Gradients - Matched to Gold Background */}
            <div className="absolute inset-y-0 left-0 w-64 bg-gradient-to-r from-[#F5B51E] via-[#F5B51E]/60 to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-64 bg-gradient-to-l from-[#D9A216] via-[#D9A216]/60 to-transparent z-10 pointer-events-none" />
          </div>
        </section>

        {/* ------------------- CLIENT FLOW ------------------- */}
        <section className="relative py-24 md:py-32 overflow-hidden bg-[#050505]">
          {/* Animated Background Integration */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            <AnimatedBackground 
              particleCount={300}
              particleColors={["#FFD700", "#FFCC00", "#FFB52E"]}
              particleSpread={12}
              speed={0.12}
              moveParticlesOnHover={true}
              particleHoverFactor={1.2}
              alphaParticles={true}
              particleBaseSize={100}
              cameraDistance={20}
              className="opacity-40"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
          </div>

          {/* Section Header */}
          <div className="relative z-10 text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
              OUR <span className="text-gradient-gold">CLIENT FLOW</span> 🤝
            </h2>
            <div className="flex items-center justify-center gap-4">
              <div className="h-px w-8 md:w-16 bg-gradient-to-r from-transparent to-primary/50" />
              <p className="text-gray-500 uppercase tracking-[0.4em] text-[10px] md:text-xs font-bold">The Strategic Partnership Journey</p>
              <div className="h-px w-8 md:w-16 bg-gradient-to-l from-transparent to-primary/50" />
            </div>
          </div>
          
          <div className="container mx-auto px-4 relative">
            {/* Background Connection Path (Desktop) */}
            <div className="absolute top-[180px] left-[15%] right-[15%] h-[2px] bg-gradient-to-r from-transparent via-primary/20 to-transparent hidden lg:block z-0" />
            <div className="absolute top-[520px] left-[15%] right-[15%] h-[2px] bg-gradient-to-r from-transparent via-primary/20 to-transparent hidden lg:block z-0" />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16 lg:gap-y-24">
              {steps.map((s, i) => (
                <div key={s.step} className="workflow-step group relative">
                  {/* Step Connector Dots/Arrows (Desktop) */}
                  {i % 4 !== 3 && i !== steps.length - 1 && (
                    <div className="hidden lg:block absolute top-[100px] -right-4 w-8 h-[2px] z-0">
                      <div className="w-full h-full bg-primary/20" />
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary animate-pulse" />
                    </div>
                  )}

                  {/* Card Design */}
                  <div className="relative z-10 bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-8 pt-12 transition-all duration-700 hover:border-primary/40 hover:bg-white/[0.04] group-hover:-translate-y-4 hover:shadow-[0_20px_50px_-15px_rgba(245,181,30,0.15)] flex flex-col items-center text-center h-full">
                    {/* Step Number Gauge */}
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-14 h-14 rounded-2xl bg-black border border-white/10 flex items-center justify-center text-primary font-black text-2xl shadow-xl group-hover:bg-primary group-hover:text-black transition-all duration-500">
                      {s.step}
                    </div>

                    {/* Icon/Image Visual */}
                    <div className="mb-8 w-24 h-24 flex items-center justify-center relative">
                      <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                      {s.image ? (
                        <img 
                          src={s.image} 
                          alt={s.title} 
                          className="w-16 h-16 object-contain relative z-10 transition-all duration-500 group-hover:scale-110 drop-shadow-[0_0_15px_rgba(245,181,30,0.3)]" 
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-primary/50 transition-colors">
                          <s.icon className="w-8 h-8 text-primary/70 group-hover:text-primary transition-colors" />
                        </div>
                      )}
                    </div>

                    {/* Text Content */}
                    <h3 className="text-xl font-bold mb-3 text-white group-hover:text-primary transition-colors tracking-tight">
                      {s.title}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed font-medium">
                      {s.desc}
                    </p>

                    {/* Interactive Bottom Glow */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-12 h-1 bg-primary/20 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-24 text-center">
              <Link to="/about">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-10 py-7 text-lg font-bold shadow-2xl shadow-primary/20 transition-all duration-500 hover:scale-105 active:scale-95 group">
                  EXPLORE OUR DUE DILIGENCE PROCESS
                  <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
