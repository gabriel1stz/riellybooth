"use client";

import React from "react";
import Link from "next/link";
import { Camera, Sparkles, Heart, RefreshCcw, Home } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#FAF7F2] text-[#3C2A2A] flex flex-col items-center justify-center p-6 text-center font-sans selection:bg-[#FF85A1] selection:text-white">
      <div className="max-w-md w-full bg-white border-4 border-pink-300 rounded-3xl p-7 sm:p-9 shadow-xl space-y-6 animate-in fade-in zoom-in-95 duration-200 relative overflow-hidden">
        {/* Cute Top Tape Decoration */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-28 h-7 bg-pink-200/80 border border-pink-300 rotate-1 rounded-sm shadow-xs pointer-events-none"></div>

        {/* Photostrip 404 Illustration */}
        <div className="mx-auto w-36 bg-rose-50 border-2 border-pink-300 rounded-2xl p-2.5 shadow-sm space-y-2">
          <div className="w-full aspect-[4/3] bg-pink-100 rounded-xl flex items-center justify-center border border-pink-200">
            <span className="text-3xl font-black text-pink-500">4</span>
          </div>
          <div className="w-full aspect-[4/3] bg-pink-200 rounded-xl flex items-center justify-center border border-pink-300">
            <Camera className="w-8 h-8 text-pink-600 animate-bounce" />
          </div>
          <div className="w-full aspect-[4/3] bg-pink-100 rounded-xl flex items-center justify-center border border-pink-200">
            <span className="text-3xl font-black text-pink-500">4</span>
          </div>
          <div className="pt-1 text-[10px] font-black text-pink-600 tracking-wider">
            riellybooth ♡
          </div>
        </div>

        {/* Message */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-100 border border-pink-300 text-pink-700 text-xs font-black rounded-full">
            <Sparkles className="w-3.5 h-3.5 text-pink-500" />
            <span>Foto Tidak Ditemukan</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-800">
            Oops! Halaman Ini Hilang dari Strip 🎞️
          </h1>
          <p className="text-xs text-slate-600 font-medium leading-relaxed">
            Mungkin linknya salah ketik atau fotonya belum selesai dicetak dari mesin photobooth. Yuk balik ke studio!
          </p>
        </div>

        {/* CTA Button */}
        <Link
          href="/"
          className="w-full py-3.5 px-6 bg-pink-400 hover:bg-pink-500 text-white font-black text-sm rounded-2xl border-2 border-pink-500 shadow-md flex items-center justify-center gap-2 transition hover:scale-102 active:scale-95"
        >
          <Home className="w-4 h-4" />
          <span>Kembali ke Photobooth ✨</span>
        </Link>
      </div>
    </main>
  );
}
