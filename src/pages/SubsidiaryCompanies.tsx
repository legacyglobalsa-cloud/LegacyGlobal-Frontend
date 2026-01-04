import { useState, useRef } from "react";
import { ArrowRight } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import AnimatedBackground from "@/components/effects/AnimatedBackground";

// Data
const subsidiaryData = [
  {
    name: "LegaBuild",
    logoIndex: 16,
    desc: "Specializing in construction and infrastructure development.",
  },
  {
    name: "LegaCreativ",
    logoIndex: 17,
    desc: "Digital marketing and creative brand solutions agency.",
  },
  {
    name: "LegaDeal",
    logoIndex: 18,
    desc: "Facilitating major business transactions and brokering.",
  },
  {
    name: "LegaFab",
    logoIndex: 19,
    desc: "Manufacturing and fabrication of industrial components.",
  },
  {
    name: "LegaFit",
    logoIndex: 20,
    desc: "Health, fitness, and wellness management services.",
  },
  {
    name: "LegaForce",
    logoIndex: 21,
    desc: "Security, surveillance, and manpower solutions.",
  },
  {
    name: "LegaHub",
    logoIndex: 22,
    desc: "Co-working spaces and business incubation services.",
  },
  {
    name: "LegaLand",
    logoIndex: 23,
    desc: "Real estate development, sales, and property management.",
  },
  {
    name: "LegaLink",
    logoIndex: 24,
    desc: "Professional networking and B2B connection platform.",
  },
  {
    name: "LegaServ",
    logoIndex: 25,
    desc: "Comprehensive corporate support and service solutions.",
  },
  {
    name: "LegaShop",
    logoIndex: 26,
    desc: "E-commerce and retail distribution platform.",
  },
  {
    name: "LegaTech",
    logoIndex: 27,
    desc: "Advanced software development and IT solutions.",
  },
  {
    name: "LegaVentures",
    logoIndex: 31,
    desc: "Investment and corporate development capital.",
  },
  {
    name: "LegaWorkx",
    logoIndex: 29,
    desc: "Talent acquisition and specialized workforce services.",
  },
  {
    name: "LegaXpress",
    logoIndex: 30,
    desc: "Global logistics, freight, and supply chain management.",
  },
];

export default function SubsidiaryCompanies() {
  const [selectedCompany, setSelectedCompany] = useState<
    (typeof subsidiaryData)[0] | null
  >(null);
  const containerRef = useRef(null);

  useGSAP(
    () => {
      // Reveal animations
      gsap.fromTo(
        ".subsidiary-card",
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power3.out" }
      );

      gsap.fromTo(
        ".section-header",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
      );
    },
    { scope: containerRef }
  );

  return (
    <div
      className="min-h-screen bg-black text-white selection:bg-primary/30 relative"
      ref={containerRef}
    >
      {/* Premium Interactive Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <AnimatedBackground
          particleCount={500}
          particleColors={["#FFD700", "#FFB52E", "#F59E0B", "#FCD34D"]}
          particleSpread={15}
          speed={0.15}
          moveParticlesOnHover={true}
          particleHoverFactor={1.5}
          alphaParticles={true}
          particleBaseSize={150}
          sizeRandomness={1.5}
          cameraDistance={25}
          disableRotation={false}
          className="opacity-60"
        />
      </div>

      <main className="relative z-10 pt-32 pb-20 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16 section-header">
          <span className="text-primary font-medium tracking-wider uppercase text-sm">
            Our Portfolio
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mt-4 mb-6">
            Subsidiary{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-500 to-yellow-300">
              Companies
            </span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Explore our diverse ecosystem of specialized companies driving
            innovation across industries.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 bg-black">
          {subsidiaryData.map((company) => (
            <div
              key={company.name}
              onClick={() => setSelectedCompany(company)}
              className="subsidiary-card group relative bg-white/5 border border-white/10 hover:border-primary/50 rounded-2xl p-6 cursor-pointer transition-all duration-300 overflow-hidden backdrop-blur-sm"
            >
              <div className="absolute inset-0 transition-opacity duration-300" />

              <div className="relative z-10 flex flex-col h-full">
                <div className="h-24 mb-6 flex items-center justify-center p-2">
                  <img
                    src={`/SubsidiaryCompanies/LG%20GROUP%20OF%20COMPANIES-${company.logoIndex}.png`}
                    alt={company.name}
                    className="h-full w-auto object-contain filter grayscale group-hover:grayscale-0 transition-all duration-500 transform group-hover:scale-110"
                  />
                </div>
                <div className="">
                  <p className="text-sm text-gray-400 mb-6 flex-grow text-center">
                    {company.desc}
                  </p>

                  <div className="flex items-center text-sm font-medium text-white/70 group-hover:text-primary transition-colors mt-auto">
                    Learn more{" "}
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Dialog
        open={!!selectedCompany}
        onOpenChange={(open) => !open && setSelectedCompany(null)}
      >
        <DialogContent className="glass-dark border-white/10 text-white max-w-2xl bg-[#0a0a0a]/95 backdrop-blur-xl">
          {selectedCompany && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-primary flex items-center gap-3">
                  {selectedCompany.name}
                </DialogTitle>
              </DialogHeader>
              <div className="mt-4">
                <div className="h-40 mb-6 flex items-center justify-center bg-white/5 rounded-xl p-6">
                  <img
                    src={`/SubsidiaryCompanies/LG%20GROUP%20OF%20COMPANIES-${selectedCompany.logoIndex}.png`}
                    alt={selectedCompany.name}
                    className="h-full w-auto object-contain"
                  />
                </div>
                <p className="text-gray-300 text-lg leading-relaxed">
                  {selectedCompany.desc}
                </p>
                <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
                  <p className="text-sm text-gray-400">
                    Interested in {selectedCompany.name} services?{" "}
                    <a href="/contact" className="text-primary hover:underline">
                      Contact us
                    </a>{" "}
                    to learn more about how we can help you.
                  </p>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
