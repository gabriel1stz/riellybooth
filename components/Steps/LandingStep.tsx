"use client";

import React, { useState, useRef, useEffect } from "react";
import FramePreviewThumb from "@/components/UI/FramePreviewThumb";
import type { FramePreset, LayoutMode } from "@/lib/canvasUtils";
import {
  Camera,
  ArrowRight,
  Sparkles,
  Hand,
  Video,
  RefreshCcw,
  Wand2,
  ChevronDown,
  ChevronUp,
  Mail,
  Instagram,
  Upload,
  ShieldCheck,
  Star,
  Flame,
  Heart,
  Users,
  Compass,
  Download,
  Film,
  Smile,
  Palette,
} from "lucide-react";

function TikTokIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 1 1-5.2-1.74 2.89 2.89 0 0 1 2.31-1.39V9.08a6.34 6.34 0 0 0-5.18 6.22 6.34 6.34 0 0 0 10.86 4.43 6.3 6.3 0 0 0 1.77-4.48V8.71a8.27 8.27 0 0 0 4.66 1.43V6.69z" />
    </svg>
  );
}

const SAMPLE_POSES = [
  {
    local: "/samples/pose1.jpg",
    fallback: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    label: "pose 01 · smile",
    note: "peace pose",
  },
  {
    local: "/samples/pose2.jpg",
    fallback: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
    label: "pose 02 · wink",
    note: "aesthetic blush",
  },
  {
    local: "/samples/pose3.jpg",
    fallback: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80",
    label: "pose 03 · cute",
    note: "sunny day",
  },
  {
    local: "/samples/pose4.jpg",
    fallback: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
    label: "pose 04 · heart",
    note: "best memory",
  },
];

const FEATURED_FRAMES: Array<{
  id: FramePreset;
  layout: LayoutMode;
  frameColor: string;
  textColor: string;
  title: string;
  badge: string;
  tagColor: string;
  cardBg: string;
  description: string;
  tags: string[];
  format: string;
}> = [
  {
    id: "coquette",
    layout: "strip_1x4",
    frameColor: "#fce7f3",
    textColor: "#db2777",
    title: "Coquette Ribbon",
    badge: "VIRAL GEN Z",
    tagColor: "bg-[#E84D91] text-white",
    cardBg: "bg-[#FFF9F0] border-[#E9B8CA] text-[#392633]",
    description: "Pita satin lembut, pearl borders, dan tone blush pink estetik favorit TikTok.",
    tags: ["Coquette", "Aesthetic", "Soft Pink"],
    format: "2×6 Strip",
  },
  {
    id: "newspaper",
    layout: "newspaper_grid",
    frameColor: "#f4f0e6",
    textColor: "#1c1917",
    title: "The Rielly Times",
    badge: "4-PHOTO NEWS",
    tagColor: "bg-[#1c1917] text-white",
    cardBg: "bg-[#FAF7F0] border-[#392633] text-[#1c1917]",
    description: "Koran broadsheet 4-foto lengkap dengan 3 kolom artikel, drop cap, pull-quote, dan spesifikasi cetak.",
    tags: ["Editorial", "Broadsheet", "4-Photo"],
    format: "4×6 Broadsheet",
  },
  {
    id: "daily_rielly",
    layout: "strip_1x4",
    frameColor: "#FAF7F0",
    textColor: "#121212",
    title: "The Daily Rielly",
    badge: "EDITORIAL",
    tagColor: "bg-[#392633] text-white",
    cardBg: "bg-[#FFF9F0] border-[#392633] text-[#392633]",
    description: "Koran editorial vintage 90-an dengan masthead RIELLYBOOTH, prangko arsip, dan barcode.",
    tags: ["Editorial", "Vintage 90s", "Archive"],
    format: "2-Photo Poster",
  },
  {
    id: "riellmatics_news",
    layout: "strip_1x4",
    frameColor: "#ffffff",
    textColor: "#111111",
    title: "Riellmatics Daily News",
    badge: "TRENDING",
    tagColor: "bg-stone-900 text-white",
    cardBg: "bg-stone-50 border-stone-400 text-stone-900",
    description: "Headline koran editorial retro hitam-putih ala Photomatic Korea dengan metadata edisi.",
    tags: ["Editorial", "Monochrome", "Vintage"],
    format: "2×6 Strip",
  },
  {
    id: "y2k",
    layout: "strip_1x4",
    frameColor: "#1e112a",
    textColor: "#f0abfc",
    title: "Cyber Y2K Sparkle",
    badge: "RETRO CYBER",
    tagColor: "bg-purple-700 text-white",
    cardBg: "bg-[#1E112A] border-purple-400 text-purple-100",
    description: "Sparkle bintang 4 sudut, aksen chrome metallic, dan nuansa digital tahun 2000-an.",
    tags: ["Y2K", "Cyber", "Metallic"],
    format: "2×6 Strip",
  },
  {
    id: "receipt",
    layout: "strip_1x4",
    frameColor: "#fffbeb",
    textColor: "#292524",
    title: "Struk Cafe Vintage",
    badge: "COZY MOOD",
    tagColor: "bg-amber-800 text-white",
    cardBg: "bg-[#FFFBEB] border-amber-300 text-amber-950",
    description: "Thermal receipt struk kopi estetik lengkap barcode dan rincian pesanan santai.",
    tags: ["Receipt", "Cafe", "Thermal"],
    format: "2×6 Strip",
  },
  {
    id: "concert_ticket",
    layout: "strip_1x4",
    frameColor: "#062419",
    textColor: "#a7f3d0",
    title: "Musikfest VIP Pass",
    badge: "FESTIVAL",
    tagColor: "bg-emerald-700 text-white",
    cardBg: "bg-[#062419] border-emerald-400 text-emerald-100",
    description: "Tiket festival backstage VIP pass dengan lanyard clip digital dan nuansa panggung konser.",
    tags: ["Concert", "VIP Pass", "Festival"],
    format: "2×6 Strip",
  },
  {
    id: "halloween_spooky",
    layout: "strip_1x4",
    frameColor: "#14081e",
    textColor: "#fb923c",
    title: "Halloween Spooky",
    badge: "LIMITED",
    tagColor: "bg-orange-600 text-white",
    cardBg: "bg-[#14081E] border-orange-500 text-orange-200",
    description: "Bingkai edisi terbatas dengan border neon ungu-oranye dan ornamen malam mistis.",
    tags: ["Halloween", "Spooky", "Limited"],
    format: "2×6 Strip",
  },
];

const TESTIMONIALS = [
  {
    user: "@nayla.aest",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
    role: "TikTok Creator",
    comment: "Frame Coquette sama Editorial-nya gemes banget, auto jepret pose peace tanpa ribet, langsung save HD buat IG Story.",
    rating: 5,
  },
  {
    user: "@kevin.ar",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
    role: "Mahasiswa ITB",
    comment: "Akhirnya nemu photobooth web yang bisa Live Photo boomerang terus 100% tanpa watermark! Fitur cetak 4R-nya pas bgt buat dibagi ke geng.",
    rating: 5,
  },
  {
    user: "@chelseaa.m",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80",
    role: "Gen Z Aesthetic",
    comment: "Gak perlu antre di mall bayar 50rb. Foto bareng ayang pas nongkrong di cafe langsung dapet strip estetik! Filter retro-nya juara pol.",
    rating: 5,
  },
  {
    user: "@dimas.pr",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80",
    role: "Mobile Photographer",
    comment: "Privasinya beneran aman karena semua proses lokal di browser. Fitur gesture peace ✌️ dan timer 3s responsif banget di HP.",
    rating: 5,
  },
];

type LandingStepProps = {
  onStart: (initialPreset?: string) => void;
  onUploadPhotos?: (files: FileList) => void;
  onOpenLDR?: () => void;
  onOpenPrivacy?: () => void;
  onOpenWhatsNew?: () => void;
  lang?: "id" | "en";
};

export default function LandingStep({
  onStart,
  onUploadPhotos,
  onOpenLDR,
  onOpenPrivacy,
  onOpenWhatsNew,
}: LandingStepProps) {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const heroFileInputRef = useRef<HTMLInputElement | null>(null);

  const handleHeroFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0 && onUploadPhotos) {
      onUploadPhotos(e.target.files);
    }
  };

  const scrollToFrames = () => {
    const el = document.getElementById("featured-frames");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const faqs = [
    {
      q: "Apakah foto saya disimpan di server RiellyBooth?",
      a: "TIDAK SAMA SEKALI. 100% pemrosesan foto strip, live photo video, filter, dan stiker diproses secara lokal di browser kamu menggunakan HTML5 Canvas & WebRTC. Foto kamu tidak pernah diunggah atau disimpan di server mana pun, sehingga aman dan privat.",
    },
    {
      q: "Apakah RiellyBooth 100% gratis tanpa watermark?",
      a: "Ya, 100% gratis! Semua unduhan photo strip format PNG HD dan video boomerang MP4 bebas dari watermark selamanya.",
    },
    {
      q: "Bagaimana jika pose Peace (✌️) tidak terdeteksi?",
      a: "Tenang! Tersedia mode Timer 3 Detik, 5 Detik, dan Jepret Instan sebagai alternatif. Kamu bisa memilih mode timer jika pencahayaan ruangan redup atau kamera HP sulit mendeteksi gesture.",
    },
    {
      q: "Bisa pakai foto yang sudah ada di galeri HP?",
      a: "Bisa banget! Klik tombol 'Upload Galeri' di hero atau saat sesi capture untuk langsung memilih foto favoritmu tanpa perlu menyalakan kamera.",
    },
    {
      q: "Bagaimana cara cetak format 4R (Double Strip 2x4)?",
      a: "Di tahap editor, pilih layout 'Double Strip 2x4'. Hasil unduhan beresolusi cetak tinggi (standar kertas foto 4R / 4x6 inci), sehingga kamu bisa memotongnya jadi 2 strip identik buat dibagi ke bestie!",
    },
  ];

  const [todayDateStr, setTodayDateStr] = useState("2026");

  useEffect(() => {
    setTodayDateStr(
      new Date().toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    );
  }, []);

  return (
    <div className="w-full max-w-6xl px-4 sm:px-6 py-6 sm:py-10 flex flex-col items-center gap-14 sm:gap-20 text-[#392633] animate-in fade-in duration-300">
      {/* ========================================================
          HERO SECTION: Gen Z Scrapbook Editorial Pink Edition
          ======================================================== */}
      <section className="w-full flex flex-col items-center text-center gap-6 sm:gap-8 pt-2 relative">
        {/* Subtle decorative scrapbook washi tape at top */}
        <div className="washi-tape washi-tape-lavender -top-3 rotate-[-3deg] left-1/2 -translate-x-1/2 hidden sm:block" />

        {/* Brand Tagline Badge & What's New Pill */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 z-10">
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#FFF9F0] border-2 border-[#E9B8CA] text-[#392633] rounded-full text-xs font-heading font-semibold shadow-xs">
            <span className="text-[#E84D91]">✦</span>
            <span>RiellyBooth Photobooth</span>
            <span className="text-[#E84D91]">✦</span>
          </div>

          {onOpenWhatsNew && (
            <button
              type="button"
              onClick={onOpenWhatsNew}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#FFF0F4] hover:bg-[#F8D8E3] border-2 border-[#F48FB1] text-[#E84D91] rounded-full text-xs font-heading font-bold shadow-xs hover:scale-105 active:scale-95 transition-all cursor-pointer group"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#E84D91]" />
              <span>What&apos;s New</span>
              <span className="px-1.5 py-0.5 bg-[#E84D91] text-white text-[9px] rounded-full uppercase tracking-wider">v2.5</span>
              <ArrowRight className="w-3 h-3 text-[#E84D91] transition-transform group-hover:translate-x-0.5" />
            </button>
          )}
        </div>

        {/* Main Headline & Supporting Text */}
        <div className="space-y-4 max-w-3xl z-10">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-heading font-bold tracking-tight text-[#392633] leading-[1.08]">
            Little Moments, <br />
            <span className="text-[#E84D91] relative inline-block mt-1">
              Big Memories.
              {/* Hand-drawn underline squiggle */}
              <svg
                className="absolute -bottom-2.5 left-0 w-full text-[#F48FB1] pointer-events-none"
                viewBox="0 0 300 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2 12C50 4 100 14 150 7C200 2 250 13 298 6"
                  stroke="currentColor"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-[#8B7180] max-w-xl mx-auto font-sans font-medium leading-relaxed pt-2">
            Your own little photo studio. Capture cute moments, create photo strips, and keep memories forever.
          </p>
        </div>

        {/* Primary CTA Row: START YOUR SESSION & EXPLORE FRAMES */}
        <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3.5 pt-2 w-full max-w-xl z-10">
          <button
            type="button"
            onClick={() => onStart()}
            className="w-full sm:w-auto scrapbook-btn px-8 py-4 text-sm sm:text-base flex items-center justify-center gap-2.5 cursor-pointer group"
          >
            <Camera className="w-5 h-5 animate-pulse" />
            <span>START YOUR SESSION</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>

          <button
            type="button"
            onClick={scrollToFrames}
            className="w-full sm:w-auto scrapbook-btn-secondary px-7 py-3.5 text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            <Compass className="w-4 h-4 text-[#E84D91]" />
            <span>EXPLORE FRAMES</span>
          </button>

          {/* Hidden File Input for Device Photo Upload */}
          <input
            ref={heroFileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleHeroFileChange}
            className="hidden"
          />

          <button
            type="button"
            onClick={() => heroFileInputRef.current?.click()}
            className="w-full sm:w-auto px-5 py-3.5 bg-white hover:bg-[#FFF0F4] border-2 border-[#E9B8CA] text-[#392633] rounded-full text-xs font-heading font-semibold shadow-xs hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Upload className="w-4 h-4 text-[#F48FB1]" />
            <span>Upload Galeri</span>
          </button>

          {onOpenLDR && (
            <button
              type="button"
              onClick={onOpenLDR}
              className="w-full sm:w-auto px-5 py-3.5 bg-[#FFF0F4] hover:bg-[#F8D8E3] border-2 border-[#F48FB1] text-[#E84D91] rounded-full text-xs font-heading font-bold shadow-xs hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Users className="w-4 h-4" />
              <span>Foto Jarak Jauh</span>
              <span className="px-1.5 py-0.5 bg-[#E84D91] text-white text-[9px] rounded-full uppercase tracking-wider">LDR</span>
            </button>
          )}
        </div>

        {/* Feature Highlights Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#FFF9F0] border border-[#E9B8CA] rounded-full shadow-xs text-xs font-heading font-medium text-[#8B7180]">
          <span className="text-[#E84D91]">✦</span> 100% In-Browser · HD Print Quality · Live Photo Video · No Watermark <span className="text-[#E84D91]">✦</span>
        </div>

        {/* ========================================================
            HERO VISUAL: Layered Polaroid & Photo Strip Scrapbook Collage
            ======================================================== */}
        <div className="relative w-full max-w-4xl mt-4 sm:mt-8 flex justify-center items-center py-6 px-2 select-none">
          {/* Handwritten Annotation 1 */}
          <div className="absolute top-2 left-4 sm:left-12 z-30 font-handwriting text-lg sm:text-2xl text-[#E84D91] rotate-[-8deg] hidden md:block">
            <span>say cheese!</span>
            <div className="text-xs font-sans text-[#8B7180] tracking-normal">peace pose auto-take</div>
          </div>

          {/* Handwritten Annotation 2 */}
          <div className="absolute top-8 right-4 sm:right-10 z-30 font-handwriting text-lg sm:text-2xl text-[#E84D91] rotate-[10deg] hidden md:block">
            <span>little memories</span>
            <div className="text-xs font-sans text-[#8B7180] tracking-normal">free without watermark</div>
          </div>

          {/* Collage Container */}
          <div className="relative flex justify-center items-center w-full min-h-[420px] sm:min-h-[480px]">
            {/* Left Polaroid - Tilted Left */}
            <div className="absolute -rotate-[12deg] -translate-x-24 sm:-translate-x-44 z-10 transition-all duration-300 hover:rotate-0 hover:z-40 hover:scale-105">
              <div className="washi-tape washi-tape-yellow -top-3 left-1/2 -translate-x-1/2 rotate-[4deg]" />
              <div className="scrapbook-polaroid w-44 sm:w-56 text-left space-y-2">
                <div className="aspect-[4/3] rounded-lg overflow-hidden bg-stone-100 border border-[#E9B8CA]">
                  <img
                    src={SAMPLE_POSES[0].local}
                    alt="Pose sample"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = SAMPLE_POSES[0].fallback;
                    }}
                  />
                </div>
                <div className="pt-1 flex items-center justify-between text-xs font-handwriting text-[#392633]">
                  <span className="font-bold text-sm text-[#E84D91]">sweet memory #01</span>
                  <span className="text-[11px] text-[#8B7180]">cafe date ♡</span>
                </div>
              </div>
            </div>

            {/* Right Polaroid - Tilted Right */}
            <div className="absolute rotate-[12deg] translate-x-24 sm:translate-x-44 z-10 transition-all duration-300 hover:rotate-0 hover:z-40 hover:scale-105">
              <div className="washi-tape washi-tape-mint -top-3 left-1/2 -translate-x-1/2 rotate-[-5deg]" />
              <div className="scrapbook-polaroid w-44 sm:w-56 text-left space-y-2">
                <div className="aspect-[4/3] rounded-lg overflow-hidden bg-stone-100 border border-[#E9B8CA]">
                  <img
                    src={SAMPLE_POSES[3].local}
                    alt="Pose sample"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = SAMPLE_POSES[3].fallback;
                    }}
                  />
                </div>
                <div className="pt-1 flex items-center justify-between text-xs font-handwriting text-[#392633]">
                  <span className="font-bold text-sm text-[#E84D91]">with bestie</span>
                  <span className="text-[11px] text-[#8B7180]">forever</span>
                </div>
              </div>
            </div>

            {/* Center Photo Strip (Front Hero) - Realistic Photobooth Strip */}
            <div className="relative z-20 transition-all duration-300 hover:scale-105">
              {/* Top Washi Tape */}
              <div className="washi-tape -top-3 left-1/2 -translate-x-1/2 rotate-[1deg]" />

              <div className="bg-white border-2 border-[#E9B8CA] p-3 sm:p-3.5 rounded-2xl shadow-polaroid w-48 sm:w-56 space-y-2 text-center">
                {/* Header ribbon */}
                <div className="flex items-center justify-center gap-1.5 text-[11px] font-heading font-bold text-[#E84D91] border-b border-[#F8D8E3] pb-1.5 tracking-wide uppercase">
                  <span>RiellyBooth Studio</span>
                </div>

                {/* 4 Photos Stacked */}
                <div className="space-y-1.5">
                  {SAMPLE_POSES.map((pose, idx) => (
                    <div
                      key={idx}
                      className="bg-[#FFF0F4] border border-[#F8D8E3] rounded-lg overflow-hidden aspect-[4/3] relative group"
                    >
                      <img
                        src={pose.local}
                        alt={pose.label}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = pose.fallback;
                        }}
                      />
                      <span className="absolute bottom-1 right-1 bg-black/50 text-white text-[9px] font-mono px-1 rounded">
                        0{idx + 1}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Footer of photo strip */}
                <div className="pt-2 border-t border-[#F8D8E3] flex items-center justify-between px-1 text-[10px] text-[#392633]">
                  <span className="font-heading font-bold text-[#E84D91]">riellybooth</span>
                  <span className="font-mono text-[9px] text-[#8B7180]">{todayDateStr}</span>
                </div>
              </div>

              {/* Little Stamp Badge */}
              <div className="absolute -bottom-3 -right-3 z-30 bg-[#FFF9F0] border-2 border-[#E84D91] text-[#E84D91] text-[10px] font-heading font-black px-2.5 py-1 rounded-full shadow-stamp rotate-[8deg] tracking-wider uppercase">
                100% FREE
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION 1 — HOW IT WORKS (Three Simple Steps)
          ======================================================== */}
      <section className="w-full py-4 text-center space-y-8">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FFF9F0] border border-[#E9B8CA] text-[#E84D91] rounded-full text-xs font-heading font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#E84D91]" />
            <span>Tiga Langkah Mudah</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-[#392633]">
            How It Works
          </h2>
          <p className="text-xs sm:text-sm text-[#8B7180] max-w-md mx-auto font-sans font-medium">
            Proses cepat, estetik, dan bisa langsung dipakai dari kamera HP atau laptop tanpa registrasi akun.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {/* Step 1 */}
          <div className="scrapbook-paper p-6 space-y-4 relative group hover:-translate-y-1 transition-transform">
            <div className="washi-tape washi-tape-yellow -top-2.5 left-8 rotate-[-2deg]" />
            <div className="flex items-center justify-between">
              <span className="text-3xl font-heading font-bold text-[#E84D91]">01.</span>
              <div className="p-3 bg-[#FFF0F4] border border-[#E9B8CA] rounded-2xl text-[#E84D91]">
                <Palette className="w-5 h-5" />
              </div>
            </div>
            <div className="space-y-1.5">
              <h3 className="text-lg font-heading font-bold text-[#392633]">
                Pick Your Frame
              </h3>
              <p className="text-xs text-[#8B7180] leading-relaxed font-sans font-medium">
                Pilih dari 16+ template bingkai estetik: Coquette Ribbon, The Daily Rielly, Cyber Y2K, Struk Cafe, atau upload bingkai PNG kreasi kamu sendiri.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="scrapbook-paper p-6 space-y-4 relative group hover:-translate-y-1 transition-transform">
            <div className="washi-tape washi-tape-mint -top-2.5 left-8 rotate-[1deg]" />
            <div className="flex items-center justify-between">
              <span className="text-3xl font-heading font-bold text-[#E84D91]">02.</span>
              <div className="p-3 bg-[#FFF0F4] border border-[#E9B8CA] rounded-2xl text-[#E84D91]">
                <Camera className="w-5 h-5" />
              </div>
            </div>
            <div className="space-y-1.5">
              <h3 className="text-lg font-heading font-bold text-[#392633]">
                Capture Your Moments
              </h3>
              <p className="text-xs text-[#8B7180] leading-relaxed font-sans font-medium">
                Angkat 2 jari pose peace ✌️ kamera jepret otomatis! Bisa juga pakai mode timer santai 3s/5s atau foto berdua jarak jauh lewat link LDR.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="scrapbook-paper p-6 space-y-4 relative group hover:-translate-y-1 transition-transform">
            <div className="washi-tape washi-tape-lavender -top-2.5 left-8 rotate-[-1deg]" />
            <div className="flex items-center justify-between">
              <span className="text-3xl font-heading font-bold text-[#E84D91]">03.</span>
              <div className="p-3 bg-[#FFF0F4] border border-[#E9B8CA] rounded-2xl text-[#E84D91]">
                <Download className="w-5 h-5" />
              </div>
            </div>
            <div className="space-y-1.5">
              <h3 className="text-lg font-heading font-bold text-[#392633]">
                Download Your Memories
              </h3>
              <p className="text-xs text-[#8B7180] leading-relaxed font-sans font-medium">
                Simpan strip beresolusi tinggi (PNG HD siap cetak 4R), Live Photo video boomerang MP4 untuk TikTok/Reels, atau GIF animasi tanpa watermark.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION 2 — FEATURED FRAMES (Real frame data & selection)
          ======================================================== */}
      <section id="featured-frames" className="w-full py-4 text-center space-y-8 scroll-mt-20">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FFF9F0] border border-[#E9B8CA] text-[#E84D91] rounded-full text-xs font-heading font-bold">
            <Flame className="w-3.5 h-3.5 text-[#E84D91]" />
            <span>Koleksi Bingkai Estetik</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-[#392633]">
            Featured Frames
          </h2>
          <p className="text-xs sm:text-sm text-[#8B7180] max-w-lg mx-auto font-sans font-medium">
            Setiap bingkai didesain dengan detail scrapbook yang unik. Pilih frame favoritmu dan mulai sesi foto sekarang!
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 text-left">
          {FEATURED_FRAMES.map((f) => (
            <div
              key={f.id}
              className={`rounded-3xl border-2 p-4 shadow-paper hover:-translate-y-1.5 hover:shadow-paper-lg transition-all duration-300 flex flex-col justify-between ${f.cardBg} group relative`}
            >
              <div className="space-y-3">
                {/* Header Tag */}
                <div className="flex justify-between items-center">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-heading font-bold tracking-wide ${f.tagColor}`}>
                    {f.badge}
                  </span>
                  <span className="text-[10px] font-mono text-[#8B7180] bg-white/70 px-2 py-0.5 rounded-md border border-[#E9B8CA]">
                    {f.format}
                  </span>
                </div>

                {/* Live Rendered Frame Preview matching the exact real frame */}
                <FramePreviewThumb
                  preset={f.id}
                  layout={f.layout}
                  frameColor={f.frameColor}
                  textColor={f.textColor}
                  title={f.title}
                />

                {/* Title */}
                <h3 className="text-sm font-heading font-bold tracking-tight">
                  {f.title}
                </h3>

                {/* Description */}
                <p className="text-xs font-sans font-medium leading-relaxed opacity-90">
                  {f.description}
                </p>

                {/* Micro tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {f.tags.map((t, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 bg-black/5 rounded-md text-[10px] font-mono font-semibold"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={() => onStart(f.id)}
                className="mt-4 w-full py-2.5 px-3 bg-[#E84D91] hover:bg-[#F48FB1] text-white font-heading font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Pakai Frame Ini</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================
          SECTION 3 — WHY RIELLYBOOTH (Real Supported Capabilities)
          ======================================================== */}
      <section className="w-full py-4 space-y-6 text-center">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FFF9F0] border border-[#E9B8CA] text-[#E84D91] rounded-full text-xs font-heading font-bold">
            <Sparkles className="w-3.5 h-3.5 text-[#E84D91]" />
            <span>Kelebihan Kami</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-[#392633]">
            Why RiellyBooth?
          </h2>
          <p className="text-xs sm:text-sm text-[#8B7180] max-w-lg mx-auto font-sans font-medium">
            Dibuat untuk memberikan pengalaman studio photobooth online paling estetik dan aman tanpa biaya tersembunyi.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 text-left">
          {/* Card 1 */}
          <div className="scrapbook-paper p-5 space-y-2.5 relative">
            <div className="p-2.5 bg-[#FFF0F4] border border-[#E9B8CA] rounded-2xl w-fit text-[#E84D91]">
              <Camera className="w-5 h-5" />
            </div>
            <h3 className="text-base font-heading font-bold text-[#392633]">
              Online Photobooth Anywhere
            </h3>
            <p className="text-xs text-[#8B7180] leading-relaxed font-sans font-medium">
              Buka dari browser smartphone, iPad, atau laptop kamu tanpa perlu install aplikasi apapun.
            </p>
          </div>

          {/* Card 2 */}
          <div className="scrapbook-paper p-5 space-y-2.5 relative">
            <div className="p-2.5 bg-[#FFF0F4] border border-[#E9B8CA] rounded-2xl w-fit text-[#E84D91]">
              <Palette className="w-5 h-5" />
            </div>
            <h3 className="text-base font-heading font-bold text-[#392633]">
              Custom Photo Frames
            </h3>
            <p className="text-xs text-[#8B7180] leading-relaxed font-sans font-medium">
              Pilihan puluhan bingkai viral, atur warna latar, typography tanggal, serta dukungan bingkai PNG kustom buatanmu.
            </p>
          </div>

          {/* Card 3 */}
          <div className="scrapbook-paper p-5 space-y-2.5 relative">
            <div className="p-2.5 bg-[#FFF0F4] border border-[#E9B8CA] rounded-2xl w-fit text-[#E84D91]">
              <Hand className="w-5 h-5" />
            </div>
            <h3 className="text-base font-heading font-bold text-[#392633]">
              Live Camera & Peace Gesture
            </h3>
            <p className="text-xs text-[#8B7180] leading-relaxed font-sans font-medium">
              Preview kamera langsung dengan AI deteksi gesture peace untuk jepret otomatis tanpa menyentuh tombol.
            </p>
          </div>

          {/* Card 4 */}
          <div className="scrapbook-paper p-5 space-y-2.5 relative">
            <div className="p-2.5 bg-[#FFF0F4] border border-[#E9B8CA] rounded-2xl w-fit text-[#E84D91]">
              <Wand2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-heading font-bold text-[#392633]">
              Retro & Beauty Filters
            </h3>
            <p className="text-xs text-[#8B7180] leading-relaxed font-sans font-medium">
              Filter analog film grain, vintage 90s, webcam toy pixel art, serta slider beauty soft glow untuk hasil wajah mulus.
            </p>
          </div>

          {/* Card 5 */}
          <div className="scrapbook-paper p-5 space-y-2.5 relative">
            <div className="p-2.5 bg-[#FFF0F4] border border-[#E9B8CA] rounded-2xl w-fit text-[#E84D91]">
              <Download className="w-5 h-5" />
            </div>
            <h3 className="text-base font-heading font-bold text-[#392633]">
              Easy & Multi-Format Downloads
            </h3>
            <p className="text-xs text-[#8B7180] leading-relaxed font-sans font-medium">
              Download photo strip PNG tajam resolusi tinggi, Live Photo video MP4 bergerak, dan animasi GIF loop instan.
            </p>
          </div>

          {/* Card 6 */}
          <div className="scrapbook-paper p-5 space-y-2.5 relative">
            <div className="p-2.5 bg-[#FFF0F4] border border-[#E9B8CA] rounded-2xl w-fit text-emerald-600">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-heading font-bold text-[#392633]">
              100% In-Browser Privacy
            </h3>
            <p className="text-xs text-[#8B7180] leading-relaxed font-sans font-medium">
              Foto kamu tidak pernah diunggah ke server kami. Semua pemrosesan terjadi lokal di browser demi privasi total.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION 4 — PHOTO MEMORIES (Editorial Scrapbook Photo Collage)
          ======================================================== */}
      <section className="w-full py-6 space-y-8 text-center">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FFF9F0] border border-[#E9B8CA] text-[#E84D91] rounded-full text-xs font-heading font-bold">
            <Heart className="w-3.5 h-3.5 text-[#E84D91] fill-[#E84D91]" />
            <span>Koleksi Momen</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-[#392633]">
            Photo Memories
          </h2>
          <p className="text-xs sm:text-sm text-[#8B7180] max-w-lg mx-auto font-sans font-medium">
            Abadikan tawa, ekspresi lucu, dan pose manis bersama orang-orang tersayang.
          </p>
        </div>

        {/* Editorial Collage Grid with Washi Tape and Annotations */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 pt-4 text-left">
          {SAMPLE_POSES.map((pose, idx) => {
            const rotClass = idx % 2 === 0 ? "rotate-[-2deg]" : "rotate-[2deg]";
            const tapeType = idx === 0 ? "washi-tape" : idx === 1 ? "washi-tape washi-tape-yellow" : idx === 2 ? "washi-tape washi-tape-mint" : "washi-tape washi-tape-lavender";
            return (
              <div
                key={idx}
                className={`scrapbook-polaroid ${rotClass} hover:rotate-0 transition-transform duration-300 relative group cursor-pointer`}
                onClick={() => onStart()}
              >
                <div className={`${tapeType} -top-2.5 left-1/2 -translate-x-1/2`} />
                <div className="aspect-[3/4] rounded-lg overflow-hidden bg-stone-100 border border-[#E9B8CA]">
                  <img
                    src={pose.local}
                    alt={pose.label}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = pose.fallback;
                    }}
                  />
                </div>
                <div className="pt-2 text-center">
                  <div className="font-handwriting text-base sm:text-lg text-[#E84D91]">
                    {pose.note}
                  </div>
                  <div className="text-[10px] font-mono text-[#8B7180]">
                    {pose.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Real Testimonials Grid */}
        <div className="pt-8 space-y-4">
          <div className="text-center space-y-1">
            <h3 className="text-xl sm:text-2xl font-heading font-bold text-[#392633]">
              Dicintai Pengguna di TikTok & Instagram
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
            {TESTIMONIALS.map((t, idx) => (
              <div
                key={idx}
                className="scrapbook-paper p-4 space-y-3 flex flex-col justify-between text-xs"
              >
                <div className="space-y-2">
                  <div className="flex text-amber-400">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                  <p className="font-sans font-medium text-[#392633] leading-relaxed italic">
                    &ldquo;{t.comment}&rdquo;
                  </p>
                </div>

                <div className="flex items-center gap-2.5 pt-2 border-t border-[#E9B8CA]">
                  <img
                    src={t.avatar}
                    alt={t.user}
                    className="w-8 h-8 rounded-full object-cover border border-[#E9B8CA]"
                  />
                  <div>
                    <div className="font-heading font-bold text-[#392633]">{t.user}</div>
                    <div className="text-[10px] text-[#E84D91] font-semibold">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          FAQ ACCORDION SECTION
          ======================================================== */}
      <section className="w-full scrapbook-paper p-6 sm:p-8 space-y-6 text-left">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FFF0F4] border border-[#E9B8CA] text-emerald-800 rounded-full text-xs font-heading font-bold">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>FAQ & Keamanan</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-heading font-bold text-[#392633]">
            Pertanyaan yang Sering Ditanyakan
          </h2>
        </div>

        <div className="space-y-2.5 max-w-2xl mx-auto">
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="border-2 border-[#E9B8CA] rounded-2xl overflow-hidden bg-white transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full px-4 py-3.5 flex justify-between items-center font-heading font-bold text-[#392633] text-xs sm:text-sm hover:bg-[#FFF0F4] transition text-left cursor-pointer"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-[#E84D91] shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#8B7180] shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-4 pb-3.5 text-xs font-sans font-medium text-[#8B7180] leading-relaxed border-t border-[#E9B8CA] pt-2.5 bg-[#FFF9F0]">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================
          SECTION 5 — FINAL CTA (Ready to make some memories?)
          ======================================================== */}
      <section className="w-full scrapbook-paper bg-[#FFF0F4] border-2 border-[#E9B8CA] p-8 sm:p-12 text-center space-y-5 relative">
        <div className="washi-tape washi-tape-lavender -top-3 left-1/2 -translate-x-1/2 rotate-[1deg]" />

        <div className="space-y-2">
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-heading font-bold text-[#392633]">
            Ready to make some memories?
          </h2>
          <p className="text-xs sm:text-sm font-sans font-medium text-[#8B7180] max-w-md mx-auto">
            Ajak temen, gebetan, atau solo pose sesukamu. 100% gratis tanpa perlu registrasi akun!
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => onStart()}
            className="scrapbook-btn px-9 py-4 text-sm sm:text-base flex items-center justify-center gap-2 cursor-pointer group"
          >
            <Camera className="w-5 h-5 animate-pulse" />
            <span>LET&apos;S TAKE PHOTOS</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </section>

      {/* ========================================================
          SECTION 6 — FOOTER
          ======================================================== */}
      <footer className="w-full border-t-2 border-[#E9B8CA] pt-8 pb-4 text-center text-xs text-[#8B7180] flex flex-col items-center justify-center gap-3">
        <div className="flex items-center gap-2 font-heading font-bold text-[#392633] text-sm">
          <span className="text-[#E84D91]">RiellyBooth</span>
          <span className="text-[#F48FB1]">♡</span>
          <span className="text-xs font-handwriting text-[#8B7180]">Little Moments, Big Memories.</span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-semibold">
          {onOpenPrivacy && (
            <>
              <button
                type="button"
                onClick={onOpenPrivacy}
                className="hover:text-[#E84D91] transition underline cursor-pointer text-[#E84D91] inline-flex items-center gap-1"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Kebijakan Privasi</span>
              </button>
              <span className="text-[#E9B8CA]">·</span>
            </>
          )}

          <a
            href="mailto:riellybooth@gmail.com"
            className="hover:text-[#E84D91] transition inline-flex items-center gap-1.5"
          >
            <Mail className="w-3.5 h-3.5 text-[#E84D91]" />
            <span>riellybooth@gmail.com</span>
          </a>
          <span className="text-[#E9B8CA]">·</span>
          <a
            href="https://instagram.com/riellybooth"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#E84D91] hover:underline transition inline-flex items-center gap-1.5"
          >
            <Instagram className="w-3.5 h-3.5 text-[#E84D91]" />
            <span>@riellybooth</span>
          </a>
          <span className="text-[#E9B8CA]">·</span>
          <a
            href="https://tiktok.com/@riellybooth_"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#E84D91] transition inline-flex items-center gap-1.5"
          >
            <TikTokIcon className="w-3.5 h-3.5 text-[#E84D91]" />
            <span>@riellybooth_</span>
          </a>
          <span className="text-[#E9B8CA]">·</span>
          <a
            href="https://instagram.com/dhikasatriaaa"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#E84D91] underline transition inline-flex items-center gap-1.5 text-[#8B7180]"
          >
            <Instagram className="w-3.5 h-3.5 text-[#8B7180]" />
            <span>Dev: @dhikasatriaaa</span>
          </a>
        </div>

        <div className="text-[10px] text-[#8B7180] font-sans">
          © 2026 RiellyBooth · All photos processed 100% locally in your browser.
        </div>
      </footer>
    </div>
  );
}
