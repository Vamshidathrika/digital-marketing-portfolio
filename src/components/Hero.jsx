import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { projects } from "../data/projects";

const projectImages = {
  2: "https://res.cloudinary.com/ddeyyxq14/image/upload/v1783314744/01_copy_kogglz.jpg",
  1: "https://res.cloudinary.com/ddeyyxq14/image/upload/v1783331785/Study_Masters_Abroad_--_Masters_in_UK_--_Top_Universities_in_UK_--_Education_Loan_--_Scholarship_ey0tsf.jpg",
  4: "https://res.cloudinary.com/ddeyyxq14/image/upload/v1783079928/This_Christmas_gift_your_skin_a_magical_glow_%EF%B8%8F_LA_Crown_Colour-Changing_Moisturizer_hydrat_srubaa.webp",
  3: "https://res.cloudinary.com/ddeyyxq14/image/upload/v1783081473/whatsapp_image_2026-01-29_at_14.12.30_720_e6kcsy.jpg"
};

export default function Hero({ setSelectedProject, hasActiveModal }) {
  const terms = [
    "Brand Designer",
    "Visual Storyteller",
    "AI Systems Builder",
    "Growth Marketer"
  ];

  const [currentTermIndex, setCurrentTermIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isFolderOpen, setIsFolderOpen] = useState(false);
  const [hoverFolder, setHoverFolder] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [lightboxImage, setLightboxImage] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentTermIndex((prev) => (prev + 1) % terms.length);
        setIsVisible(true);
      }, 500);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Delayed auto-open trigger on startup for reveal effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFolderOpen(true);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleCtaClick = (e, targetId) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  const sortedProjects = [
    projects.find((p) => p.id === 2),
    projects.find((p) => p.id === 1),
    projects.find((p) => p.id === 4),
    projects.find((p) => p.id === 3),
  ].filter(Boolean);

  const renderCardContent = (project) => {
    switch (project.id) {
      case 2: // Jira Board Card
        return (
          <div className="w-full h-full relative overflow-hidden rounded-xl">
            <img src="https://res.cloudinary.com/ddeyyxq14/image/upload/v1783314744/01_copy_kogglz.jpg" alt="" className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
          </div>
        );

      case 1: // Email Summarizer Card
        return (
          <div className="w-full h-full relative overflow-hidden rounded-xl">
            <img src="https://res.cloudinary.com/ddeyyxq14/image/upload/v1783331785/Study_Masters_Abroad_--_Masters_in_UK_--_Top_Universities_in_UK_--_Education_Loan_--_Scholarship_ey0tsf.jpg" alt="" className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
          </div>
        );

      case 4: // PPC Ad Campaigns Card
        return (
          <div className="w-full h-full relative overflow-hidden rounded-xl">
            <img src="https://res.cloudinary.com/ddeyyxq14/image/upload/v1783079928/This_Christmas_gift_your_skin_a_magical_glow_%EF%B8%8F_LA_Crown_Colour-Changing_Moisturizer_hydrat_srubaa.webp" alt="" className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
          </div>
        );

      case 3: // Sanjay Growth Audit Card
        return (
          <div className="w-full h-full relative overflow-hidden rounded-xl">
            <img src="https://res.cloudinary.com/ddeyyxq14/image/upload/v1783081473/whatsapp_image_2026-01-29_at_14.12.30_720_e6kcsy.jpg" alt="" className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <section id="home" className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center text-left select-none pt-0">
      {/* Left Column: Headline and Pitch */}
      <div className="lg:col-span-7 space-y-7">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/5 dark:bg-indigo-500/10 border border-indigo-500/10 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 dark:bg-indigo-400 animate-pulse" />
          <span className="text-[9px] sm:text-[10px] font-bold tracking-wider uppercase">
            Creative Head &amp; UI/UX Designer
          </span>
        </div>

        <h1 className="text-5xl sm:text-[62px] font-black tracking-tight text-zinc-900 dark:text-white leading-[1.08]">
          Vamshi Krishna,
          <br />
          <span className="bg-gradient-to-r from-blue-500 via-indigo-500 to-pink-500 dark:from-blue-400 dark:via-violet-400 dark:to-pink-450 bg-clip-text text-transparent min-h-[1.2em] inline-block">
            <span
              className={`inline-block transition-all duration-500 transform ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
              }`}
            >
              {terms[currentTermIndex]}
            </span>
          </span>
        </h1>

        <p className="text-sm sm:text-[15px] font-normal tracking-tight text-zinc-500 dark:text-zinc-400 max-w-xl leading-relaxed">
          I build brand identities, edit short-form videos, code custom automation pipelines, and direct advertising campaigns for founders.
        </p>

        <div className="flex items-center gap-6 pt-2 text-xs font-semibold tracking-wide uppercase">
          <a
            href="#contact"
            onClick={(e) => handleCtaClick(e, "contact")}
            className="text-zinc-900 dark:text-white hover:text-blue-500 dark:hover:text-blue-400 transition-colors cursor-pointer"
          >
            Start a project &rarr;
          </a>
          <a
            href="#projects"
            onClick={(e) => handleCtaClick(e, "projects")}
            className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-350 transition-colors cursor-pointer"
          >
            View Case Studies
          </a>
        </div>
      </div>

      {/* Right Column: Interactive Folder Gallery (Image 01 in place of Image 02) */}
      <div className="lg:col-span-5 relative w-full min-h-[380px] sm:min-h-[420px] flex flex-col items-center justify-center pt-4 select-none">
        <div className="relative w-[280px] sm:w-[360px] h-[340px] sm:h-[390px] flex justify-center pointer-events-none z-0">
          {/* Folder Back Cover */}
          <motion.div 
            className="absolute bottom-6 w-[230px] sm:w-72 h-40 sm:h-48 drop-shadow-2xl"
            animate={{ opacity: hasActiveModal ? 0 : 1, scale: isFolderOpen ? 0.95 : 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <div className="absolute top-0 left-0 w-24 sm:w-28 h-8 bg-gradient-to-t from-[#1b1b1f] to-[#26262b] rounded-t-xl border-t border-l border-r border-white/5 dark:border-white/10" />
            <div className="absolute top-6 left-0 right-0 bottom-0 bg-gradient-to-b from-[#1b1b1f] to-[#0c0c0e] rounded-b-xl rounded-tr-xl border border-white/5 dark:border-white/10 shadow-[inset_0_0_40px_rgba(0,0,0,0.85)]" />
            <div className="absolute top-8 left-2 right-2 bottom-2 bg-black rounded-lg shadow-inner pointer-events-none" />
          </motion.div>

          {/* Fanned Cards */}
          <div className={`absolute bottom-10 z-10 flex justify-center transition-all duration-300 ${hasActiveModal ? "opacity-0 pointer-events-none scale-95" : "opacity-100"}`}>
            {sortedProjects.map((project, i) => {
              const offset = i - 1.5; // Centers 4 cards perfectly

              const stackY = hoverFolder ? offset * -12 - 40 : offset * -6;
              const stackX = hoverFolder ? offset * 32 : offset * 4;
              const stackRotate = hoverFolder ? offset * 7 : offset * 2.5;
              const stackScale = 1 - Math.abs(offset) * 0.04;

              // Compact fanned stacking matching Image 01
              const openY = isMobile ? offset * -15 - 100 : offset * -10 - 130;
              const openX = isMobile ? offset * 18 : offset * 42;
              const openRotate = offset * 8;
              const openScale = 0.95;

              return (
                <motion.div
                  key={project.id}
                  drag={isFolderOpen ? true : false}
                  dragSnapToOrigin={true}
                  onDragEnd={(e, info) => {
                    if (info.offset.y > 100 && isFolderOpen) {
                      setIsFolderOpen(false);
                      setHoverFolder(false);
                    }
                  }}
                  onClick={() => {
                    setLightboxImage(projectImages[project.id]);
                  }}
                  className="absolute bottom-0 w-[170px] sm:w-[200px] h-[230px] sm:h-[270px] rounded-xl shadow-[0_20px_40px_rgba(99,102,241,0.05)] dark:shadow-[0_20px_45px_rgba(0,0,0,0.6)] overflow-hidden border border-indigo-100 dark:border-zinc-800 origin-bottom cursor-pointer z-10 pointer-events-auto select-none bg-white dark:bg-zinc-950"
                  animate={!isFolderOpen ? {
                    y: stackY,
                    x: stackX,
                    rotate: stackRotate,
                    scale: stackScale,
                    zIndex: i + 10
                  } : {
                    y: openY,
                    x: openX,
                    rotate: openRotate,
                    scale: openScale,
                    zIndex: i + 10 // Keeps cards layered behind front cover (z-20) when not hovered
                  }}
                  whileHover={isFolderOpen ? { scale: openScale + 0.05, rotate: 0, zIndex: 100 } : {}}
                  whileDrag={isFolderOpen ? { scale: openScale + 0.08, rotate: 4, zIndex: 150 } : {}}
                  transition={{ type: "spring", stiffness: 350, damping: 28 }}
                >
                  {renderCardContent(project)}
                </motion.div>
              );
            })}
          </div>
 
          {/* Folder Front Cover */}
          <motion.div 
            className="absolute bottom-0 w-[250px] sm:w-[300px] h-28 sm:h-36 drop-shadow-[0_-20px_40px_rgba(0,0,0,0.85)] cursor-pointer z-20 pointer-events-auto"
            style={{ transformOrigin: "bottom" }}
            animate={{ 
              opacity: hasActiveModal ? 0 : 1, 
              rotateX: isFolderOpen ? -15 : (hoverFolder ? -25 : 0), 
              y: isFolderOpen ? 15 : (hoverFolder ? 10 : 0),
              pointerEvents: hasActiveModal ? "none" : "auto" 
            }}
            onMouseEnter={() => !hasActiveModal && setHoverFolder(true)}
            onMouseLeave={() => setHoverFolder(false)}
            onClick={() => setIsFolderOpen(!isFolderOpen)}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <div className="w-full h-full bg-gradient-to-b from-[#242429] to-[#0c0c0e] rounded-2xl border border-white/10 dark:border-white/15 shadow-[inset_0_2px_10px_rgba(255,255,255,0.1)] relative overflow-hidden flex items-end justify-center pb-6">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
 
              <div className="px-4 py-1.5 bg-black rounded-lg border border-black/85 shadow-inner flex items-center justify-center backdrop-blur-md">
                <span className="text-white/90 text-[10px] font-bold tracking-widest font-mono">
                  PROJECTS.archive
                </span>
              </div>
            </div>
          </motion.div>
        </div>
 
        {/* Interactive Drag Hint */}
        <motion.div 
          animate={{ opacity: (isFolderOpen && !hasActiveModal) ? 1 : 0, y: isFolderOpen ? 0 : 30 }}
          className="absolute bottom-1 px-4 py-1.5 rounded-full bg-indigo-50/50 dark:bg-zinc-900/60 border border-indigo-100/50 dark:border-zinc-800 backdrop-blur-md text-indigo-650 dark:text-indigo-400 text-[8px] font-bold uppercase tracking-widest pointer-events-none"
        >
          Drag down or click cover to close
        </motion.div>
      </div>

      {/* Zoom Lightbox Modal */}
      {typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          {lightboxImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-xl flex items-center justify-center pointer-events-auto select-none"
              onClick={() => setLightboxImage(null)}
            >
              {/* Close Button top-right */}
              <button
                onClick={(e) => { e.stopPropagation(); setLightboxImage(null); }}
                className="absolute top-6 right-6 p-2 rounded-xl bg-white/10 text-white/80 hover:bg-white/20 transition cursor-pointer z-50"
                aria-label="Close Lightbox"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Displaying Image Container */}
              <div 
                className="relative max-w-[85vw] max-h-[85vh] flex items-center justify-center p-2 select-text"
                onClick={(e) => e.stopPropagation()}
              >
                <motion.img
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  src={lightboxImage}
                  alt="Zoomed card background"
                  className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl border border-white/5"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </section>
  );
}
