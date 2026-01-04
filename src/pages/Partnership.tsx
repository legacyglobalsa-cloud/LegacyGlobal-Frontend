import { useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Handshake, Globe, Trophy, ArrowRight } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

// Data for partners
const partnersData = [
  {
    name: "Gimona Organic Farm",
    logo: "/Partnership/ImonaLogo.png",
    tagline: "Gift from Nature",
    description:
      "Gimona Organic Farm is a cultivation and production model following USDA Organic and Halal standards. We offer organic agriculture experiences, allowing visitors to learn about organic farming practices and experience the cultivation and production process of chemical-free agricultural products.\n\nDiscover what medicinal food is and enjoy purely plant-based meals to improve health and enhance quality of life. Experience a place of peace and harmony with nature.",
    website: "https://gimona.vn",
  },
  {
    name: "Oasis 360 Media Solutions",
    logo: "/Partnership/Oasis360 logo.png",
    tagline: "Entertainment & Events Management Experts",
    description:
      "Oasis 360 Media Solutions carries with it over 35 years of proven expertise in the entertainment and events management industry. Established in 1989, the company built a solid reputation for delivering quality, creativity, and memorable experiences.\n\nIn 2025, the company embraced a bold new branding and vision. A specialized management team now leads our Sales & Marketing, Finance & Procurement, Operations, and Innovation & Technology divisions—driving efficiency and client satisfaction.",
    website: "https://wahatalfaten.com",
  },
  {
    name: "Spectrum Engineering Solutions (SES)",
    logo: "/Partnership/sesksa.png",
    tagline: "Driven By our Values — People, Process & Performance",
    description:
      "Spectrum Engineering Solutions (SES) is a contracting company with international and local experience in Civil construction, Industrial Automation and Electro-Mechanical Turnkey Job.\n\nThe company is working under Spectrum group who operates as an industrial Automation and electro-mechanical contractor for high-end Industries Automation, civil and MEP contractor in the U.S and Saudi Market.",
    website: "https://sesksa.com",
  },
  {
    name: "ABK Law",
    logo: "/Partnership/abklaw.png",
    tagline: "Excellent Legal Service — Sustainable Trust",
    description:
      "ABK Law are pioneers in providing innovative and reliable legal advice, while adhering to the values of integrity and professionalism. We are here to build long-term relationships based on trust and excellence.\n\nProviding reliable legal service based on professionalism and integrity, with a focus on meeting the needs of each client effectively and with the highest level of accuracy and transparency.",
    website: "https://abklaw.net/en/",
  },
];

export default function Partnership() {
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
    <div className="min-h-screen bg-black text-white" ref={containerRef}>
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-4xl mx-auto mb-20 reveal">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Strategic <span className="text-gradient-gold">Partnerships</span>
            </h1>
            <p className="text-gray-400 text-lg md:text-xl">
              Collaborating with industry leaders to deliver exceptional value
              and drive global innovation.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-32">
            {[
              {
                icon: Handshake,
                title: "Joint Ventures",
                desc: "Collaborative business opportunities designed to foster mutual growth and market expansion.",
              },
              {
                icon: Globe,
                title: "Global Network",
                desc: "Immediate access to our extensive worldwide network of industry resources and expertise.",
              },
              {
                icon: Trophy,
                title: "Shared Success",
                desc: "A deep commitment to achieving operational excellence and market leadership together.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="reveal group bg-[#121212] p-10 rounded-[2rem] border border-white/5 hover:border-yellow-500/30 transition-all duration-500 hover:-translate-y-1"
              >
                <div className="w-14 h-14 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center mb-8 group-hover:bg-zinc-800 transition-all duration-500 group-hover:scale-110">
                  <item.icon className="w-7 h-7 text-yellow-500" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-white group-hover:text-yellow-400 transition-colors">
                  {item.title}
                </h3>
                <p className="text-gray-400 leading-relaxed font-light">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Strategic Partners Section */}
          <div className="mb-32">
            <div className="text-center mb-16 reveal">
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                Our Strategic{" "}
                <span className="text-gradient-gold">Partners</span>
              </h2>
            </div>

            <div className="max-w-4xl mx-auto reveal">
              <Accordion type="single" collapsible className="w-full space-y-6">
                {partnersData.map((partner, index) => (
                  <AccordionItem
                    key={index}
                    value={`item-${index}`}
                    className="border-b-0 bg-gradient-to-br from-[#F5B51E] via-[#FFD700] to-[#D9A216] rounded-[2rem] px-2 md:px-6 shadow-[0_10px_30px_-10px_rgba(245,181,30,0.3)] transition-all duration-300 hover:scale-[1.02] data-[state=open]:scale-[1.02]"
                  >
                    <AccordionTrigger className="hover:no-underline py-6">
                      <div className="flex items-center gap-6 text-left w-full pr-4">
                        <div className="w-16 h-16 md:w-20 md:h-20 bg-white/90 backdrop-blur rounded-xl p-2 flex items-center justify-center shadow-sm flex-shrink-0">
                          <img
                            src={partner.logo}
                            alt={partner.name}
                            className="max-w-full max-h-full object-contain"
                          />
                        </div>
                        <div>
                          <h3 className="text-xl md:text-2xl font-black text-black leading-tight uppercase tracking-tight">
                            {partner.name}
                          </h3>
                          <p className="text-black/70 font-bold text-sm md:text-base mt-1 uppercase tracking-wide">
                            {partner.tagline}
                          </p>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-2 pb-8">
                      <div className="pt-6 border-t border-black/10">
                        <div className="space-y-4 mb-8 text-black/80 text-lg font-medium leading-relaxed">
                          {partner.description
                            .split("\n\n")
                            .map((paragraph, pIndex) => (
                              <p key={pIndex}>{paragraph}</p>
                            ))}
                        </div>
                        <a
                          href={partner.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-8 py-4 bg-black text-white rounded-full hover:bg-black/80 transition-all duration-300 font-bold text-base shadow-lg hover:shadow-xl hover:-translate-y-1"
                        >
                          Visit Website
                          <ArrowRight className="w-5 h-5" />
                        </a>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </div>

        {/* gold-themed Become a Partner section */}
        <section className="relative my-24 overflow-hidden py-24 bg-gradient-to-br from-[#F5B51E] via-[#FFD700] to-[#D9A216] rounded-[4rem] mx-2 md:mx-6 shadow-[0_30px_60px_-15px_rgba(245,181,30,0.4)] border border-white/20 reveal">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/20 blur-[100px] rounded-full" />
          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-2xl">
              <h2 className="text-4xl md:text-6xl font-black mb-6 text-black tracking-tight uppercase">
                Become a <span className="opacity-70">Partner</span>
              </h2>
              <div className="w-24 h-1 bg-black/20 mb-8 rounded-full" />
              <p className="text-black/80 mb-10 text-xl leading-relaxed font-medium">
                Join our ecosystem of innovators and industry leaders. Let's
                create something extraordinary together.
              </p>
              <Button className="bg-black text-white hover:bg-black/90 text-xl px-10 py-8 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 group">
                Apply for Partnership{" "}
                <ArrowRight className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
