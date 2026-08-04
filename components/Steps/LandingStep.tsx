import React from "react";
import { Camera, ArrowRight, Sparkles, Video, ShieldCheck, Wand2 } from "lucide-react";

export default function LandingStep({ onStart }: { onStart: () => void }) {
  return (
    <div className="max-w-4xl w-full text-center space-y-10 py-6 px-4 flex flex-col items-center">
      {/* Top Floating Badge */}
      <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-pink-100 rounded-full border-2 border-pink-300 text-pink-700 text-xs sm:text-sm font-black shadow-xs">
        <Sparkles className="w-4 h-4 text-pink-500" />
        <span>Photobooth Studio</span>
        <span className="text-pink-600">v4.0 🎀</span>
      </div>

      {/* Main Hero Header */}
      <div className="space-y-4 max-w-2xl">
        <h2 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight text-slate-800">
          Studio Photo Strip <br />
          <span className="text-pink-500">Super Cute & Aesthetic</span>
        </h2>
        <p className="text-slate-600 text-sm sm:text-lg font-medium leading-relaxed">
          Tangkap pose foto terbaikmu dengan <span className="font-bold text-pink-600">Gesture Peace (✌️)</span>, buat <span className="font-bold text-pink-600">Live Photo (Moving Video 🎥)</span>, dan simpan photo strip resolusi tinggi tanpa watermark!
        </p>
      </div>

      {/* TILTED 3D PHOTO STRIP CARDS STACK */}
      <div className="relative my-4 flex items-center justify-center group cursor-pointer" onClick={onStart}>
        {/* Left Tilted Strip Card */}
        <div className="relative w-36 sm:w-44 h-64 sm:h-76 bg-white border-2 border-pink-300 rounded-2xl p-2 shadow-xl -rotate-12 transition-transform duration-300 ease-in-out group-hover:-rotate-6 group-hover:-translate-x-4 flex flex-col justify-between">
          <div className="space-y-1.5 flex-1">
            <div className="w-full h-12 bg-pink-100 rounded-lg flex items-center justify-center text-[10px] text-pink-700 font-bold">✨ Pose 01</div>
            <div className="w-full h-12 bg-pink-100 rounded-lg flex items-center justify-center text-[10px] text-pink-700 font-bold">✌️ Pose 02</div>
            <div className="w-full h-12 bg-pink-100 rounded-lg flex items-center justify-center text-[10px] text-pink-700 font-bold">🎀 Pose 03</div>
            <div className="w-full h-12 bg-pink-100 rounded-lg flex items-center justify-center text-[10px] text-pink-700 font-bold">💖 Pose 04</div>
          </div>
          <div className="text-[10px] font-bold text-pink-600 text-center py-1 border-t border-pink-200">Coquette 🎀</div>
        </div>

        {/* Main Center Tilted Strip Card */}
        <div className="relative z-10 w-40 sm:w-48 h-72 sm:h-84 bg-white border-4 border-pink-400 rounded-2xl p-2.5 shadow-2xl rotate-3 transition-transform duration-300 ease-in-out group-hover:rotate-0 group-hover:scale-105 flex flex-col justify-between">
          {/* Sticker Badges */}
          <div className="absolute -top-3 -right-3 bg-pink-400 text-white p-2 rounded-full shadow-md text-xs font-bold animate-bounce border-2 border-pink-500">
            🎀
          </div>
          <div className="absolute -bottom-3 -left-3 bg-white border-2 border-pink-300 text-pink-600 px-2.5 py-0.5 rounded-full shadow-md text-[10px] font-black">
            Live Photo 🎥
          </div>

          <div className="space-y-1.5 flex-1">
            <div className="w-full h-14 bg-rose-50 rounded-xl border border-pink-200 flex items-center justify-center">
              <span className="text-[10px] text-pink-600 font-bold">rielllybooth ♡</span>
            </div>
            <div className="w-full h-14 bg-rose-50 rounded-xl border border-pink-200 flex items-center justify-center">
              <span className="text-[10px] text-pink-600 font-bold">Webcam Toy FX</span>
            </div>
            <div className="w-full h-14 bg-rose-50 rounded-xl border border-pink-200 flex items-center justify-center">
              <span className="text-[10px] text-pink-600 font-bold">Peace Auto-Take</span>
            </div>
            <div className="w-full h-14 bg-rose-50 rounded-xl border border-pink-200 flex items-center justify-center">
              <span className="text-[10px] text-pink-600 font-bold">Polkadot Cute</span>
            </div>
          </div>
          <div className="text-xs font-bold text-pink-600 text-center py-1.5 border-t border-pink-200">
            rielllybooth ♡
          </div>
        </div>

        {/* Right Tilted Strip Card */}
        <div className="relative w-36 sm:w-44 h-64 sm:h-76 bg-white border-2 border-pink-300 rounded-2xl p-2 shadow-xl rotate-12 transition-transform duration-300 ease-in-out group-hover:rotate-6 group-hover:translate-x-4 flex flex-col justify-between">
          <div className="space-y-1.5 flex-1">
            <div className="w-full h-12 bg-purple-100 rounded-lg flex items-center justify-center text-[10px] text-purple-700 font-bold">🎞️ 35mm Film</div>
            <div className="w-full h-12 bg-purple-100 rounded-lg flex items-center justify-center text-[10px] text-purple-700 font-bold">📰 Newspaper</div>
            <div className="w-full h-12 bg-purple-100 rounded-lg flex items-center justify-center text-[10px] text-purple-700 font-bold">✨ Soft Pink</div>
            <div className="w-full h-12 bg-purple-100 rounded-lg flex items-center justify-center text-[10px] text-purple-700 font-bold">☕ Warm Cafe</div>
          </div>
          <div className="text-[10px] font-bold text-purple-600 text-center py-1 border-t border-purple-200">Retro 🎞️</div>
        </div>
      </div>

      {/* Feature Highlights Pills */}
      <div className="flex flex-wrap justify-center gap-3 pt-2">
        <span className="px-4 py-2 rounded-full bg-white border-2 border-pink-200 text-xs font-bold text-slate-700 flex items-center gap-1.5 shadow-xs">
          <ShieldCheck className="w-4 h-4 text-emerald-500" /> Gratis & Tanpa Watermark
        </span>
        <span className="px-4 py-2 rounded-full bg-white border-2 border-pink-200 text-xs font-bold text-slate-700 flex items-center gap-1.5 shadow-xs">
          <Video className="w-4 h-4 text-sky-500" /> Support Live Photo 🎥
        </span>
        <span className="px-4 py-2 rounded-full bg-white border-2 border-pink-200 text-xs font-bold text-slate-700 flex items-center gap-1.5 shadow-xs">
          <Wand2 className="w-4 h-4 text-pink-500" /> Gesture Auto-Take ✌️
        </span>
      </div>

      {/* Main CTA Button */}
      <div className="pt-4">
        <button
          onClick={onStart}
          className="group relative inline-flex items-center gap-4 px-12 py-5 bg-pink-400 hover:bg-pink-500 text-white font-black text-xl sm:text-2xl rounded-3xl shadow-lg border-2 border-pink-500 transition-all duration-300 ease-in-out hover:scale-105 active:scale-95"
        >
          <Camera className="w-7 h-7 transition-transform group-hover:rotate-12" />
          <span>Mulai Sesi Photobooth</span>
          <ArrowRight className="w-6 h-6 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
}