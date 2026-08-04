import React from "react";
import { Sparkles, Camera } from "lucide-react";

export default function Navbar() {
  return (
    <header className="border-b border-pink-200/80 px-6 py-4 flex justify-between items-center bg-white/90 backdrop-blur-md sticky top-0 z-50 transition-all duration-300 shadow-xs">
      <div className="flex items-center gap-3 group cursor-pointer">
        <div className="p-2 rounded-2xl bg-pink-100 border border-pink-300 group-hover:scale-105 transition-transform duration-300">
          <Camera className="w-5 h-5 text-pink-500" />
        </div>
        <div className="flex items-center gap-1.5">
          <h1 className="text-2xl font-black tracking-tight text-pink-500">
            rielllybooth
          </h1>
          <Sparkles className="w-4 h-4 text-pink-400 animate-pulse" />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className="inline-flex items-center gap-1.5 text-xs bg-pink-100 text-pink-600 border border-pink-300 px-3.5 py-1.5 rounded-full font-bold shadow-xs">
          <span className="w-2 h-2 rounded-full bg-pink-500 animate-ping" />
          Photobooth Live v1
        </span>
      </div>
    </header>
  );
}