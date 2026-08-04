import React from "react";
import { Camera, ArrowRight, Sparkles, Image as ImageIcon, Heart, Wand2 } from "lucide-react";

export default function LandingStep({ onStart }: { onStart: () => void }) {
  return (
    <div className="max-w-3xl w-full text-center space-y-8 py-8 px-4 flex flex-col items-center">
      {/* Decorative Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-pink-500/10 rounded-full border border-pink-500/30 text-pink-300 text-sm font-medium animate-pulse shadow-lg shadow-pink-500/10">
        <Sparkles className="w-4 h-4 text-pink-400" />
        <span>Photobooth Studio</span>
      </div>

      {/* Main Heading */}
      <div className="space-y-4 max-w-2xl">
        <h2 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
          Bikin Photo Strip <br />
          <span className="bg-gradient-to-r from-pink-400 via-rose-400 to-pink-500 bg-clip-text text-transparent drop-shadow-sm">
            Lucu & Aesthetic
          </span>{" "}
          di Mana Aja.
        </h2>
        <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
          Abadikan 4 pose terbaikmu langsung dari browser, sesuaikan layout strip atau grid, pilih warna bingkai favorit, dan download hasil HD gratis tanpa watermark!
        </p>
      </div>

      {/* CTA Button */}
      <div className="pt-2">
        <button
          onClick={onStart}
          className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 hover:from-pink-600 hover:to-rose-600 text-white font-bold text-lg rounded-2xl shadow-xl shadow-pink-500/25 transition-all duration-300 hover:scale-105 active:scale-95"
        >
          <Camera className="w-6 h-6 transition-transform group-hover:rotate-12" />
          <span>Mulai Sesi Foto Sekarang</span>
          <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
        </button>
      </div>

      {/* Feature Highlights Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full pt-8 border-t border-slate-800/80">
        <div className="bg-slate-900/60 border border-slate-800/80 p-5 rounded-2xl flex flex-col items-center gap-2 text-center backdrop-blur-sm">
          <div className="p-3 bg-pink-500/10 text-pink-400 rounded-xl">
            <Camera className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-200">4-Pose Studio</h3>
          <p className="text-xs text-slate-400">Timers otomatis 3 detik per jepretan foto secara gratis & fleksibel.</p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 p-5 rounded-2xl flex flex-col items-center gap-2 text-center backdrop-blur-sm">
          <div className="p-3 bg-pink-500/10 text-pink-400 rounded-xl">
            <Wand2 className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-200">Layout & Filter</h3>
          <p className="text-xs text-slate-400">Layout Strip 1x4 atau Grid 2x2 dengan filter warna & brightness kustom.</p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 p-5 rounded-2xl flex flex-col items-center gap-2 text-center backdrop-blur-sm">
          <div className="p-3 bg-pink-500/10 text-pink-400 rounded-xl">
            <ImageIcon className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-200">Hasil Print HD</h3>
          <p className="text-xs text-slate-400">Unduh langsung format PNG resolusi tinggi siap cetak atau share!</p>
        </div>
      </div>
    </div>
  );
}