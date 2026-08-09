"use client";

import React, { useState } from "react";
import {
  Camera,
  ArrowRight,
  Sparkles,
  Video,
  Music,
  Wand2,
  Download,
  Hand,
  ChevronDown,
  ChevronUp,
  Mail,
  Instagram,
  Play,
  Pause,
  RefreshCcw,
  CheckCircle2,
} from "lucide-react";

export default function LandingStep({ onStart }: { onStart: () => void }) {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [isPlayingDemoMusic, setIsPlayingDemoMusic] = useState(false);
  const [activeMirrorDemo, setActiveMirrorDemo] = useState<"mirror" | "normal">("mirror");

  const faqs = [
    {
      q: "Apakah rielllybooth 100% gratis?",
      a: "Ya, 100% gratis tanpa biaya tersembunyi dan hasil foto tanpa watermark!",
    },
    {
      q: "Apakah foto saya disimpan di server?",
      a: "Tidak, semua pemrosesan foto dilakukan secara lokal di browser Anda untuk menjaga privasi 100%.",
    },
    {
      q: "Bagaimana cara menggunakan gesture peace (✌️)?",
      a: "Cukup angkat 2 jari (V-sign) di depan kamera, sistem akan mendeteksi gesture dan memulai hitungan 3 detik otomatis.",
    },
    {
      q: "Bisakah saya memilih antara foto Mirror dan Normal?",
      a: "Bisa! Kamu bebas mengatur orientasi foto (mirror/normal) kapan saja sebelum mengunduh hasil photostrip.",
    },
    {
      q: "Apakah bisa digunakan di HP/Mobile?",
      a: "Sangat bisa! rielllybooth dirancang responsif dan lancar di iOS maupun Android.",
    },
    {
      q: "Apakah ada pilihan musik saat berfoto?",
      a: "Ada! Kamu bisa memutar lagu santai (FotoKita) untuk memberikan suasana saat berfoto.",
    },
    {
      q: "Bagaimana jika kamera saya tidak terdeteksi?",
      a: "Pastikan kamu telah mengizinkan akses kamera pada browser (permission popup) saat pertama kali membuka.",
    },
  ];

  return (
    <div className="w-full max-w-5xl px-3 sm:px-6 py-6 sm:py-10 flex flex-col items-center gap-12 sm:gap-20 text-[#3C2A2A] animate-in fade-in duration-300">
      
      {/* 1. HERO SECTION */}
      <section className="w-full flex flex-col items-center text-center gap-6 pt-2 sm:pt-6">
        {/* Brand Pill */}
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-white border border-[#F2C6D1] text-[#3C2A2A] rounded-full text-xs font-bold shadow-xs">
          <span>rielllybooth ♡</span>
        </div>

        {/* Headline & Subheadline */}
        <div className="space-y-4 max-w-3xl">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-[#3C2A2A] leading-tight">
            foto dulu, mikir belakangan.
          </h1>
          <p className="text-sm sm:text-base text-[#6B5252] max-w-xl mx-auto font-medium leading-relaxed">
            Photobooth virtual buat kamu yang pengen foto sendiri, bareng teman, atau cuma iseng bikin photostrip.
          </p>
        </div>

        {/* Primary CTA & Trust Microcopy */}
        <div className="flex flex-col items-center gap-3 pt-2">
          <button
            type="button"
            onClick={onStart}
            className="bg-[#FF85A1] hover:bg-[#F472B6] border-2 border-[#E05770] text-white rounded-full px-8 sm:px-10 py-4 text-base sm:text-lg font-extrabold shadow-sm hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 group cursor-pointer"
          >
            <span>Mulai Sesi Photobooth</span>
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </button>
          <span className="text-xs font-bold text-[#8C6B6B]">
            Gratis · HD · Tanpa Daftar
          </span>
        </div>

        {/* Visual Showcase: Center stacked photostrip preview with subtle floating labels */}
        <div className="relative w-full max-w-md mt-6 sm:mt-8 flex justify-center items-center">
          {/* Subtle floating labels */}
          <span className="absolute -top-3 left-2 sm:left-4 z-20 bg-white border border-[#F2C6D1] text-[#3C2A2A] text-[11px] font-black px-3 py-1 rounded-full shadow-xs -rotate-6">
            auto jepret ✌️
          </span>
          <span className="absolute top-1/2 -right-2 sm:-right-4 z-20 bg-white border border-[#F2C6D1] text-[#3C2A2A] text-[11px] font-black px-3 py-1 rounded-full shadow-xs rotate-6">
            flip foto 🪞
          </span>
          <span className="absolute -bottom-3 left-6 z-20 bg-[#FFF0F3] border border-[#F2C6D1] text-[#3C2A2A] text-[11px] font-black px-3 py-1 rounded-full shadow-xs -rotate-3">
            100% gratis ✨
          </span>

          {/* Handcrafted Photostrip Stack Mockup */}
          <div className="relative bg-white border-2 border-[#F2C6D1] p-3 rounded-2xl shadow-md w-48 sm:w-56 space-y-2 -rotate-1 hover:rotate-0 transition-transform duration-300">
            <div className="bg-[#FFF9F6] border border-[#F2C6D1] rounded-xl aspect-[4/3] flex items-center justify-center p-2 text-center text-xs font-bold text-[#6B5252]">
              <span>pose #1 ✌️</span>
            </div>
            <div className="bg-[#FFF9F6] border border-[#F2C6D1] rounded-xl aspect-[4/3] flex items-center justify-center p-2 text-center text-xs font-bold text-[#6B5252]">
              <span>pose #2 ✨</span>
            </div>
            <div className="bg-[#FFF9F6] border border-[#F2C6D1] rounded-xl aspect-[4/3] flex items-center justify-center p-2 text-center text-xs font-bold text-[#6B5252]">
              <span>pose #3 ♡</span>
            </div>
            <div className="bg-[#FFF9F6] border border-[#F2C6D1] rounded-xl aspect-[4/3] flex items-center justify-center p-2 text-center text-xs font-bold text-[#6B5252]">
              <span>pose #4 🎀</span>
            </div>
            <div className="pt-1 text-center font-bold text-[10px] text-[#8C6B6B] border-t border-[#F2C6D1]">
              rielllybooth • happy captures
            </div>
          </div>
        </div>
      </section>

      {/* 2. INTRO SECTION */}
      <section className="w-full bg-white border border-[#F2C6D1] rounded-3xl p-6 sm:p-10 shadow-xs flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-4 max-w-lg text-left">
          <h2 className="text-2xl sm:text-3xl font-black text-[#3C2A2A]">
            nggak perlu studio buat dapetin foto bagus.
          </h2>
          <p className="text-sm text-[#6B5252] font-medium leading-relaxed">
            Buka kamera, siapin pose, dan biarkan rielllybooth yang ngurus sisanya.
          </p>
          <button
            type="button"
            onClick={onStart}
            className="inline-flex items-center gap-2 text-sm font-black text-[#FF85A1] hover:text-[#E05770] transition"
          >
            <span>Coba Sekarang</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Clean Photostrip Card Mockup */}
        <div className="bg-[#FAF7F2] border border-[#F2C6D1] p-4 rounded-2xl w-44 sm:w-52 space-y-2 shadow-xs rotate-2">
          <div className="bg-white border border-[#F2C6D1] rounded-lg aspect-[4/3] flex items-center justify-center text-xs font-bold text-[#8C6B6B]">
            natural angle 📸
          </div>
          <div className="bg-white border border-[#F2C6D1] rounded-lg aspect-[4/3] flex items-center justify-center text-xs font-bold text-[#8C6B6B]">
            studio quality ✨
          </div>
        </div>
      </section>

      {/* 3. FEATURE 01 — AUTO JEPRET */}
      <section className="w-full bg-[#FFF9F6] border border-[#F2C6D1] rounded-3xl p-6 sm:p-10 shadow-xs flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-4 max-w-lg text-left order-2 md:order-1">
          <span className="px-3 py-1 bg-white border border-[#F2C6D1] text-[#3C2A2A] text-xs font-black rounded-full">
            Feature 01 · Auto Take
          </span>
          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-black text-[#3C2A2A]">
              tinggal pose peace.
            </h2>
            <p className="text-sm font-bold text-[#FF85A1]">
              nggak perlu pencet-pencet.
            </p>
          </div>
          <p className="text-sm text-[#6B5252] font-medium leading-relaxed">
            Angkat dua jari, pose peace, dan rielllybooth bakal otomatis mengambil foto.
          </p>
          <p className="text-xs text-[#8C6B6B] font-semibold italic">
            lebih natural, lebih seru, dan nggak perlu buru-buru cari tombol shutter.
          </p>
        </div>

        {/* Interactive Camera Preview Card Mockup showing ✌️ */}
        <div className="order-1 md:order-2 bg-white border-2 border-[#F2C6D1] p-4 rounded-2xl w-60 sm:w-72 space-y-3 text-center shadow-xs">
          <div className="bg-[#FAF7F2] border border-[#F2C6D1] rounded-xl aspect-[4/3] flex flex-col items-center justify-center gap-2 relative overflow-hidden">
            <Hand className="w-10 h-10 text-[#FF85A1] animate-bounce" />
            <span className="text-xs font-extrabold text-[#3C2A2A]">Peace Gesture Detected! ✌️</span>
            <span className="absolute bottom-2 right-2 px-2 py-0.5 bg-[#FF85A1] text-white text-[10px] font-black rounded">
              3s Countdown
            </span>
          </div>
          <div className="text-[11px] font-bold text-[#8C6B6B]">
            Kamera otomatis menjepret saat V-sign terdeteksi
          </div>
        </div>
      </section>

      {/* 4. FEATURE 02 — FLIP FOTO */}
      <section className="w-full bg-white border border-[#F2C6D1] rounded-3xl p-6 sm:p-10 shadow-xs flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-4 max-w-lg text-left">
          <span className="px-3 py-1 bg-[#FFF9F6] border border-[#F2C6D1] text-[#3C2A2A] text-xs font-black rounded-full">
            Feature 02 · Flip Foto
          </span>
          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-black text-[#3C2A2A]">
              mau mirror atau normal?
            </h2>
            <p className="text-sm font-bold text-[#FF85A1]">
              bebas, pilih yang paling kamu suka.
            </p>
          </div>
          <p className="text-sm text-[#6B5252] font-medium leading-relaxed">
            Kadang versi mirror terasa lebih familiar. Kadang versi normal lebih natural. Tinggal pilih sebelum simpan.
          </p>
        </div>

        {/* Visual Comparison: Side-by-side solid cards (MIRROR 🪞 vs NORMAL 📸) */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setActiveMirrorDemo("mirror")}
            className={`p-4 rounded-2xl border-2 text-center transition-all cursor-pointer ${
              activeMirrorDemo === "mirror"
                ? "bg-[#FFF0F3] border-[#FF85A1] shadow-xs scale-105"
                : "bg-[#FAF7F2] border-[#F2C6D1] hover:bg-white"
            }`}
          >
            <div className="w-20 h-24 bg-white border border-[#F2C6D1] rounded-xl flex flex-col items-center justify-center gap-1 mb-2">
              <span className="text-xl -scale-x-100">🤳</span>
              <span className="text-[10px] font-black text-[#FF85A1]">MIRROR</span>
            </div>
            <span className="text-xs font-bold text-[#3C2A2A]">MIRROR 🪞</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMirrorDemo("normal")}
            className={`p-4 rounded-2xl border-2 text-center transition-all cursor-pointer ${
              activeMirrorDemo === "normal"
                ? "bg-[#FFF0F3] border-[#FF85A1] shadow-xs scale-105"
                : "bg-[#FAF7F2] border-[#F2C6D1] hover:bg-white"
            }`}
          >
            <div className="w-20 h-24 bg-white border border-[#F2C6D1] rounded-xl flex flex-col items-center justify-center gap-1 mb-2">
              <span className="text-xl">📸</span>
              <span className="text-[10px] font-black text-[#3C2A2A]">NORMAL</span>
            </div>
            <span className="text-xs font-bold text-[#3C2A2A]">NORMAL 📸</span>
          </button>
        </div>
      </section>

      {/* 5. FEATURE 03 — MUSIK */}
      <section className="w-full bg-[#FFF9F6] border border-[#F2C6D1] rounded-3xl p-6 sm:p-10 shadow-xs flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-4 max-w-lg text-left order-2 md:order-1">
          <span className="px-3 py-1 bg-white border border-[#F2C6D1] text-[#3C2A2A] text-xs font-black rounded-full">
            Feature 03 · Background Music
          </span>
          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-black text-[#3C2A2A]">
              biar fotonya punya suasana.
            </h2>
            <p className="text-sm font-bold text-[#FF85A1]">
              ambil foto sambil ditemani FotoKita.
            </p>
          </div>
          <p className="text-sm text-[#6B5252] font-medium leading-relaxed">
            Sedikit musik bikin sesi photobooth terasa lebih hidup.
          </p>
        </div>

        {/* Mini aesthetic music player card */}
        <div className="order-1 md:order-2 bg-white border-2 border-[#F2C6D1] p-5 rounded-2xl w-64 sm:w-72 space-y-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#FFF0F3] border border-[#F2C6D1] rounded-xl flex items-center justify-center">
              <Music className="w-6 h-6 text-[#FF85A1]" />
            </div>
            <div className="text-left space-y-0.5">
              <h4 className="text-xs font-black text-[#3C2A2A]">FotoKita</h4>
              <p className="text-[11px] font-semibold text-[#8C6B6B]">rielllybooth session 🎵</p>
            </div>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-[#F2C6D1]">
            <span className="text-[10px] font-bold text-[#8C6B6B]">01:24</span>
            <button
              type="button"
              onClick={() => setIsPlayingDemoMusic((v) => !v)}
              className="p-2 bg-[#FF85A1] text-white rounded-full hover:bg-[#F472B6] transition"
            >
              {isPlayingDemoMusic ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
            </button>
            <span className="text-[10px] font-bold text-[#8C6B6B]">03:15</span>
          </div>
        </div>
      </section>

      {/* 6. PHOTOSTRIP SECTION */}
      <section className="w-full bg-white border border-[#F2C6D1] rounded-3xl p-6 sm:p-10 shadow-xs flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-4 max-w-lg text-left">
          <h2 className="text-2xl sm:text-3xl font-black text-[#3C2A2A]">
            akhirnya jadi photostrip.
          </h2>
          <p className="text-sm text-[#6B5252] font-medium leading-relaxed">
            Setelah selesai foto, pilih hasil yang paling kamu suka dan simpan langsung ke perangkat.
          </p>
        </div>

        {/* Large photostrip mockup with solid cream/pink borders */}
        <div className="bg-[#FAF7F2] border-2 border-[#F2C6D1] p-4 rounded-2xl w-48 sm:w-56 space-y-2.5 shadow-sm text-center">
          <div className="bg-white border border-[#F2C6D1] rounded-xl aspect-[4/3] flex items-center justify-center text-xs font-bold text-[#3C2A2A]">
            photo #1 ✨
          </div>
          <div className="bg-white border border-[#F2C6D1] rounded-xl aspect-[4/3] flex items-center justify-center text-xs font-bold text-[#3C2A2A]">
            photo #2 ♡
          </div>
          <div className="bg-white border border-[#F2C6D1] rounded-xl aspect-[4/3] flex items-center justify-center text-xs font-bold text-[#3C2A2A]">
            photo #3 ✌️
          </div>
          <div className="pt-2 border-t border-[#F2C6D1] text-[10px] font-black text-[#8C6B6B] flex items-center justify-center gap-1">
            <span>siap masuk kamera roll 🎀</span>
          </div>
        </div>
      </section>

      {/* 7. CARA PAKAINYA (HOW IT WORKS) */}
      <section className="w-full bg-white border border-[#F2C6D1] rounded-3xl p-6 sm:p-10 shadow-xs space-y-8">
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-black text-[#3C2A2A]">
            cara pakainya
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 01 */}
          <div className="bg-[#FFF9F6] border border-[#F2C6D1] p-6 rounded-2xl text-left space-y-3 flex flex-col justify-between">
            <div className="w-12 h-12 rounded-2xl bg-[#FF85A1] text-white flex items-center justify-center font-black text-xl shadow-xs border border-[#E05770]">
              01
            </div>
            <div className="space-y-1">
              <h3 className="font-extrabold text-[#3C2A2A] text-base">
                Siapin pose
              </h3>
              <p className="text-xs text-[#6B5252] leading-relaxed font-medium">
                Izinkan akses kamera dan cari angle terbaik kamu.
              </p>
            </div>
          </div>

          {/* Card 02 */}
          <div className="bg-[#FFF9F6] border border-[#F2C6D1] p-6 rounded-2xl text-left space-y-3 flex flex-col justify-between">
            <div className="w-12 h-12 rounded-2xl bg-[#FF85A1] text-white flex items-center justify-center font-black text-xl shadow-xs border border-[#E05770]">
              02
            </div>
            <div className="space-y-1">
              <h3 className="font-extrabold text-[#3C2A2A] text-base">
                Pose peace
              </h3>
              <p className="text-xs text-[#6B5252] leading-relaxed font-medium">
                Nggak perlu pencet shutter. Cukup pose dan kamera akan otomatis mengambil foto.
              </p>
            </div>
          </div>

          {/* Card 03 */}
          <div className="bg-[#FFF9F6] border border-[#F2C6D1] p-6 rounded-2xl text-left space-y-3 flex flex-col justify-between">
            <div className="w-12 h-12 rounded-2xl bg-[#FF85A1] text-white flex items-center justify-center font-black text-xl shadow-xs border border-[#E05770]">
              03
            </div>
            <div className="space-y-1">
              <h3 className="font-extrabold text-[#3C2A2A] text-base">
                Pilih & simpan
              </h3>
              <p className="text-xs text-[#6B5252] leading-relaxed font-medium">
                Atur hasilnya, pilih mirror atau normal, lalu simpan photostrip kamu.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. MOMENTS SECTION */}
      <section className="w-full bg-[#FFF9F6] border border-[#F2C6D1] rounded-3xl p-6 sm:p-10 shadow-xs space-y-6 text-center">
        <div className="space-y-2 max-w-xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-black text-[#3C2A2A]">
            buat momen apa aja.
          </h2>
          <p className="text-xs sm:text-sm text-[#6B5252] font-medium leading-relaxed">
            Serius mau foto, iseng, atau cuma pengen punya photostrip baru — semuanya boleh.
          </p>
        </div>

        {/* Flat Category Tags (no emojis) */}
        <div className="flex flex-wrap justify-center gap-2.5 max-w-lg mx-auto pt-2">
          {["sendiri", "bareng teman", "couple", "hts", "just friend"].map((tag, idx) => (
            <span
              key={idx}
              className="px-4 py-2 bg-white border border-[#F2C6D1] text-[#3C2A2A] text-xs font-extrabold rounded-full shadow-xs"
            >
              {tag}
            </span>
          ))}
        </div>
      </section>

      {/* 9. FEATURE SUMMARY */}
      <section className="w-full bg-white border border-[#F2C6D1] rounded-3xl p-6 sm:p-10 shadow-xs space-y-6 text-center">
        <h2 className="text-2xl sm:text-3xl font-black text-[#3C2A2A]">
          yang bikin rielllybooth beda
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto">
          {[
            "AUTO JEPRET",
            "FLIP FOTO",
            "HD",
            "TANPA DAFTAR",
            "GRATIS",
            "PHOTOSTRIP",
            "MUSIK",
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-4 bg-[#FFF9F6] border border-[#F2C6D1] rounded-2xl text-xs font-black text-[#3C2A2A] flex items-center justify-center text-center shadow-xs"
            >
              {item}
            </div>
          ))}
        </div>
      </section>

      {/* 10. CTA SECTION */}
      <section className="w-full bg-[#FFF0F3] border-2 border-[#F2C6D1] rounded-3xl p-8 sm:p-12 shadow-xs text-center space-y-6">
        <div className="space-y-3 max-w-md mx-auto">
          <h2 className="text-3xl sm:text-4xl font-black text-[#3C2A2A]">
            nggak perlu ribet.
          </h2>
          <p className="text-sm font-bold text-[#6B5252] leading-relaxed whitespace-pre-line">
            {`Buka kamera.
Cari pose.
Pose peace.
Sisanya biar rielllybooth.`}
          </p>
        </div>

        <button
          type="button"
          onClick={onStart}
          className="bg-[#FF85A1] hover:bg-[#F472B6] border-2 border-[#E05770] text-white rounded-full px-8 sm:px-10 py-4 text-base font-extrabold shadow-sm hover:scale-105 active:scale-95 transition-all inline-flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Mulai Photobooth</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </section>

      {/* 11. FAQ ACCORDION */}
      <section className="w-full bg-white border border-[#F2C6D1] rounded-3xl p-6 sm:p-10 shadow-xs space-y-6 text-left">
        <h2 className="text-2xl sm:text-3xl font-black text-[#3C2A2A] text-center">
          pertanyaan yang sering ditanya
        </h2>

        <div className="space-y-3 max-w-3xl mx-auto">
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="border border-[#F2C6D1] rounded-2xl overflow-hidden bg-[#FFF9F6] transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full px-5 py-4 flex justify-between items-center font-extrabold text-[#3C2A2A] text-xs sm:text-sm hover:bg-white transition text-left cursor-pointer"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-[#FF85A1] shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#8C6B6B] shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-5 pb-4 text-xs font-medium text-[#6B5252] leading-relaxed border-t border-[#F2C6D1] pt-3 bg-white">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 12. FINAL CTA */}
      <section className="w-full bg-white border border-[#F2C6D1] rounded-3xl p-8 sm:p-10 shadow-xs text-center space-y-4">
        <div className="space-y-1">
          <h2 className="text-2xl sm:text-3xl font-black text-[#3C2A2A]">
            satu foto lagi?
          </h2>
          <p className="text-xs sm:text-sm font-medium text-[#6B5252]">
            Kalau tadi belum dapet yang pas, coba lagi.
          </p>
        </div>

        <button
          type="button"
          onClick={onStart}
          className="bg-[#FF85A1] hover:bg-[#F472B6] border-2 border-[#E05770] text-white rounded-full px-8 py-3.5 text-sm sm:text-base font-extrabold shadow-sm hover:scale-105 active:scale-95 transition-all inline-flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Foto Lagi 🎀</span>
        </button>
      </section>

      {/* 13. COMPACT FOOTER */}
      <footer className="w-full border-t border-[#F2C6D1] pt-8 pb-4 text-center text-xs text-[#6B5252] flex flex-col items-center justify-center gap-3">
        <div className="font-bold text-[#3C2A2A]">
          © 2026 rielllybooth 🎀 · &ldquo;buat momen yang pengen kamu simpan&rdquo;
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-bold">
          <a
            href="mailto:rielllybooth@gmail.com"
            className="hover:text-[#FF85A1] transition inline-flex items-center gap-1"
          >
            ✉ rielllybooth@gmail.com
          </a>
          <span className="text-[#F2C6D1]">·</span>
          <a
            href="https://instagram.com/rielllybooth"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#FF85A1] hover:underline transition inline-flex items-center gap-1"
          >
            ◎ @rielllybooth
          </a>
          <span className="text-[#F2C6D1]">·</span>
          <a
            href="https://tiktok.com/@riellybooth_"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#FF85A1] transition inline-flex items-center gap-1"
          >
            ♫ @riellybooth_
          </a>
          <span className="text-[#F2C6D1]">·</span>
          <a
            href="https://instagram.com/dhikastriaaa"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#6B5252] hover:text-[#FF85A1] underline transition"
          >
            Dev: @dhikastriaaa
          </a>
        </div>
      </footer>
    </div>
  );
}