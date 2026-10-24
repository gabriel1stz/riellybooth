"use client";

import React, { useState, useRef } from "react";
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
  Clock,
  ShieldCheck,
  Star,
  Flame,
  Layers,
  Heart,
  QrCode,
  Tag,
  Coffee,
  Users,
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
    label: "pose #1",
  },
  {
    local: "/samples/pose2.jpg",
    fallback: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
    label: "pose #2",
  },
  {
    local: "/samples/pose3.jpg",
    fallback: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80",
    label: "pose #3",
  },
  {
    local: "/samples/pose4.jpg",
    fallback: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
    label: "pose #4",
  },
];

// Curated Showcase of Viral Frames with Distinct Varied Visual Previews
const FEATURED_FRAMES = [
  {
    id: "halloween_spooky",
    title: "Halloween Spooky 🎃",
    badge: "Limited (7 Hari Lagi!)",
    tagColor: "bg-orange-500 text-white",
    cardBg: "bg-slate-950 border-orange-500 text-orange-200",
    description: "Labu jack-o'-lantern, kelelawar terbang & nuansa gothic mistis.",
    sampleUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=500&q=80",
    tags: ["Halloween", "Spooky", "Limited 🎃"],
  },
  {
    id: "student_kalcer",
    title: "Student Kalcer (Si Paling Rajin) 🎓",
    badge: "Viral TikTok 🔥",
    tagColor: "bg-stone-900 text-white",
    cardBg: "bg-[#fbf9f4] border-stone-800 text-stone-900",
    description: "Koran editorial vintage: headline Student Kalcer, si paling rajin, dan kolom berita ambis berstempel riellybooth.",
    sampleUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=500&q=80",
    tags: ["Student Kalcer", "Newspaper", "Viral TikTok"],
  },
  {
    id: "riellmatics_news",
    title: "Riellmatics Daily News 📰",
    badge: "Trending 🔥",
    tagColor: "bg-stone-900 text-white",
    cardBg: "bg-stone-100 border-stone-400 text-stone-900",
    description: "Headline koran editorial retro hitam-putih ala majalah vintage khas riellybooth.",
    sampleUrl: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=500&q=80",
    tags: ["Editorial", "Monochrome", "Vintage"],
  },
  {
    id: "coquette_ribbon",
    title: "Coquette Ribbon 🎀",
    badge: "Viral Gen Z",
    tagColor: "bg-pink-500 text-white",
    cardBg: "bg-white border-pink-300 text-pink-700",
    description: "Pita satin lembut, pearl borders, dan tone blush pink estetik.",
    sampleUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80",
    tags: ["Coquette", "Aesthetic", "Soft Pink"],
  },
  {
    id: "cyber_y2k",
    title: "Cyber Y2K Sparkle ✨",
    badge: "Retro Cyber",
    tagColor: "bg-purple-600 text-white",
    cardBg: "bg-gradient-to-b from-purple-950 to-indigo-950 border-purple-400 text-purple-200",
    description: "Sparkle bintang 4 sudut, chrome metallic & vibe tahun 2000-an.",
    sampleUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=500&q=80",
    tags: ["Y2K", "Cyber", "Sparkles"],
  },
  {
    id: "cafe_receipt",
    title: "Struk Cafe Vintage 🧾",
    badge: "Cozy Mood",
    tagColor: "bg-amber-700 text-white",
    cardBg: "bg-amber-50 border-amber-300 text-amber-900",
    description: "Thermal receipt struk kopi estetik lengkap barcode & rincian pesanan.",
    sampleUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=500&q=80",
    tags: ["Receipt", "Cafe", "Thermal"],
  },
  {
    id: "pestapora_pass",
    title: "Musikfest VIP Pass 🎫",
    badge: "Festival",
    tagColor: "bg-emerald-600 text-white",
    cardBg: "bg-emerald-950 border-emerald-400 text-emerald-200",
    description: "Tiket festival backstage VIP pass dengan lanyard clip digital.",
    sampleUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=500&q=80",
    tags: ["Concert", "VIP Pass", "Festival"],
  },
  {
    id: "photocard_kpop",
    title: "Photocard Idol K-Pop 📸",
    badge: "Hallyu",
    tagColor: "bg-rose-500 text-white",
    cardBg: "bg-rose-50 border-rose-300 text-rose-800",
    description: "Sudut rounded 4R layaknya official photocard album idol K-Pop.",
    sampleUrl: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=500&q=80",
    tags: ["K-Pop", "Photocard", "Polarr"],
  },
  {
    id: "manner_high",
    title: "Manner High Webtoon 🏫",
    badge: "Anime Mood",
    tagColor: "bg-sky-600 text-white",
    cardBg: "bg-sky-50 border-sky-300 text-sky-800",
    description: "Seragam sekolah Korea & bingkai manga panel aesthetic.",
    sampleUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=500&q=80",
    tags: ["School", "Webtoon", "Manga"],
  },
];

const TESTIMONIALS = [
  {
    user: "@nayla.aest",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
    role: "TikTok Creator",
    comment: "Sumpah frame Halloween-nya gemes bangettt 😭🎃 auto jepret pake pose peace gak ribet sama sekali! Hasilnya langsung aku upload ke IG Story.",
    rating: 5,
  },
  {
    user: "@kevin.ar",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
    role: "Mahasiswa ITB",
    comment: "Akhirnya nemu photobooth web yang bisa live photo boomerang terus gak ada watermarknya! Fitur double strip 2x4 buat diprint juga mantep bgt.",
    rating: 5,
  },
  {
    user: "@chelseaa.m",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80",
    role: "Gen Z Aesthetic",
    comment: "Cocok bgt buat bikin photostrip bareng ayang pas nongkrong di cafe tanpa bayar 50rb di mall 💖 Filter retro-nya cakep pol!",
    rating: 5,
  },
  {
    user: "@dimas.pr",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80",
    role: "Fotografer Mobile",
    comment: "Keren karena 100% diproses di browser sendiri jadi privasi foto aman gak diupload ke server orang. Plus timer 3s/5s ngebantu bgt pas cahaya remang.",
    rating: 5,
  },
];

function PhotostripTrioShowcase() {
  // Dynamic today's date formatted as YYYY.MM.DD
  const todayDateStr = new Date().toISOString().slice(0, 10).replace(/-/g, ".");

  return (
    <div className="relative w-full max-w-md mt-6 sm:mt-8 flex justify-center items-center py-4">
      {/* Washi Tape Clip Vector */}
      <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-20 h-6 bg-pink-200/90 border border-pink-300 rounded-xs rotate-1 z-40 shadow-xs"></div>

      {/* Floating Micro-Badges */}
      <span className="absolute -top-3 left-1 sm:left-2 z-40 bg-white border border-pink-300 text-[#3C2A2A] text-[11px] font-black px-3 py-1 rounded-full shadow-xs -rotate-6">
        auto jepret ✌️
      </span>
      <span className="absolute top-1/2 -right-3 sm:-right-6 z-40 bg-white border border-pink-300 text-[#3C2A2A] text-[11px] font-black px-3 py-1 rounded-full shadow-xs rotate-6">
        flip foto 🪞
      </span>
      <span className="absolute -bottom-3 left-4 z-40 bg-pink-100 border border-pink-300 text-[#3C2A2A] text-[11px] font-black px-3 py-1 rounded-full shadow-xs -rotate-3">
        100% gratis ✨
      </span>

      {/* Stacked Trio */}
      <div className="relative flex justify-center items-center w-full min-h-[380px]">
        {/* Left Strip (Back Left) - Newspaper Style */}
        <div className="absolute -rotate-6 -translate-x-14 sm:-translate-x-20 z-10 opacity-90 scale-90 hover:rotate-0 hover:z-30 transition-all duration-300 bg-stone-100 border-2 border-stone-300 p-2.5 rounded-2xl shadow-md w-40 sm:w-48 space-y-1.5 text-center">
          <div className="text-[9px] font-mono font-bold text-stone-700 border-b border-stone-300 pb-1">
            THE DAILY PHOTOBOOTH
          </div>
          {SAMPLE_POSES.slice(0, 3).map((pose, idx) => (
            <div key={idx} className="bg-stone-200 rounded-lg overflow-hidden aspect-[4/3]">
              <img
                src={pose.local}
                alt={pose.label}
                className="w-full h-full object-cover grayscale brightness-90"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = pose.fallback;
                }}
              />
            </div>
          ))}
          <div className="text-[8px] font-mono text-stone-500">NEWSPAPER EDITION</div>
        </div>

        {/* Right Strip (Back Right) - Polkadot Style */}
        <div className="absolute rotate-6 translate-x-14 sm:translate-x-20 z-10 opacity-90 scale-90 hover:rotate-0 hover:z-30 transition-all duration-300 bg-pink-50 border-2 border-pink-300 p-2.5 rounded-2xl shadow-md w-40 sm:w-48 space-y-1.5 text-center bg-pattern-polkadot">
          {SAMPLE_POSES.slice(1, 4).map((pose, idx) => (
            <div key={idx} className="bg-white border border-pink-200 rounded-lg overflow-hidden aspect-[4/3]">
              <img
                src={pose.local}
                alt={pose.label}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = pose.fallback;
                }}
              />
            </div>
          ))}
          <div className="text-[9px] font-black text-pink-500">POLKADOT CUTE</div>
        </div>

        {/* Center Strip (Front) - Coquette Ribbon Style with DYNAMIC CURRENT DATE */}
        <div className="relative z-20 scale-100 bg-white border-2 border-pink-300 p-3 rounded-2xl shadow-xl w-44 sm:w-52 space-y-2 text-center transition-transform duration-300 hover:scale-105">
          <div className="text-[10px] font-black text-pink-500 flex items-center justify-center gap-1">
            <span>🎀 Coquette Ribbon 🎀</span>
          </div>
          {SAMPLE_POSES.map((pose, idx) => (
            <div key={idx} className="bg-pink-50 border border-pink-200 rounded-xl overflow-hidden aspect-[4/3] relative group">
              <img
                src={pose.local}
                alt={pose.label}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = pose.fallback;
                }}
              />
              <span className="absolute bottom-1 right-1 bg-black/40 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded backdrop-blur-xs">
                {pose.label}
              </span>
            </div>
          ))}
          <div className="pt-1.5 border-t border-pink-200 text-[10px] font-black text-[#3C2A2A] flex items-center justify-between px-1">
            <span>riellybooth ♡</span>
            <span className="text-[9px] font-bold text-slate-500">{todayDateStr}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

type LandingStepProps = {
  onStart: () => void;
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
  lang = "id",
}: LandingStepProps) {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const heroFileInputRef = useRef<HTMLInputElement | null>(null);

  const handleHeroFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0 && onUploadPhotos) {
      onUploadPhotos(e.target.files);
    }
  };

  const faqs = [
    {
      q: "Apakah foto saya disimpan di server riellybooth?",
      a: "TIDAK SAMA SEKALI. 100% pemrosesan foto strip, live photo video, filter, dan stiker diproses secara lokal di browser kamu menggunakan HTML5 Canvas & WebRTC. Foto kamu tidak pernah diunggah atau disimpan di server mana pun, sehingga aman dan privat.",
    },
    {
      q: "Apakah riellybooth 100% gratis tanpa watermark?",
      a: "Ya, 100% gratis! Semua unduhan photo strip format PNG HD dan video boomerang MP4 bebas watermark.",
    },
    {
      q: "Bagaimana kalau pose Peace (✌️) tidak terdeteksi?",
      a: "Tenang! Kami sudah menambahkan mode Timer 3 Detik, 5 Detik, dan Jepret Instan sebagai alternatif. Kamu bisa memilih mode timer jika pencahayaan ruangan redup atau kamera HP sulit mendeteksi gesture.",
    },
    {
      q: "Bisa pakai foto yang sudah ada di galeri HP?",
      a: "Bisa banget! Klik tombol 'Upload Galeri 🖼️' di halaman depan atau saat sesi capture untuk langsung memilih 4 foto favoritmu tanpa perlu menyalakan kamera.",
    },
    {
      q: "Bagaimana cara cetak format 4R (Double Strip 2x4)?",
      a: "Di tahap editor, pilih layout 'Double Strip 2x4'. Hasil unduhan akan memiliki resolusi cetak 1200x1800 piksel (sesuai standar kertas foto 4R / 4x6 inci), sehingga kamu bisa memotongnya jadi 2 strip identik buat dibagi ke bestie!",
    },
  ];

  return (
    <div className="w-full max-w-5xl px-4 sm:px-6 py-6 sm:py-8 flex flex-col items-center gap-10 sm:gap-14 text-[#3C2A2A] animate-in fade-in duration-300 relative">
      {/* Pattern Background Overlay */}
      <div className="absolute inset-0 bg-pattern-polkadot bg-rose-50/40 rounded-3xl -z-10 pointer-events-none"></div>

      {/* 1. HERO SECTION WITH HIGH-IMPACT HEADLINE & DUAL CTA */}
      <section className="w-full flex flex-col items-center text-center gap-5 pt-2">
        {/* Brand Badge & What's New Banner */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <div className="inline-flex items-center gap-1 px-4 py-1.5 bg-white border border-pink-300 text-[#3C2A2A] rounded-full text-xs font-extrabold shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-pink-500 animate-pulse" />
            <span>riellybooth ♡ photobooth online gratis</span>
          </div>

          {onOpenWhatsNew && (
            <button
              type="button"
              onClick={onOpenWhatsNew}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-pink-50 to-rose-50 hover:from-pink-100 hover:to-rose-100 border border-pink-300 text-pink-700 rounded-full text-xs font-black shadow-xs hover:scale-105 active:scale-95 transition-all cursor-pointer group"
            >
              <Sparkles className="w-3.5 h-3.5 text-pink-500 animate-bounce" />
              <span>Apa yang baru di v2.0? 🔥</span>
              <ArrowRight className="w-3 h-3 text-pink-600 transition-transform group-hover:translate-x-0.5" />
            </button>
          )}
        </div>

        {/* Mixed Color Headline */}
        <div className="space-y-3 max-w-2xl">
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            <span className="text-[#3C2A2A] block font-black">Bikin photo strip online?</span>
            <span className="text-[#FF5588] bg-pink-100/90 px-5 py-1.5 rounded-2xl border-2 border-pink-300 inline-block mt-2 font-black shadow-xs">
              Tinggal pose aja ♡
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto font-medium leading-relaxed">
            Gak perlu antri studio mahal di mall. Cukup angkat 2 jari peace ✌️ atau gunakan mode timer, kamera langsung jepret otomatis jadi photostrip HD + Live Photo tanpa watermark!
          </p>
        </div>

        {/* Primary CTA Row: Camera Start + LDR Remote + Gallery Upload */}
        <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 pt-1 w-full max-w-xl">
          <button
            type="button"
            onClick={onStart}
            className="w-full sm:w-auto bg-pink-400 hover:bg-pink-500 border-2 border-pink-500 text-white rounded-full px-6 py-3.5 text-sm sm:text-base font-extrabold shadow-md hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 group cursor-pointer"
          >
            <Camera className="w-5 h-5 animate-pulse" />
            <span>Mulai Photobooth 📸</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>

          {onOpenLDR && (
            <button
              type="button"
              onClick={onOpenLDR}
              className="w-full sm:w-auto px-5 py-3.5 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white rounded-full text-xs sm:text-sm font-extrabold shadow-md hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer relative"
            >
              <Users className="w-4 h-4" />
              <span>Foto Jarak Jauh (LDR) 👯‍♀️</span>
              <span className="px-1.5 py-0.2 bg-amber-400 text-slate-900 text-[9px] font-black rounded-full uppercase tracking-wider">
                BARU
              </span>
            </button>
          )}

          {/* Hidden File Input for Gallery Upload */}
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
            className="w-full sm:w-auto px-5 py-3.5 bg-white hover:bg-rose-50 border-2 border-pink-300 text-slate-700 rounded-full text-xs sm:text-sm font-extrabold shadow-xs hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Upload className="w-4 h-4 text-pink-500" />
            <span>Upload Galeri 🖼️</span>
          </button>
        </div>

        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-rose-100/90 border border-pink-300 rounded-full shadow-xs">
          <span className="text-xs sm:text-sm font-black text-[#8B2E4E] tracking-wide">
            ✨ 100% Gratis · HD Quality · Live Photo Boomerang · Tanpa Watermark ✨
          </span>
        </div>

        {/* Visual Showcase: 3D Stacked Photostrip Trio Showcase */}
        <PhotostripTrioShowcase />
      </section>

      {/* 2. REAL FEATURES & PRIVACY HIGHLIGHTS BAR */}
      <section className="w-full bg-white border-2 border-pink-200 rounded-3xl p-4 sm:p-6 shadow-sm">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center divide-y md:divide-y-0 md:divide-x divide-pink-100">
          <div className="space-y-1 py-1">
            <div className="text-2xl sm:text-3xl font-black text-[#FF5588]">16+</div>
            <div className="text-xs font-bold text-slate-600">Pilihan Bingkai Viral</div>
          </div>

          <div className="space-y-1 py-1">
            <div className="text-2xl sm:text-3xl font-black text-emerald-600 flex items-center justify-center gap-1">
              <ShieldCheck className="w-6 h-6 text-emerald-500" />
              <span>100%</span>
            </div>
            <div className="text-xs font-bold text-slate-600">Privasi Lokal Browser (0 Upload)</div>
          </div>

          <div className="space-y-1 py-1">
            <div className="text-2xl sm:text-3xl font-black text-indigo-600">HD & 4R</div>
            <div className="text-xs font-bold text-slate-600">Format Cetak & Boomerang MP4</div>
          </div>

          <div className="space-y-1 py-1">
            <div className="text-2xl sm:text-3xl font-black text-rose-500">Gratis</div>
            <div className="text-xs font-bold text-slate-600">Bebas Watermark Selamanya</div>
          </div>
        </div>
      </section>

      {/* 3. INTERACTIVE VIRAL FRAME SHOWCASE GALLERY (16+ FRAME DIVERSITY) */}
      <section className="w-full space-y-6 text-center">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-pink-100 border border-pink-300 text-pink-700 rounded-full text-xs font-extrabold">
            <Flame className="w-3.5 h-3.5 text-pink-600" />
            <span>Koleksi Bingkai Viral 2026</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#3C2A2A]">
            Pilih Vibe Favorit Kamu ✨
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto font-medium">
            Dari edisi terbatas Halloween Spooky 🎃 sampai gaya koran editorial The Daily News 📰, temukan frame paling cocok buat feed IG & TikTok kamu!
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
          {FEATURED_FRAMES.map((f) => (
            <div
              key={f.id}
              className={`rounded-3xl border-2 p-4 shadow-sm hover:-translate-y-1.5 hover:shadow-lg transition-all duration-300 flex flex-col justify-between ${f.cardBg} group`}
            >
              <div className="space-y-3">
                {/* Header Tag */}
                <div className="flex justify-between items-center">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wide ${f.tagColor}`}>
                    {f.badge}
                  </span>
                  <Heart className="w-4 h-4 text-pink-400 group-hover:scale-125 transition-transform" />
                </div>

                {/* Preview Image Thumbnail */}
                <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden border border-white/20 bg-black/10 relative">
                  <img
                    src={f.sampleUrl}
                    alt={f.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-2.5">
                    <span className="text-white text-xs font-extrabold drop-shadow-md">
                      {f.title}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs font-medium leading-relaxed opacity-90">
                  {f.description}
                </p>

                {/* Micro tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {f.tags.map((t, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 bg-black/5 dark:bg-white/10 rounded-md text-[10px] font-bold"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={onStart}
                className="mt-4 w-full py-2.5 px-3 bg-pink-500 hover:bg-pink-600 text-white font-black text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Pakai Frame Ini</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 4. SECTION "APA YANG BARU" / CHANGELOG v2.5 */}
      <section className="w-full bg-gradient-to-br from-pink-50/80 via-white to-purple-50/80 border-2 border-pink-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-5 text-left">
        <div className="flex flex-wrap justify-between items-center gap-2 border-b border-pink-200 pb-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-pink-100 border border-pink-300 text-pink-700 rounded-full text-xs font-black">
              <span>🚀 Update v2.5 Baru Rilis</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[#3C2A2A]">
              Apa yang Baru di riellybooth?
            </h2>
          </div>
          <span className="text-xs font-bold text-slate-500">Oktober 2026</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3 bg-white p-4 rounded-2xl border border-pink-100 shadow-xs">
            <span className="text-2xl">🎃</span>
            <div className="space-y-0.5">
              <h3 className="font-extrabold text-xs sm:text-sm text-[#3C2A2A]">
                Frame Spesial Halloween Spooky
              </h3>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                Menyambut Halloween 31 Oktober! Lengkap dengan ukiran labu, kelelawar malam, dan jaring laba-laba estetik.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-white p-4 rounded-2xl border border-pink-100 shadow-xs">
            <span className="text-2xl">⏱️</span>
            <div className="space-y-0.5">
              <h3 className="font-extrabold text-xs sm:text-sm text-[#3C2A2A]">
                Mode Timer 3s, 5s & Jepret Instan
              </h3>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                Cadangan handal saat pose peace susah terdeteksi karena ruangan remang atau kamera HP buram.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-white p-4 rounded-2xl border border-pink-100 shadow-xs">
            <span className="text-2xl">👯</span>
            <div className="space-y-0.5">
              <h3 className="font-extrabold text-xs sm:text-sm text-[#3C2A2A]">
                Layout Double Strip 2x4 (Print 4R)
              </h3>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                Cetak 2 strip langsung dalam satu lembar foto 4R standar (1200x1800), tinggal potong tengah buat bestie.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-white p-4 rounded-2xl border border-pink-100 shadow-xs">
            <span className="text-2xl">🏷️</span>
            <div className="space-y-0.5">
              <h3 className="font-extrabold text-xs sm:text-sm text-[#3C2A2A]">
                Sticker Packs Tematik & QR Code HP
              </h3>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                Koleksi stiker Coquette, Spooky, Y2K, Cafe & fitur scan QR untuk ambil hasil strip langsung di HP.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FEATURE BENTO CARDS HIGHLIGHTING ACTUAL RIELLYBOOTH FEATURES */}
      <section className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Card 1: Peace Auto-Take */}
        <div className="bg-white border-2 border-pink-200 p-6 rounded-3xl shadow-sm hover:-translate-y-1 transition-transform text-left flex items-start gap-4">
          <div className="p-3 bg-pink-50 border border-pink-200 rounded-2xl shrink-0">
            <Hand className="w-6 h-6 text-pink-500" />
          </div>
          <div className="space-y-1">
            <h3 className="font-extrabold text-[#3C2A2A] text-sm sm:text-base flex items-center gap-1.5">
              <span>✌️ Peace Auto-Take & Timer Mode</span>
            </h3>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              Pose peace 1 detik kamera jepret otomatis, atau aktifkan timer 3s/5s untuk hitungan mundur santai.
            </p>
          </div>
        </div>

        {/* Card 2: Live Photo */}
        <div className="bg-white border-2 border-pink-200 p-6 rounded-3xl shadow-sm hover:-translate-y-1 transition-transform text-left flex items-start gap-4">
          <div className="p-3 bg-pink-50 border border-pink-200 rounded-2xl shrink-0">
            <Video className="w-6 h-6 text-pink-500" />
          </div>
          <div className="space-y-1">
            <h3 className="font-extrabold text-[#3C2A2A] text-sm sm:text-base flex items-center gap-1.5">
              <span>🎥 Live Photo (Moving Video MP4)</span>
            </h3>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              Rekam klip bergerak boomerang yang bisa langsung diunduh sebagai MP4 untuk Instagram Reels & TikTok.
            </p>
          </div>
        </div>

        {/* Card 3: Flip Foto */}
        <div className="bg-white border-2 border-pink-200 p-6 rounded-3xl shadow-sm hover:-translate-y-1 transition-transform text-left flex items-start gap-4">
          <div className="p-3 bg-pink-50 border border-pink-200 rounded-2xl shrink-0">
            <RefreshCcw className="w-6 h-6 text-pink-500" />
          </div>
          <div className="space-y-1">
            <h3 className="font-extrabold text-[#3C2A2A] text-sm sm:text-base flex items-center gap-1.5">
              <span>🪞 Flip Mirror & Unggah Galeri</span>
            </h3>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              Balik foto kapan saja tanpa foto ulang, atau unggah foto lama dari galeri HP buat dibikin photostrip.
            </p>
          </div>
        </div>

        {/* Card 4: Webcam Toy & Bingkai */}
        <div className="bg-white border-2 border-pink-200 p-6 rounded-3xl shadow-sm hover:-translate-y-1 transition-transform text-left flex items-start gap-4">
          <div className="p-3 bg-pink-50 border border-pink-200 rounded-2xl shrink-0">
            <Wand2 className="w-6 h-6 text-pink-500" />
          </div>
          <div className="space-y-1">
            <h3 className="font-extrabold text-[#3C2A2A] text-sm sm:text-base flex items-center gap-1.5">
              <span>🎨 16+ Bingkai Estetik & Filter Retro</span>
            </h3>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              Filter Pixel Art, Thermal, VHS CRT, Film Grain + stiker lucu yang bisa digeser dan disesuaikan.
            </p>
          </div>
        </div>
      </section>

      {/* 6. REAL GEN Z SOCIAL PROOF & TESTIMONIALS GRID */}
      <section className="w-full space-y-6 text-center">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-pink-100 border border-pink-300 text-pink-700 rounded-full text-xs font-extrabold">
            <Heart className="w-3.5 h-3.5 text-pink-600 fill-pink-500" />
            <span>Kata Mereka yang Sudah Coba</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#3C2A2A]">
            Dicintai Ribuan Bestie di TikTok & IG 💖
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
          {TESTIMONIALS.map((t, idx) => (
            <div
              key={idx}
              className="bg-white border-2 border-pink-200 p-5 rounded-3xl shadow-xs space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex text-amber-400">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs font-medium text-slate-700 leading-relaxed italic">
                  &ldquo;{t.comment}&rdquo;
                </p>
              </div>

              <div className="flex items-center gap-2.5 pt-2 border-t border-pink-100">
                <img
                  src={t.avatar}
                  alt={t.user}
                  className="w-9 h-9 rounded-full object-cover border border-pink-300"
                />
                <div>
                  <div className="text-xs font-black text-slate-800">{t.user}</div>
                  <div className="text-[10px] text-pink-600 font-bold">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. TRANSPARENT PRIVACY & FAQ ACCORDION (100% IN-BROWSER ZERO SERVER UPLOAD) */}
      <section className="w-full bg-white border border-pink-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6 text-left">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 border border-emerald-300 text-emerald-800 rounded-full text-xs font-black">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Privasi & Keamanan Terjamin</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#3C2A2A]">
            Pertanyaan yang Sering Ditanyakan (FAQ)
          </h2>
          <p className="text-xs text-slate-500 max-w-lg mx-auto">
            Semua hal yang perlu kamu tahu tentang cara kerja riellybooth.
          </p>
        </div>

        {/* Prominent Privacy Highlight Box for Web Fetchers & Users */}
        <div className="bg-emerald-50/80 border-2 border-emerald-200 p-4 rounded-2xl flex items-start gap-3">
          <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <h4 className="font-black text-xs sm:text-sm text-emerald-900">
              Apakah Foto Saya Diunggah ke Server? (100% TIDAK)
            </h4>
            <p className="text-xs text-emerald-800 font-medium leading-relaxed">
              Kamera dan foto kamu diproses secara lokal 100% di peramban (browser) kamu menggunakan teknologi WebRTC & HTML5 Canvas. Kami tidak memiliki server penyimpanan foto, tidak ada database gambar, dan tidak ada pihak ketiga yang dapat melihat foto kamu.
            </p>
          </div>
        </div>

        <div className="space-y-2.5 max-w-2xl mx-auto">
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="border border-pink-200 rounded-2xl overflow-hidden bg-pink-50/40 transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full px-4 py-3.5 flex justify-between items-center font-extrabold text-[#3C2A2A] text-xs sm:text-sm hover:bg-white transition text-left cursor-pointer"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-pink-500 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-4 pb-3.5 text-xs font-medium text-slate-600 leading-relaxed border-t border-pink-200 pt-2.5 bg-white">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 8. FINAL INVITATION CTA */}
      <section className="w-full bg-pink-50/80 border-2 border-pink-300 rounded-3xl p-6 sm:p-8 shadow-xs text-center space-y-4">
        <div className="space-y-1">
          <h2 className="text-xl sm:text-3xl font-black text-[#3C2A2A]">
            Siap Abadikan Momen Kamu? 🎀
          </h2>
          <p className="text-xs sm:text-sm font-medium text-slate-600 max-w-md mx-auto">
            Ajak temen, gebetan, atau solo pose sesukamu. Gratis tanpa perlu registrasi akun!
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={onStart}
            className="bg-pink-400 hover:bg-pink-500 border-2 border-pink-500 text-white rounded-full px-8 py-3.5 text-sm sm:text-base font-extrabold shadow-md hover:scale-105 active:scale-95 transition-all inline-flex items-center justify-center gap-2 cursor-pointer"
          >
            <Camera className="w-5 h-5" />
            <span>Mulai Foto Sekarang ✨</span>
          </button>
        </div>
      </section>

      {/* 9. STANDARDIZED FOOTER (RIELLYBOOTH 2 L's) */}
      <footer className="w-full border-t border-pink-200 pt-6 pb-2 text-center text-xs text-slate-600 flex flex-col items-center justify-center gap-2.5">
        <div className="font-bold text-[#3C2A2A]">
          © 2026 riellybooth 🎀 · &ldquo;buat momen yang pengen kamu simpan&rdquo;
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-bold">
          {onOpenPrivacy && (
            <>
              <button
                type="button"
                onClick={onOpenPrivacy}
                className="hover:text-pink-600 transition inline-flex items-center gap-1.5 text-pink-700 underline cursor-pointer"
              >
                <span>Kebijakan Privasi 🔒</span>
              </button>
              <span className="text-pink-300">·</span>
            </>
          )}

          <a
            href="mailto:riellybooth@gmail.com"
            className="hover:text-pink-600 transition inline-flex items-center gap-1.5"
          >
            <Mail className="w-3.5 h-3.5 text-pink-500" />
            <span>riellybooth@gmail.com</span>
          </a>
          <span className="text-pink-300">·</span>
          <a
            href="https://instagram.com/riellybooth"
            target="_blank"
            rel="noopener noreferrer"
            className="text-pink-600 hover:underline transition inline-flex items-center gap-1.5"
          >
            <Instagram className="w-3.5 h-3.5 text-pink-500" />
            <span>@riellybooth</span>
          </a>
          <span className="text-pink-300">·</span>
          <a
            href="https://tiktok.com/@riellybooth_"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-pink-600 transition inline-flex items-center gap-1.5"
          >
            <TikTokIcon className="w-3.5 h-3.5 text-pink-500" />
            <span>@riellybooth_</span>
          </a>
          <span className="text-pink-300">·</span>
          <a
            href="https://instagram.com/dhikasatriaaa"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-600 hover:text-pink-600 underline transition inline-flex items-center gap-1.5"
          >
            <Instagram className="w-3.5 h-3.5 text-[#8B4A5A]" />
            <span>Dev: @dhikasatriaaa</span>
          </a>
        </div>

        <div className="text-[10px] text-slate-400 font-medium">
          Audio BGM: CC0 / Royalty-Free Public Domain Beats · Foto Sampel: Unsplash Commercial Free License
        </div>
      </footer>
    </div>
  );
}