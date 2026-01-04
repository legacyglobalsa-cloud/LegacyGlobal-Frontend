import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Building2, Users, Handshake } from "lucide-react";
import GoldTerrainBackground from "@/components/effects/GoldTerrainBackground";

// Client logos data
const clientsData = [
  { name: "Al-Othman", logo: "/Clients/Al-Othman.png" },
  { name: "Alostool", logo: "/Clients/Alostool.png" },
  { name: "Boudl Hotel", logo: "/Clients/Boudl Hotel.png" },
  { name: "CrownPlaza", logo: "/Clients/CrownPlaza.png" },
  { name: "JMS Medical", logo: "/Clients/JMSMedical.png" },
  { name: "Lantern Systems", logo: "/Clients/LanternSystems.png" },
  { name: "Philippine Embassy", logo: "/Clients/PhilippineEmbassy.png" },
  { name: "PrimeWave", logo: "/Clients/PrimeWave.png" },
  { name: "Radisson", logo: "/Clients/Radisson.png" },
  { name: "SBM", logo: "/Clients/SBM.png" },
  { name: "Schreder", logo: "/Clients/Schreder.png" },
  { name: "Somerset", logo: "/Clients/Somerset.png" },
];

export default function Client() {
  const containerRef = useRef(null);

  useGSAP(
    () => {
      gsap.fromTo(
        ".reveal",
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: "power3.out" }
      );
    },
    { scope: containerRef }
  );

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden" ref={containerRef}>
      {/* Gold Terrain Background */}
      <div className="fixed inset-0 z-0">
        <GoldTerrainBackground />
      </div>
      
      {/* Content Overlay */}
      <main className="relative z-10 pt-32 pb-20">
        <div className="container mx-auto px-6 space-y-20">

          {/* Clients Grid Section */}
          <div className="mb-20">
            <div className="text-center mb-16 reveal">
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                Trusted By{" "}
                <span className="text-gradient-gold">Industry Leaders</span>
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Our portfolio includes renowned organizations across hospitality,
                healthcare, technology, and government sectors.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 reveal">
              {clientsData.map((client, index) => (
                <div
                  key={index}
                  className="group bg-[#E6E1D3] p-8 rounded-[1.5rem] border border-white/5 hover:border-yellow-500/30 transition-all duration-500 hover:-translate-y-1 flex flex-col items-center justify-center"
                >
                  <div className="w-full h-24 flex items-center justify-center mb-4 overflow-hidden">
                    <img
                      src={client.logo}
                      alt={client.name}
                      className="max-w-full max-h-full object-contain filter group-hover:opacity-100 transition-all duration-500 group-hover:scale-110"
                    />
                  </div>
                  <p className="text-sm text-gray-700 font-medium text-center">
                    {client.name}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="reveal text-center bg-gradient-to-r from-[#121212] via-[#1a1a1a] to-[#121212] p-12 md:p-20 rounded-[2rem] border border-white/5">
            <h3 className="text-2xl md:text-4xl font-bold mb-6">
              Join Our Growing{" "}
              <span className="text-gradient-gold">Client Family</span>
            </h3>
            <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
              Experience the Legacy Global difference. Let us help you achieve
              your business goals with our comprehensive solutions.
            </p>
            <a
              href="/contact"
              className="inline-flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-black font-semibold px-8 py-4 rounded-full transition-all duration-300 hover:scale-105"
            >
              Get In Touch
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
