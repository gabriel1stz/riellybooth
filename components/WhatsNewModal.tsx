"use client";

import React from "react";
import { Sparkles, Users, Camera, Smile, SlidersHorizontal, Image as ImageIcon, Flame, X, ArrowRight } from "lucide-react";

type WhatsNewModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onStartSession: () => void;
};

export default function WhatsNewModal({ isOpen, onClose, onStartSession }: WhatsNewModalProps) {
  if (!isOpen) return null;

  const updates = [
    {
      icon: <Users className="w-5 h-5 text-pink-600" />,
      bg: "bg-pink-100",
      border: "border-pink-200",
      title: "Mode Berdua Jarak Jauh (LDR Photobooth) 👯‍♀️",
      desc: "Kirim link via WhatsApp ke teman atau ayang dari kota berbeda, jepret dan masuk di 1 strip foto yang sama secara realtime!",
      tag: "Fitur #1 Viral",
    },
    {
      icon: <Camera className="w-5 h-5 text-purple-600" />,
      bg: "bg-purple-100",
      border: "border-purple-200",
      title: "Mode Korea: Ambil 6, Pilih 4 🇰🇷",
      desc: "Gaya photobooth Haru Film & Life Four Cuts: jepret 6 pose seru, pilih 4 foto terbaik buat masuk ke strip akhir.",
      tag: "Favorit",
    },
    {
      icon: <Smile className="w-5 h-5 text-rose-600" />,
      bg: "bg-rose-100",
      border: "border-rose-200",
      title: "AR Face Props Tracking 🎀",
      desc: "Pita satin coquette blush, kacamata pixel Y2K, kuping kucing, dan puppy yang menempel otomatis mengikuti gerak wajah.",
      tag: "Aesthetic",
    },
    {
      icon: <SlidersHorizontal className="w-5 h-5 text-amber-600" />,
      bg: "bg-amber-100",
      border: "border-amber-200",
      title: "Tuning Kamera ☀️ & Beauty Glow",
      desc: "Kamera HP gelap di dalam ruangan? Atur slider kecerahan, kontras, dan efek kulit halus soft glow langsung dari viewfinder.",
      tag: "Kamera",
    },
    {
      icon: <ImageIcon className="w-5 h-5 text-sky-600" />,
      bg: "bg-sky-100",
      border: "border-sky-200",
      title: "Upload Bingkai PNG Custom 🖼️",
      desc: "Punya desain frame acara ultah, wisuda, atau komunitas sendiri dari Canva/Photoshop? Tinggal drop PNG transparan kamu!",
      tag: "Event",
    },
    {
      icon: <Flame className="w-5 h-5 text-amber-700" />,
      bg: "bg-amber-100",
      border: "border-amber-300",
      title: "Frame Viral: Student Kalcer 🎓 & Riellmatics 📰",
      desc: "Koran editorial vintage ala majalah 'Si Paling Rajin' lengkap dengan kolom berita ambis berstempel resmi riellybooth, plus bingkai Riellmatics News!",
      tag: "Viral TikTok",
    },
    {
      icon: <Flame className="w-5 h-5 text-orange-600" />,
      bg: "bg-orange-100",
      border: "border-orange-200",
      title: "Frame Halloween Spooky 🎃 & Siap Cetak 4R ✂️",
      desc: "Bingkai labu jack-o'-lantern dan export garis potong 4R (4x6) bertanda gunting untuk potongan rapi.",
      tag: "Edisi Terbatas",
    },
  ];

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white border-4 border-pink-300 rounded-3xl p-5 sm:p-7 max-w-lg w-full shadow-2xl space-y-5 relative max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full bg-rose-100 text-rose-600 hover:bg-rose-200 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-1.5">
          <div className="inline-flex p-3 bg-pink-100 rounded-full border border-pink-300 text-pink-600 mb-1">
            <Sparkles className="w-7 h-7 animate-bounce" />
          </div>
          <div className="inline-block px-3 py-0.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-[11px] font-black rounded-full uppercase tracking-wider shadow-xs">
            Rilis Update v2.0
          </div>
          <h3 className="text-2xl font-black text-slate-800">
            Apa yang Baru di riellybooth? ✨
          </h3>
          <p className="text-xs text-slate-600 font-medium max-w-sm mx-auto leading-relaxed">
            Semua fitur baru ini dirancang biar photobooth online kamu makin seru dan estetik!
          </p>
        </div>

        {/* Feature List */}
        <div className="space-y-2.5">
          {updates.map((u, i) => (
            <div
              key={i}
              className={`p-3.5 rounded-2xl border-2 ${u.border} bg-white flex items-start gap-3 shadow-xs hover:shadow-md transition`}
            >
              <div className={`p-2.5 rounded-xl ${u.bg} shrink-0 mt-0.5`}>
                {u.icon}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-black text-slate-800">{u.title}</h4>
                  <span className="text-[9px] font-black bg-rose-100 text-rose-700 px-2 py-0.2 rounded-md">
                    {u.tag}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
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
          className="w-full py-3.5 bg-gradient-to-r from-pink-400 to-rose-500 hover:from-pink-500 hover:to-rose-600 text-white font-black text-xs sm:text-sm rounded-2xl shadow-md border-2 border-pink-500 flex items-center justify-center gap-2 transition hover:scale-102 active:scale-95 cursor-pointer"
        >
          <span>Cobain Fitur Baru Sekarang 🚀</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
