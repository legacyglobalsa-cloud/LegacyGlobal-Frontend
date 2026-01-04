import AboutSection from "@/features/marketing/components/AboutSection";
import GoldTerrainBackground from "@/components/effects/GoldTerrainBackground";
import { useRef } from "react"; 
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const containerRef = useRef<HTMLDivElement>(null);
  const leadershipRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Header animation - staggered reveal of children
      gsap.from(".header-content > *", {
        opacity: 0,
        y: 30,
        stagger: 0.2,
        duration: 1,
        ease: "power3.out",
      });

      // Leadership animation - staggered rise
      const cards = gsap.utils.toArray(".leader-card");
      if (cards.length > 0) {
        gsap.set(cards, { opacity: 0, y: 50 }); // Ensure hidden initially

        gsap.to(cards, {
          opacity: 1,
          y: 0,
          stagger: 0.2,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: leadershipRef.current,
            start: "top 90%", // Trigger earlier
            toggleActions: "play none none reverse",
          },
        });
      }

      // Ensure ScrollTrigger updates after layout
      const timer = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 100);

      return () => clearTimeout(timer);
    },
    { scope: containerRef }
  );

  return (
    <div
      className="min-h-screen bg-black text-white relative overflow-hidden z-0"
      ref={containerRef}
    >
      
      <div className="pt-24 pb-16 relative z-10">
        {/* --- HEADER SECTION --- */}
        <div className="header-content text-center my-16 md:my-24 container mx-auto px-6">
          <div className="flex flex-col items-center justify-center gap-4 mb-4">
            <h1 className="text-4xl md:text-6xl font-extrabold text-white">
              <span className="text-gradient-gold">Global</span> Gateway
              Solutions
            </h1>
            <p className="text-primary font-bold tracking-[0.2em] text-sm uppercase">
              "We deliver business opportunities to your doorstep!"
            </p>
          </div>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto leading-relaxed mt-6">
            As a premier B2B{" "}
            <span className="text-primary font-semibold">gateway-builder</span>{" "}
            and Project Consultancy firm, we bridge the gap between clients and
            providers with integrity and excellence.
          </p>

          {/* Video Section */}
          <div className="video-reveal w-full max-w-4xl mx-auto mt-12 md:mt-16 relative group">
            <div className="absolute -inset-1 bg-gradient-gold opacity-20 rounded-[2rem] blur-xl group-hover:opacity-30 transition duration-1000"></div>
            <div className="relative aspect-video rounded-[1.8rem] overflow-hidden">
              <video
                src="/Video/LegacyGlobalVid.mp4"
                className="w-full h-full object-cover"
                autoPlay
                muted
                loop
                playsInline
                controls
              />
            </div>
          </div>
        </div>
        <AboutSection />

        {/* Leadership Section */}
        <section className="relative my-24 overflow-hidden py-24 bg-gradient-to-br from-[#F5B51E] via-[#FFD700] to-[#D9A216] rounded-[4rem] mx-2 md:mx-6 shadow-[0_30px_60px_-15px_rgba(245,181,30,0.4)] border border-white/20">
          <div className="container mx-auto px-6 relative z-20">
            <h2 className="text-4xl md:text-6xl font-black text-center text-black tracking-tight mb-4 uppercase">
              Corporate <span className="opacity-70">Leadership</span>
            </h2>
            <div className="w-24 h-1 bg-black/20 mx-auto mb-16 rounded-full" />

            <div
              className="leadership-grid grid md:grid-cols-2 gap-8 max-w-4xl mx-auto"
              ref={leadershipRef}
            >
              {[
                { name: "Fahad Al-Saeed", role: "Managing Director" },
                { name: "Jeffrey de Dios", role: "Chief Executive Officer" },
              ].map((leader) => (
                <div
                  key={leader.name}
                  className="leader-card group bg-black p-10 rounded-[2.5rem] border border-white/10 text-center shadow-2xl transition-all duration-500 hover:-translate-y-2"
                >
                  <div className="w-24 h-24 bg-primary/10 rounded-full mx-auto mb-8 flex items-center justify-center border border-primary/20 group-hover:bg-primary group-hover:text-black transition-all duration-500">
                    <span className="text-3xl font-black">
                      {leader.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  </div>
                  <h3 className="text-2xl font-black text-white mb-3 tracking-tight italic uppercase">
                    {leader.name}
                  </h3>
                  <p className="text-[#F5B51E] font-bold text-sm tracking-[0.2em] uppercase">
                    {leader.role}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
