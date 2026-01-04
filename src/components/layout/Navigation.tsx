import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Subsidiary Companies", href: "/subsidiaries" },
    { label: "Services", href: "/services" },
    { label: "Clients", href: "/clients" },
    { label: "About", href: "/about" },
    { label: "Partnership", href: "/partnership" },
    { label: "Contact", href: "/contact" },
  ];

  const isActive = (path) => {
    if (path === "/" && location.pathname !== "/") return false;
    return location.pathname.startsWith(path);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? "glass py-3" : "bg-transparent py-6"
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between relative">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <img
            src="/Logos/Logo.png"
            alt="Legacy Global"
            className="h-12 w-auto transition-transform duration-300 group-hover:scale-105"
          />
        </Link>

        {/* Desktop Navigation - Centered Pill */}
        <div className="hidden lg:flex items-center bg-[#1a1a1a]/90 backdrop-blur-md border border-white/10 rounded-full p-1 absolute left-1/2 transform -translate-x-1/2">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              className={`px-3 xl:px-4 py-2 rounded-full text-xs font-medium transition-all duration-300 flex items-center whitespace-nowrap ${
                isActive(item.href)
                  ? "bg-[#2a2a2a] text-white shadow-sm"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {isActive(item.href) && (
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 mr-1.5 animate-pulse"></span>
              )}
              {item.label}
            </Link>
          ))}
        </div>

        {/* Right Side Actions */}
        <div className="hidden lg:flex items-center gap-6">
          <Link
            to="/login"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Sign In
          </Link>
          <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-6 font-medium">
            <Link to="/signup">Get Started</Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden p-2 text-foreground"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden glass mt-2 mx-4 rounded-2xl p-6 animate-fade-in-up border border-white/10">
          <div className="flex flex-col gap-2">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className={`px-4 py-3 rounded-xl transition-all duration-300 flex items-center ${
                  isActive(item.href)
                    ? "bg-white/10 text-foreground"
                    : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {isActive(item.href) && (
                  <span className="w-2 h-2 rounded-full bg-primary mr-2"></span>
                )}
                {item.label}
              </Link>
            ))}
            <div className="h-px bg-white/10 my-2" />
            <Link
              to="/login"
              className="px-4 py-3 text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Sign In
            </Link>
            <Button asChild className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl mt-2">
              <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)}>Get Started</Link>
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
