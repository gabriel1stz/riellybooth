"use client";

import React, { useState, useRef } from "react";
import {
  Camera,
  ArrowRight,
  Sparkles,
  Upload,
  Users,
  ShieldCheck,
  Video,
  Download,
  ChevronDown,
  ChevronUp,
  Mail,
  Instagram,
  Sliders,
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

const FAQS = [
  {
    q: "Apakah foto saya disimpan di server RiellyBooth?",
    a: "Tidak sama sekali. Seluruh pemrosesan photo strip, Live Photo, filter, dan stiker berjalan 100% lokal di browser kamu menggunakan HTML5 Canvas & WebRTC. Foto tidak pernah diunggah ke server mana pun.",
  },
  {
    q: "Apakah RiellyBooth gratis dan tanpa watermark?",
    a: "Ya, 100% gratis selamanya tanpa watermark. Kamu bisa menyimpan hasil photo strip PNG HD, Live Video MP4, maupun GIF animasi tanpa perlu daftar akun.",
  },
  {
    q: "Bisa dipakai di HP tanpa install aplikasi?",
    a: "Bisa. Cukup buka riellybooth.my.id lewat Chrome atau Safari di HP maupun laptop, izinkan kamera, lalu langsung mulai sesi foto.",
  },
  {
    q: "Bisa pakai foto dari galeri HP atau foto bareng LDR?",
    a: "Bisa keduanya. Klik 'Upload Galeri' untuk menyusun foto yang sudah ada di HP, atau pilih 'Foto Bareng LDR' untuk sesi photobooth jarak jauh secara real-time dengan pasangan atau teman.",
  },
  {
    q: "Bagaimana cara simpan untuk IG Story atau cetak 4R?",
    a: "Di halaman editor, kamu bisa memilih Background Estetik rasio 9:16 Story atau 4:5 Feed yang ikut tersimpan ke file PNG/MP4/GIF, atau pilih layout Double Strip 2×4 untuk cetak kertas foto 4R.",
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

  return (
    <div className="w-full max-w-3xl px-4 sm:px-6 pt-8 sm:pt-14 pb-10 flex flex-col items-center gap-14 sm:gap-20 text-[#392633] animate-step-reveal">
      {/* ========================================================
          MINIMALIST SOFT PINK HERO — ZERO STOCK PHOTOS
          ======================================================== */}
      <section className="w-full flex flex-col items-center text-center gap-6 sm:gap-7">
        {/* Top Minimal Brand Pill + What's New */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-white/90 border border-[#E9B8CA] text-[#8B7180] rounded-full text-[11px] font-heading font-semibold tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E84D91]" />
            <span>Photobooth Online Indonesia</span>
          </span>

          {onOpenWhatsNew && (
            <button
              type="button"
              onClick={onOpenWhatsNew}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FFF0F4] hover:bg-[#F8D8E3] border border-[#F48FB1] text-[#E84D91] rounded-full text-[11px] font-heading font-bold transition cursor-pointer"
            >
              <Sparkles className="w-3 h-3" />
              <span>Update Baru</span>
            </button>
          )}
        </div>

        {/* Clean Headline & Short Value Prop */}
        <div className="space-y-3.5 max-w-xl">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-heading font-bold tracking-tight text-[#392633] leading-[1.08]">
            Photobooth Online{" "}
            <span className="text-[#E84D91] block sm:inline">Simpel &amp; Estetik.</span>
          </h1>
          <p className="text-sm sm:text-base text-[#8B7180] font-sans font-medium leading-relaxed max-w-md mx-auto">
            Buat photo strip, Live Photo, dan frame estetik langsung dari kamera HP atau laptop. Gratis, privat di browser, tanpa watermark.
          </p>
        </div>

        {/* Primary Action Card — Clean Minimal Start Box */}
        <div className="w-full max-w-md bg-white/90 backdrop-blur-sm border border-[#E9B8CA] rounded-3xl p-4 sm:p-5 shadow-[0_12px_32px_-12px_rgba(232,77,145,0.16)] space-y-3">
          <button
            type="button"
            onClick={() => onStart()}
            className="w-full py-4 px-6 bg-[#E84D91] hover:bg-[#D93D82] active:scale-[0.99] text-white font-heading font-bold text-base rounded-2xl shadow-[0_8px_20px_-6px_rgba(232,77,145,0.55)] transition-all flex items-center justify-center gap-2.5 cursor-pointer group"
          >
            <Camera className="w-5 h-5" />
            <span>Mulai Foto Sekarang</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>

          {/* Hidden File Input for Gallery Upload */}
          <input
            ref={heroFileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleHeroFileChange}
            className="hidden"
          />

          <div className={`grid gap-2.5 ${onOpenLDR ? "grid-cols-2" : "grid-cols-1"}`}>
            <button
              type="button"
              onClick={() => heroFileInputRef.current?.click()}
              className="py-2.5 px-4 bg-[#FFF7FA] hover:bg-[#FFF0F4] border border-[#E9B8CA] text-[#392633] rounded-xl text-xs font-heading font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5 text-[#E84D91]" />
              <span>Upload Galeri</span>
            </button>

            {onOpenLDR && (
              <button
                type="button"
                onClick={onOpenLDR}
                className="py-2.5 px-4 bg-[#FFF7FA] hover:bg-[#FFF0F4] border border-[#E9B8CA] text-[#392633] rounded-xl text-xs font-heading font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Users className="w-3.5 h-3.5 text-[#E84D91]" />
                <span>Foto Bareng LDR</span>
              </button>
            )}
          </div>
        </div>

        {/* Minimal Trust Highlights */}
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[11px] sm:text-xs font-sans font-medium text-[#8B7180]">
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#E84D91]" />
            100% Privat di Browser
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Video className="w-3.5 h-3.5 text-[#E84D91]" />
            Live Photo MP4 &amp; GIF
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Download className="w-3.5 h-3.5 text-[#E84D91]" />
            HD Tanpa Watermark
          </span>
        </div>
      </section>

      {/* ========================================================
          SIMPLE 3-STEP FLOW (CLEAN & SCANNABLE)
          ======================================================== */}
      <section aria-label="Cara Menggunakan RiellyBooth" className="w-full space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-white/80 border border-[#E9B8CA]/80 rounded-2xl p-4 text-left space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold text-[#E84D91]">01</span>
              <Camera className="w-4 h-4 text-[#E84D91]" />
            </div>
            <h2 className="text-sm font-heading font-bold text-[#392633]">Pilih Pose &amp; Filter</h2>
            <p className="text-xs text-[#8B7180] font-sans leading-relaxed">
              Pilih 2, 3, 4, atau 6 pose dengan live filter kamera &amp; timer otomatis.
            </p>
          </div>

          <div className="bg-white/80 border border-[#E9B8CA]/80 rounded-2xl p-4 text-left space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold text-[#E84D91]">02</span>
              <Sliders className="w-4 h-4 text-[#E84D91]" />
            </div>
            <h2 className="text-sm font-heading font-bold text-[#392633]">Atur Bingkai &amp; BG</h2>
            <p className="text-xs text-[#8B7180] font-sans leading-relaxed">
              Pilih frame, bentuk foto, motif bingkai, stiker, dan background estetik 4:5 / 9:16.
            </p>
          </div>

          <div className="bg-white/80 border border-[#E9B8CA]/80 rounded-2xl p-4 text-left space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold text-[#E84D91]">03</span>
              <Download className="w-4 h-4 text-[#E84D91]" />
            </div>
            <h2 className="text-sm font-heading font-bold text-[#392633]">Simpan Langsung</h2>
            <p className="text-xs text-[#8B7180] font-sans leading-relaxed">
              Unduh PNG HD, Live Video MP4, atau GIF tanpa watermark siap share ke Story.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================
          MINIMAL FAQ ACCORDION (SEO RICH SNIPPET FRIENDLY)
          ======================================================== */}
      <section aria-label="Pertanyaan Umum" className="w-full space-y-3">
        <div className="text-center space-y-1">
          <h2 className="text-lg sm:text-xl font-heading font-bold text-[#392633]">
            Pertanyaan Umum
          </h2>
          <p className="text-xs text-[#8B7180] font-sans">
            Info singkat seputar privasi, fitur Live Photo, dan cara simpan hasil.
          </p>
        </div>

        <div className="space-y-2">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white/85 border border-[#E9B8CA]/80 rounded-2xl overflow-hidden transition"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full px-4 py-3.5 text-left flex items-center justify-between gap-3 cursor-pointer hover:bg-[#FFF7FA] transition"
                >
                  <span className="text-xs sm:text-sm font-heading font-bold text-[#392633]">
                    {faq.q}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-[#E84D91] shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#8B7180] shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-4 pb-3.5 text-xs text-[#8B7180] font-sans leading-relaxed border-t border-[#F8D8E3]/60 pt-2.5">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================
          CLEAN MINIMAL FOOTER
          ======================================================== */}
      <footer className="w-full pt-6 border-t border-[#E9B8CA]/70 flex flex-col items-center gap-3 text-center text-xs text-[#8B7180]">
        <div className="flex items-center gap-1.5 font-heading font-bold text-[#392633]">
          <span>© 2026 RiellyBooth</span>
          <span className="text-[#E84D91]">·</span>
          <span className="font-sans font-medium text-[#8B7180]">Photobooth Online Gratis</span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] font-medium">
          <a
            href="mailto:riellybooth@gmail.com"
            className="hover:text-[#E84D91] transition inline-flex items-center gap-1"
          >
            <Mail className="w-3.5 h-3.5 text-[#E84D91]" />
            <span>riellybooth@gmail.com</span>
          </a>
          <a
            href="https://instagram.com/riellybooth"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#E84D91] transition inline-flex items-center gap-1"
          >
            <Instagram className="w-3.5 h-3.5 text-[#E84D91]" />
            <span>@riellybooth</span>
          </a>
          <a
            href="https://tiktok.com/@riellybooth_"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#E84D91] transition inline-flex items-center gap-1"
          >
            <TikTokIcon className="w-3.5 h-3.5 text-[#E84D91]" />
            <span>@riellybooth_</span>
          </a>
          {onOpenPrivacy && (
            <button
              type="button"
              onClick={onOpenPrivacy}
              className="hover:text-[#E84D91] transition underline underline-offset-2 cursor-pointer"
            >
              Privasi
            </button>
          )}
        </div>
      </footer>
    </div>
  );
}
