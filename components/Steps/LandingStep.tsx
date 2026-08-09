"use client";

import React, { useState } from "react";
import { Camera, Sparkles, Music, Smartphone, ArrowRight, ChevronDown, Check, Heart, Play, RefreshCw, Download, ShieldCheck } from "lucide-react";

interface LandingStepProps {
  onStart: () => void;
}

export default function LandingStep({ onStart }: LandingStepProps) {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const faqList = [
    {
      q: "rielllybooth gratis?",
      a: "Iya. Kamu bisa menggunakan photobooth tanpa biaya.",
    },
    {
      q: "Harus bikin akun?",
      a: "Nggak perlu. Tinggal buka website dan mulai sesi.",
    },
    {
      q: "Gimana cara auto jepretnya?",
      a: "Pastikan kamera aktif, lalu lakukan pose peace. Kamera akan mendeteksi gesture tersebut dan mengambil foto secara otomatis.",
    },
    {
      q: "Bisa matiin auto jepret?",
      a: "Iya, kamu tetap bisa menggunakan tombol shutter manual jika ingin mengambil foto secara biasa.",
    },
    {
      q: "Foto bisa di-flip?",
      a: "Bisa. Kamu bisa memilih hasil mirror atau normal sebelum menyimpan.",
    },
    {
      q: "Bisa dipakai di HP?",
      a: "Bisa. rielllybooth berjalan langsung melalui browser di HP, tablet, maupun laptop.",
    },
    {
      q: "Ada musiknya?",
      a: "Iya. Sesi photobooth ditemani lagu FotoKita untuk bikin suasananya lebih seru.",
    },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto space-y-24 px-4 sm:px-6 py-6 font-sans text-[#3C2A2A] selection:bg-rose-200">
      
      {/* 1. HERO SECTION */}
      <section className="text-center space-y-8 pt-4 pb-8 relative">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-100/80 border border-rose-200 text-xs font-semibold text-[#8B4A5a] tracking-wide">
          <span>rielllybooth ♡</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-[#3C2A2A] leading-[1.15] max-w-3xl mx-auto">
          foto dulu, mikir belakangan.
        </h1>

        <p className="text-base sm:text-lg text-[#6E5456] max-w-xl mx-auto font-medium leading-relaxed">
          Photobooth virtual buat kamu yang pengen foto sendiri, bareng teman, atau cuma iseng bikin photostrip.
        </p>

        <div className="space-y-3 pt-2">
          <button
            onClick={onStart}
            className="px-8 py-4 bg-[#F48FB1] hover:bg-[#e0789d] text-white font-bold rounded-full shadow-md hover:shadow-rose-300/50 transition-all transform hover:-translate-y-0.5 active:translate-y-0 text-base sm:text-lg flex items-center justify-center gap-3 mx-auto"
          >
            <span>Mulai Sesi Photobooth</span>
            <ArrowRight className="w-5 h-5" />
          </button>
          
          <p className="text-xs sm:text-sm text-[#8C6D70] font-medium tracking-wide">
            Gratis · HD · Tanpa Daftar
          </p>
        </div>

        {/* Hero Photostrip Visual Focal Point */}
        <div className="pt-8 relative max-w-md mx-auto">
          {/* Subtle floating labels */}
          <span className="hidden sm:inline-block absolute -left-8 top-1/4 bg-white/90 border border-rose-200 px-3 py-1 rounded-full text-xs font-semibold text-[#8B4A5A] shadow-sm -rotate-6">
            auto jepret ✌️
          </span>
          <span className="hidden sm:inline-block absolute -right-8 top-1/3 bg-white/90 border border-rose-200 px-3 py-1 rounded-full text-xs font-semibold text-[#8B4A5A] shadow-sm rotate-6">
            flip foto 🪞
          </span>
          <span className="hidden sm:inline-block absolute left-4 bottom-8 bg-white/90 border border-rose-200 px-3 py-1 rounded-full text-xs font-semibold text-[#8B4A5A] shadow-sm rotate-3">
            HD 📸
          </span>

          {/* Photostrip Card */}
          <div className="bg-white p-4 rounded-2xl border border-rose-200 shadow-sm max-w-[260px] mx-auto space-y-3 transform -rotate-1 hover:rotate-0 transition-transform duration-300">
            <div className="aspect-[4/3] bg-rose-100/60 rounded-lg flex items-center justify-center text-xs text-rose-400 font-medium">
              pose #1
            </div>
            <div className="aspect-[4/3] bg-rose-100/60 rounded-lg flex items-center justify-center text-xs text-rose-400 font-medium">
              pose #2
            </div>
            <div className="aspect-[4/3] bg-rose-100/60 rounded-lg flex items-center justify-center text-xs text-rose-400 font-medium">
              pose #3
            </div>
            <div className="pt-2 text-center border-t border-rose-100">
              <span className="text-xs font-bold text-[#8B4A5A] tracking-wider">rielllybooth ♡</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. INTRO SECTION */}
      <section className="bg-white/80 border border-rose-200 rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-sm">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#3C2A2A]">
          nggak perlu studio buat dapetin foto bagus.
        </h2>
        <p className="text-sm sm:text-base text-[#6E5456] max-w-lg mx-auto leading-relaxed">
          Buka kamera, siapin pose, dan biarkan rielllybooth yang ngurus sisanya.
        </p>
        <button
          onClick={onStart}
          className="px-6 py-3 bg-rose-100 hover:bg-rose-200 text-[#8B4A5A] font-bold rounded-full text-sm transition-colors inline-flex items-center gap-2"
        >
          <span>Coba Sekarang</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </section>

      {/* 3. FEATURE 01 — AUTO JEPRET */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-rose-50/50 border border-rose-200/80 rounded-3xl p-8 sm:p-10">
        <div className="space-y-4">
          <span className="text-xs font-bold text-[#8B4A5A] uppercase tracking-wider bg-rose-100 px-3 py-1 rounded-full">
            Feature 01
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight text-[#3C2A2A]">
            tinggal pose peace.
          </h2>
          <h3 className="text-lg font-semibold text-[#8B4A5A]">
            nggak perlu pencet-pencet.
          </h3>
          <p className="text-sm sm:text-base text-[#6E5456] leading-relaxed">
            Angkat dua jari, pose peace, dan rielllybooth bakal otomatis mengambil foto.
          </p>
          <p className="text-xs text-[#8C6D70] font-medium bg-white/60 p-3 rounded-xl border border-rose-100 inline-block">
            lebih natural, lebih seru, dan nggak perlu buru-buru cari tombol shutter.
          </p>
        </div>

        {/* Visual Mockup */}
        <div className="bg-white p-6 rounded-2xl border border-rose-200 text-center space-y-4 shadow-sm">
          <div className="aspect-video bg-rose-100/50 rounded-xl flex flex-col items-center justify-center p-4 border border-rose-200/60 relative overflow-hidden">
            <span className="text-4xl mb-2">✌️</span>
            <span className="text-xs font-bold text-[#8B4A5A] bg-white px-3 py-1 rounded-full border border-rose-200 shadow-xs animate-pulse">
              Pose Peace Terdeteksi! 3... 2... 1...
            </span>
          </div>
          <div className="flex justify-between items-center text-xs text-[#6E5456] font-medium px-2">
            <span>Kamera Ready</span>
            <span>→</span>
            <span>Pose Peace ✌️</span>
            <span>→</span>
            <span>Foto Otomatis 📸</span>
          </div>
        </div>
      </section>

      {/* 4. FEATURE 02 — FLIP FOTO */}
      <section className="bg-white border border-rose-200 rounded-3xl p-8 sm:p-10 space-y-8 shadow-sm">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <span className="text-xs font-bold text-[#8B4A5A] uppercase tracking-wider bg-rose-100 px-3 py-1 rounded-full">
            Flip Foto
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#3C2A2A]">
            mau mirror atau normal?
          </h2>
          <h3 className="text-base font-semibold text-[#8B4A5A]">
            bebas, pilih yang paling kamu suka.
          </h3>
          <p className="text-sm text-[#6E5456] leading-relaxed pt-1">
            Kadang versi mirror terasa lebih familiar. Kadang versi normal lebih natural. Tinggal pilih sebelum simpan.
          </p>
        </div>

        {/* Visual Comparison: MIRROR vs NORMAL */}
        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
          <div className="bg-rose-50/60 p-4 rounded-2xl border border-rose-200 text-center space-y-2">
            <div className="aspect-[4/3] bg-rose-200/50 rounded-lg flex items-center justify-center text-sm font-bold text-[#8B4A5A]">
              🪞 MIRROR
            </div>
            <span className="text-xs text-[#6E5456] font-medium">Tampilan Cermin</span>
          </div>
          <div className="bg-rose-50/60 p-4 rounded-2xl border border-rose-200 text-center space-y-2">
            <div className="aspect-[4/3] bg-rose-200/50 rounded-lg flex items-center justify-center text-sm font-bold text-[#8B4A5A]">
              📸 NORMAL
            </div>
            <span className="text-xs text-[#6E5456] font-medium">Tampilan Asli</span>
          </div>
        </div>
      </section>

      {/* 5. FEATURE 03 — MUSIK */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-rose-50/50 border border-rose-200/80 rounded-3xl p-8 sm:p-10">
        <div className="space-y-3">
          <span className="text-xs font-bold text-[#8B4A5A] uppercase tracking-wider bg-rose-100 px-3 py-1 rounded-full">
            Suasana
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#3C2A2A]">
            biar fotonya punya suasana.
          </h2>
          <h3 className="text-base font-semibold text-[#8B4A5A]">
            ambil foto sambil ditemani FotoKita.
          </h3>
          <p className="text-sm text-[#6E5456] leading-relaxed">
            Sedikit musik bikin sesi photobooth terasa lebih hidup.
          </p>
        </div>

        {/* Aesthetic Music Player Card */}
        <div className="bg-white p-5 rounded-2xl border border-rose-200 shadow-sm flex items-center gap-4 max-w-sm mx-auto w-full">
          <div className="w-12 h-12 bg-rose-200 rounded-xl flex items-center justify-center text-rose-600">
            <Music className="w-6 h-6 animate-spin-slow" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-bold text-[#3C2A2A] truncate">FotoKita</h4>
            <p className="text-xs text-[#8C6D70] truncate">rielllybooth session 🎵</p>
          </div>
          <div className="px-3 py-1 bg-rose-100 text-[#8B4A5A] text-xs font-semibold rounded-full">
            Playing
          </div>
        </div>
      </section>

      {/* 6. PHOTOSTRIP SECTION */}
      <section className="bg-white border border-rose-200 rounded-3xl p-8 sm:p-12 text-center space-y-8 shadow-sm">
        <div className="space-y-2 max-w-xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#3C2A2A]">
            akhirnya jadi photostrip.
          </h2>
          <p className="text-sm text-[#6E5456] leading-relaxed">
            Setelah selesai foto, pilih hasil yang paling kamu suka dan simpan langsung ke perangkat.
          </p>
        </div>

        {/* Large Photostrip Visual */}
        <div className="bg-rose-50/50 p-6 rounded-3xl border border-rose-200 max-w-xs mx-auto space-y-4 shadow-sm relative">
          <span className="absolute -top-3 right-6 text-xl">🎀</span>
          <div className="aspect-[4/3] bg-white rounded-xl border border-rose-200/80 flex items-center justify-center text-xs text-[#8C6D70]">
            foto 01
          </div>
          <div className="aspect-[4/3] bg-white rounded-xl border border-rose-200/80 flex items-center justify-center text-xs text-[#8C6D70]">
            foto 02
          </div>
          <div className="aspect-[4/3] bg-white rounded-xl border border-rose-200/80 flex items-center justify-center text-xs text-[#8C6D70]">
            foto 03
          </div>
          <div className="pt-2 text-center">
            <span className="text-xs font-bold text-[#8B4A5A] tracking-widest">rielllybooth ♡</span>
          </div>
        </div>

        <p className="text-xs font-semibold text-[#8C6D70] tracking-wide">
          siap masuk kamera roll.
        </p>
      </section>

      {/* 7. HOW IT WORKS */}
      <section className="space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#3C2A2A]">
            cara pakainya
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-rose-200 space-y-3 shadow-sm relative overflow-hidden">
            <span className="text-4xl font-black text-rose-200 block">01</span>
            <h3 className="text-lg font-bold text-[#3C2A2A]">Siapin pose</h3>
            <p className="text-xs sm:text-sm text-[#6E5456] leading-relaxed">
              Izinkan akses kamera dan cari angle terbaik kamu.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-rose-200 space-y-3 shadow-sm relative overflow-hidden">
            <span className="text-4xl font-black text-rose-200 block">02</span>
            <h3 className="text-lg font-bold text-[#3C2A2A]">Pose peace</h3>
            <p className="text-xs sm:text-sm text-[#6E5456] leading-relaxed">
              Nggak perlu pencet shutter. Cukup pose dan kamera akan otomatis mengambil foto.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-rose-200 space-y-3 shadow-sm relative overflow-hidden">
            <span className="text-4xl font-black text-rose-200 block">03</span>
            <h3 className="text-lg font-bold text-[#3C2A2A]">Pilih & simpan</h3>
            <p className="text-xs sm:text-sm text-[#6E5456] leading-relaxed">
              Atur hasilnya, pilih mirror atau normal, lalu simpan photostrip kamu.
            </p>
          </div>
        </div>
      </section>

      {/* 8. MOMENTS SECTION */}
      <section className="bg-rose-50/50 border border-rose-200/80 rounded-3xl p-8 sm:p-10 space-y-6 text-center">
        <div className="space-y-2 max-w-xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#3C2A2A]">
            buat momen apa aja.
          </h2>
          <p className="text-sm text-[#6E5456] leading-relaxed">
            Serius mau foto, iseng, atau cuma pengen punya photostrip baru — semuanya boleh.
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap justify-center gap-2 pt-2">
          {["sendiri", "bareng teman", "couple", "hts", "just friend"].map((cat) => (
            <span
              key={cat}
              className="px-4 py-2 bg-white border border-rose-200 text-xs font-semibold text-[#8B4A5A] rounded-full shadow-xs"
            >
              {cat}
            </span>
          ))}
        </div>
      </section>

      {/* 9. FEATURE SUMMARY */}
      <section className="space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#3C2A2A]">
            yang bikin rielllybooth beda
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { title: "AUTO JEPRET", desc: "Pose peace, kamera otomatis jepret." },
            { title: "FLIP FOTO", desc: "Mirror atau normal, pilih sendiri." },
            { title: "HD", desc: "Hasil tetap tajam dan enak disimpan." },
            { title: "TANPA DAFTAR", desc: "Buka, foto, selesai." },
            { title: "GRATIS", desc: "Nggak perlu bayar buat mulai." },
            { title: "PHOTOSTRIP", desc: "Langsung jadi dan siap masuk kamera roll." },
            { title: "MUSIK", desc: "Foto sambil ditemani FotoKita." },
          ].map((item, idx) => (
            <div key={idx} className="bg-white p-5 rounded-2xl border border-rose-200 space-y-1 shadow-xs">
              <h3 className="text-xs font-extrabold text-[#8B4A5A] tracking-wider uppercase">{item.title}</h3>
              <p className="text-xs sm:text-sm text-[#6E5456] font-medium leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 10. CTA SECTION */}
      <section className="bg-white border border-rose-200 rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-sm">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#3C2A2A] tracking-tight">
          ngggak perlu ribet.
        </h2>
        <p className="text-sm sm:text-base text-[#6E5456] max-w-sm mx-auto leading-relaxed whitespace-pre-line font-medium">
          Buka kamera.{"\n"}
          Cari pose.{"\n"}
          Pose peace.{"\n"}
          Sisanya biar rielllybooth.
        </p>
        <button
          onClick={onStart}
          className="px-8 py-4 bg-[#F48FB1] hover:bg-[#e0789d] text-white font-bold rounded-full shadow-md transition-all text-base sm:text-lg inline-flex items-center justify-center gap-2"
        >
          <span>Mulai Photobooth</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </section>

      {/* 11. FAQ SECTION */}
      <section className="space-y-6 max-w-2xl mx-auto">
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#3C2A2A]">
            pertanyaan yang sering ditanya
          </h2>
        </div>

        <div className="space-y-3">
          {faqList.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white border border-rose-200 rounded-2xl overflow-hidden transition-all shadow-xs"
            >
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full p-4 text-left font-bold text-xs sm:text-sm text-[#3C2A2A] flex justify-between items-center gap-4"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-rose-400 transition-transform duration-200 ${
                    openFaqIndex === idx ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openFaqIndex === idx && (
                <div className="px-4 pb-4 text-xs sm:text-sm text-[#6E5456] leading-relaxed border-t border-rose-100 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 12. FINAL CTA SECTION */}
      <section className="bg-rose-50/60 border border-rose-200 rounded-3xl p-8 sm:p-10 text-center space-y-4">
        <div className="space-y-1">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#3C2A2A]">
            satu foto lagi?
          </h2>
          <p className="text-xs sm:text-sm text-[#6E5456]">
            Kalau tadi belum dapet yang pas, coba lagi.
          </p>
        </div>

        <button
          onClick={onStart}
          className="px-8 py-3 bg-[#F48FB1] hover:bg-[#e0789d] text-white font-bold rounded-full text-sm sm:text-base shadow-sm transition-all inline-flex items-center gap-2"
        >
          <span>Foto Lagi</span>
          <span className="text-xs">🎀</span>
        </button>
      </section>

      {/* 13. COMPACT MINIMAL FOOTER */}
      <footer className="pt-8 border-t border-rose-200/80 text-center space-y-2 text-xs text-[#8C6D70] font-medium">
        <div>
          © 2026 rielllybooth 🎀 · &quot;buat momen yang pengen kamu simpan&quot;
        </div>
        <div className="flex flex-wrap justify-center items-center gap-2 text-[11px] sm:text-xs">
          <a
            href="mailto:rielllybooth@gmail.com"
            className="hover:text-rose-600 transition-colors"
          >
            ✉ rielllybooth@gmail.com
          </a>
          <span>·</span>
          <a
            href="https://instagram.com/rielllybooth"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-rose-600 transition-colors"
          >
            ◎ @rielllybooth
          </a>
          <span>·</span>
          <a
            href="https://tiktok.com/@riellybooth_"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-rose-600 transition-colors"
          >
            ♫ @riellybooth_
          </a>
          <span>·</span>
          <a
            href="https://instagram.com/dhikasatriaaa"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-rose-600 transition-colors"
          >
            Dev: @dhikasatriaaa
          </a>
        </div>
      </footer>

    </div>
  );
}