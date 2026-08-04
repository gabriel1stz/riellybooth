"use client";

import React, { useState } from "react";
import { Sparkles, ArrowLeft, Download, ArrowLeftRight, Palette, Sliders, RotateCcw, Frame, Heart, Film, Newspaper, Sparkle, Video, Type, FontCw, Wand2 } from "lucide-react";
import Slider from "../UI/Slider";
import ColorPicker from "../UI/ColorPicker";
import { LayoutMode, FilterState, FramePreset, CuteFilter, FontFamily } from "@/lib/canvasUtils";

type Shot = { id: number; dataUrl: string; videoBlobUrl?: string };

type EditorStepProps = {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  shots: Shot[];
  layout: LayoutMode;
  setLayout: (mode: LayoutMode) => void;
  preset: FramePreset;
  setPreset: (preset: FramePreset) => void;
  cuteFilter: CuteFilter;
  setCuteFilter: (filter: CuteFilter) => void;
  customText: string;
  setCustomText: (text: string) => void;
  fontFamily: FontFamily;
  setFontFamily: (font: FontFamily) => void;
  subtitleText: string;
  setSubtitleText: (sub: string) => void;
  isLivePhotoOn: boolean;
  setIsLivePhotoOn: (val: boolean | ((prev: boolean) => boolean)) => void;
  selectedForSwap: number | null;
  onSwapPhotos: (index: number) => void;
  frameColor: string;
  setFrameColor: (color: string) => void;
  textColor: string;
  setTextColor: (color: string) => void;
  filter: FilterState;
  setFilter: React.Dispatch<React.SetStateAction<FilterState>>;
  onBack: () => void;
  onDownloadPng: () => void;
  onDownloadVideo: () => void;
  isExportingVideo: boolean;
};

const DEFAULT_FILTER: FilterState = {
  brightness: 100,
  contrast: 100,
  saturation: 100,
  grayscale: 0,
};

export default function EditorStep({
  canvasRef,
  shots,
  layout,
  setLayout,
  preset,
  setPreset,
  cuteFilter,
  setCuteFilter,
  customText,
  setCustomText,
  fontFamily,
  setFontFamily,
  subtitleText,
  setSubtitleText,
  isLivePhotoOn,
  setIsLivePhotoOn,
  selectedForSwap,
  onSwapPhotos,
  frameColor,
  setFrameColor,
  textColor,
  setTextColor,
  filter,
  setFilter,
  onBack,
  onDownloadPng,
  onDownloadVideo,
  isExportingVideo,
}: EditorStepProps) {
  const handleResetFilters = () => {
    setFilter(DEFAULT_FILTER);
    setCuteFilter("none");
  };

  return (
    <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-start px-4 py-4">
      {/* LEFT: CANVAS PREVIEW AREA */}
      <div className="lg:col-span-6 flex flex-col items-center justify-center bg-slate-900/40 border border-slate-800/80 rounded-3xl p-6 shadow-2xl relative">
        <div className="flex items-center justify-between w-full mb-3 z-10">
          <div className="bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium text-pink-300 border border-white/10 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-pink-400" /> Pratinjau Canvas HD
          </div>

          {/* Live Photo Toggle */}
          <button
            type="button"
            onClick={() => setIsLivePhotoOn((v) => !v)}
            className={`px-3 py-1 rounded-full text-xs font-bold transition border flex items-center gap-1.5 ${
              isLivePhotoOn
                ? "bg-pink-500/20 text-pink-300 border-pink-500/40"
                : "bg-slate-950/80 text-slate-400 border-white/10"
            }`}
          >
            <Video className="w-3.5 h-3.5 text-pink-400" />
            <span>Live Video 🎥: {isLivePhotoOn ? "ON" : "OFF"}</span>
          </button>
        </div>

        <div className="w-full flex items-center justify-center py-2 min-h-[480px]">
          <canvas
            ref={canvasRef}
            className="max-h-[580px] w-auto max-w-full shadow-2xl rounded-2xl border border-slate-700/80 object-contain transition-all duration-300"
          />
        </div>

        <p className="text-[11px] text-slate-500 text-center pt-2">
          * Canvas dirender secara real-time. Kamu dapat mengekspor dalam format PNG Statis atau Video Live (WebM/MP4).
        </p>
      </div>

      {/* RIGHT: CONTROLS STUDIO PANEL */}
      <div className="lg:col-span-6 space-y-6 bg-slate-900/90 border border-slate-800/90 rounded-3xl p-6 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <h3 className="text-xl font-black text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-pink-400" /> Studio Hias Photo Strip
          </h3>
          <span className="text-xs bg-pink-500/10 text-pink-300 px-3 py-1 rounded-full border border-pink-500/20 font-medium">
            Custom Style v3.0
          </span>
        </div>

        {/* 1. FRAME PRESET SELECTOR */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Frame className="w-3.5 h-3.5 text-pink-400" /> Pilih Tema Frame Preset
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            <button
              type="button"
              onClick={() => setPreset("clean")}
              className={`p-2.5 rounded-2xl border text-xs font-bold transition flex flex-col items-center gap-1 ${
                preset === "clean"
                  ? "bg-pink-500/20 border-pink-500 text-pink-300 ring-2 ring-pink-500/30"
                  : "bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700"
              }`}
            >
              <Frame className="w-4 h-4 text-pink-400" />
              <span>Classic Clean</span>
            </button>

            <button
              type="button"
              onClick={() => setPreset("coquette")}
              className={`p-2.5 rounded-2xl border text-xs font-bold transition flex flex-col items-center gap-1 ${
                preset === "coquette"
                  ? "bg-pink-500/20 border-pink-500 text-pink-300 ring-2 ring-pink-500/30"
                  : "bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700"
              }`}
            >
              <Heart className="w-4 h-4 text-pink-400" />
              <span>Coquette 🎀</span>
            </button>

            <button
              type="button"
              onClick={() => setPreset("y2k")}
              className={`p-2.5 rounded-2xl border text-xs font-bold transition flex flex-col items-center gap-1 ${
                preset === "y2k"
                  ? "bg-pink-500/20 border-pink-500 text-pink-300 ring-2 ring-pink-500/30"
                  : "bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700"
              }`}
            >
              <Sparkle className="w-4 h-4 text-sky-400" />
              <span>Y2K Cyber ✨</span>
            </button>

            <button
              type="button"
              onClick={() => setPreset("newspaper")}
              className={`p-2.5 rounded-2xl border text-xs font-bold transition flex flex-col items-center gap-1 ${
                preset === "newspaper"
                  ? "bg-pink-500/20 border-pink-500 text-pink-300 ring-2 ring-pink-500/30"
                  : "bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700"
              }`}
            >
              <Newspaper className="w-4 h-4 text-amber-400" />
              <span>Newspaper 📰</span>
            </button>

            <button
              type="button"
              onClick={() => setPreset("film")}
              className={`p-2.5 rounded-2xl border text-xs font-bold transition flex flex-col items-center gap-1 ${
                preset === "film"
                  ? "bg-pink-500/20 border-pink-500 text-pink-300 ring-2 ring-pink-500/30"
                  : "bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700"
              }`}
            >
              <Film className="w-4 h-4 text-emerald-400" />
              <span>Film Strip 🎞️</span>
            </button>
          </div>
        </div>

        {/* 2. CUTE COLOR GRADE FILTERS */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Wand2 className="w-3.5 h-3.5 text-pink-400" /> Cute Filter Color Grade
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {[
              { id: "none", label: "Normal" },
              { id: "soft_pink", label: "Soft Pink 🌸" },
              { id: "warm_cafe", label: "Warm Cafe ☕" },
              { id: "cyber_glow", label: "Cyber Glow ⚡" },
              { id: "vintage_90s", label: "90s Vintage 🎞️" },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setCuteFilter(item.id as CuteFilter)}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold transition ${
                  cuteFilter === item.id
                    ? "bg-pink-500/20 border-pink-500 text-pink-300"
                    : "bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* 3. CUSTOM TEXT & TYPOGRAPHY EDITOR */}
        <div className="space-y-3 p-3.5 bg-slate-950/40 rounded-2xl border border-slate-800/80">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Type className="w-3.5 h-3.5 text-pink-400" /> Custom Text & Font Footer
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-slate-400">Judul Header/Footer</label>
              <input
                type="text"
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder="rielllybooth ♡"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-pink-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-400">Tanggal / Subtitle</label>
              <input
                type="text"
                value={subtitleText}
                onChange={(e) => setSubtitleText(e.target.value)}
                placeholder="✨ 04 Aug 2026 ✨"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-pink-500"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-400">Gaya Font Typography</label>
            <div className="grid grid-cols-4 gap-2 pt-1">
              {[
                { id: "sans", label: "Sans" },
                { id: "serif", label: "Serif" },
                { id: "cursive", label: "Cursive" },
                { id: "mono", label: "Mono" },
              ].map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFontFamily(f.id as FontFamily)}
                  className={`py-1.5 px-2 rounded-lg border text-xs font-semibold transition ${
                    fontFamily === f.id
                      ? "bg-pink-500/20 border-pink-500 text-pink-300"
                      : "bg-slate-900 border-slate-800 text-slate-400"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 4. LAYOUT MODE */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-pink-400" /> Layout Frame
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setLayout("strip")}
              className={`py-2.5 px-4 rounded-2xl border text-xs font-bold transition flex items-center justify-center gap-2 ${
                layout === "strip"
                  ? "bg-pink-500/20 border-pink-500 text-pink-300 ring-2 ring-pink-500/30"
                  : "bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700"
              }`}
            >
              <span>Strip 1x4 (Vertikal)</span>
            </button>

            <button
              type="button"
              onClick={() => setLayout("grid")}
              className={`py-2.5 px-4 rounded-2xl border text-xs font-bold transition flex items-center justify-center gap-2 ${
                layout === "grid"
                  ? "bg-pink-500/20 border-pink-500 text-pink-300 ring-2 ring-pink-500/30"
                  : "bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700"
              }`}
            >
              <span>Grid 2x2 (Kotak)</span>
            </button>
          </div>
        </div>

        {/* 5. SWAP PHOTO POSITIONS */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <ArrowLeftRight className="w-3.5 h-3.5 text-pink-400" /> Tukar Urutan Foto
            </label>
            {selectedForSwap !== null && (
              <span className="text-[11px] text-pink-400 animate-pulse font-semibold">
                Pilih foto ke-2 untuk ditukar dengan #{selectedForSwap + 1}
              </span>
            )}
          </div>

          <div className="grid grid-cols-4 gap-2.5 bg-slate-950/40 p-2.5 rounded-2xl border border-slate-800/80">
            {shots.slice(0, 4).map((shot, idx) => (
              <button
                key={shot.id || idx}
                type="button"
                onClick={() => onSwapPhotos(idx)}
                className={`relative rounded-xl overflow-hidden border-2 transition-all duration-200 aspect-square ${
                  selectedForSwap === idx
                    ? "border-pink-500 scale-95 ring-4 ring-pink-500/40"
                    : "border-slate-800 hover:border-slate-600"
                }`}
              >
                <img
                  src={shot.dataUrl}
                  className="w-full h-full object-cover"
                  alt={`Thumb ${idx + 1}`}
                />
                <span className="absolute bottom-1 right-1 bg-slate-950/80 text-[10px] text-white px-1.5 py-0.5 rounded font-mono font-bold border border-white/10">
                  #{idx + 1}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* 6. COLOR PICKERS (ACTIVE FOR CLEAN PRESET) */}
        {preset === "clean" && (
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-pink-400" /> Kustom Skema Warna
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <ColorPicker
                label="Warna Bingkai Frame"
                value={frameColor}
                onChange={setFrameColor}
              />
              <ColorPicker
                label="Warna Teks Branding"
                value={textColor}
                onChange={setTextColor}
              />
            </div>
          </div>
        )}

        {/* 7. SLIDER ADJUSTMENTS */}
        <div className="space-y-3 pt-3 border-t border-slate-800">
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-pink-400" /> Brightness & Contrast Sliders
            </label>
            <button
              type="button"
              onClick={handleResetFilters}
              className="text-[11px] text-slate-400 hover:text-pink-400 transition flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" /> Reset Filter
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Slider
              label="Brightness (Kecerahan)"
              min={50}
              max={150}
              value={filter.brightness}
              onChange={(v) => setFilter((f) => ({ ...f, brightness: v }))}
            />
            <Slider
              label="Contrast (Kontras)"
              min={50}
              max={150}
              value={filter.contrast}
              onChange={(v) => setFilter((f) => ({ ...f, contrast: v }))}
            />
            <Slider
              label="Saturation (Saturasi)"
              min={0}
              max={200}
              value={filter.saturation}
              onChange={(v) => setFilter((f) => ({ ...f, saturation: v }))}
            />
            <Slider
              label="Grayscale (Hitam Putih)"
              min={0}
              max={100}
              value={filter.grayscale}
              onChange={(v) => setFilter((f) => ({ ...f, grayscale: v }))}
            />
          </div>
        </div>

        {/* 8. DUAL EXPORT ACTIONS (PNG & LIVE VIDEO) */}
        <div className="pt-4 border-t border-slate-800 flex flex-col gap-3">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onBack}
              className="px-5 py-3.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-2xl text-slate-300 font-semibold text-xs flex items-center gap-2 transition"
            >
              <ArrowLeft className="w-4 h-4" /> Kembali
            </button>

            <button
              type="button"
              onClick={onDownloadPng}
              className="flex-1 py-3.5 bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 hover:from-pink-600 hover:to-rose-600 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-xl shadow-pink-500/25 flex items-center justify-center gap-2 transition hover:scale-[1.02] active:scale-[0.98]"
            >
              <Download className="w-4 h-4" /> Simpan Foto Statis (PNG HD)
            </button>
          </div>

          <button
            type="button"
            onClick={onDownloadVideo}
            disabled={isExportingVideo}
            className="w-full py-3.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-pink-300 border border-pink-500/30 font-bold text-xs sm:text-sm rounded-2xl shadow-lg transition flex items-center justify-center gap-2"
          >
            <Video className="w-4 h-4 text-pink-400" />
            <span>
              {isExportingVideo
                ? "Merekam Live Video Canvas..."
                : "Simpan Live Photo Video 🎥 (WebM / Boomerang)"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}