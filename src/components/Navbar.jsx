import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

const navItems = [
  { name: "Services", href: "#services" },
  { name: "Projects", href: "#projects" },
  { name: "Contact", href: "#contact" },
];

export default function Navbar({ activeSection }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (e, href) => {
    e.preventDefault();
    const targetId = href.replace("#", "");
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      const offset = 80;
      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
    setMobileMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-200 ${
        scrolled
          ? "py-4 bg-[#fafafa]/80 dark:bg-[#09090b]/80 backdrop-blur-md border-b border-zinc-200/50 dark:border-zinc-800/50"
          : "py-6 bg-transparent"
      }`}
    >
      <div className="max-w-4xl mx-auto px-6 flex items-center justify-between">
        {/* Name Logo */}
        <a
          href="#home"
          onClick={(e) => handleNavClick(e, "#home")}
          className="font-mono font-bold text-sm tracking-tight text-zinc-900 dark:text-white"
        >
          vk<span className="text-blue-500">.</span>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden sm:flex items-center gap-6">
          {navItems.map((item) => {
            const isActive = activeSection === item.href.replace("#", "");
            return (
              <a
                key={item.name}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className={`text-xs font-medium tracking-tight transition-colors duration-150 cursor-pointer ${
                  isActive
                    ? "text-zinc-950 dark:text-white"
                    : "text-zinc-400 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300"
                }`}
              >
                {item.name}
              </a>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="hidden sm:flex items-center gap-4">
          <ThemeToggle />
          <a
            href="/resume.html"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 hover:underline cursor-pointer"
          >
            Resume
          </a>
        </div>

        {/* Mobile Actions */}
        <div className="flex sm:hidden items-center gap-3">
          <ThemeToggle />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1 text-zinc-500 dark:text-zinc-400 cursor-pointer"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden w-full bg-[#fafafa] dark:bg-[#09090b] border-b border-zinc-200 dark:border-zinc-800 px-6 py-6 flex flex-col gap-4 shadow-md">
          <div className="flex flex-col gap-2">
            {navItems.map((item) => {
              const isActive = activeSection === item.href.replace("#", "");
              return (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className={`py-2 text-sm font-semibold ${
                    isActive ? "text-blue-500" : "text-zinc-500 dark:text-zinc-400"
                  }`}
                >
                  {item.name}
                </a>
              );
            })}
            <a
              href="/resume.html"
              target="_blank"
              rel="noopener noreferrer"
              className="py-2 text-sm font-semibold text-zinc-850 dark:text-zinc-200"
            >
              Resume
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
