"use client";

import React, { useState } from "react";
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

function PhotostripTrioShowcase() {
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

        {/* Center Strip (Front) - Coquette Ribbon Style */}
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
            <span>rielllybooth ♡</span>
            <span className="text-[9px] font-bold text-slate-500">2026.08.09</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LandingStep({ onStart }: { onStart: () => void }) {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "Apakah rielllybooth 100% gratis?",
      a: "Ya, 100% gratis tanpa biaya tersembunyi dan hasil foto tanpa watermark.",
    },
    {
      q: "Apakah foto saya disimpan di server?",
      a: "Tidak, semua pemrosesan foto dilakukan secara lokal di browser Anda untuk menjaga privasi 100%.",
    },
    {
      q: "Bagaimana cara kerja Peace Auto-Take (✌️)?",
      a: "Cukup angkat 2 jari di depan kamera, sistem akan mendeteksi gesture dan memulai hitungan 1.5s otomatis tanpa pencet shutter.",
    },
    {
      q: "Apakah bisa download Live Photo video?",
      a: "Bisa! Selain photo strip PNG HD, kamu juga bisa menyimpan klip video bergerak boomerang MP4/Reels secara langsung.",
    },
  ];

  return (
    <div className="w-full max-w-5xl px-4 sm:px-6 py-6 sm:py-8 flex flex-col items-center gap-10 sm:gap-14 text-[#3C2A2A] animate-in fade-in duration-300 relative">
      {/* Pattern Background Overlay */}
      <div className="absolute inset-0 bg-pattern-polkadot bg-rose-50/40 rounded-3xl -z-10 pointer-events-none"></div>

      {/* 1. HERO SECTION WITH MIXED COLOR HEADLINE */}
      <section className="w-full flex flex-col items-center text-center gap-5 pt-2">
        {/* Brand Badge */}
        <div className="inline-flex items-center gap-1 px-4 py-1 bg-white border border-pink-300 text-[#3C2A2A] rounded-full text-xs font-extrabold shadow-xs">
          <span>rielllybooth ♡</span>
        </div>

        {/* Mixed Color Headline */}
        <div className="space-y-3 max-w-2xl">
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            <span className="text-[#3C2A2A] block font-black">Bikin photo strip?</span>
            <span className="text-[#FF5588] bg-pink-100/90 px-5 py-1.5 rounded-2xl border-2 border-pink-300 inline-block mt-2 font-black shadow-xs">
              Tinggal pose aja ♡
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto font-medium leading-relaxed">
            Ga perlu antri studio, gak perlu install aplikasi. Tinggal pose peace ✌️, kamera yang jepret, langsung jadi photostrip + live photo siap masuk IG Story & TikTok!
          </p>
        </div>

        {/* Primary CTA & Trust Microcopy */}
        <div className="flex flex-col items-center gap-2 pt-1">
          <button
            type="button"
            onClick={onStart}
            className="bg-pink-400 hover:bg-pink-500 border-2 border-pink-500 text-white rounded-full px-8 py-3.5 text-base sm:text-lg font-extrabold shadow-md hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 group cursor-pointer"
          >
            <span>Mulai Sesi Photobooth 📸</span>
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </button>
          <span className="text-xs font-bold text-pink-600">
            100% Gratis · HD Quality · Live Photo · Tanpa Daftar
          </span>
        </div>

        {/* Visual Showcase: 3D Stacked Photostrip Trio Showcase */}
        <PhotostripTrioShowcase />
      </section>

      {/* 2. FEATURE BENTO CARDS HIGHLIGHTING ACTUAL RIELLLYBOOTH FEATURES */}
      <section className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Card 1: Peace Auto-Take */}
        <div className="bg-white border-2 border-pink-200 p-6 rounded-3xl shadow-sm hover:-translate-y-1 transition-transform text-left flex items-start gap-4">
          <div className="p-3 bg-pink-50 border border-pink-200 rounded-2xl shrink-0">
            <Hand className="w-6 h-6 text-pink-500" />
          </div>
          <div className="space-y-1">
            <h3 className="font-extrabold text-[#3C2A2A] text-sm sm:text-base flex items-center gap-1.5">
              <span>✌️ Peace Auto-Take</span>
            </h3>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              Pose peace 1.5s, kamera jepret otomatis tanpa perlu pencet shutter.
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
              <span>🎥 Live Photo (Moving Video)</span>
            </h3>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              Rekam klip video bergerak boomerang yang bisa didownload sebagai MP4/Reels.
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
              <span>🪞 Flip Foto (Mirror/Normal)</span>
            </h3>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              Balik foto kapan saja antara mode mirror atau normal tanpa perlu foto ulang.
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
              <span>🎨 Webcam Toy & 16+ Bingkai</span>
            </h3>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              Filter retro Pixel Art, Thermal, VHS CRT + bingkai viral Gen Z (Newspaper, Passport, Struk, Photocard).
            </p>
          </div>
        </div>
      </section>

      {/* 3. SIMPLE 3-STEP "HOW IT WORKS" */}
      <section className="w-full bg-white border border-pink-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="text-center">
          <h2 className="text-xl sm:text-2xl font-black text-[#3C2A2A]">
            Cara Pakainya
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-pink-50/60 border border-pink-200 p-5 rounded-2xl text-left space-y-3 flex flex-col justify-between">
            <div className="w-10 h-10 rounded-xl bg-pink-400 text-white flex items-center justify-center font-black text-lg shadow-xs border border-pink-500">
              01
            </div>
            <div className="space-y-1">
              <h3 className="font-extrabold text-[#3C2A2A] text-sm">
                Izinkan Kamera
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Akses kamera browser kamu
              </p>
            </div>
          </div>

          <div className="bg-pink-50/60 border border-pink-200 p-5 rounded-2xl text-left space-y-3 flex flex-col justify-between">
            <div className="w-10 h-10 rounded-xl bg-pink-400 text-white flex items-center justify-center font-black text-lg shadow-xs border border-pink-500">
              02
            </div>
            <div className="space-y-1">
              <h3 className="font-extrabold text-[#3C2A2A] text-sm">
                Pose Peace
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Kamera otomatis jepret foto
              </p>
            </div>
          </div>

          <div className="bg-pink-50/60 border border-pink-200 p-5 rounded-2xl text-left space-y-3 flex flex-col justify-between">
            <div className="w-10 h-10 rounded-xl bg-pink-400 text-white flex items-center justify-center font-black text-lg shadow-xs border border-pink-500">
              03
            </div>
            <div className="space-y-1">
              <h3 className="font-extrabold text-[#3C2A2A] text-sm">
                Simpan Foto
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Unduh photo strip HD & Live Video
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FAQ ACCORDION */}
      <section className="w-full bg-white border border-pink-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-5 text-left">
        <h2 className="text-xl sm:text-2xl font-black text-[#3C2A2A] text-center">
          Pertanyaan Sering Diajukan
        </h2>

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

      {/* 5. FINAL CTA */}
      <section className="w-full bg-pink-50/70 border-2 border-pink-300 rounded-3xl p-6 sm:p-8 shadow-xs text-center space-y-3">
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-black text-[#3C2A2A]">
            satu foto lagi?
          </h2>
          <p className="text-xs font-medium text-slate-600">
            Kalau tadi belum dapet yang pas, coba lagi.
          </p>
        </div>

        <button
          type="button"
          onClick={onStart}
          className="bg-pink-400 hover:bg-pink-500 border-2 border-pink-500 text-white rounded-full px-7 py-3 text-xs sm:text-sm font-extrabold shadow-md hover:scale-105 active:scale-95 transition-all inline-flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Foto Lagi 🎀</span>
        </button>
      </section>

      {/* 6. SINGLE COMPACT FOOTER WITH VECTOR ICONS */}
      <footer className="w-full border-t border-pink-200 pt-6 pb-2 text-center text-xs text-slate-600 flex flex-col items-center justify-center gap-2.5">
        <div className="font-bold text-[#3C2A2A]">
          © 2026 rielllybooth 🎀 · &ldquo;buat momen yang pengen kamu simpan&rdquo;
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-bold">
          <a
            href="mailto:rielllybooth@gmail.com"
            className="hover:text-pink-600 transition inline-flex items-center gap-1.5"
          >
            <Mail className="w-3.5 h-3.5 text-pink-500" />
            <span>rielllybooth@gmail.com</span>
          </a>
          <span className="text-pink-300">·</span>
          <a
            href="https://instagram.com/rielllybooth"
            target="_blank"
            rel="noopener noreferrer"
            className="text-pink-600 hover:underline transition inline-flex items-center gap-1.5"
          >
            <Instagram className="w-3.5 h-3.5 text-pink-500" />
            <span>@rielllybooth</span>
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
      </footer>
    </div>
  );
}