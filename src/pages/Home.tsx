import { useRef } from "react";
import HeroSection from "@/features/marketing/components/HeroSection";
import { CheckCircle2, ArrowRight, Shield, Globe, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Index = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Marquee Logic (Left) - only animate if element exists
    const marqueeLeft = containerRef.current?.querySelector(".marquee-inner-left");
    if (marqueeLeft) {
      gsap.to(".marquee-inner-left", {
        xPercent: -50,
        repeat: -1,
        duration: 30,
        ease: "none",
      });
    }

    // Marquee Logic (Right) - only animate if element exists
    const marqueeRight = containerRef.current?.querySelector(".marquee-inner-right");
    if (marqueeRight) {
      gsap.fromTo(".marquee-inner-right", 
        { xPercent: -50 },
        {
          xPercent: 0,
          repeat: -1,
          duration: 35,
          ease: "none",
        }
      );
    }

    // Reveal animations for summaries - only animate if elements exist
    const revealTrigger = containerRef.current?.querySelector(".reveal-trigger");
    const revealItems = containerRef.current?.querySelectorAll(".reveal-item");
    if (revealTrigger && revealItems && revealItems.length > 0) {
      gsap.from(".reveal-item", {
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".reveal-trigger",
          start: "top 80%",
        }
      });
    }

  }, { scope: containerRef });

  const sectorsRows = [
    ["Oil & Gas Trading", "Commodities Export", "Manpower Supply", "Real Estate Industry", "Construction Projects"],
    ["Technology & Innovation", "Logistics & Warehousing", "Facility Management", "Business Acquisition", "Manufacturing"]
  ];

  return (
    <div className="min-h-screen bg-black text-white" ref={containerRef}>
      <main>
        <HeroSection />
        {/* Additional sections can be added here */}
      </main>
    </div>
  );
};

export default Index;
