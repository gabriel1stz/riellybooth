"use client";

import React from "react";
import {
  Sparkles,
  ArrowLeft,
  Download,
  ArrowLeftRight,
  Palette,
  Sliders,
  RotateCcw,
  Frame,
  Heart,
  Film,
  Newspaper,
  Sparkle,
  Video,
  Type,
  Wand2,
  Sticker,
  CircleDot,
  Trash2,
} from "lucide-react";
import Slider from "../UI/Slider";
import ColorPicker from "../UI/ColorPicker";
import { LayoutMode, FilterState, FramePreset, CuteFilter, FontFamily, PlacedSticker } from "@/lib/canvasUtils";

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
  placedStickers: PlacedSticker[];
  onAddSticker: (emoji: string) => void;
  onClearStickers: () => void;
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

const STICKER_PALETTE = [
  { emoji: "🎀", name: "Ribbon" },
  { emoji: "💖", name: "Heart" },
  { emoji: "🍒", name: "Cherry" },
  { emoji: "🧸", name: "Teddy" },
  { emoji: "✨", name: "Sparkles" },
  { emoji: "👑", name: "Crown" },
  { emoji: "✌️", name: "Peace" },
];

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
  placedStickers,
  onAddSticker,
  onClearStickers,
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
      <div className="lg:col-span-6 flex flex-col items-center justify-center bg-white border-2 border-pink-200 rounded-3xl p-6 shadow-xl relative">
        <div className="flex items-center justify-between w-full mb-3 z-10">
          <div className="bg-pink-100 px-3.5 py-1.5 rounded-full text-xs font-bold text-pink-700 border border-pink-300 flex items-center gap-1.5 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-pink-500" /> Pratinjau Canvas HD
          </div>

          {/* Live Photo Toggle */}
          <button
            type="button"
            onClick={() => setIsLivePhotoOn((v) => !v)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-300 ease-in-out border-2 flex items-center gap-1.5 shadow-xs ${
              isLivePhotoOn
                ? "bg-pink-400 text-white border-pink-500"
                : "bg-white text-slate-700 border-slate-300"
            }`}
          >
            <Video className="w-3.5 h-3.5 text-pink-500" />
            <span>Live Video 🎥: {isLivePhotoOn ? "ON" : "OFF"}</span>
          </button>
        </div>

        <div className="w-full flex items-center justify-center py-2 min-h-[480px]">
          <canvas
            ref={canvasRef}
            className="max-h-[580px] w-auto max-w-full shadow-2xl rounded-2xl border-2 border-pink-200 object-contain transition-all duration-300 ease-in-out"
          />
        </div>

        <p className="text-[11px] text-slate-500 font-medium text-center pt-2">
          * Canvas dirender secara real-time. Kamu dapat mengekspor dalam format PNG Statis atau Video Live (WebM / Boomerang).
        </p>
      </div>

      {/* RIGHT: CONTROLS STUDIO PANEL */}
      <div className="lg:col-span-6 space-y-6 bg-white border-2 border-pink-200 rounded-3xl p-6 shadow-xl">
        <div className="flex items-center justify-between border-b border-pink-200 pb-4">
          <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-pink-500" /> Studio Hias Photo Strip
          </h3>
          <span className="text-xs bg-pink-100 text-pink-700 px-3.5 py-1 rounded-full border border-pink-300 font-bold">
            Light Aesthetic v4.0
          </span>
        </div>

        {/* 1. FRAME PRESET SELECTOR (INCLUDES POLKADOT CUTE) */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <Frame className="w-3.5 h-3.5 text-pink-500" /> Pilih Tema Frame Preset
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            <button
              type="button"
              onClick={() => setPreset("clean")}
              className={`p-2.5 rounded-2xl border-2 text-xs font-bold transition-all duration-300 ease-in-out flex flex-col items-center gap-1 ${
                preset === "clean"
                  ? "bg-pink-100 border-pink-400 text-pink-700 shadow-xs"
                  : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
              }`}
            >
              <Frame className="w-4 h-4 text-pink-500" />
              <span>Classic Clean</span>
            </button>

            <button
              type="button"
              onClick={() => setPreset("polkadot")}
              className={`p-2.5 rounded-2xl border-2 text-xs font-bold transition-all duration-300 ease-in-out flex flex-col items-center gap-1 ${
                preset === "polkadot"
                  ? "bg-pink-100 border-pink-400 text-pink-700 shadow-xs"
                  : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
              }`}
            >
              <CircleDot className="w-4 h-4 text-pink-500" />
              <span>Polkadot Cute 💖</span>
            </button>

            <button
              type="button"
              onClick={() => setPreset("coquette")}
              className={`p-2.5 rounded-2xl border-2 text-xs font-bold transition-all duration-300 ease-in-out flex flex-col items-center gap-1 ${
                preset === "coquette"
                  ? "bg-pink-100 border-pink-400 text-pink-700 shadow-xs"
                  : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
              }`}
            >
              <Heart className="w-4 h-4 text-pink-500" />
              <span>Coquette 🎀</span>
            </button>

            <button
              type="button"
              onClick={() => setPreset("y2k")}
              className={`p-2.5 rounded-2xl border-2 text-xs font-bold transition-all duration-300 ease-in-out flex flex-col items-center gap-1 ${
                preset === "y2k"
                  ? "bg-pink-100 border-pink-400 text-pink-700 shadow-xs"
                  : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
              }`}
            >
              <Sparkle className="w-4 h-4 text-sky-500" />
              <span>Y2K Cyber ✨</span>
            </button>

            <button
              type="button"
              onClick={() => setPreset("newspaper")}
              className={`p-2.5 rounded-2xl border-2 text-xs font-bold transition-all duration-300 ease-in-out flex flex-col items-center gap-1 ${
                preset === "newspaper"
                  ? "bg-pink-100 border-pink-400 text-pink-700 shadow-xs"
                  : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
              }`}
            >
              <Newspaper className="w-4 h-4 text-amber-500" />
              <span>Newspaper 📰</span>
            </button>

            <button
              type="button"
              onClick={() => setPreset("film")}
              className={`p-2.5 rounded-2xl border-2 text-xs font-bold transition-all duration-300 ease-in-out flex flex-col items-center gap-1 ${
                preset === "film"
                  ? "bg-pink-100 border-pink-400 text-pink-700 shadow-xs"
                  : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
              }`}
            >
              <Film className="w-4 h-4 text-emerald-500" />
              <span>Film Strip 🎞️</span>
            </button>
          </div>
        </div>

        {/* 2. WEBCAM TOY RETRO FILTERS & CUTE FILTERS */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <Wand2 className="w-3.5 h-3.5 text-pink-500" /> Webcam Toy & Cute Filters
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {[
              { id: "none", label: "Normal" },
              { id: "pixel", label: "Pixel Art 👾" },
              { id: "thermal", label: "Thermal Heatmap 🌈" },
              { id: "pop_art", label: "Vivid Pop Art 🎨" },
              { id: "vhs", label: "VHS Retro CRT 📺" },
              { id: "soft_pink", label: "Soft Pink 🌸" },
              { id: "warm_cafe", label: "Warm Cafe ☕" },
              { id: "cyber_glow", label: "Cyber Glow ⚡" },
              { id: "vintage_90s", label: "90s Vintage 🎞️" },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setCuteFilter(item.id as CuteFilter)}
                className={`py-2 px-3 rounded-xl border-2 text-xs font-bold transition-all duration-300 ease-in-out ${
                  cuteFilter === item.id
                    ? "bg-pink-100 border-pink-400 text-pink-700 shadow-xs"
                    : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* 3. INTERACTIVE STICKER PICKER */}
        <div className="space-y-2.5 p-3.5 bg-rose-50/60 rounded-2xl border-2 border-pink-200">
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Sticker className="w-3.5 h-3.5 text-pink-500" /> Tambah Stiker Interaktif
            </label>
            {placedStickers.length > 0 && (
              <button
                type="button"
                onClick={onClearStickers}
                className="text-[11px] text-rose-600 hover:text-rose-700 font-bold transition flex items-center gap-1"
              >
                <Trash2 className="w-3 h-3" /> Hapus Stiker ({placedStickers.length})
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {STICKER_PALETTE.map((st) => (
              <button
                key={st.emoji}
                type="button"
                onClick={() => onAddSticker(st.emoji)}
                className="px-3 py-2 bg-white border-2 border-pink-200 hover:border-pink-400 hover:scale-110 rounded-xl text-lg font-bold shadow-xs transition-all duration-300 ease-in-out"
                title={`Tambah ${st.name}`}
              >
                {st.emoji}
              </button>
            ))}
          </div>
        </div>

        {/* 4. CUSTOM TEXT & TYPOGRAPHY EDITOR */}
        <div className="space-y-3 p-3.5 bg-rose-50/60 rounded-2xl border-2 border-pink-200">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <Type className="w-3.5 h-3.5 text-pink-500" /> Custom Text & Font Footer
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-slate-600">Judul Header/Footer</label>
              <input
                type="text"
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder="rielllybooth ♡"
                className="w-full bg-white border-2 border-pink-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 font-bold placeholder-slate-400 focus:outline-none focus:border-pink-400"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-600">Tanggal / Subtitle</label>
              <input
                type="text"
                value={subtitleText}
                onChange={(e) => setSubtitleText(e.target.value)}
                placeholder="✨ 04 Aug 2026 ✨"
                className="w-full bg-white border-2 border-pink-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 font-bold placeholder-slate-400 focus:outline-none focus:border-pink-400"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-600">Gaya Font Typography</label>
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
                  className={`py-1.5 px-2 rounded-xl border-2 text-xs font-bold transition-all duration-300 ease-in-out ${
                    fontFamily === f.id
                      ? "bg-pink-100 border-pink-400 text-pink-700 shadow-xs"
                      : "bg-white border-slate-200 text-slate-600"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 5. LAYOUT MODE */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-pink-500" /> Layout Frame
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setLayout("strip")}
              className={`py-2.5 px-4 rounded-2xl border-2 text-xs font-bold transition-all duration-300 ease-in-out flex items-center justify-center gap-2 ${
                layout === "strip"
                  ? "bg-pink-100 border-pink-400 text-pink-700 shadow-xs"
                  : "bg-white border-slate-200 text-slate-600"
              }`}
            >
              <span>Strip 1x4 (Vertikal)</span>
            </button>

            <button
              type="button"
              onClick={() => setLayout("grid")}
              className={`py-2.5 px-4 rounded-2xl border-2 text-xs font-bold transition-all duration-300 ease-in-out flex items-center justify-center gap-2 ${
                layout === "grid"
                  ? "bg-pink-100 border-pink-400 text-pink-700 shadow-xs"
                  : "bg-white border-slate-200 text-slate-600"
              }`}
            >
              <span>Grid 2x2 (Kotak)</span>
            </button>
          </div>
        </div>

        {/* 6. SWAP PHOTO POSITIONS */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <ArrowLeftRight className="w-3.5 h-3.5 text-pink-500" /> Tukar Urutan Foto
            </label>
            {selectedForSwap !== null && (
              <span className="text-[11px] text-pink-600 animate-pulse font-bold">
                Pilih foto ke-2 untuk ditukar dengan #{selectedForSwap + 1}
              </span>
            )}
          </div>

          <div className="grid grid-cols-4 gap-2.5 bg-rose-50/60 p-2.5 rounded-2xl border-2 border-pink-200">
            {shots.slice(0, 4).map((shot, idx) => (
              <button
                key={shot.id || idx}
                type="button"
                onClick={() => onSwapPhotos(idx)}
                className={`relative rounded-xl overflow-hidden border-2 transition-all duration-300 ease-in-out aspect-square ${
                  selectedForSwap === idx
                    ? "border-pink-500 scale-95 ring-4 ring-pink-300 shadow-md"
                    : "border-slate-200 hover:border-slate-400"
                }`}
              >
                <img
                  src={shot.dataUrl}
                  className="w-full h-full object-cover"
                  alt={`Thumb ${idx + 1}`}
                />
                <span className="absolute bottom-1 right-1 bg-white/90 text-slate-800 text-[10px] px-1.5 py-0.5 rounded font-bold border border-pink-200">
                  #{idx + 1}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* 7. COLOR PICKERS (ACTIVE FOR CLEAN & POLKADOT PRESETS) */}
        {(preset === "clean" || preset === "polkadot") && (
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-pink-500" /> Kustom Skema Warna
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

        {/* 8. SLIDER ADJUSTMENTS */}
        <div className="space-y-3 pt-3 border-t border-pink-200">
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-pink-500" /> Brightness & Contrast Sliders
            </label>
            <button
              type="button"
              onClick={handleResetFilters}
              className="text-[11px] text-slate-500 hover:text-pink-600 font-bold transition flex items-center gap-1"
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

        {/* 9. DUAL EXPORT ACTIONS (PNG & LIVE VIDEO) - SOLID PASTEL BUTTONS */}
        <div className="pt-4 border-t border-pink-200 flex flex-col gap-3">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onBack}
              className="px-5 py-3.5 bg-white hover:bg-slate-50 border-2 border-slate-300 rounded-2xl text-slate-700 font-bold text-xs flex items-center gap-2 transition-all duration-300 ease-in-out shadow-xs"
            >
              <ArrowLeft className="w-4 h-4" /> Kembali
            </button>

            <button
              type="button"
              onClick={onDownloadPng}
              className="flex-1 py-3.5 bg-pink-400 hover:bg-pink-500 border-2 border-pink-500 text-white font-black text-xs sm:text-sm rounded-2xl shadow-md transition-all duration-300 ease-in-out flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Download className="w-4 h-4" /> Simpan Foto Statis (PNG HD)
            </button>
          </div>

          <button
            type="button"
            onClick={onDownloadVideo}
            disabled={isExportingVideo}
            className="w-full py-3.5 bg-white hover:bg-rose-50 disabled:opacity-50 text-pink-600 border-2 border-pink-300 font-black text-xs sm:text-sm rounded-2xl shadow-xs transition-all duration-300 ease-in-out flex items-center justify-center gap-2"
          >
            <Video className="w-4 h-4 text-pink-500" />
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