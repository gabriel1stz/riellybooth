import React, { useState } from "react";
import { Sparkles, Camera, Volume2, VolumeX, Home, Info, Heart } from "lucide-react";

type NavbarProps = {
  isAudioOn?: boolean;
  onToggleAudio?: () => void;
  onGoHome?: () => void;
  onOpenAbout?: () => void;
  onOpenSupport?: () => void;
};

export default function Navbar({
  isAudioOn = true,
  onToggleAudio,
  onGoHome,
  onOpenAbout,
  onOpenSupport,
}: NavbarProps) {
  const [logoFailed, setLogoFailed] = useState(false);

  return (
    <header className="border-b border-pink-200/80 px-4 sm:px-8 py-3.5 flex justify-between items-center bg-white/90 backdrop-blur-md sticky top-0 z-50 transition-all duration-300 shadow-xs">
      {/* Brand Logo & Name */}
      <div
        onClick={onGoHome}
        className="flex items-center gap-3 group cursor-pointer"
      >
        <div className="p-1.5 sm:p-2 rounded-2xl bg-pink-100 border border-pink-300 group-hover:scale-105 transition-transform duration-300 flex items-center justify-center">
          {!logoFailed ? (
            <img
              src="/logo.png"
              alt="rielllybooth logo"
              onError={() => setLogoFailed(true)}
              className="w-6 h-6 object-contain"
            />
          ) : (
            <Camera className="w-5 h-5 text-pink-500" />
          )}
        </div>
        <div className="flex items-center gap-1.5">
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-pink-500">
            rielllybooth
          </h1>
          <Sparkles className="w-4 h-4 text-pink-400 animate-[spin_6s_linear_infinite]" />
        </div>
      </div>

      {/* Navigation & Action Links */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Home Link */}
        {onGoHome && (
          <button
            type="button"
            onClick={onGoHome}
            className="p-2 sm:px-3 py-1.5 rounded-full border border-pink-200 bg-rose-50 hover:bg-pink-100 text-slate-700 text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
            title="Beranda / Home"
          >
            <Home className="w-4 h-4 text-pink-500" />
            <span className="hidden sm:inline">Home</span>
          </button>
        )}

        {/* About Link */}
        {onOpenAbout && (
          <button
            type="button"
            onClick={onOpenAbout}
            className="p-2 sm:px-3 py-1.5 rounded-full border border-pink-200 bg-rose-50 hover:bg-pink-100 text-slate-700 text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
            title="Tentang rielllybooth"
          >
            <Info className="w-4 h-4 text-pink-500" />
            <span className="hidden sm:inline">About</span>
          </button>
        )}

        {/* Support / Donate Link */}
        {onOpenSupport && (
          <button
            type="button"
            onClick={onOpenSupport}
            className="px-3.5 py-1.5 rounded-full border-2 border-pink-400 bg-pink-400 hover:bg-pink-500 text-white text-xs font-black transition flex items-center gap-1.5 shadow-sm hover:scale-105 active:scale-95"
            title="Dukung / Traktir Kopi 💖"
          >
            <Heart className="w-3.5 h-3.5 fill-current animate-bounce" />
            <span>Support 💖</span>
          </button>
        )}

        {/* Audio Toggle */}
        {onToggleAudio && (
          <button
            type="button"
            onClick={onToggleAudio}
            className={`px-3 py-1.5 rounded-full border-2 text-xs font-bold transition-all duration-300 flex items-center gap-1.5 shadow-xs ${
              isAudioOn
                ? "bg-pink-100 text-pink-700 border-pink-300"
                : "bg-slate-100 text-slate-500 border-slate-300"
            }`}
            title="Toggle Background Music 🎵"
          >
            {isAudioOn ? (
              <>
                <Volume2 className="w-4 h-4 text-pink-500" />
                <span className="hidden md:inline">BGM 🎵 ON</span>
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4 text-slate-400" />
                <span className="hidden md:inline">BGM OFF</span>
              </>
            )}
          </button>
        )}
      </div>
    </header>
  );
}