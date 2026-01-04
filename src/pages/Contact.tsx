import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Send, MessageSquare, Clock } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Contact() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Initial opacity set to prevent flash of content
    gsap.set([".header-reveal", ".info-card", ".form-reveal"], { opacity: 0 });

    // Header reveal
    gsap.to(".header-reveal", {
      opacity: 1,
      y: 0,
      duration: 1,
      stagger: 0.2,
      ease: "power3.out",
      startAt: { y: 30 }
    });

    // Info cards reveal
    gsap.to(".info-card", {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: "power2.out",
      startAt: { y: 20 },
      scrollTrigger: {
        trigger: ".contact-grid",
        start: "top 90%",
        once: true
      }
    });

    // Form reveal
    gsap.to(".form-reveal", {
      opacity: 1,
      scale: 1,
      duration: 1,
      ease: "power3.out",
      startAt: { scale: 0.98 },
      scrollTrigger: {
        trigger: ".form-reveal",
        start: "top 90%",
        once: true
      }
    });

    // Background floating
    gsap.to(".blob-1", {
      x: "15%",
      y: "10%",
      duration: 18,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });

    gsap.to(".blob-2", {
      x: "-15%",
      y: "-10%",
      duration: 22,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      delay: 1
    });

    ScrollTrigger.refresh();
  }, { scope: containerRef });

  const contactInfo = [
    { 
      icon: MapPin, 
      title: "Headquarters", 
      content: "Riyadh, Saudi Arabia",
      sub: "Kingdom of Saudi Arabia"
    },
    { 
      icon: Mail, 
      title: "Email Support", 
      content: "info@legacyglobal.com",
      link: "mailto:info@legacyglobal.com"
    },
    { 
      icon: Phone, 
      title: "Call Us", 
      content: "+966 (Contact for Inquiry)",
      sub: "Sun — Thu: 9AM — 6PM"
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden bg-grain pt-32 pb-20 px-6" ref={containerRef}>
      
      {/* Background Decor */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="blob-1 absolute top-[-5%] right-[-5%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] opacity-40" />
        <div className="blob-2 absolute bottom-[-5%] left-[-5%] w-[400px] h-[400px] bg-amber-600/10 rounded-full blur-[100px] opacity-30" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <span className="header-reveal inline-block text-primary font-medium tracking-[0.2em] uppercase text-xs mb-4">Get In Touch</span>
          <h1 className="header-reveal text-4xl md:text-5xl font-bold mb-6">
            Partner with <span className="text-gradient-gold">Legacy Global</span>
          </h1>
          <p className="header-reveal text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Revolutionizing B2B opportunities through integrity and strategic consultancy. Reach out to explore how we can bridge your business to success.
          </p>
        </div>

        <div className="contact-grid grid lg:grid-cols-12 gap-8 lg:gap-16 items-start">
          {/* Info Column */}
          <div className="lg:col-span-5 space-y-6">
            {contactInfo.map((info, idx) => (
              <div key={idx} className="info-card bg-white/5 border border-white/10 p-7 rounded-2xl backdrop-blur-md group hover:border-primary/40 transition-all duration-300">
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 group-hover:bg-primary transition-all duration-300">
                    <info.icon className="w-6 h-6 text-primary group-hover:text-black" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">{info.title}</h3>
                    {info.link ? (
                      <a href={info.link} className="text-gray-400 hover:text-primary transition-colors text-sm font-medium">{info.content}</a>
                    ) : (
                      <p className="text-gray-400 text-sm">{info.content}</p>
                    )}
                    {info.sub && <p className="text-xs text-gray-500 mt-1">{info.sub}</p>}
                  </div>
                </div>
              </div>
            ))}

            <div className="info-card bg-primary/5 border border-primary/10 p-7 rounded-2xl backdrop-blur-md">
               <div className="flex items-center gap-3 mb-4">
                 <MessageSquare className="w-5 h-5 text-primary" />
                 <h3 className="text-sm font-bold text-primary tracking-widest uppercase">Registration</h3>
               </div>
               <div className="space-y-2 text-xs text-gray-400 font-mono">
                 <div className="flex justify-between border-b border-white/5 pb-2">
                   <span>CR Number</span> 
                   <span className="text-white">1010499715</span>
                 </div>
                 <div className="flex justify-between pt-1">
                   <span>VAT ID</span> 
                   <span className="text-white">310278963700003</span>
                 </div>
               </div>
            </div>
          </div>

          {/* Form Column - Smaller and more refined */}
          <div className="lg:col-span-7">
            <div className="form-reveal bg-[#0a0a0a]/60 border border-white/10 p-8 md:p-10 rounded-[2.5rem] backdrop-blur-xl relative shadow-2xl overflow-hidden">
               <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 blur-3xl rounded-full" />
               
               <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
                 <Send className="w-6 h-6 text-primary" />
                 Inquiry Form
               </h3>
               
               <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                 <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <Label htmlFor="first-name" className="text-xs font-medium text-gray-500 ml-1">First Name</Label>
                       <Input id="first-name" placeholder="John" className="bg-white/5 border-white/10 h-12 rounded-xl focus-visible:ring-primary/40" />
                    </div>
                    <div className="space-y-2">
                       <Label htmlFor="last-name" className="text-xs font-medium text-gray-500 ml-1">Last Name</Label>
                       <Input id="last-name" placeholder="Doe" className="bg-white/5 border-white/10 h-12 rounded-xl focus-visible:ring-primary/40" />
                    </div>
                 </div>

                 <div className="space-y-2">
                    <Label htmlFor="email" className="text-xs font-medium text-gray-500 ml-1">Email Address</Label>
                    <Input id="email" type="email" placeholder="john@example.com" className="bg-white/5 border-white/10 h-12 rounded-xl focus-visible:ring-primary/40" />
                 </div>

                 <div className="space-y-2">
                    <Label htmlFor="message" className="text-xs font-medium text-gray-500 ml-1">Your Inquiry</Label>
                    <Textarea 
                      id="message" 
                      placeholder="Tell us about your requirements..." 
                      className="bg-white/5 border-white/10 min-h-[150px] rounded-xl focus-visible:ring-primary/40 transition-all resize-none p-4" 
                    />
                 </div>

                 <Button className="w-full bg-primary text-black hover:bg-gold-light rounded-2xl h-14 font-extrabold text-lg group transition-all duration-500 shadow-xl shadow-primary/10 tracking-wide">
                    Submit Message
                    <Send className="ml-2 w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                 </Button>
               </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
