import React from "react";
import { Camera, ArrowRight, Sparkles, Heart, Video, ShieldCheck, Wand2, Star } from "lucide-react";

export default function LandingStep({ onStart }: { onStart: () => void }) {
  return (
    <div className="max-w-4xl w-full text-center space-y-10 py-6 px-4 flex flex-col items-center">
      {/* Top Floating Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-pink-500/10 rounded-full border border-pink-500/30 text-pink-300 text-xs sm:text-sm font-semibold animate-pulse shadow-lg shadow-pink-500/10">
        <Sparkles className="w-4 h-4 text-pink-400" />
        <span>Korean & Y2K Aesthetic Photobooth Studio</span>
        <span className="text-pink-400 font-bold">v3.0 🎀</span>
      </div>

      {/* Main Hero Header */}
      <div className="space-y-4 max-w-2xl">
        <h2 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight text-white">
          Studio Photo Strip <br />
          <span className="bg-gradient-to-r from-pink-400 via-rose-400 to-pink-500 bg-clip-text text-transparent drop-shadow-sm">
            Super Cute & Aesthetic
          </span>
        </h2>
        <p className="text-slate-400 text-sm sm:text-lg leading-relaxed">
          Tangkap pose foto terbaikmu dengan **Gesture Peace (✌️)**, buat **Live Photo (Moving Video 🎥)**, dan simpan photo strip resolusi tinggi tanpa watermark!
        </p>
      </div>

      {/* TILTED 3D PHOTO STRIP CARDS STACK (ANTI-AI-SLOP REDESIGN) */}
      <div className="relative my-4 flex items-center justify-center group cursor-pointer" onClick={onStart}>
        {/* Back Card Decorative Shadow */}
        <div className="absolute w-44 h-72 bg-gradient-to-tr from-pink-600 to-purple-600 rounded-3xl opacity-30 blur-xl group-hover:opacity-50 transition-opacity duration-300" />

        {/* Left Tilted Strip Card */}
        <div className="relative w-36 sm:w-44 h-64 sm:h-76 bg-slate-900 border-2 border-pink-500/30 rounded-2xl p-2 shadow-2xl -rotate-12 transition-transform duration-500 group-hover:-rotate-6 group-hover:-translate-x-4 flex flex-col justify-between">
          <div className="space-y-1.5 flex-1">
            <div className="w-full h-12 bg-pink-500/20 rounded-lg flex items-center justify-center text-[10px] text-pink-300 font-bold">✨ Pose 01</div>
            <div className="w-full h-12 bg-pink-500/20 rounded-lg flex items-center justify-center text-[10px] text-pink-300 font-bold">✌️ Pose 02</div>
            <div className="w-full h-12 bg-pink-500/20 rounded-lg flex items-center justify-center text-[10px] text-pink-300 font-bold">🎀 Pose 03</div>
            <div className="w-full h-12 bg-pink-500/20 rounded-lg flex items-center justify-center text-[10px] text-pink-300 font-bold">💖 Pose 04</div>
          </div>
          <div className="text-[10px] font-bold text-pink-400 text-center py-1 border-t border-pink-500/20">Coquette 🎀</div>
        </div>

        {/* Main Center Tilted Strip Card */}
        <div className="relative z-10 w-40 sm:w-48 h-72 sm:h-84 bg-slate-950 border-2 border-pink-400 rounded-2xl p-2.5 shadow-2xl rotate-3 transition-transform duration-500 group-hover:rotate-0 group-hover:scale-105 flex flex-col justify-between">
          {/* Sticker Badges */}
          <div className="absolute -top-3 -right-3 bg-pink-500 text-white p-1.5 rounded-full shadow-lg text-xs font-bold animate-bounce">
            🎀
          </div>
          <div className="absolute -bottom-3 -left-3 bg-slate-900 border border-pink-500/40 text-pink-300 px-2 py-0.5 rounded-full shadow-lg text-[10px] font-bold">
            Live Photo 🎥
          </div>

          <div className="space-y-1.5 flex-1">
            <div className="w-full h-14 bg-slate-900 rounded-xl border border-pink-500/30 overflow-hidden relative flex items-center justify-center">
              <span className="text-[10px] text-pink-300 font-bold">rielllybooth ♡</span>
            </div>
            <div className="w-full h-14 bg-slate-900 rounded-xl border border-pink-500/30 overflow-hidden relative flex items-center justify-center">
              <span className="text-[10px] text-pink-300 font-bold">✨ Y2K Cyber</span>
            </div>
            <div className="w-full h-14 bg-slate-900 rounded-xl border border-pink-500/30 overflow-hidden relative flex items-center justify-center">
              <span className="text-[10px] text-pink-300 font-bold">✌️ Peace Auto-Take</span>
            </div>
            <div className="w-full h-14 bg-slate-900 rounded-xl border border-pink-500/30 overflow-hidden relative flex items-center justify-center">
              <span className="text-[10px] text-pink-300 font-bold">💖 Cute Filters</span>
            </div>
          </div>
          <div className="text-xs font-bold text-pink-400 text-center py-1.5 border-t border-slate-800">
            rielllybooth ♡
          </div>
        </div>

        {/* Right Tilted Strip Card */}
        <div className="relative w-36 sm:w-44 h-64 sm:h-76 bg-slate-900 border-2 border-pink-500/30 rounded-2xl p-2 shadow-2xl rotate-12 transition-transform duration-500 group-hover:rotate-6 group-hover:translate-x-4 flex flex-col justify-between">
          <div className="space-y-1.5 flex-1">
            <div className="w-full h-12 bg-purple-500/20 rounded-lg flex items-center justify-center text-[10px] text-purple-300 font-bold">🎞️ 35mm Film</div>
            <div className="w-full h-12 bg-purple-500/20 rounded-lg flex items-center justify-center text-[10px] text-purple-300 font-bold">📰 Newspaper</div>
            <div className="w-full h-12 bg-purple-500/20 rounded-lg flex items-center justify-center text-[10px] text-purple-300 font-bold">✨ Soft Pink</div>
            <div className="w-full h-12 bg-purple-500/20 rounded-lg flex items-center justify-center text-[10px] text-purple-300 font-bold">☕ Warm Cafe</div>
          </div>
          <div className="text-[10px] font-bold text-purple-400 text-center py-1 border-t border-purple-500/20">Retro 🎞️</div>
        </div>
      </div>

      {/* Feature Highlights Pills */}
      <div className="flex flex-wrap justify-center gap-3 pt-2">
        <span className="px-4 py-2 rounded-full bg-slate-900/80 border border-slate-800 text-xs font-semibold text-slate-300 flex items-center gap-1.5 shadow-md">
          <ShieldCheck className="w-4 h-4 text-emerald-400" /> Gratis & Tanpa Watermark
        </span>
        <span className="px-4 py-2 rounded-full bg-slate-900/80 border border-slate-800 text-xs font-semibold text-slate-300 flex items-center gap-1.5 shadow-md">
          <Video className="w-4 h-4 text-sky-400" /> Support Live Photo 🎥
        </span>
        <span className="px-4 py-2 rounded-full bg-slate-900/80 border border-slate-800 text-xs font-semibold text-slate-300 flex items-center gap-1.5 shadow-md">
          <Wand2 className="w-4 h-4 text-pink-400" /> Gesture Auto-Take ✌️
        </span>
      </div>

      {/* Main CTA Button */}
      <div className="pt-2">
        <button
          onClick={onStart}
          className="group relative inline-flex items-center gap-3 px-10 py-4.5 bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 hover:from-pink-600 hover:to-rose-600 text-white font-black text-lg rounded-2xl shadow-2xl shadow-pink-500/30 transition-all duration-300 hover:scale-105 active:scale-95"
        >
          <Camera className="w-6 h-6 transition-transform group-hover:rotate-12" />
          <span>Mulai Sesi Photo Booth</span>
          <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
}