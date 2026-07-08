import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { createPortal } from "react-dom";
import { Palette, Video, Cpu, Target, Volume2, VolumeX, Play, Pause, SkipForward, TrendingUp, X, ArrowUpRight, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Helper to randomly shuffle an array
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// ─── ReelPlayer ───────────────────────────────────────────────────────────────
// Active card → plain YouTube iframe with autoplay + enablejsapi.
// Inactive cards → YouTube thumbnail image (no embed overhead).
function ReelPlayer({ videoId, isActive, isMuted, isPlaying }) {
  const iframeRef = useRef(null);

  // Send postMessage commands (play / pause / mute / unmute)
  const cmd = useCallback((func) => {
    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: "command", func, args: [] }),
      "https://www.youtube.com"
    );
  }, []);

  // Sync play/pause whenever props change (small delay lets iframe settle)
  useEffect(() => {
    if (!isActive) return;
    const t = setTimeout(() => cmd(isPlaying ? "playVideo" : "pauseVideo"), 300);
    return () => clearTimeout(t);
  }, [isPlaying, isActive, cmd]);

  // Sync mute/unmute
  useEffect(() => {
    if (!isActive) return;
    cmd(isMuted ? "mute" : "unMute");
  }, [isMuted, isActive, cmd]);

  if (!isActive) {
    // Thumbnail only for non-active cards — no iframe overhead
    return (
      <div className="absolute inset-0 w-full h-full bg-black overflow-hidden">
        <img
          src={`https://i.ytimg.com/vi/${videoId}/0.jpg`}
          alt="Reel thumbnail"
          className="w-full h-full object-cover opacity-80"
          onError={(e) => { e.currentTarget.style.display = "none"; }}
        />
      </div>
    );
  }

  // Build embed URL — enablejsapi=1 allows postMessage control
  const src =
    `https://www.youtube.com/embed/${videoId}` +
    `?autoplay=1&mute=1&controls=0&loop=1&playlist=${videoId}` +
    `&playsinline=1&rel=0&modestbranding=1&iv_load_policy=3` +
    `&enablejsapi=1&origin=${encodeURIComponent(window.location.origin)}`;

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden yt-iframe-container">
      <iframe
        ref={iframeRef}
        src={src}
        title="Video reel"
        allow="autoplay; encrypted-media; picture-in-picture"
        allowFullScreen={false}
        className="border-0"
      />
    </div>
  );
}


// ─── LiveCampaignDashboard ────────────────────────────────────────────────────
// Animated live campaign metrics widget for the Digital Marketing bento card.
function LiveCampaignDashboard() {
  // Base bar heights (%) — updates periodically to simulate live data
  const baseData = [38, 52, 61, 45, 78, 55, 82];
  const [bars, setBars] = useState(baseData);
  const [activePlatform, setActivePlatform] = useState(0);
  const [pulse, setPulse] = useState(false);

  // Cycle through platforms every 2s
  useEffect(() => {
    const t = setInterval(() => setActivePlatform((p) => (p + 1) % 3), 2000);
    return () => clearInterval(t);
  }, []);

  // Simulate live chart update every 2.5s
  useEffect(() => {
    const t = setInterval(() => {
      setPulse(true);
      setTimeout(() => setPulse(false), 600);
      setBars((prev) => {
        const next = [...prev.slice(1), Math.floor(Math.random() * 45) + 45];
        return next;
      });
    }, 2500);
    return () => clearInterval(t);
  }, []);

  const metrics = [
    { label: "ROAS", value: "4.2×", color: "text-emerald-500" },
    { label: "CTR",  value: "3.8%", color: "text-blue-500" },
    { label: "CPC",  value: "$0.47", color: "text-violet-500" },
  ];

  const platforms = [
    { name: "Google", dot: "bg-blue-500" },
    { name: "Meta",   dot: "bg-indigo-500" },
    { name: "TikTok", dot: "bg-pink-500" },
  ];

  const maxBar = Math.max(...bars);

  return (
    <div className="w-full flex flex-col gap-2.5">
      {/* Metric pills row */}
      <div className="flex gap-1.5">
        {metrics.map((m) => (
          <div key={m.label} className="flex-1 rounded-lg bg-zinc-100 dark:bg-zinc-800/80 px-2 py-1.5 flex flex-col gap-0.5">
            <span className="text-[8px] font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">{m.label}</span>
            <span className={`text-[11px] font-bold ${m.color} leading-none`}>{m.value}</span>
          </div>
        ))}
      </div>

      {/* Live animated bar chart */}
      <div className="relative w-full rounded-lg bg-zinc-100 dark:bg-zinc-800/60 p-2 overflow-hidden">
        {/* LIVE pill */}
        <div className="absolute top-1.5 right-1.5 flex items-center gap-1 bg-black/10 dark:bg-white/5 rounded-full px-1.5 py-0.5">
          <span className={`w-1.5 h-1.5 rounded-full bg-emerald-400 ${pulse ? "scale-125" : "scale-100"} transition-transform duration-300`} />
          <span className="text-[7px] font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Live</span>
        </div>

        <div className="flex items-end gap-1 h-10 mt-1">
          {bars.map((h, i) => (
            <motion.div
              key={i}
              animate={{ height: `${(h / maxBar) * 100}%` }}
              transition={{ type: "spring", stiffness: 200, damping: 22 }}
              className="flex-1 rounded-sm bg-gradient-to-t from-emerald-500 to-teal-400 opacity-80"
              style={{ minHeight: "4px" }}
            />
          ))}
        </div>
      </div>

      {/* Platform badges */}
      <div className="flex gap-1.5">
        {platforms.map((p, i) => (
          <button
            key={p.name}
            onClick={() => setActivePlatform(i)}
            className={`flex items-center gap-1 px-2 py-1 rounded-full text-[9px] font-semibold transition-all duration-300 cursor-pointer ${
              activePlatform === i
                ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400 border border-transparent"
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${p.dot}`} />
            {p.name}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-1 text-[9px] text-emerald-500 font-semibold">
          <TrendingUp className="w-3 h-3" />
          +18%
        </div>
      </div>
    </div>
  );
}

const uniqueDesigns = [
  "https://res.cloudinary.com/ddeyyxq14/image/upload/v1783078231/5in1.jpg_sc1chu.jpg",
  "https://res.cloudinary.com/ddeyyxq14/image/upload/v1783078231/988.jpg_hf7omq.jpg",
  "https://res.cloudinary.com/ddeyyxq14/image/upload/v1783078231/0092w.jpg_pvybmx.jpg",
  "https://res.cloudinary.com/ddeyyxq14/image/upload/v1783079345/2_kcbqx3.png",
  "https://res.cloudinary.com/ddeyyxq14/image/upload/v1783078232/ooq.jpg_vpufn2.jpg",
  "https://res.cloudinary.com/ddeyyxq14/image/upload/v1783078234/peri.jpg_s6s60w.jpg",
  "https://res.cloudinary.com/ddeyyxq14/image/upload/v1783079928/This_Christmas_gift_your_skin_a_magical_glow_%EF%B8%8F_LA_Crown_Colour-Changing_Moisturizer_hydrat_srubaa.webp",
  "https://res.cloudinary.com/ddeyyxq14/image/upload/v1783080921/image_dofmcj.png",
  "https://res.cloudinary.com/ddeyyxq14/image/upload/v1783080970/2026-07-03_17-43-28_720_v93tdd.png",
  "https://res.cloudinary.com/ddeyyxq14/image/upload/v1783081140/image_720_htgdcd.png",
  "https://res.cloudinary.com/ddeyyxq14/image/upload/v1783081296/03-03-social-media-marketing_720_woo5zx.png",
  "https://res.cloudinary.com/ddeyyxq14/image/upload/v1783081304/02-02-cover_720_dh2v81.png",
  "https://res.cloudinary.com/ddeyyxq14/image/upload/v1783081310/01-01-hook_720_hwm48g.png",
  "https://res.cloudinary.com/ddeyyxq14/image/upload/v1783081318/09-09-book-a-call_720_gyizex.png",
  "https://res.cloudinary.com/ddeyyxq14/image/upload/v1783081319/08-08-web-design-development_720_cz8ous.png",
  "https://res.cloudinary.com/ddeyyxq14/image/upload/v1783081327/07-07-brand-strategy-identity_720_zckugc.png",
  "https://res.cloudinary.com/ddeyyxq14/image/upload/v1783081331/06-06-content-creative_720_knqx1u.png",
  "https://res.cloudinary.com/ddeyyxq14/image/upload/v1783081334/05-05-performance-advertising_720_rjntdz.png",
  "https://res.cloudinary.com/ddeyyxq14/image/upload/v1783081352/04-04-search-engine-optimization_720_alplob.png",
  "https://res.cloudinary.com/ddeyyxq14/image/upload/v1783081473/whatsapp_image_2026-01-29_at_14.12.30_720_e6kcsy.jpg",
  "https://res.cloudinary.com/ddeyyxq14/image/upload/v1783081477/social_media_designs_480_nslpmp.png",
  "https://res.cloudinary.com/ddeyyxq14/image/upload/v1783081795/your_skin_in_juicy_hydration_Start_your_skin_s_happy_hour_with_our_Pomegranate_Wine_Moisturize_tp0h9g.webp",
  "https://res.cloudinary.com/ddeyyxq14/image/upload/v1783081858/Meet_your_skin_s_new_best_friend-_The_La_Crown_Glutathione_Serum._Known_as_the_master_antioxid_mrp4ir.webp",
  "https://res.cloudinary.com/ddeyyxq14/image/upload/v1783081890/7_steps_to_your_best_skin_yet_Grab_the_LA_Crown_Glutathione_Facial_Kit_and_discover_the_sec_mm1yo5.webp",
  "https://res.cloudinary.com/ddeyyxq14/image/upload/v1783082252/synersys_hiring__2__720_mfkdef.png",
  "https://res.cloudinary.com/ddeyyxq14/image/upload/v1783314744/01_copy_kogglz.jpg",
  "https://res.cloudinary.com/ddeyyxq14/image/upload/v1783314744/Screenshot_2026-07-06_at_10.41.27_AM_kxa2wq.png",
  "https://res.cloudinary.com/ddeyyxq14/image/upload/v1783314743/dew_or_dare_summer_sale_-68d9-461c-b122-7144fcde3236_copy_ywhozz.jpg",
  "https://res.cloudinary.com/ddeyyxq14/image/upload/v1783314744/dewor_dare_02_copy_sizs0d.jpg",
  "https://res.cloudinary.com/ddeyyxq14/image/upload/v1783331780/Study_Masters_in_UK_at_Top_Universities_--_Education_Loan_Assistance_--_Scholarships_up_to_6_Lak_g6c9j9.jpg",
  "https://res.cloudinary.com/ddeyyxq14/image/upload/v1783331780/Step_into_Your_Future_with_Vsource_Are_you_ready_to_take_the_next_big_step_in_your_educatio_exzkaz.jpg",
  "https://res.cloudinary.com/ddeyyxq14/image/upload/v1783331780/Dreaming_of_studying_in_the_UK_Now_you_can_make_it_happen_for_under_15_lakhs_Get_an_interna_u605wz.jpg",
  "https://res.cloudinary.com/ddeyyxq14/image/upload/v1783331780/One_Loan_Endless_Opportunities-_Covering_Your_Study_Abroad_Needs_Ready_to_study_abroad_djyfuo.jpg",
  "https://res.cloudinary.com/ddeyyxq14/image/upload/v1783331782/Study_Masters_in_UK_at_Top_Universities_--_Education_Loan_Assistance_--_Scholarships_upto_10_Lak_d0pxvd.jpg",
  "https://res.cloudinary.com/ddeyyxq14/image/upload/v1783331781/Turn_Your_Dream_of_Studying_Abroad_into_Reality_%EF%B8%8FDreaming_of_studying_abroad_Now_you_can_ma_uzwuvg.jpg",
  "https://res.cloudinary.com/ddeyyxq14/image/upload/v1783331780/Unlock_the_door_to_Bright_and_Successful_academic_future_%EF%B8%8F_Dreaming_of_studying_abroad_No_npn4mm.jpg",
  "https://res.cloudinary.com/ddeyyxq14/image/upload/v1783331783/Study_Masters_Abroad_-_Top_Universities_with_Placements_Internship_-_100_Non-Collateral_Educa_mksdlf.jpg",
  "https://res.cloudinary.com/ddeyyxq14/image/upload/v1783331784/Study_Masters_in_UK_--_Top_Universities_in_UK_--_Education_Loan_--_Scholarships_Upto_10_Lakhs_--_c2y6vc.jpg",
  "https://res.cloudinary.com/ddeyyxq14/image/upload/v1783331785/Masters_in_UK_--_Top_Universities_in_UK_--_Full_Education_Loan_--_Scholarships_Upto_6_LakhsIf_yo_vdjlaq.jpg",
  "https://res.cloudinary.com/ddeyyxq14/image/upload/v1783331785/Study_Masters_Abroad_--_Masters_in_UK_--_Top_Universities_in_UK_--_Education_Loan_--_Scholarship_ey0tsf.jpg",
  "https://res.cloudinary.com/ddeyyxq14/image/upload/v1783331786/Last_Chance_to_Apply_for_UK_Universities_January_2025_Intake_Dont_miss_your_opportunity_kdita6.jpg"
];

const row1Designs = [
  uniqueDesigns[17],
  uniqueDesigns[1],
  uniqueDesigns[22],
  uniqueDesigns[12],
  uniqueDesigns[0],
  uniqueDesigns[15],
  uniqueDesigns[19],
  uniqueDesigns[9],
  uniqueDesigns[5],
  uniqueDesigns[24],
  uniqueDesigns[6],
  uniqueDesigns[7],
  uniqueDesigns[14],
  uniqueDesigns[25],
  uniqueDesigns[26],
  uniqueDesigns[29],
  uniqueDesigns[31],
  uniqueDesigns[33],
  uniqueDesigns[35],
  uniqueDesigns[37],
  uniqueDesigns[39]
];

const row2Designs = [
  uniqueDesigns[21],
  uniqueDesigns[2],
  uniqueDesigns[23],
  uniqueDesigns[3],
  uniqueDesigns[20],
  uniqueDesigns[8],
  uniqueDesigns[18],
  uniqueDesigns[4],
  uniqueDesigns[11],
  uniqueDesigns[13],
  uniqueDesigns[10],
  uniqueDesigns[16],
  uniqueDesigns[27],
  uniqueDesigns[28],
  uniqueDesigns[30],
  uniqueDesigns[32],
  uniqueDesigns[34],
  uniqueDesigns[36],
  uniqueDesigns[38],
  uniqueDesigns[40]
];

export default function Services() {
  const shuffledUnique = useMemo(() => shuffleArray(uniqueDesigns), []);
  const shuffledRow1 = useMemo(() => shuffleArray(row1Designs), []);
  const shuffledRow2 = useMemo(() => shuffleArray(row2Designs), []);

  // Playlist: user's own Short plays first
  const playlist = [
    { id: "juicoFAMZOU", title: "Vertical Video Editing" },
    { id: "q57moBJsoAI", title: "Dynamic Storytelling" },
    { id: "ctPEPIucVZo", title: "Creative Video Production" }
  ];

  const [currentIndex, setCurrentIndex] = useState(0); // Start on Reel 1 (My Reel)
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [direction, setDirection] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  // Live metadata — re-fetched from YouTube oEmbed whenever the active reel changes
  const [reelMeta, setReelMeta] = useState({ title: "", author: "" });

  // Disable scrolling when gallery or video modal is open
  useEffect(() => {
    if (isGalleryOpen || isVideoModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isGalleryOpen, isVideoModalOpen]);

  useEffect(() => {
    const videoId = playlist[currentIndex]?.id;
    if (!videoId) return;
    setReelMeta({ title: "", author: "" });
    // Append a timestamp cache-buster to the oEmbed request to bypass CDN caches and get fresh data
    const cb = Date.now();
    fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json&cb=${cb}`)
      .then((r) => r.json())
      .then((d) => setReelMeta({ title: d.title || "", author: d.author_name || "" }))
      .catch(() => setReelMeta({ title: "", author: "" }));
  }, [currentIndex]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);


  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % playlist.length);
    setIsPlaying(true);
  };

  // Returns CSS transform properties for each card based on its offset from the active index
  const getCardStyle = (index) => {
    const n = playlist.length;
    // Positive modular offset: 0 = active, 1 = next-right, 2 = next-left (for n=3)
    const offset = ((index - currentIndex) % n + n) % n;
    // Fold: anything past the halfway point wraps to the left (negative)
    const wrappedOffset = offset > Math.floor(n / 2) ? offset - n : offset;

    if (wrappedOffset === 0) {
      // Active center card
      return { x: 0, scale: 1, opacity: 1, rotate: 0, zIndex: 20, blur: 0 };
    } else if (wrappedOffset < 0) {
      // Left side
      return { x: -70 * Math.abs(wrappedOffset), scale: 0.75, opacity: 0.55, rotate: -10, zIndex: 10 - Math.abs(wrappedOffset), blur: 2 };
    } else {
      // Right side
      return { x: 70 * wrappedOffset, scale: 0.75, opacity: 0.55, rotate: 10, zIndex: 10 - wrappedOffset, blur: 2 };
    }
  };

  return (
    <section id="services" className="space-y-10 text-left select-none">
      {/* Header */}
      <div className="space-y-3">
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
          Offerings
        </h2>
        <p className="text-sm sm:text-base text-zinc-500 dark:text-zinc-400 max-w-2xl leading-relaxed font-normal">
          I help founders and high-growth startups elevate their digital presence by crafting premium visual brand identities, editing high-impact short-form video assets, and building custom integration pipelines that automate team workflows. By combining creative design with direct-response advertising strategy, I turn brand assets into measurable business growth.
        </p>
      </div>

      {/* Uneven Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: Graphic Designs (Spans 2 cols) */}
        <div
          onClick={() => setIsGalleryOpen(true)}
          className="md:col-span-2 p-7 rounded-[24px] bento-card dark:bento-card-dark flex flex-col justify-between h-[26rem] overflow-hidden relative cursor-pointer hover:shadow-xl dark:hover:shadow-zinc-950/70 hover:border-zinc-300 dark:hover:border-zinc-700 transition duration-300 group"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-blue-500">
                  <Palette className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                  Graphic Designs
                </h3>
              </div>
              <div className="px-3 py-1 rounded-full text-[10px] font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center gap-1">
                <span>View Gallery</span>
                <ArrowUpRight className="w-3 h-3" />
              </div>
            </div>
            <p className="text-xs text-zinc-450 dark:text-zinc-500 leading-relaxed max-w-md font-normal">
              Distinct visual identities, custom typography, print layouts, and digital branding assets.
            </p>
          </div>

          {/* Graphic Design Scroll Velocity Marquee */}
          <div className="w-full space-y-2 pointer-events-none select-none relative overflow-hidden mt-1 before:absolute before:left-0 before:top-0 before:z-10 before:h-full before:w-16 before:bg-gradient-to-r before:from-[#ffffff] dark:before:from-[#030303] before:to-transparent after:absolute after:right-0 after:top-0 after:z-10 after:h-full after:w-16 after:bg-gradient-to-l after:from-[#ffffff] dark:after:from-[#030303] after:to-transparent">
            {/* Row 1 - Scroll Left */}
            <div className="flex w-[200%] gap-3 items-center animate-marquee-left whitespace-nowrap">
              {[...shuffledRow1, ...shuffledRow1].map((src, idx) => (
                <div key={idx} className="w-24 h-32 rounded-lg overflow-hidden border border-zinc-200/50 dark:border-zinc-850 shadow-md flex-shrink-0">
                  <img src={src} alt="Graphic design thumbnail" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>

            {/* Row 2 - Scroll Right */}
            <div className="flex w-[200%] gap-3 items-center animate-marquee-right whitespace-nowrap">
              {[...shuffledRow2, ...shuffledRow2].map((src, idx) => (
                <div key={idx} className="w-24 h-32 rounded-lg overflow-hidden border border-zinc-200/50 dark:border-zinc-850 shadow-md flex-shrink-0">
                  <img src={src} alt="Graphic design thumbnail" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Card 2: Video Editing (Spans 1 col, Tall) - Swapped with interactive YouTube Shorts loop */}
        <div className="md:row-span-2 p-7 rounded-[24px] bento-card dark:bento-card-dark flex flex-col justify-between h-[36rem] md:h-full">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-purple-500">
                <Video className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                Video Editing
              </h3>
            </div>
            <p className="text-xs text-zinc-450 dark:text-zinc-500 leading-relaxed font-normal min-h-[1.5rem]">
              {reelMeta.title ? (
                <>
                  <span className="font-black bg-gradient-to-r from-purple-500 via-pink-500 to-rose-400 bg-clip-text text-transparent">
                    {reelMeta.title}
                  </span>
                  {reelMeta.author && (
                    <>{" — "}<span className="font-medium text-purple-500">{reelMeta.author}</span>.</>
                  )}
                </>
              ) : (
                <span className="opacity-40 italic text-[10px]">Loading...</span>
              )}
            </p>
            {/* 3D Cover Flow Stack — Reel 1 left, Reel 2 center playing, Reel 3 right */}
            <div className="mt-1 flex items-center justify-center relative" style={{ perspective: "900px" }}>
            <div className="relative flex items-center justify-center w-full h-[330px] sm:h-[390px]">
              {playlist.map((reel, index) => {
                const style = getCardStyle(index);
                const isActive = index === currentIndex;

                return (
                  <motion.div
                    key={`${reel.id}-${index}`}
                    animate={{
                      x: style.x,
                      scale: style.scale,
                      opacity: style.opacity,
                      rotateY: style.rotate,
                      zIndex: style.zIndex,
                    }}
                    transition={{ type: "spring", stiffness: 280, damping: 28 }}
                    onClick={() => {
                      if (!isActive) {
                        setDirection(index > currentIndex ? 1 : -1);
                        setCurrentIndex(index);
                        setIsPlaying(true);
                      } else {
                        setIsVideoModalOpen(true);
                        setIsPlaying(false); // Pause background video
                      }
                    }}
                    className={`absolute w-[180px] sm:w-[210px] aspect-[9/16] rounded-[22px] border-4 bg-black overflow-hidden shadow-2xl cursor-pointer ${
                      isActive
                        ? "border-zinc-200 dark:border-zinc-700 hover:border-purple-500/50"
                        : "border-zinc-300/50 dark:border-zinc-800/60"
                    }`}
                    style={{ transformStyle: "preserve-3d", filter: isActive ? "none" : "blur(1px) brightness(0.7)" }}
                  >


                    {/* Video Player */}
                    <ReelPlayer
                      videoId={reel.id}
                      isActive={isActive}
                      isMuted={isMuted || !isActive}
                      isPlaying={isActive ? isPlaying : false}
                    />

                    {/* Click-to-expand overlay on active card */}
                    {isActive && (
                      <div className="absolute inset-0 bg-black/20 hover:bg-black/45 z-10 opacity-0 hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center gap-2 text-white">
                        <div className="p-3.5 rounded-full bg-purple-600/90 text-white shadow-lg border border-purple-400/20 scale-90 hover:scale-100 transition-transform duration-300">
                          <Play className="w-6 h-6" fill="white" />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-widest bg-black/40 px-2.5 py-1 rounded-md backdrop-blur-sm border border-white/5">Open &amp; Play</span>
                      </div>
                    )}

                    {/* Click-to-select dim overlay on non-active cards */}
                    {!isActive && (
                      <div className="absolute inset-0 bg-black/30 z-10 flex items-center justify-center">
                        <Play className="w-8 h-8 text-white/70" />
                      </div>
                    )}

                    {/* Controls — only on active card */}
                    {isActive && (
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-20 flex flex-col justify-end p-2.5 pointer-events-none">
                        <div className="flex items-center justify-between pointer-events-auto bg-black/40 backdrop-blur-sm p-1.5 rounded-xl w-full border border-white/5">
                          <button
                            onClick={(e) => { e.stopPropagation(); setIsMuted(!isMuted); }}
                            className="p-1 rounded-lg text-white/90 hover:text-white hover:bg-white/20 transition cursor-pointer"
                            aria-label={isMuted ? "Unmute" : "Mute"}
                          >
                            {isMuted ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); setIsPlaying(!isPlaying); }}
                            className="p-1 rounded-lg text-white/90 hover:text-white hover:bg-white/20 transition cursor-pointer"
                            aria-label={isPlaying ? "Pause" : "Play"}
                          >
                            {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleNext(); }}
                            className="p-1 rounded-lg text-white/90 hover:text-white hover:bg-white/20 transition cursor-pointer"
                            aria-label="Next video"
                          >
                            <SkipForward className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Video Specs Dashboard */}
          <div className="grid grid-cols-3 gap-2 my-2 w-full text-center">
            <div className="rounded-lg bg-zinc-100 dark:bg-zinc-800/80 p-1.5 flex flex-col justify-center">
              <span className="text-[7px] font-mono text-zinc-400 dark:text-zinc-500 uppercase">Resolution</span>
              <span className="text-[10px] font-bold text-zinc-800 dark:text-zinc-200">4K Ultra HD</span>
            </div>
            <div className="rounded-lg bg-zinc-100 dark:bg-zinc-800/80 p-1.5 flex flex-col justify-center">
              <span className="text-[7px] font-mono text-zinc-400 dark:text-zinc-500 uppercase">Frame Rate</span>
              <span className="text-[10px] font-bold text-zinc-800 dark:text-zinc-200">60 FPS</span>
            </div>
            <div className="rounded-lg bg-zinc-100 dark:bg-zinc-800/80 p-1.5 flex flex-col justify-center">
              <span className="text-[7px] font-mono text-zinc-400 dark:text-zinc-500 uppercase">Tools Used</span>
              <span className="text-[10px] font-bold text-purple-500">Pr / Ae / AI</span>
            </div>
          </div>

          <div className="text-[10px] font-mono text-zinc-400 dark:text-zinc-550 flex justify-between items-center w-full mt-1 border-t border-zinc-100 dark:border-zinc-800/80 pt-2">
            <span>Render Codec: H.264</span>
            <span className="font-semibold text-purple-500 truncate max-w-[150px]" title={playlist[currentIndex].title}>
              &bull; {playlist[currentIndex].title}
            </span>
          </div>
        </div>

        {/* Card 3: Automations & AI Products (Spans 1 col) */}
        <div className="p-7 rounded-[24px] bento-card dark:bento-card-dark flex flex-col justify-between h-72">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-amber-500">
                <Cpu className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                Automations & AI
              </h3>
            </div>
            <p className="text-xs text-zinc-450 dark:text-zinc-500 leading-relaxed font-normal">
              Custom OpenAI API summaries, pipeline automations, and natural speech client voice agents.
            </p>
          </div>

          {/* Simulated Code Mockup */}
          <div className="p-3 rounded-lg bg-zinc-900 text-zinc-300 font-mono text-[9px] space-y-1 text-left">
            <p className="text-zinc-500">// Initialize Agent</p>
            <p className="text-blue-400">const<span className="text-white"> agent = </span>new<span className="text-amber-500"> VoiceAgent</span>();</p>
            <p className="text-white">agent.setLanguage(<span className="text-emerald-400">"en-US"</span>);</p>
            <p className="text-purple-400">await<span className="text-white"> agent.mount();</span></p>
          </div>
        </div>

        {/* Card 4: Digital Marketing (Spans 1 col) */}
        <div className="p-7 rounded-[24px] bento-card dark:bento-card-dark flex flex-col justify-between h-72">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-emerald-500">
                <Target className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                Digital Marketing
              </h3>
            </div>
            <p className="text-xs text-zinc-450 dark:text-zinc-500 leading-relaxed font-normal">
              Paid Google and Meta campaigns designed to scale budgets with A/B creative testing.
            </p>
          </div>

          {/* Live Campaign Dashboard */}
          <LiveCampaignDashboard />
        </div>

      </div>

      {/* Video Lightbox Modal */}
      {typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          {isVideoModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[150] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center pointer-events-auto select-none p-4"
              onClick={() => {
                setIsVideoModalOpen(false);
                setIsPlaying(true); // Resume background video when modal closes
              }}
            >
              {/* Close Button top-right */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsVideoModalOpen(false);
                  setIsPlaying(true);
                }}
                className="absolute top-6 right-6 p-3 rounded-xl bg-white/10 text-white/80 hover:bg-white/20 transition cursor-pointer z-50 shadow-md border border-white/5"
                aria-label="Close Lightbox"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Navigation Controls on sides for desktop */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setDirection(-1);
                  setCurrentIndex((prev) => (prev - 1 + playlist.length) % playlist.length);
                }}
                className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/5 hover:bg-white/10 text-white/80 transition cursor-pointer z-50 hidden sm:flex border border-white/5 shadow-md"
                aria-label="Previous video"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setDirection(1);
                  setCurrentIndex((prev) => (prev + 1) % playlist.length);
                }}
                className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/5 hover:bg-white/10 text-white/80 transition cursor-pointer z-50 hidden sm:flex border border-white/5 shadow-md"
                aria-label="Next video"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Main Video Card Container */}
              <div
                className="relative max-w-full w-[310px] sm:w-[350px] aspect-[9/16] flex items-center justify-center bg-black rounded-[32px] border-4 border-zinc-800/80 shadow-2xl overflow-hidden mt-6"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Embed YouTube Video with controls enabled and unmuted autoplay */}
                <iframe
                  src={`https://www.youtube.com/embed/${playlist[currentIndex].id}?autoplay=1&mute=0&controls=1&loop=1&playlist=${playlist[currentIndex].id}&playsinline=1&rel=0&modestbranding=1&iv_load_policy=3&enablejsapi=1`}
                  title={playlist[currentIndex].title}
                  allow="autoplay; encrypted-media; picture-in-picture"
                  allowFullScreen={true}
                  className="w-full h-full border-0 absolute inset-0"
                />
              </div>

              {/* Bottom Info & Navigation panel */}
              <div 
                className="mt-6 flex flex-col items-center gap-3 text-center px-4 max-w-md"
                onClick={(e) => e.stopPropagation()}
              >
                <div>
                  <h3 className="text-sm font-black bg-gradient-to-r from-purple-400 via-pink-400 to-rose-350 bg-clip-text text-transparent uppercase tracking-wider">
                    {playlist[currentIndex].title}
                  </h3>
                  <p className="text-[11px] text-zinc-405 font-mono mt-1">
                    {reelMeta.author ? `Client Campaign — ${reelMeta.author}` : "Video Deliverable"}
                  </p>
                </div>

                {/* Mobile Navigation arrows */}
                <div className="flex items-center gap-6 mt-1 sm:hidden">
                  <button
                    onClick={() => {
                      setDirection(-1);
                      setCurrentIndex((prev) => (prev - 1 + playlist.length) % playlist.length);
                    }}
                    className="p-2.5 rounded-full bg-zinc-900 border border-zinc-800 text-white hover:bg-zinc-800 transition"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                    {currentIndex + 1} / {playlist.length}
                  </span>
                  <button
                    onClick={() => {
                      setDirection(1);
                      setCurrentIndex((prev) => (prev + 1) % playlist.length);
                    }}
                    className="p-2.5 rounded-full bg-zinc-900 border border-zinc-800 text-white hover:bg-zinc-800 transition"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* Graphic Design Gallery Overlay */}
      {typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          {isGalleryOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] overflow-y-auto bg-zinc-50 dark:bg-zinc-950 flex flex-col pointer-events-auto select-text"
            >
            {/* Sticky Header */}
            <div className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-200/50 dark:border-zinc-900">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsGalleryOpen(false)}
                  className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-600 dark:text-zinc-405 transition cursor-pointer"
                  aria-label="Back to home"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div>
                  <h1 className="text-sm sm:text-base font-extrabold text-zinc-900 dark:text-white flex items-center gap-2">
                    Graphic Design Portfolio
                  </h1>
                  <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-mono">
                    {shuffledUnique.length} Project Pieces
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsGalleryOpen(false)}
                className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-900 text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition cursor-pointer"
                aria-label="Close Gallery"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Gallery Content Masonry Grid */}
            <div className="flex-1 overflow-y-auto px-6 pt-2 pb-8">
              <div className="max-w-7xl mx-auto columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
                {shuffledUnique.map((src, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.02 }}
                    onClick={() => setActiveImageIndex(index)}
                    className="break-inside-avoid rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border border-zinc-200/50 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 relative group"
                  >
                    <img
                      src={src}
                      alt={`Graphic design work ${index + 1}`}
                      className="w-full object-cover rounded-2xl group-hover:scale-[1.02] transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <span className="text-white text-xs font-semibold px-3 py-1.5 bg-black/40 backdrop-blur-md rounded-full border border-white/10 flex items-center gap-1">
                        <Maximize2 className="w-3 h-3" /> View Zoom
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Zoom Lightbox Modal */}
            <AnimatePresence>
              {activeImageIndex !== null && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center pointer-events-auto select-none"
                  onClick={() => setActiveImageIndex(null)}
                >
                  {/* Close Button top-right */}
                  <button
                    onClick={(e) => { e.stopPropagation(); setActiveImageIndex(null); }}
                    className="absolute top-6 right-6 p-2 rounded-xl bg-white/10 text-white/80 hover:bg-white/20 transition cursor-pointer z-50"
                    aria-label="Close Lightbox"
                  >
                    <X className="w-6 h-6" />
                  </button>

                  {/* Prev Button */}
                  <button
                    onClick={(e) => { e.stopPropagation(); setActiveImageIndex((prev) => (prev - 1 + shuffledUnique.length) % shuffledUnique.length); }}
                    className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/5 hover:bg-white/10 text-white/80 transition cursor-pointer z-50"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>

                  {/* Displaying Image Container */}
                  <div 
                    className="relative max-w-[85vw] max-h-[80vh] sm:max-h-[85vh] flex items-center justify-center p-2 select-text"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <motion.img
                      key={activeImageIndex}
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.95, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      src={shuffledUnique[activeImageIndex]}
                      alt={`Zoomed graphic design ${activeImageIndex + 1}`}
                      className="max-w-full max-h-[80vh] sm:max-h-[85vh] object-contain rounded-xl shadow-2xl border border-white/5"
                    />
                  </div>

                  {/* Next Button */}
                  <button
                    onClick={(e) => { e.stopPropagation(); setActiveImageIndex((prev) => (prev + 1) % shuffledUnique.length); }}
                    className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/5 hover:bg-white/10 text-white/80 transition cursor-pointer z-50"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>

                  {/* Bottom footer pagination */}
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center text-white/60 text-xs font-mono z-50">
                    {activeImageIndex + 1} / {shuffledUnique.length}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>,
      document.body
    )}
    </section>
  );
}
