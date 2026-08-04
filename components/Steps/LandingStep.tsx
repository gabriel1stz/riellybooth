"use client";

import React from "react";
import {
  Camera,
  ArrowRight,
  Sparkles,
  Video,
  Music,
  Wand2,
  Download,
  Hand,
  CheckCircle2,
} from "lucide-react";

export default function LandingStep({ onStart }: { onStart: () => void }) {
  return (
    <div className="max-w-5xl w-full text-center space-y-14 py-6 px-4 flex flex-col items-center">
      {/* Live Counter & Top Floating Badge */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-pink-100 rounded-full border-2 border-pink-300 text-pink-700 text-xs sm:text-sm font-black shadow-xs">
          <Sparkles className="w-4 h-4 text-pink-500 animate-[spin_6s_linear_infinite]" />
          <span>Korean & Y2K Aesthetic Photobooth Studio</span>
          <span className="text-pink-600 font-extrabold">v5.0 🎀</span>
        </div>

        {/* Live Counter Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full border-2 border-pink-200 text-slate-700 text-xs font-black shadow-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span>📸 1,280+ photo strips created today!</span>
        </div>
      </div>

      {/* Main Hero Header */}
      <div className="space-y-4 max-w-3xl">
        <h2 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight text-slate-800">
          Studio Photo Strip <br />
          <span className="text-pink-500">Super Cute & Aesthetic</span>
        </h2>
        <p className="text-slate-600 text-sm sm:text-lg font-medium leading-relaxed max-w-2xl mx-auto">
          Tangkap pose foto terbaikmu dengan{" "}
          <span className="font-bold text-pink-600 bg-pink-100 px-2 py-0.5 rounded-md border border-pink-300">
            Gesture Peace (✌️)
          </span>
          , buat{" "}
          <span className="font-bold text-pink-600 bg-pink-100 px-2 py-0.5 rounded-md border border-pink-300">
            Live Photo (Moving Video 🎥)
          </span>
          , dan simpan photo strip resolusi tinggi tanpa watermark!
        </p>
      </div>

      {/* ASYMMETRIC SCATTERED PHOTO STRIP MOCKUP SHOWCASE */}
      <div
        className="relative my-6 w-full max-w-3xl h-80 sm:h-96 flex items-center justify-center cursor-pointer group"
        onClick={onStart}
      >
        {/* CARD 1 (MAIN CENTER): Larger, slight left tilt */}
        <div className="absolute z-20 w-44 sm:w-56 h-72 sm:h-88 bg-white border-4 border-pink-400 rounded-3xl p-3 shadow-2xl -rotate-3 transition-all duration-300 ease-out group-hover:rotate-0 group-hover:scale-105 flex flex-col justify-between">
          {/* Sticker Badges */}
          <div className="absolute -top-3 -right-3 bg-pink-400 text-white p-2.5 rounded-full shadow-md text-sm font-bold border-2 border-pink-500 animate-bounce">
            🎀
          </div>
          <div className="absolute -bottom-3 -left-3 bg-white border-2 border-pink-300 text-pink-600 px-3 py-1 rounded-full shadow-md text-[10px] font-black">
            Live Photo 🎥
          </div>

          <div className="space-y-2 flex-1">
            <div className="w-full h-14 bg-pink-50 rounded-xl border border-pink-200 flex items-center justify-center">
              <span className="text-xs text-pink-600 font-bold">rielllybooth ♡</span>
            </div>
            <div className="w-full h-14 bg-pink-50 rounded-xl border border-pink-200 flex items-center justify-center">
              <span className="text-xs text-pink-600 font-bold">✨ Webcam Toy FX</span>
            </div>
            <div className="w-full h-14 bg-pink-50 rounded-xl border border-pink-200 flex items-center justify-center">
              <span className="text-xs text-pink-600 font-bold">✌️ Peace Auto-Take</span>
            </div>
            <div className="w-full h-14 bg-pink-50 rounded-xl border border-pink-200 flex items-center justify-center">
              <span className="text-xs text-pink-600 font-bold">💖 Polkadot Cute</span>
            </div>
          </div>
          <div className="text-xs font-black text-pink-600 text-center py-1.5 border-t border-pink-200">
            rielllybooth ♡
          </div>
        </div>

        {/* CARD 2 (SECONDARY): Overlapping behind to the right, right tilt */}
        <div className="absolute z-10 translate-x-24 sm:translate-x-32 -translate-y-2 w-40 sm:w-52 h-68 sm:h-80 bg-white border-3 border-pink-300 rounded-3xl p-2.5 shadow-xl rotate-6 transition-all duration-300 ease-out group-hover:rotate-2 group-hover:translate-x-36 flex flex-col justify-between">
          <div className="absolute -top-3 -right-2 bg-purple-400 text-white p-2 rounded-full shadow-sm text-xs border border-purple-500">
            ✨
          </div>
          <div className="space-y-1.5 flex-1">
            <div className="w-full h-12 bg-purple-50 rounded-lg border border-purple-200 flex items-center justify-center text-[10px] text-purple-700 font-bold">
              🎞️ 35mm Film
            </div>
            <div className="w-full h-12 bg-purple-50 rounded-lg border border-purple-200 flex items-center justify-center text-[10px] text-purple-700 font-bold">
              📰 Newspaper
            </div>
            <div className="w-full h-12 bg-purple-50 rounded-lg border border-purple-200 flex items-center justify-center text-[10px] text-purple-700 font-bold">
              🌸 Soft Pink
            </div>
            <div className="w-full h-12 bg-purple-50 rounded-lg border border-purple-200 flex items-center justify-center text-[10px] text-purple-700 font-bold">
              ☕ Warm Cafe
            </div>
          </div>
          <div className="text-[10px] font-bold text-purple-600 text-center py-1 border-t border-purple-200">
            Retro 🎞️
          </div>
        </div>

        {/* CARD 3 (ACCENT): Offset at bottom left, subtle tilt */}
        <div className="absolute z-0 -translate-x-28 sm:-translate-x-36 translate-y-4 w-38 sm:w-48 h-64 sm:h-76 bg-white border-2 border-pink-200 rounded-3xl p-2 shadow-lg -rotate-6 transition-all duration-300 ease-out group-hover:-rotate-1 group-hover:-translate-x-40 flex flex-col justify-between">
          <div className="absolute -top-2 -left-2 bg-rose-400 text-white p-1.5 rounded-full text-xs shadow-xs">
            💖
          </div>
          <div className="space-y-1.5 flex-1">
            <div className="w-full h-11 bg-rose-50 rounded-lg flex items-center justify-center text-[10px] text-rose-700 font-bold">
              ✨ Pose 01
            </div>
            <div className="w-full h-11 bg-rose-50 rounded-lg flex items-center justify-center text-[10px] text-rose-700 font-bold">
              ✌️ Pose 02
            </div>
            <div className="w-full h-11 bg-rose-50 rounded-lg flex items-center justify-center text-[10px] text-rose-700 font-bold">
              🎀 Pose 03
            </div>
            <div className="w-full h-11 bg-rose-50 rounded-lg flex items-center justify-center text-[10px] text-rose-700 font-bold">
              💖 Pose 04
            </div>
          </div>
          <div className="text-[10px] font-bold text-rose-600 text-center py-1 border-t border-rose-200">
            Coquette 🎀
          </div>
        </div>
      </div>

      {/* MAIN CTA BUTTON */}
      <div className="pt-2">
        <button
          onClick={onStart}
          className="group relative inline-flex items-center gap-4 px-12 py-5 bg-pink-400 hover:bg-pink-500 text-white font-black text-xl sm:text-2xl rounded-3xl shadow-xl border-2 border-pink-500 transition-all duration-300 ease-out hover:scale-105 active:scale-95"
        >
          <Camera className="w-8 h-8 transition-transform group-hover:rotate-12" />
          <span>Mulai Sesi Photobooth</span>
          <ArrowRight className="w-7 h-7 transition-transform group-hover:translate-x-1" />
        </button>
      </div>

      {/* MANDATORY "HOW IT WORKS" 3-STEP SECTION */}
      <div className="w-full max-w-4xl bg-white border-2 border-pink-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="text-center space-y-1">
          <span className="text-xs font-black text-pink-500 uppercase tracking-wider">
            Panduan Mudah
          </span>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-800">
            Cara Kerja Photobooth 3 Langkah ⚡
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {/* Step 1 */}
          <div className="bg-rose-50/70 border-2 border-pink-200 p-5 rounded-2xl text-center space-y-3 flex flex-col items-center hover:-translate-y-1 transition-transform">
            <div className="w-12 h-12 rounded-2xl bg-pink-400 text-white flex items-center justify-center font-black text-xl shadow-md border-2 border-pink-500">
              ①
            </div>
            <div className="space-y-1">
              <h4 className="font-black text-slate-800 text-base flex items-center justify-center gap-1.5">
                <Camera className="w-4 h-4 text-pink-500" /> Izinkan Kamera
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Klik izinkan akses webcam pada browser Anda untuk memulai video feed.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-rose-50/70 border-2 border-pink-200 p-5 rounded-2xl text-center space-y-3 flex flex-col items-center hover:-translate-y-1 transition-transform">
            <div className="w-12 h-12 rounded-2xl bg-pink-400 text-white flex items-center justify-center font-black text-xl shadow-md border-2 border-pink-500">
              ②
            </div>
            <div className="space-y-1">
              <h4 className="font-black text-slate-800 text-base flex items-center justify-center gap-1.5">
                <Hand className="w-4 h-4 text-pink-500" /> Pose & Auto-Take ✌️
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Gunakan gesture V-sign (✌️) atau tombol jepret manual 3 detik untuk 4 pose.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-rose-50/70 border-2 border-pink-200 p-5 rounded-2xl text-center space-y-3 flex flex-col items-center hover:-translate-y-1 transition-transform">
            <div className="w-12 h-12 rounded-2xl bg-pink-400 text-white flex items-center justify-center font-black text-xl shadow-md border-2 border-pink-500">
              ③
            </div>
            <div className="space-y-1">
              <h4 className="font-black text-slate-800 text-base flex items-center justify-center gap-1.5">
                <Download className="w-4 h-4 text-pink-500" /> Hias & Download ⬇️
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Pilih bingkai, stiker, filter, lalu simpan Foto PNG HD & Live Video WebM!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* VISUAL FEATURE PILLS GRID */}
      <div className="w-full max-w-4xl space-y-4">
        <h4 className="text-lg font-black text-slate-700">Fitur Unggulan Studio</h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { icon: Camera, title: "Live Camera Feed", color: "text-rose-500" },
            { icon: Hand, title: "Peace Gesture ✌️", color: "text-pink-500" },
            { icon: Music, title: "Background Music 🎵", color: "text-purple-500" },
            { icon: Wand2, title: "Webcam Toy Filters ✨", color: "text-sky-500" },
            { icon: Video, title: "Live Photo 🎥 (Moving Video)", color: "text-indigo-500" },
            { icon: Download, title: "Export Dual PNG HD & WebM", color: "text-emerald-500" },
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-4 bg-white border-2 border-pink-200 rounded-2xl shadow-xs flex items-center gap-3 hover:-translate-y-1 hover:shadow-md transition-all duration-300"
            >
              <div className="p-2 bg-pink-50 rounded-xl border border-pink-200">
                <item.icon className={`w-5 h-5 ${item.color}`} />
              </div>
              <span className="text-xs font-black text-slate-800 text-left">
                {item.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Security & Guarantee Pills */}
      <div className="flex flex-wrap justify-center gap-3 pt-2">
        <span className="px-4 py-2 rounded-full bg-white border-2 border-pink-200 text-xs font-bold text-slate-700 flex items-center gap-1.5 shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Gratis & Tanpa Watermark
        </span>
        <span className="px-4 py-2 rounded-full bg-white border-2 border-pink-200 text-xs font-bold text-slate-700 flex items-center gap-1.5 shadow-xs">
          <Video className="w-4 h-4 text-sky-500" /> Support Live Photo 🎥
        </span>
        <span className="px-4 py-2 rounded-full bg-white border-2 border-pink-200 text-xs font-bold text-slate-700 flex items-center gap-1.5 shadow-xs">
          <Wand2 className="w-4 h-4 text-pink-500" /> Gesture Auto-Take ✌️
        </span>
      </div>
    </div>
  );
}