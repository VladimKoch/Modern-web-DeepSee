"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { translations } from "./translations";

export default function DeepSeaExperience() {
  // --- UI & Modal States ---
  const [activeTab, setActiveTab] = useState<"01" | "02" | "03">("01");
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [liveModalOpen, setLiveModalOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState<"CZ" | "EN">("CZ");
  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const [joinedSuccess, setJoinedSuccess] = useState(false);
  const [advocateCount, setAdvocateCount] = useState(14500);
  const [waveOffset, setWaveOffset] = useState(0);

  // --- Below-the-fold Ocean Zone State ---
  const [activeZone, setActiveZone] = useState<"sunlight" | "twilight" | "midnight">("sunlight");
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);

  // --- Scroll & Canvas Frame Engine States ---
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentDepth, setCurrentDepth] = useState(0);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const pinnedWrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const framesRef = useRef<HTMLImageElement[]>([]);
  const lastDrawnFrameRef = useRef<number>(-1);

  // Selected translation dictionary (CZ or EN)
  const t = translations[currentLang] || translations.CZ;

  // Persist language preference in localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("deepsea_lang") as "CZ" | "EN" | null;
      if (saved && (saved === "CZ" || saved === "EN")) {
        setCurrentLang(saved);
      }
    }
  }, []);

  const handleLanguageChange = (lang: "CZ" | "EN") => {
    setCurrentLang(lang);
    setLangDropdownOpen(false);
    if (typeof window !== "undefined") {
      localStorage.setItem("deepsea_lang", lang);
    }
  };

  // Ambient wave visualizer animation loop
  useEffect(() => {
    const interval = setInterval(() => {
      setWaveOffset((prev) => (prev + 1) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // --- Register GSAP & Lenis Smooth Scroll Engine ---
  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      smoothWheel: true,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const updateTicker = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateTicker);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(updateTicker);
      lenis.destroy();
    };
  }, []);

  // --- High-Performance 300-Frame Canvas Scrubbing Engine ---
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = scrollContainerRef.current;
    const pinned = pinnedWrapperRef.current;
    if (!canvas || !container || !pinned) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    // Set internal render resolution (16:9 HD canvas)
    canvas.width = 1280;
    canvas.height = 720;

    const totalFrames = 300;
    const images: HTMLImageElement[] = [];

    const drawFrame = (index: number) => {
      const img = images[index];
      if (img && img.complete && img.naturalWidth > 0) {
        ctx.drawImage(img, 0, 0, 1280, 720);
        lastDrawnFrameRef.current = index;
        return true;
      }
      return false;
    };

    // Load first frame immediately to display instantly with zero delay
    const firstImg = new window.Image();
    firstImg.src = "/video/frames/frame_0001.webp";
    firstImg.onload = () => {
      if (lastDrawnFrameRef.current === -1) {
        ctx.drawImage(firstImg, 0, 0, 1280, 720);
        lastDrawnFrameRef.current = 0;
      }
    };
    images[0] = firstImg;

    // Preload all 300 frames into memory array
    for (let i = 1; i < totalFrames; i++) {
      const img = new window.Image();
      const frameNum = String(i + 1).padStart(4, "0");
      img.src = `/video/frames/frame_${frameNum}.webp`;
      images[i] = img;
    }
    framesRef.current = images;

    let currentFrameIndex = 0;
    let targetFrameIndex = 0;
    let rafId: number;

    const render = () => {
      // Smooth lerp to target frame for 60/120fps fluid playback
      if (Math.abs(targetFrameIndex - currentFrameIndex) > 0.4) {
        currentFrameIndex += (targetFrameIndex - currentFrameIndex) * 0.35;
      } else {
        currentFrameIndex = targetFrameIndex;
      }

      const drawIdx = Math.min(totalFrames - 1, Math.max(0, Math.round(currentFrameIndex)));

      // If frame ready, draw it; otherwise fallback to nearest loaded frame
      if (!drawFrame(drawIdx)) {
        for (let offset = 1; offset < 25; offset++) {
          if (drawIdx - offset >= 0 && drawFrame(drawIdx - offset)) break;
          if (drawIdx + offset < totalFrames && drawFrame(drawIdx + offset)) break;
        }
      }

      rafId = requestAnimationFrame(render);
    };
    rafId = requestAnimationFrame(render);

    // GSAP ScrollTrigger attached to 500vh container with pinned viewport
    const st = ScrollTrigger.create({
      trigger: container,
      pin: pinned,
      start: "top top",
      end: "bottom bottom",
      pinSpacing: false,
      scrub: 0.5,
      onUpdate: (self) => {
        const p = self.progress; // 0.0 to 1.0
        setScrollProgress(p);
        targetFrameIndex = p * (totalFrames - 1);

        // Dynamic depth progression based on acts:
        let depth = 0;
        if (p > 0.18) {
          if (p <= 0.29) {
            depth = ((p - 0.18) / (0.29 - 0.18)) * 15;
          } else if (p <= 0.61) {
            depth = 15 + ((p - 0.29) / (0.61 - 0.29)) * 45;
          } else {
            depth = 60 + ((p - 0.61) / (1.0 - 0.61)) * 60;
          }
        }
        setCurrentDepth(Math.round(depth * 10) / 10);
      },
    });

    return () => {
      cancelAnimationFrame(rafId);
      st.kill();
    };
  }, []);

  const languages = [
    { code: "CZ" as const, name: "Čeština" },
    { code: "EN" as const, name: "English" },
  ];

  // =========================================================================
  // ACT TIMINGS & ANIMATION STYLES
  // =========================================================================

  // --- ACT I: 0% – 18% Scroll | Existing Hero Exit ---
  let act1Opacity = 1;
  let act1TranslateY = 0;
  let act1TranslateLeft = 0;
  let act1TranslateRight = 0;
  let act1Scale = 1;
  let act1Blur = 0;

  if (scrollProgress > 0.04) {
    if (scrollProgress >= 0.17) {
      act1Opacity = 0;
      act1Scale = 0.96;
      act1Blur = 8;
    } else {
      const f = (scrollProgress - 0.04) / (0.17 - 0.04);
      act1Opacity = Math.max(0, 1 - f);
      act1TranslateY = -f * 50;
      act1TranslateLeft = -f * 45;
      act1TranslateRight = f * 45;
      act1Scale = 1 - f * 0.04;
      act1Blur = f * 8;
    }
  }

  // Scroll to dive cue: fades out by 10%
  const scrollCueOpacity =
    scrollProgress <= 0.02
      ? 1
      : scrollProgress >= 0.1
      ? 0
      : 1 - (scrollProgress - 0.02) / (0.1 - 0.02);

  // --- ACT II & BEYOND: Depth Gauge Micro-UI (18% – 100%) ---
  const depthGaugeOpacity =
    scrollProgress < 0.18
      ? 0
      : scrollProgress < 0.23
      ? (scrollProgress - 0.18) / (0.23 - 0.18)
      : 1;

  // --- ACT III: 29% – 61% Scroll | Sunlit Seabed Glide ---
  let act3LeftOpacity = 0;
  let act3LeftY = 32;
  let act3LeftBlur = 8;
  let act3RightOpacity = 0;
  let act3RightY = 32;
  let act3RightTilt = 1.5;

  if (scrollProgress >= 0.32 && scrollProgress <= 0.58) {
    if (scrollProgress < 0.38) {
      const f = (scrollProgress - 0.32) / (0.38 - 0.32);
      act3LeftOpacity = f;
      act3LeftY = (1 - f) * 32;
      act3LeftBlur = (1 - f) * 8;
    } else if (scrollProgress > 0.52) {
      const f = (scrollProgress - 0.52) / (0.58 - 0.52);
      act3LeftOpacity = Math.max(0, 1 - f);
      act3LeftY = -f * 25;
      act3LeftBlur = f * 6;
    } else {
      act3LeftOpacity = 1;
      act3LeftY = 0;
      act3LeftBlur = 0;
    }
  }

  if (scrollProgress >= 0.36 && scrollProgress <= 0.6) {
    if (scrollProgress < 0.42) {
      const f = (scrollProgress - 0.36) / (0.42 - 0.36);
      act3RightOpacity = f;
      act3RightY = (1 - f) * 32;
      act3RightTilt = (1 - f) * 1.5;
    } else if (scrollProgress > 0.54) {
      const f = (scrollProgress - 0.54) / (0.6 - 0.54);
      act3RightOpacity = Math.max(0, 1 - f);
      act3RightY = -f * 25;
      act3RightTilt = 0;
    } else {
      act3RightOpacity = 1;
      act3RightY = 0;
      act3RightTilt = 0;
    }
  }

  // --- ACT IV: 61% – 100% Scroll | Sunken Heritage & Reef ---
  let act4Opacity = 0;
  let act4Y = 40;

  if (scrollProgress >= 0.68) {
    if (scrollProgress < 0.76) {
      const f = (scrollProgress - 0.68) / (0.76 - 0.68);
      act4Opacity = f;
      act4Y = (1 - f) * 40;
    } else if (scrollProgress > 0.96) {
      const f = (scrollProgress - 0.96) / (1.0 - 0.96);
      act4Opacity = Math.max(0, 1 - f);
      act4Y = -f * 15;
    } else {
      act4Opacity = 1;
      act4Y = 0;
    }
  }

  // Adaptive header glass deepening underwater
  const isUnderwater = scrollProgress >= 0.18;

  return (
    <div className="relative min-h-screen w-full bg-[#03131E] text-white selection:bg-cyan-500 selection:text-white font-sans">
      {/* =====================================================================
          PERSISTENT FIXED FLOATING TOP PILL NAVBAR (z-50)
      ===================================================================== */}
      <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 transition-all duration-300">
        <div className="max-w-7xl mx-auto">
          <nav
            className={`w-full rounded-full px-4 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between transition-all duration-500 shadow-2xl ${
              isUnderwater
                ? "bg-[#072436]/65 border border-cyan-400/30 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,10,30,0.5)]"
                : "glass-panel"
            }`}
          >
            {/* Left: Brand Identity (Stays DEEP SEA in English) */}
            <a
              href="#"
              className="flex items-center gap-3 group focus:outline-none"
              aria-label="DEEP SEA Home"
            >
              <div
                className="w-10 h-10 rounded-full bg-white/20 border border-white/40 flex items-center justify-center shadow-inner group-hover:scale-105 group-hover:bg-white/30 transition-all duration-300 shrink-0"
                style={{ width: "40px", height: "40px", minWidth: "40px", minHeight: "40px" }}
              >
                <svg
                  width="24"
                  height="24"
                  className="w-6 h-6 text-white drop-shadow transition-transform duration-500 group-hover:rotate-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M2 13c2.5-3 5-3 7.5 0 2.5 3 5 3 7.5 0 2-2.5 3.5-2.5 5 0" />
                  <path d="M2 17c2.5-3 5-3 7.5 0 2.5 3 5 3 7.5 0 2-2.5 3.5-2.5 5 0" />
                  <path d="M2 9c2.5-3 5-3 7.5 0 2.5 3 5 3 7.5 0 2-2.5 3.5-2.5 5 0" />
                </svg>
              </div>
              <span className="font-extrabold text-lg sm:text-xl tracking-[0.16em] uppercase text-white drop-shadow-sm group-hover:text-cyan-200 transition-colors">
                DEEP SEA
              </span>
            </a>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-1 lg:gap-2">
              {t.nav.links.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="px-4 py-1.5 rounded-full text-sm font-medium text-white/90 hover:text-white hover:bg-white/20 backdrop-blur-sm transition-all duration-200 active:scale-95"
                >
                  {item.name}
                </a>
              ))}
            </div>

            {/* Right Actions: Search, Lang, Join Button */}
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Search Button */}
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="p-2 rounded-full text-white/90 hover:text-white hover:bg-white/20 transition-all duration-200 active:scale-90"
                aria-label={t.nav.searchAria}
                title={t.nav.searchTitle}
              >
                <svg
                  width="20"
                  height="20"
                  className="w-5 h-5 drop-shadow-sm"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="7" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </button>

              {/* Language Selector */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-semibold tracking-wider text-white/90 hover:text-white hover:bg-white/20 transition-all duration-200"
                >
                  <span>{currentLang}</span>
                  <svg
                    width="14"
                    height="14"
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      langDropdownOpen ? "rotate-180" : ""
                    }`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {langDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-32 py-1.5 glass-panel rounded-2xl shadow-2xl border border-white/30 z-50">
                    {languages.map((l) => (
                      <button
                        key={l.code}
                        type="button"
                        onClick={() => handleLanguageChange(l.code)}
                        className={`w-full text-left px-4 py-1.5 text-xs font-medium flex items-center justify-between hover:bg-white/25 transition-colors ${
                          currentLang === l.code
                            ? "text-cyan-300 font-bold"
                            : "text-white/85"
                        }`}
                      >
                        <span>{l.name}</span>
                        {currentLang === l.code && <span>✓</span>}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Join Mission Button */}
              <button
                type="button"
                onClick={() => setJoinModalOpen(true)}
                className="relative group overflow-hidden px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-semibold tracking-wide text-white bg-white/20 hover:bg-white/30 border border-white/40 shadow-[0_4px_16px_rgba(255,255,255,0.15)] hover:shadow-[0_6px_24px_rgba(255,255,255,0.3)] transition-all duration-300 active:scale-95"
              >
                <span className="relative z-10">{t.nav.joinButton}</span>
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/35 to-transparent pointer-events-none" />
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* =====================================================================
          500vh SCROLL CONTAINER WITH HARDWARE-ACCELERATED CANVAS FRAME ENGINE
      ===================================================================== */}
      <div ref={scrollContainerRef} className="relative h-[500vh] w-full">
        {/* Sticky Pinned Viewport (100vw x 100vh) */}
        <div ref={pinnedWrapperRef} className="sticky top-0 h-screen w-full overflow-hidden">
          {/* Hardware-accelerated Canvas Frame Sequence (300 frames, instant scrubbing) */}
          <div className="absolute inset-0 w-full h-full z-0 bg-[#020b18]">
            <canvas
              ref={canvasRef}
              className="absolute inset-0 h-full w-full object-cover z-0 pointer-events-none"
            />

            {/* Adaptive atmospheric lighting & underwater tint */}
            <div
              className="absolute inset-0 pointer-events-none transition-opacity duration-1000"
              style={{
                background: isUnderwater
                  ? "radial-gradient(ellipse at center, rgba(0, 119, 145, 0.18) 0%, rgba(3, 19, 30, 0.5) 100%)"
                  : "linear-gradient(180deg, rgba(3, 13, 26, 0.18) 0%, transparent 40%, rgba(3, 19, 30, 0.35) 100%)",
              }}
            />

            {/* Seamless Bottom Edge Gradient Blend */}
            <div className="absolute bottom-0 left-0 right-0 h-36 bg-gradient-to-t from-[#03131E] via-[#03131E]/40 to-transparent pointer-events-none z-10" />
          </div>

          {/* ===================================================================
              DEPTH GAUGE MICRO-UI (Act II – Act IV)
          =================================================================== */}
          <div
            className="fixed right-3 sm:right-6 top-1/2 -translate-y-1/2 z-40 pointer-events-none transition-opacity duration-500"
            style={{ opacity: depthGaugeOpacity }}
          >
            <div className="glass-panel-subsurface rounded-2xl px-3 py-4 flex flex-col items-center gap-2 border border-cyan-400/30 shadow-2xl backdrop-blur-xl">
              <span className="text-[9px] font-mono font-bold tracking-widest text-cyan-300 uppercase">
                {t.depthGauge.label}
              </span>
              <div className="text-sm sm:text-base font-black font-mono text-white tracking-tight">
                -{currentDepth.toFixed(0)}m
              </div>

              {/* Depth Ladder Bar */}
              <div className="relative w-1.5 h-32 sm:h-40 bg-slate-800/80 rounded-full overflow-hidden my-1">
                <div
                  className="w-full bg-gradient-to-b from-cyan-400 via-sky-400 to-amber-400 rounded-full transition-all duration-150"
                  style={{
                    height: `${Math.min(100, (currentDepth / 120) * 100)}%`,
                  }}
                />
              </div>

              {/* Micro Status Badges */}
              <div className="flex flex-col items-center gap-1 text-[8px] font-mono text-cyan-200/80">
                <span className="px-1.5 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/30">
                  {currentDepth < 60 ? t.depthGauge.euphotic : t.depthGauge.mesopelagic}
                </span>
                <span className="text-white/60">
                  {currentDepth < 60 ? "24,6 °C" : "19,8 °C"}
                </span>
              </div>
            </div>
          </div>

          {/* ===================================================================
              ACT I: HERO SECTION (Dynamic Language, DEEP SEA title in English)
          =================================================================== */}
          <div
            className="relative z-20 w-full h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-between pt-24 pb-8"
            style={{
              opacity: act1Opacity,
              transform: `scale(${act1Scale})`,
              filter: `blur(${act1Blur}px)`,
              pointerEvents: act1Opacity > 0.05 ? "auto" : "none",
              visibility: act1Opacity > 0 ? "visible" : "hidden",
            }}
          >
            {/* Center Area */}
            <div className="flex-1 flex flex-col justify-center">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
                {/* Left Column */}
                <div
                  className="lg:col-span-7 flex flex-col items-start space-y-6 sm:space-y-7 transition-transform duration-300"
                  style={{
                    transform: `translate(${act1TranslateLeft}px, ${act1TranslateY}px)`,
                  }}
                >
                  {/* Tag Badge */}
                  <div
                    onClick={() => alert(t.hero.tagAlert)}
                    className="glass-panel glass-panel-hover rounded-full px-4 py-1.5 inline-flex items-center gap-2.5 text-xs font-bold tracking-widest uppercase text-white/95 cursor-pointer shadow-sm group"
                  >
                    <svg
                      width="16"
                      height="16"
                      className="w-4 h-4 text-cyan-200 group-hover:rotate-12 transition-transform duration-300"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                      <path d="M2 12h20" />
                    </svg>
                    <span>{t.hero.tag}</span>
                  </div>

                  {/* Main Title - Stays DEEP SEA in English */}
                  <div className="space-y-2">
                    <h1 className="text-6xl sm:text-7xl lg:text-8xl xl:text-9xl font-black tracking-tight text-white drop-shadow-[0_8px_32px_rgba(0,10,30,0.35)] leading-none">
                      {t.hero.title}
                    </h1>
                    {/* Tagline */}
                    <p className="text-sm sm:text-base lg:text-lg font-bold tracking-[0.2em] uppercase text-white drop-shadow-sm pt-1">
                      {t.hero.tagline}
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-sm sm:text-base lg:text-lg text-white/90 max-w-xl font-normal leading-relaxed drop-shadow-md">
                    {t.hero.description}
                  </p>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap items-center gap-4 pt-2">
                    {/* Primary Button */}
                    <button
                      type="button"
                      onClick={() => {
                        const el = document.getElementById("expeditions-grid");
                        el?.scrollIntoView({ behavior: "smooth" });
                      }}
                      className="relative group overflow-hidden px-7 py-3.5 rounded-full font-semibold text-sm sm:text-base text-white bg-gradient-to-r from-[#1788d4] via-[#1478c4] to-[#1062b0] border border-cyan-300/40 shadow-[0_8px_25px_rgba(16,98,176,0.45)] hover:shadow-[0_12px_35px_rgba(23,136,212,0.65)] hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2.5"
                    >
                      <span className="relative z-10">{t.hero.exploreBtn}</span>
                      <svg
                        width="16"
                        height="16"
                        className="w-4 h-4 relative z-10 group-hover:translate-x-1.5 transition-transform duration-200"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />
                    </button>

                    {/* Secondary Button */}
                    <button
                      type="button"
                      onClick={() => setVideoModalOpen(true)}
                      className="glass-panel glass-panel-hover px-6 py-3.5 rounded-full font-medium text-sm sm:text-base text-white flex items-center gap-2.5 active:scale-95 shadow-lg group cursor-pointer"
                    >
                      <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs group-hover:bg-white/40 transition-colors">
                        ▶
                      </span>
                      <span>{t.hero.watchBtn}</span>
                    </button>
                  </div>

                  {/* Social Proof & Rating Row */}
                  <div className="flex items-center gap-3 pt-2">
                    <div className="flex -space-x-2.5 items-center shrink-0">
                      {[
                        { id: 1, name: "Sarah Jenkins", src: "/avatar_1.jpg" },
                        { id: 2, name: "Leo Vance", src: "/avatar_2.jpg" },
                        { id: 3, name: "Elena Rostova", src: "/avatar_3.jpg" },
                        { id: 4, name: "Marcus Brody", src: "/avatar_4.jpg" },
                      ].map((advocate) => (
                        <div
                          key={advocate.id}
                          title={advocate.name}
                          className="w-10 h-10 rounded-full ring-2 ring-white/70 overflow-hidden shadow-md shrink-0 bg-slate-800 hover:scale-110 hover:z-20 transition-transform duration-200 cursor-pointer"
                          style={{ width: "40px", height: "40px", minWidth: "40px", minHeight: "40px" }}
                        >
                          <Image
                            src={advocate.src}
                            alt={advocate.name}
                            width={40}
                            height={40}
                            className="w-10 h-10 rounded-full object-cover"
                            style={{ width: "40px", height: "40px" }}
                          />
                        </div>
                      ))}
                    </div>

                    <p className="text-xs sm:text-sm text-white/90 font-medium drop-shadow-sm">
                      {t.hero.socialProofPrefix}{" "}
                      <span className="font-bold text-white">
                        {advocateCount.toLocaleString()}+
                      </span>{" "}
                      {t.hero.socialProofSuffix} •{" "}
                      <span className="inline-flex items-center gap-1 font-semibold text-white">
                        {t.hero.ratingLabel}
                        <span className="text-amber-300">★</span>
                      </span>
                    </p>
                  </div>
                </div>

                {/* Right Column: Floating Glass Cards */}
                <div
                  id="mission-card"
                  className="lg:col-span-5 flex flex-col items-center lg:items-end space-y-5 transition-transform duration-300"
                  style={{
                    transform: `translate(${act1TranslateRight}px, ${act1TranslateY}px)`,
                  }}
                >
                  {/* Card 1: CURRENT EXPEDITION */}
                  <div className="glass-panel glass-panel-hover rounded-3xl p-6 w-full max-w-sm sm:max-w-md shadow-[0_16px_40px_rgba(0,10,35,0.25)] relative overflow-hidden group">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold tracking-[0.16em] uppercase text-white/70">
                        {t.hero.currentExpeditionTag}
                      </span>
                      <div
                        className="flex items-center gap-1.5 cursor-pointer"
                        onClick={() => setLiveModalOpen(true)}
                        title={t.hero.liveActiveTitle}
                      >
                        <span className="relative flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-300 shadow-[0_0_10px_#22d3ee]" />
                        </span>
                      </div>
                    </div>

                    <div className="mt-2">
                      <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight group-hover:text-cyan-200 transition-colors">
                        {t.hero.currentExpeditionTitle}
                      </h3>
                      <p className="text-xs sm:text-sm text-white/80 font-medium mt-1">
                        {t.hero.currentExpeditionMeta}
                      </p>
                    </div>

                    {/* Dynamic Wave Visualizer Graphic */}
                    <div className="relative mt-5 pt-2 pb-1 overflow-hidden rounded-xl">
                      <svg
                        width="100%"
                        height="80"
                        className="w-full h-16 sm:h-20"
                        style={{ maxHeight: "80px" }}
                        viewBox="0 0 320 80"
                        fill="none"
                        preserveAspectRatio="none"
                      >
                        <defs>
                          <linearGradient id="waveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="rgba(56, 189, 248, 0.45)" />
                            <stop offset="100%" stopColor="rgba(14, 165, 233, 0.05)" />
                          </linearGradient>
                          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#38bdf8" />
                            <stop offset="50%" stopColor="#67e8f9" />
                            <stop offset="100%" stopColor="#a5f3fc" />
                          </linearGradient>
                        </defs>
                        <path
                          d={`M 0 50 Q 80 ${
                            40 + Math.sin(waveOffset * 0.05) * 8
                          }, 160 ${45 - Math.sin(waveOffset * 0.05) * 6} T 320 ${
                            35 + Math.sin(waveOffset * 0.05) * 8
                          } L 320 80 L 0 80 Z`}
                          fill="url(#waveGradient)"
                        />
                        <path
                          d={`M 0 50 Q 80 ${
                            40 + Math.sin(waveOffset * 0.05) * 8
                          }, 160 ${45 - Math.sin(waveOffset * 0.05) * 6} T 320 ${
                            35 + Math.sin(waveOffset * 0.05) * 8
                          }`}
                          stroke="url(#lineGradient)"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          filter="drop-shadow(0 0 6px rgba(56, 189, 248, 0.8))"
                        />
                      </svg>
                      <div className="absolute top-1 right-2 text-[10px] uppercase font-bold tracking-wider text-cyan-200/90 bg-sky-950/40 px-2 py-0.5 rounded-md border border-cyan-400/30">
                        {t.hero.sonarActive}
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-end">
                      <button
                        type="button"
                        onClick={() => setLiveModalOpen(true)}
                        className="text-xs sm:text-sm font-semibold text-white/95 hover:text-cyan-200 flex items-center gap-1.5 transition-colors group/btn py-1"
                      >
                        <span>{t.hero.watchLive}</span>
                        <svg
                          width="14"
                          height="14"
                          className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                        >
                          <polyline points="9 18 15 12 9 6" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Card 2: Stats Metric Card */}
                  <div className="glass-panel glass-panel-hover rounded-3xl p-5 w-full max-w-sm sm:max-w-md shadow-[0_16px_40px_rgba(0,10,35,0.25)] flex items-center justify-between px-6 sm:px-8">
                    <div className="flex flex-col">
                      <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight drop-shadow-sm">
                        {t.hero.metric1Value}
                      </span>
                      <span className="text-xs sm:text-sm text-white/80 font-medium leading-tight mt-0.5 max-w-[120px]">
                        {t.hero.metric1Label}
                      </span>
                    </div>
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-300 shadow-[0_0_8px_#67e8f9]" />
                    <div className="flex flex-col">
                      <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight drop-shadow-sm">
                        {t.hero.metric2Value}
                      </span>
                      <span className="text-xs sm:text-sm text-white/80 font-medium leading-tight mt-0.5 max-w-[100px]">
                        {t.hero.metric2Label}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Navigation & Scroll Indicator */}
            <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <div className="flex items-center gap-3 sm:gap-6 text-xs font-bold tracking-widest uppercase text-white/80">
                {t.hero.tabs.map((tab, idx, arr) => (
                  <div key={tab.id} className="flex items-center gap-3 sm:gap-6">
                    <button
                      type="button"
                      onClick={() => setActiveTab(tab.id as "01" | "02" | "03")}
                      className={`relative py-1 transition-all duration-300 group cursor-pointer ${
                        activeTab === tab.id
                          ? "text-white font-extrabold"
                          : "text-white/70 hover:text-white"
                      }`}
                    >
                      <span>
                        {tab.id} / {tab.label}
                      </span>
                      {activeTab === tab.id && (
                        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400 rounded-full shadow-[0_0_8px_#22d3ee]" />
                      )}
                    </button>
                    {idx < arr.length - 1 && (
                      <span className="text-white/40 select-none">•</span>
                    )}
                  </div>
                ))}
              </div>

              {/* Scroll To Dive Indicator */}
              <div
                className="flex flex-col items-center gap-1 text-[11px] font-bold tracking-[0.2em] uppercase text-white/85 transition-opacity duration-300"
                style={{ opacity: scrollCueOpacity }}
              >
                <span>{t.hero.scrollCue}</span>
                <svg
                  width="16"
                  height="16"
                  className="w-4 h-4 text-cyan-300 animate-bounce"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
            </div>
          </div>

          {/* ===================================================================
              ACT III: SUNLIT SEABED GLIDE (Dynamic Language)
          =================================================================== */}
          <div
            className="absolute inset-0 z-25 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between pointer-events-none"
            style={{
              visibility: act3LeftOpacity > 0 || act3RightOpacity > 0 ? "visible" : "hidden",
            }}
          >
            {/* Left Narrative */}
            <div
              className="max-w-xl space-y-4 pointer-events-auto transition-all duration-300"
              style={{
                opacity: act3LeftOpacity,
                transform: `translateY(${act3LeftY}px)`,
                filter: `blur(${act3LeftBlur}px)`,
              }}
            >
              <div className="glass-panel-subsurface inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase text-cyan-300 border border-cyan-400/30">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                {t.act3.badge}
              </div>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-none drop-shadow-[0_8px_24px_rgba(0,10,30,0.5)]">
                {t.act3.headline}
              </h2>
              <p className="text-base sm:text-lg text-white/90 leading-relaxed font-normal drop-shadow-md">
                {t.act3.copy}
              </p>
            </div>

            {/* Right Telemetry Modules */}
            <div
              className="hidden lg:flex flex-col space-y-4 max-w-sm pointer-events-auto"
              style={{
                opacity: act3RightOpacity,
                transform: `translateY(${act3RightY}px) rotate(${act3RightTilt}deg)`,
              }}
            >
              {/* Module 1: Acoustic & Light Sensor */}
              <div className="glass-panel-subsurface rounded-3xl p-5 border border-cyan-400/35 shadow-2xl backdrop-blur-xl space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-cyan-300 tracking-wider uppercase">
                  <span>{t.act3.lightLabel}</span>
                  <span className="text-white">{t.act3.lightValue}</span>
                </div>
                <div className="w-full bg-slate-900/60 h-2 rounded-full overflow-hidden p-0.5 border border-cyan-500/30">
                  <div className="h-full bg-gradient-to-r from-cyan-400 via-sky-300 to-teal-300 rounded-full w-[78%] animate-caustic" />
                </div>
                <div className="flex items-center justify-between text-[11px] text-white/80 font-mono pt-1 border-t border-cyan-500/20">
                  <span>{t.act3.tempLabel}</span>
                  <span>{t.act3.visLabel}</span>
                </div>
              </div>

              {/* Module 2: Conservation Pulse Card */}
              <div className="glass-panel-subsurface rounded-3xl p-5 border border-cyan-400/35 shadow-2xl backdrop-blur-xl space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-white tracking-wider uppercase">
                  <span className="flex items-center gap-1.5 text-cyan-300">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    {t.act3.reefMonitoring}
                  </span>
                  <span className="text-[10px] text-emerald-300 font-mono">{t.act3.liveBadge}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-sky-950/40 rounded-xl p-2.5 border border-cyan-400/20">
                    <span className="text-[10px] text-white/70 block">{t.act3.coralCoverLabel}</span>
                    <span className="text-emerald-300 font-bold text-sm">{t.act3.coralCoverValue}</span>
                  </div>
                  <div className="bg-sky-950/40 rounded-xl p-2.5 border border-cyan-400/20">
                    <span className="text-[10px] text-white/70 block">{t.act3.acousticLabel}</span>
                    <span className="text-cyan-300 font-bold text-sm">{t.act3.acousticValue}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ===================================================================
              ACT IV: SUNKEN HERITAGE (Dynamic Language, left 45% unobstructed chest on right)
          =================================================================== */}
          <div
            className="absolute inset-0 z-25 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center pointer-events-none"
            style={{
              visibility: act4Opacity > 0 ? "visible" : "hidden",
            }}
          >
            <div
              className="w-full max-w-lg lg:max-w-xl space-y-5 pointer-events-auto transition-all duration-300"
              style={{
                opacity: act4Opacity,
                transform: `translateY(${act4Y}px)`,
              }}
            >
              {/* Gold Pill Badge */}
              <div className="glass-panel-gold inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase text-amber-300 border border-amber-400/40 shadow-[0_0_20px_rgba(245,196,81,0.2)]">
                <span className="text-sm">🪙</span>
                {t.act4.badge}
              </div>

              {/* Headline */}
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-none drop-shadow-[0_8px_32px_rgba(0,10,30,0.6)]">
                {t.act4.headline}
              </h2>

              {/* Copy */}
              <p className="text-sm sm:text-base lg:text-lg text-white/90 leading-relaxed font-normal drop-shadow-md">
                {t.act4.copy}
              </p>

              {/* Featured Expedition Card */}
              <div className="glass-panel-gold rounded-3xl p-5 sm:p-6 border border-amber-400/35 shadow-2xl backdrop-blur-2xl space-y-4">
                <div className="flex items-center justify-between text-xs font-bold text-amber-200">
                  <span className="tracking-wider uppercase">{t.act4.featuredTag}</span>
                  <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px]">
                    {t.act4.spotsRemaining}
                  </span>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white">
                    {t.act4.cardTitle}
                  </h4>
                  <p className="text-xs text-white/80 mt-0.5">
                    {t.act4.cardMeta}
                  </p>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs text-white/70">
                    {t.act4.departure}
                  </span>
                  <button
                    type="button"
                    onClick={() => setBookingModalOpen(true)}
                    className="px-5 py-2.5 rounded-full text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 shadow-[0_4px_20px_rgba(245,196,81,0.35)] hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5"
                  >
                    <span>{t.act4.bookBtn}</span>
                    <span>→</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =======================================================================
          BELOW-THE-FOLD SECTIONS (Dynamic Language)
      ======================================================================= */}
      <div className="relative z-20 bg-gradient-to-b from-[#03131E] via-[#041a29] to-[#062436] py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-32">
          {/* ===================================================================
              1. INTERACTIVE EXPEDITION GRID
          =================================================================== */}
          <section id="expeditions-grid" className="space-y-12">
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <span className="px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 inline-block">
                {t.expeditions.badge}
              </span>
              <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                {t.expeditions.title}
              </h2>
              <p className="text-base sm:text-lg text-white/80">
                {t.expeditions.subtitle}
              </p>
            </div>

            {/* 3-Column Glass Card Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {t.expeditions.cards.map((card) => (
                <div
                  key={card.id}
                  className={`glass-panel-subsurface rounded-3xl p-7 border ${card.border} hover:scale-[1.03] transition-all duration-300 flex flex-col justify-between space-y-6 shadow-2xl group`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-xs font-bold text-cyan-300">
                      <span>{card.tag}</span>
                      <span className="w-2 h-2 rounded-full bg-cyan-400 group-hover:animate-ping" />
                    </div>
                    <h3 className="text-2xl font-bold text-white group-hover:text-cyan-200 transition-colors">
                      {card.title}
                    </h3>
                    <p className="text-xs text-white/70 font-mono">
                      📍 {card.location}
                    </p>
                    <p className="text-sm text-white/80 leading-relaxed">
                      {card.desc}
                    </p>
                  </div>
                  <div className="pt-4 border-t border-white/15 flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-white/90">
                      {card.stats}
                    </span>
                    <button
                      type="button"
                      onClick={() => setBookingModalOpen(true)}
                      className="text-xs font-bold text-cyan-300 hover:text-white flex items-center gap-1 group-hover:translate-x-1 transition-all"
                    >
                      <span>{t.expeditions.detailsBtn}</span>
                      <span>→</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ===================================================================
              2. INTERACTIVE OCEAN DEPTH EXPLORER
          =================================================================== */}
          <section id="depth-explorer" className="space-y-12">
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <span className="px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase bg-teal-500/20 text-teal-300 border border-teal-400/30 inline-block">
                {t.zones.badge}
              </span>
              <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                {t.zones.title}
              </h2>
              <p className="text-base sm:text-lg text-white/80">
                {t.zones.subtitle}
              </p>
            </div>

            {/* Depth Explorer Tabs */}
            <div className="glass-panel-subsurface rounded-3xl p-6 sm:p-10 border border-cyan-400/30 shadow-2xl space-y-8">
              {/* Tab Selector Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3">
                {t.zones.tabs.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveZone(tab.id as "sunlight" | "twilight" | "midnight")}
                    className={`px-5 py-3 rounded-full text-xs sm:text-sm font-bold tracking-wide transition-all ${
                      activeZone === tab.id
                        ? "bg-cyan-500 text-slate-950 shadow-[0_0_24px_rgba(6,182,212,0.6)]"
                        : "bg-white/10 text-white/80 hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Dynamic Zone Breakdown Content */}
              {activeZone === "sunlight" && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center animate-in fade-in duration-300">
                  <div className="space-y-4">
                    <span className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-widest">
                      {t.zones.sunlight.tag}
                    </span>
                    <h3 className="text-3xl font-bold text-white">
                      {t.zones.sunlight.title}
                    </h3>
                    <p className="text-sm sm:text-base text-white/80 leading-relaxed">
                      {t.zones.sunlight.desc}
                    </p>
                    <div className="grid grid-cols-3 gap-3 pt-2 font-mono text-center">
                      <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
                        <span className="text-[10px] text-white/60 block">{t.zones.sunlight.stat1Label}</span>
                        <span className="text-base font-bold text-cyan-300">{t.zones.sunlight.stat1Val}</span>
                      </div>
                      <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
                        <span className="text-[10px] text-white/60 block">{t.zones.sunlight.stat2Label}</span>
                        <span className="text-base font-bold text-cyan-300">{t.zones.sunlight.stat2Val}</span>
                      </div>
                      <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
                        <span className="text-[10px] text-white/60 block">{t.zones.sunlight.stat3Label}</span>
                        <span className="text-base font-bold text-cyan-300">{t.zones.sunlight.stat3Val}</span>
                      </div>
                    </div>
                  </div>
                  <div className="relative aspect-video rounded-2xl overflow-hidden border border-cyan-400/30">
                    <Image
                      src="/ocean-bg.jpg"
                      alt={t.zones.sunlight.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-5">
                      <span className="text-xs font-bold text-white font-mono">
                        {t.zones.sunlight.caption}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {activeZone === "twilight" && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center animate-in fade-in duration-300">
                  <div className="space-y-4">
                    <span className="text-xs font-mono font-bold text-blue-300 uppercase tracking-widest">
                      {t.zones.twilight.tag}
                    </span>
                    <h3 className="text-3xl font-bold text-white">
                      {t.zones.twilight.title}
                    </h3>
                    <p className="text-sm sm:text-base text-white/80 leading-relaxed">
                      {t.zones.twilight.desc}
                    </p>
                    <div className="grid grid-cols-3 gap-3 pt-2 font-mono text-center">
                      <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
                        <span className="text-[10px] text-white/60 block">{t.zones.twilight.stat1Label}</span>
                        <span className="text-base font-bold text-blue-300">{t.zones.twilight.stat1Val}</span>
                      </div>
                      <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
                        <span className="text-[10px] text-white/60 block">{t.zones.twilight.stat2Label}</span>
                        <span className="text-base font-bold text-blue-300">{t.zones.twilight.stat2Val}</span>
                      </div>
                      <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
                        <span className="text-[10px] text-white/60 block">{t.zones.twilight.stat3Label}</span>
                        <span className="text-base font-bold text-blue-300">{t.zones.twilight.stat3Val}</span>
                      </div>
                    </div>
                  </div>
                  <div className="relative aspect-video rounded-2xl overflow-hidden border border-blue-400/30 bg-[#020b18] flex items-center justify-center p-6 text-center">
                    <div className="space-y-2">
                      <span className="text-4xl">🦑</span>
                      <h4 className="text-lg font-bold text-white">
                        {t.zones.twilight.cardTitle}
                      </h4>
                      <p className="text-xs text-white/70 max-w-sm">
                        {t.zones.twilight.cardDesc}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeZone === "midnight" && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center animate-in fade-in duration-300">
                  <div className="space-y-4">
                    <span className="text-xs font-mono font-bold text-purple-300 uppercase tracking-widest">
                      {t.zones.midnight.tag}
                    </span>
                    <h3 className="text-3xl font-bold text-white">
                      {t.zones.midnight.title}
                    </h3>
                    <p className="text-sm sm:text-base text-white/80 leading-relaxed">
                      {t.zones.midnight.desc}
                    </p>
                    <div className="grid grid-cols-3 gap-3 pt-2 font-mono text-center">
                      <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
                        <span className="text-[10px] text-white/60 block">{t.zones.midnight.stat1Label}</span>
                        <span className="text-base font-bold text-purple-300">{t.zones.midnight.stat1Val}</span>
                      </div>
                      <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
                        <span className="text-[10px] text-white/60 block">{t.zones.midnight.stat2Label}</span>
                        <span className="text-base font-bold text-purple-300">{t.zones.midnight.stat2Val}</span>
                      </div>
                      <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
                        <span className="text-[10px] text-white/60 block">{t.zones.midnight.stat3Label}</span>
                        <span className="text-base font-bold text-purple-300">{t.zones.midnight.stat3Val}</span>
                      </div>
                    </div>
                  </div>
                  <div className="relative aspect-video rounded-2xl overflow-hidden border border-purple-400/30 bg-[#01060e] flex items-center justify-center p-6 text-center">
                    <div className="space-y-2">
                      <span className="text-4xl">⚓</span>
                      <h4 className="text-lg font-bold text-white">
                        {t.zones.midnight.cardTitle}
                      </h4>
                      <p className="text-xs text-white/70 max-w-sm">
                        {t.zones.midnight.cardDesc}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* ===================================================================
              3. MINIMALIST FOOTER
          =================================================================== */}
          <footer id="footer" className="pt-16 border-t border-white/15 space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
              {/* Brand & Newsletter */}
              <div className="md:col-span-5 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-cyan-300 font-bold">
                    🌊
                  </div>
                  <span className="font-extrabold text-lg tracking-widest uppercase">
                    {t.footer.brand}
                  </span>
                </div>
                <p className="text-sm text-white/75 leading-relaxed max-w-md">
                  {t.footer.desc}
                </p>

                {/* Newsletter Form */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    alert(t.footer.newsAlert);
                  }}
                  className="flex items-center gap-2 pt-2 max-w-md"
                >
                  <input
                    type="email"
                    required
                    placeholder={t.footer.newsPlaceholder}
                    className="flex-1 px-4 py-2.5 rounded-full bg-white/10 border border-white/20 text-xs text-white placeholder:text-white/50 focus:outline-none focus:border-cyan-400"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-full text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition-all shrink-0"
                  >
                    {t.footer.newsSubmit}
                  </button>
                </form>
              </div>

              {/* Navigation Columns */}
              <div className="md:col-span-7 grid grid-cols-3 gap-6 text-xs text-white/75">
                <div className="space-y-3">
                  <span className="font-bold uppercase tracking-wider text-white block">
                    {t.footer.col1Title}
                  </span>
                  <ul className="space-y-2">
                    {t.footer.col1Links.map((item, idx) => (
                      <li key={idx}>
                        <a href="#expeditions-grid" className="hover:text-cyan-300">
                          {item}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-3">
                  <span className="font-bold uppercase tracking-wider text-white block">
                    {t.footer.col2Title}
                  </span>
                  <ul className="space-y-2">
                    {t.footer.col2Links.map((item, idx) => (
                      <li key={idx}>
                        <a href="#depth-explorer" className="hover:text-cyan-300">
                          {item}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-3">
                  <span className="font-bold uppercase tracking-wider text-white block">
                    {t.footer.col3Title}
                  </span>
                  <ul className="space-y-2">
                    {t.footer.col3Links.map((item, idx) => (
                      <li key={idx}>
                        <a href="#" className="hover:text-cyan-300">
                          {item}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Bottom Row */}
            <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/60">
              <p>{t.footer.rights}</p>
              <div className="flex items-center gap-6">
                <span>{t.footer.partner}</span>
                <span>•</span>
                <button
                  type="button"
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                  className="hover:text-cyan-300 font-bold"
                >
                  {t.footer.returnTop}
                </button>
              </div>
            </div>
          </footer>
        </div>
      </div>

      {/* =======================================================================
          INTERACTIVE MODALS
      ======================================================================= */}

      {/* 1. Modal: Documentary Player */}
      {videoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl glass-panel-subsurface rounded-3xl p-6 sm:p-8 border border-cyan-400/35 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between pb-4 border-b border-white/20">
              <div>
                <span className="text-xs font-bold tracking-widest text-cyan-300 uppercase">
                  {t.modals.video.badge}
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white mt-0.5">
                  {t.modals.video.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setVideoModalOpen(false)}
                className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/30 border border-white/30 flex items-center justify-center text-white transition-all"
              >
                ✕
              </button>
            </div>

            {/* Simulated 4K Cinematic Player */}
            <div
              className="relative mt-6 aspect-video rounded-2xl overflow-hidden bg-slate-950 border border-white/20 shadow-inner flex flex-col justify-between p-6 bg-cover bg-center"
              style={{ backgroundImage: "url('/video/voda_poster.jpg')" }}
            >
              <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />

              <div className="relative z-10 flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-red-600/90 text-[11px] font-bold tracking-wider uppercase text-white shadow-lg">
                  4K ULTRA HD
                </span>
                <span className="text-xs text-white/80 font-medium">
                  {t.modals.video.runtime}
                </span>
              </div>

              <div className="relative z-10 self-center">
                <div className="w-20 h-20 rounded-full bg-cyan-500/80 hover:bg-cyan-400 border-2 border-white flex items-center justify-center text-white shadow-[0_0_30px_rgba(6,182,212,0.6)] cursor-pointer hover:scale-110 active:scale-95 transition-all">
                  <span className="text-3xl ml-1">▶</span>
                </div>
              </div>

              <div className="relative z-10 space-y-2">
                <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-cyan-400 h-full w-1/3 rounded-full" />
                </div>
                <div className="flex items-center justify-between text-xs text-white/80">
                  <span>16:04 / 48:22</span>
                  <span className="text-cyan-300 font-semibold">
                    {t.modals.video.audio}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Modal: Live Submersible Stream */}
      {liveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl glass-panel-subsurface rounded-3xl p-6 sm:p-8 border border-cyan-400/40 shadow-[0_0_60px_rgba(6,182,212,0.3)]">
            <div className="flex items-center justify-between pb-4 border-b border-cyan-400/20">
              <div className="flex items-center gap-3">
                <span className="relative flex h-3.5 w-3.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-red-600" />
                </span>
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-cyan-200 tracking-wide uppercase">
                    {t.modals.live.badge}
                  </h3>
                  <p className="text-xs text-white/70">
                    {t.modals.live.location}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setLiveModalOpen(false)}
                className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/30 border border-white/30 flex items-center justify-center text-white transition-all"
              >
                ✕
              </button>
            </div>

            <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2 aspect-video bg-[#020b18] rounded-2xl border border-cyan-500/30 p-4 relative overflow-hidden flex flex-col justify-between">
                <div
                  className="absolute inset-0 opacity-15 pointer-events-none"
                  style={{
                    backgroundImage:
                      "linear-gradient(rgba(34,211,238,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.3) 1px, transparent 1px)",
                    backgroundSize: "24px 24px",
                  }}
                />
                <div className="relative z-10 flex justify-between text-xs font-mono text-cyan-300">
                  <span>{t.modals.live.camera}</span>
                  <span>FPS: 60 | 4K UHD</span>
                </div>
                <div className="relative z-10 self-center text-center">
                  <div className="w-16 h-16 rounded-full border border-cyan-400/50 flex items-center justify-center text-cyan-300 animate-spin">
                    ⊕
                  </div>
                  <span className="text-xs font-mono text-cyan-200 mt-2 block">
                    {t.modals.live.target}
                  </span>
                </div>
                <div className="relative z-10 flex justify-between text-xs font-mono text-cyan-300">
                  <span>{t.modals.live.pressure}</span>
                  <span>{t.modals.live.temp}</span>
                </div>
              </div>

              <div className="space-y-3 flex flex-col justify-between">
                <div className="glass-panel-subsurface rounded-2xl p-4 border border-cyan-400/20">
                  <span className="text-[10px] uppercase font-bold text-cyan-300">
                    {t.modals.live.depthTitle}
                  </span>
                  <p className="text-3xl font-black text-white font-mono mt-0.5">
                    10 994 m
                  </p>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div className="bg-gradient-to-r from-cyan-400 to-blue-500 h-full w-[98%]" />
                  </div>
                </div>
                <div className="glass-panel-subsurface rounded-2xl p-4 border border-cyan-400/20">
                  <span className="text-[10px] uppercase font-bold text-cyan-300">
                    {t.modals.live.oxygenTitle}
                  </span>
                  <p className="text-2xl font-bold text-white font-mono mt-0.5">
                    96,4 %
                  </p>
                  <p className="text-[11px] text-emerald-300 font-medium">
                    {t.modals.live.oxygenStatus}
                  </p>
                </div>
                <div className="glass-panel-subsurface rounded-2xl p-4 border border-cyan-400/20">
                  <span className="text-[10px] uppercase font-bold text-cyan-300">
                    {t.modals.live.uplinkTitle}
                  </span>
                  <p className="text-xs text-white/80 mt-1">
                    {t.modals.live.uplinkDesc}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Modal: Search */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl glass-panel-subsurface rounded-3xl p-6 border border-cyan-400/40 shadow-2xl">
            <div className="flex items-center gap-3">
              <svg
                width="24"
                height="24"
                className="w-6 h-6 text-cyan-300"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <circle cx="11" cy="11" r="7" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.modals.search.placeholder}
                className="w-full bg-transparent border-none text-white text-base sm:text-lg focus:outline-none placeholder:text-white/50"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="text-white/70 hover:text-white text-sm font-bold px-2 py-1"
              >
                ESC
              </button>
            </div>

            <div className="mt-5 pt-4 border-t border-white/20">
              <span className="text-xs uppercase font-bold tracking-wider text-white/60">
                {t.modals.search.trending}
              </span>
              <div className="flex flex-wrap gap-2 mt-2">
                {t.modals.search.tags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setSearchQuery(tag)}
                    className="px-3 py-1 rounded-full text-xs font-medium bg-white/15 hover:bg-white/25 border border-white/25 text-white transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. Modal: Join Mission */}
      {joinModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md glass-panel-subsurface rounded-3xl p-6 sm:p-8 border border-white/35 shadow-2xl text-center">
            <button
              type="button"
              onClick={() => {
                setJoinModalOpen(false);
                setJoinedSuccess(false);
              }}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/15 hover:bg-white/30 flex items-center justify-center text-white transition-all"
            >
              ✕
            </button>

            {!joinedSuccess ? (
              <div className="space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-2xl text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.4)]">
                  🌊
                </div>
                <h3 className="text-2xl font-black text-white">
                  {t.modals.join.title}
                </h3>
                <p className="text-sm text-white/80">
                  {t.modals.join.desc}
                </p>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setAdvocateCount((prev) => prev + 1);
                    setJoinedSuccess(true);
                  }}
                  className="space-y-3 pt-2"
                >
                  <input
                    type="email"
                    required
                    placeholder={t.modals.join.emailPlaceholder}
                    className="w-full px-4 py-3 rounded-full bg-white/15 border border-white/30 text-white placeholder:text-white/60 focus:outline-none focus:border-cyan-300 text-sm"
                  />
                  <button
                    type="submit"
                    className="w-full py-3 rounded-full font-bold text-sm text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-lg active:scale-95 transition-all"
                  >
                    {t.modals.join.submitBtn}
                  </button>
                </form>
              </div>
            ) : (
              <div className="space-y-4 py-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-2xl text-emerald-300">
                  ✓
                </div>
                <h3 className="text-2xl font-black text-white">
                  {t.modals.join.successTitle}
                </h3>
                <p className="text-sm text-white/85">
                  {t.modals.join.successPrefix}
                  {advocateCount.toLocaleString()}
                  {t.modals.join.successSuffix}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setJoinModalOpen(false);
                    setJoinedSuccess(false);
                  }}
                  className="px-6 py-2.5 rounded-full font-semibold text-sm bg-white/20 hover:bg-white/30 text-white border border-white/30 transition-all"
                >
                  {t.modals.join.dismissBtn}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 5. Modal: Book Expedition */}
      {bookingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md glass-panel-gold rounded-3xl p-6 sm:p-8 border border-amber-400/40 shadow-2xl text-center">
            <button
              type="button"
              onClick={() => {
                setBookingModalOpen(false);
                setBookingSuccess(false);
              }}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/15 hover:bg-white/30 flex items-center justify-center text-white transition-all"
            >
              ✕
            </button>

            {!bookingSuccess ? (
              <div className="space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-amber-500/20 border border-amber-400 flex items-center justify-center text-2xl text-amber-300 shadow-[0_0_20px_rgba(245,196,81,0.4)]">
                  🪙
                </div>
                <h3 className="text-2xl font-black text-white">
                  {t.modals.booking.title}
                </h3>
                <p className="text-sm text-white/80">
                  {t.modals.booking.desc}
                </p>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setBookingSuccess(true);
                  }}
                  className="space-y-3 pt-2"
                >
                  <input
                    type="text"
                    required
                    placeholder={t.modals.booking.namePlaceholder}
                    className="w-full px-4 py-3 rounded-full bg-white/15 border border-white/30 text-white placeholder:text-white/60 focus:outline-none focus:border-amber-300 text-sm"
                  />
                  <input
                    type="email"
                    required
                    placeholder={t.modals.booking.emailPlaceholder}
                    className="w-full px-4 py-3 rounded-full bg-white/15 border border-white/30 text-white placeholder:text-white/60 focus:outline-none focus:border-amber-300 text-sm"
                  />
                  <button
                    type="submit"
                    className="w-full py-3 rounded-full font-bold text-sm text-slate-950 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 shadow-lg active:scale-95 transition-all"
                  >
                    {t.modals.booking.submitBtn}
                  </button>
                </form>
              </div>
            ) : (
              <div className="space-y-4 py-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-amber-500/20 border border-amber-400 flex items-center justify-center text-2xl text-amber-300">
                  ✓
                </div>
                <h3 className="text-2xl font-black text-white">
                  {t.modals.booking.successTitle}
                </h3>
                <p className="text-sm text-white/85">
                  {t.modals.booking.successDesc}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setBookingModalOpen(false);
                    setBookingSuccess(false);
                  }}
                  className="px-6 py-2.5 rounded-full font-semibold text-sm bg-white/20 hover:bg-white/30 text-white border border-white/30 transition-all"
                >
                  {t.modals.booking.returnBtn}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
