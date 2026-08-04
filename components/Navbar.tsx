import React from "react";
import { Sparkles, Camera, Volume2, VolumeX } from "lucide-react";

type NavbarProps = {
  isAudioOn?: boolean;
  onToggleAudio?: () => void;
};

export default function Navbar({ isAudioOn = true, onToggleAudio }: NavbarProps) {
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
        {onToggleAudio && (
          <button
            type="button"
            onClick={onToggleAudio}
            className={`px-3.5 py-1.5 rounded-full border-2 text-xs font-bold transition-all duration-300 flex items-center gap-2 shadow-xs ${
              isAudioOn
                ? "bg-pink-100 text-pink-700 border-pink-300"
                : "bg-slate-100 text-slate-500 border-slate-300"
            }`}
            title="Toggle Background Music 🎵"
          >
            {isAudioOn ? (
              <>
                <Volume2 className="w-4 h-4 text-pink-500" />
                <span>Sal Priadi 🎵 ON</span>
                <span className="flex gap-0.5 items-end h-3">
                  <span className="w-1 h-3 bg-pink-500 rounded-full animate-pulse" />
                  <span className="w-1 h-2 bg-pink-400 rounded-full animate-bounce" />
                  <span className="w-1 h-3.5 bg-pink-500 rounded-full animate-pulse" />
                </span>
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4 text-slate-400" />
                <span>BGM OFF</span>
              </>
            )}
          </button>
        )}

        <span className="hidden sm:inline-flex items-center gap-1.5 text-xs bg-pink-100 text-pink-600 border border-pink-300 px-3.5 py-1.5 rounded-full font-bold shadow-xs">
          <span className="w-2 h-2 rounded-full bg-pink-500 animate-ping" />
          Virtual Photobooth
        </span>
      </div>
    </header>
  );
}