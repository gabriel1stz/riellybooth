"use client";

import React from "react";
import { Sparkles, Users, Camera, Zap, SlidersHorizontal, Image as ImageIcon, Flame, X, ArrowRight } from "lucide-react";

type WhatsNewModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onStartSession: () => void;
};

export default function WhatsNewModal({ isOpen, onClose, onStartSession }: WhatsNewModalProps) {
  if (!isOpen) return null;

  const updates = [
    {
      icon: <Users className="w-5 h-5 text-[#E84D91]" />,
      bg: "bg-[#FFF0F4]",
      border: "border-[#E9B8CA]",
      title: "Mode Berdua Jarak Jauh (LDR Photobooth)",
      desc: "Kirim link atau kode room ke teman dari kota berbeda, jepret dan masuk di 1 strip foto yang sama secara realtime.",
      tag: "P2P LIVE",
    },
    {
      icon: <Camera className="w-5 h-5 text-purple-600" />,
      bg: "bg-purple-50",
      border: "border-purple-200",
      title: "Mode Korea: Ambil 6, Pilih 4",
      desc: "Gaya photobooth Haru Film & Life Four Cuts: jepret 6 pose seru, pilih 4 foto terbaik buat masuk ke strip akhir.",
      tag: "FAVORIT",
    },
    {
      icon: <Zap className="w-5 h-5 text-amber-600" />,
      bg: "bg-amber-50",
      border: "border-amber-200",
      title: "Screen Flash & Hardware Torch",
      desc: "Ruangan redup? Aktifkan Flash ON untuk efek Retina Flash layar terang sekaligus dukungan lampu torch kamera belakang.",
      tag: "KAMERA",
    },
    {
      icon: <SlidersHorizontal className="w-5 h-5 text-rose-600" />,
      bg: "bg-rose-50",
      border: "border-rose-200",
      title: "Tuning Kamera & Beauty Soft Glow",
      desc: "Atur kecerahan, kontras, dan efek kulit halus langsung dari viewfinder studio sebelum mulai jepret.",
      tag: "STUDIO",
    },
    {
      icon: <ImageIcon className="w-5 h-5 text-sky-600" />,
      bg: "bg-sky-50",
      border: "border-sky-200",
      title: "Upload Bingkai PNG Custom",
      desc: "Punya desain frame acara ultah, wisuda, atau komunitas sendiri dari Canva/Photoshop? Tinggal upload PNG transparan kamu.",
      tag: "CUSTOM",
    },
    {
      icon: <Flame className="w-5 h-5 text-[#E84D91]" />,
      bg: "bg-[#FFF0F4]",
      border: "border-[#E9B8CA]",
      title: "Frame Koran Editorial: The Rielly Times & Daily Rielly",
      desc: "Koran broadsheet vintage 4-foto lengkap dengan 3 kolom artikel, drop cap, pull-quote, dan spesifikasi cetak 300 DPI.",
      tag: "EDITORIAL",
    },
  ];

  return (
    <div className="fixed inset-0 bg-stone-900/60 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="scrapbook-paper bg-[#FFF9F0] border-4 border-[#E9B8CA] p-5 sm:p-7 max-w-lg w-full shadow-paper-lg space-y-5 relative max-h-[92vh] overflow-y-auto">
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup modal"
          className="absolute top-4 right-4 p-1.5 rounded-full bg-[#FFF0F4] text-[#E84D91] hover:bg-[#F8D8E3] border border-[#E9B8CA] transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-1.5">
          <div className="inline-flex p-3 bg-[#FFF0F4] rounded-full border border-[#E9B8CA] text-[#E84D91] mb-1">
            <Sparkles className="w-6 h-6" />
          </div>
          <div className="inline-block px-3 py-0.5 bg-[#E84D91] text-white text-[10px] font-heading font-bold rounded-full uppercase tracking-wider shadow-xs">
            RELEASE v2.5
          </div>
          <h3 className="text-2xl sm:text-3xl font-heading font-bold text-[#392633]">
            What&apos;s New in RiellyBooth
          </h3>
          <p className="text-xs text-[#8B7180] font-sans font-medium max-w-sm mx-auto leading-relaxed">
            Pembaruan studio photobooth online yang lebih cepat, bersih, dan estetik.
          </p>
        </div>

        {/* Feature List */}
        <div className="space-y-2.5 text-left">
          {updates.map((u, i) => (
            <div
              key={i}
              className={`p-3.5 rounded-2xl border-2 ${u.border} bg-white flex items-start gap-3 shadow-xs hover:shadow-paper transition`}
            >
              <div className={`p-2.5 rounded-xl ${u.bg} shrink-0 mt-0.5`}>
                {u.icon}
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="text-xs font-heading font-bold text-[#392633]">{u.title}</h4>
                  <span className="text-[9px] font-heading font-bold bg-[#FFF0F4] text-[#E84D91] px-2 py-0.5 rounded-md border border-[#E9B8CA] uppercase tracking-wider">
                    {u.tag}
                  </span>
                </div>
                <p className="text-[11px] text-[#8B7180] leading-relaxed font-sans font-medium">
                  {u.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={() => {
            onClose();
            onStartSession();
          }}
          className="w-full py-3.5 scrapbook-btn text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Cobain Fitur Baru Sekarang</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
