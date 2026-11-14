"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Sparkles, Camera, Volume2, VolumeX, Home, Info, Heart, ShieldCheck, Menu, X, ArrowRight } from "lucide-react";

type NavbarProps = {
  isAudioOn?: boolean;
  onToggleAudio?: () => void;
  onGoHome?: () => void;
  onStartStudio?: () => void;
  onOpenAbout?: () => void;
  onOpenSupport?: () => void;
  onOpenPrivacy?: () => void;
  lang?: "id" | "en";
  onToggleLang?: () => void;
};

export default function Navbar({
  isAudioOn = true,
  onToggleAudio,
  onGoHome,
  onStartStudio,
  onOpenAbout,
  onOpenSupport,
  onOpenPrivacy,
  lang = "id",
  onToggleLang,
}: NavbarProps) {
  const [logoFailed, setLogoFailed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="border-b-2 border-[#E9B8CA] px-4 sm:px-8 py-3 bg-[#FFF9F0]/95 backdrop-blur-md sticky top-0 z-50 transition-all duration-300 shadow-paper">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Brand Logo & Tagline */}
        <div
          onClick={onGoHome}
          className="flex items-center gap-2.5 sm:gap-3 group cursor-pointer select-none"
        >
          <div className="p-1.5 rounded-2xl bg-[#FFF0F4] border-2 border-[#E9B8CA] group-hover:rotate-[-3deg] transition-transform duration-200 flex items-center justify-center shadow-xs">
            {!logoFailed ? (
              <Image
                src="/logo.png"
                alt="RiellyBooth logo"
                width={150}
                height={42}
                priority
                onError={() => setLogoFailed(true)}
                className="h-7 sm:h-8 w-auto object-contain"
              />
            ) : (
              <Camera className="w-5 h-5 text-[#E84D91]" />
            )}
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-xl sm:text-2xl font-heading font-bold tracking-tight text-[#E84D91]">
                RiellyBooth
              </span>
              <span className="text-xs text-[#F48FB1] animate-pulse">♡</span>
            </div>
            <span className="hidden sm:inline text-[11px] font-handwriting text-[#8B7180] tracking-wide -mt-1">
              Little Moments, Big Memories.
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1.5 lg:gap-2 text-xs font-semibold text-[#392633]">
          {onGoHome && (
            <button
              type="button"
              onClick={onGoHome}
              className="px-3 py-1.5 rounded-full hover:bg-[#FFF0F4] hover:text-[#E84D91] transition flex items-center gap-1.5 cursor-pointer"
            >
              <Home className="w-3.5 h-3.5 text-[#F48FB1]" />
              <span>Home</span>
            </button>
          )}

          {onStartStudio && (
            <button
              type="button"
              onClick={onStartStudio}
              className="px-3 py-1.5 rounded-full hover:bg-[#FFF0F4] hover:text-[#E84D91] transition flex items-center gap-1.5 cursor-pointer"
            >
              <Camera className="w-3.5 h-3.5 text-[#E84D91]" />
              <span>Studio</span>
            </button>
          )}

          {onOpenAbout && (
            <button
              type="button"
              onClick={onOpenAbout}
              className="px-3 py-1.5 rounded-full hover:bg-[#FFF0F4] hover:text-[#E84D91] transition flex items-center gap-1.5 cursor-pointer"
            >
              <Info className="w-3.5 h-3.5 text-[#8B7180]" />
              <span>About</span>
            </button>
          )}

          {onOpenPrivacy && (
            <button
              type="button"
              onClick={onOpenPrivacy}
              className="px-3 py-1.5 rounded-full hover:bg-[#FFF0F4] hover:text-[#E84D91] transition flex items-center gap-1.5 cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Privasi</span>
            </button>
          )}

          {/* Support / Treat coffee */}
          {onOpenSupport && (
            <button
              type="button"
              onClick={onOpenSupport}
              className="px-3 py-1.5 rounded-full bg-[#FFF0F4] border border-[#E9B8CA] hover:bg-[#F8D8E3] text-[#E84D91] transition flex items-center gap-1.5 cursor-pointer"
              title="Support developer"
            >
              <Heart className="w-3.5 h-3.5 fill-[#E84D91] text-[#E84D91] animate-bounce" />
              <span>Support</span>
            </button>
          )}

          {/* Audio BGM Toggle */}
          {onToggleAudio && (
            <button
              type="button"
              onClick={onToggleAudio}
              className={`p-2 rounded-full border transition flex items-center justify-center cursor-pointer ${isAudioOn
                  ? "bg-[#FFF0F4] border-[#E9B8CA] text-[#E84D91]"
                  : "bg-stone-100 border-stone-200 text-stone-400"
                }`}
              title={isAudioOn ? "Matikan Efek Suara Kamera" : "Nyalakan Efek Suara Kamera"}
              aria-label={isAudioOn ? "Matikan Efek Suara Kamera" : "Nyalakan Efek Suara Kamera"}
            >
              {isAudioOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          )}

          {/* Main CTA: Start Creating */}
          {onStartStudio && (
            <button
              type="button"
              onClick={onStartStudio}
              className="ml-2 px-5 py-2 scrapbook-btn text-xs sm:text-sm font-heading flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Start Creating</span>
            </button>
          )}
        </nav>

        {/* Mobile Action Controls & Hamburger Toggle */}
        <div className="flex md:hidden items-center gap-2">
          {onToggleAudio && (
            <button
              type="button"
              onClick={onToggleAudio}
              className={`p-2 rounded-full border text-xs cursor-pointer ${isAudioOn
                  ? "bg-[#FFF0F4] border-[#E9B8CA] text-[#E84D91]"
                  : "bg-stone-100 border-stone-200 text-stone-400"
                }`}
              aria-label={isAudioOn ? "Matikan Efek Suara Kamera" : "Nyalakan Efek Suara Kamera"}
            >
              {isAudioOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          )}

          {onStartStudio && (
            <button
              type="button"
              onClick={onStartStudio}
              className="px-3.5 py-1.5 scrapbook-btn text-xs font-heading flex items-center gap-1 cursor-pointer"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Foto</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setMobileMenuOpen((v) => !v)}
            className="p-2 rounded-xl bg-[#FFF0F4] border border-[#E9B8CA] text-[#392633] cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-3 pt-3 border-t border-[#E9B8CA] flex flex-col gap-2 pb-2 animate-in slide-in-from-top-2 duration-150">
          {onGoHome && (
            <button
              type="button"
              onClick={() => {
                onGoHome();
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-4 py-2.5 rounded-xl hover:bg-[#FFF0F4] text-xs font-bold text-[#392633] flex items-center gap-2"
            >
              <Home className="w-4 h-4 text-[#F48FB1]" /> Home
            </button>
          )}

          {onStartStudio && (
            <button
              type="button"
              onClick={() => {
                onStartStudio();
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-4 py-2.5 rounded-xl hover:bg-[#FFF0F4] text-xs font-bold text-[#E84D91] flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-[#E84D91]" /> Photo Studio
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-[#E84D91]" />
            </button>
          )}

          {onOpenAbout && (
            <button
              type="button"
              onClick={() => {
                onOpenAbout();
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-4 py-2.5 rounded-xl hover:bg-[#FFF0F4] text-xs font-bold text-[#392633] flex items-center gap-2"
            >
              <Info className="w-4 h-4 text-[#8B7180]" /> About RiellyBooth
            </button>
          )}

          {onOpenPrivacy && (
            <button
              type="button"
              onClick={() => {
                onOpenPrivacy();
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-4 py-2.5 rounded-xl hover:bg-[#FFF0F4] text-xs font-bold text-[#392633] flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> Kebijakan Privasi
            </button>
          )}

          {onOpenSupport && (
            <button
              type="button"
              onClick={() => {
                onOpenSupport();
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-4 py-2.5 rounded-xl hover:bg-[#FFF0F4] text-xs font-bold text-[#E84D91] flex items-center gap-2"
            >
              <Heart className="w-4 h-4 text-[#E84D91] fill-[#E84D91]" /> Support / Traktir Kopi
            </button>
          )}
        </div>
      )}
    </header>
  );
}
