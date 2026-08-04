import React from "react";
import { Sparkles, Camera } from "lucide-react";

export default function Navbar() {
  return (
    <header className="border-b border-slate-800/80 px-6 py-4 flex justify-between items-center bg-slate-950/70 backdrop-blur-xl sticky top-0 z-50 transition-all duration-300">
      <div className="flex items-center gap-3 group cursor-pointer">
        <div className="p-2 rounded-xl bg-pink-500/10 border border-pink-500/20 group-hover:scale-105 transition-transform duration-300">
          <Camera className="w-5 h-5 text-pink-400" />
        </div>
        <div className="flex items-center gap-1.5">
          <h1 className="text-2xl font-black tracking-tight bg-gradient-to-r from-pink-400 via-rose-400 to-pink-500 bg-clip-text text-transparent drop-shadow-sm">
            rielllybooth
          </h1>
          <Sparkles className="w-4 h-4 text-pink-400 animate-pulse" />
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <span className="inline-flex items-center gap-1.5 text-xs bg-pink-500/10 text-pink-300 border border-pink-500/20 px-3.5 py-1.5 rounded-full font-semibold shadow-sm backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-pink-400 animate-ping"></span>
          Virtual Photobooth
        </span>
      </div>
    </header>
  );
}