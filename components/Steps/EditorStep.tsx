"use client";

import React, { useState, useRef } from "react";
import { Download, ArrowLeft, RefreshCw, Layout, Palette, Sparkles, Video, Wand2, FlipHorizontal, Trash2 } from "lucide-react";
import { LayoutMode, FramePreset, CuteFilter, FontFamily, FilterState, PlacedSticker } from "@/lib/canvasUtils";
import ColorPicker from "../UI/ColorPicker";
import Slider from "../UI/Slider";

type Shot = { id: number; dataUrl: string; videoBlobUrl?: string };

const STICKER_LIBRARY = [
  "🎀", "💖", "🍒", "🧸", "✨", "👑", "✌️", "🐱",
  "🐰", "🌸", "🍭", "🕶️", "👻", "⭐", "🍓", "🦋",
  "🍩", "🐾", "🍦", "🎈"
];

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
  setSubtitleText: (text: string) => void;
  isLivePhotoOn: boolean;
  setIsLivePhotoOn: (val: boolean) => void;
  placedStickers: PlacedSticker[];
  onAddSticker: (emoji: string) => void;
  onClearStickers: () => void;
  onUpdateStickerPos?: (id: string, x: number, y: number) => void;
  selectedForSwap: number | null;
  onSwapPhotos: (index: number) => void;
  frameColor: string;
  setFrameColor: (color: string) => void;
  textColor: string;
  setTextColor: (color: string) => void;
  filter: FilterState;
  setFilter: React.Dispatch<React.SetStateAction<FilterState>>;
  isFlipped: boolean;
  setIsFlipped: (val: boolean | ((prev: boolean) => boolean)) => void;
  onBack: () => void;
  onDownloadPng: () => void;
  onDownloadVideo: () => void;
  isExportingVideo: boolean;
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
  onUpdateStickerPos,
  selectedForSwap,
  onSwapPhotos,
  frameColor,
  setFrameColor,
  textColor,
  setTextColor,
  filter,
  setFilter,
  isFlipped,
  setIsFlipped,
  onBack,
  onDownloadPng,
  onDownloadVideo,
  isExportingVideo,
}: EditorStepProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<"frame" | "filter" | "text" | "stickers" | "adjust">("frame");
  const [draggingId, setDraggingId] = useState<string | null>(null);

  // Helper to convert mouse/touch event into canvas coordinate space
  const getCanvasPos = (clientX: number, clientY: number) => {
    if (!canvasRef.current) return null;
    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = canvasRef.current.width / rect.width;
    const scaleY = canvasRef.current.height / rect.height;

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  const handlePointerDown = (clientX: number, clientY: number) => {
    const pos = getCanvasPos(clientX, clientY);
    if (!pos || placedStickers.length === 0) return;

    // Find closest sticker within 50px radius
    let foundId: string | null = null;
    let minDist = 60;

    placedStickers.forEach((st) => {
      const dist = Math.hypot(st.x - pos.x, st.y - pos.y);
      if (dist < minDist) {
        minDist = dist;
        foundId = st.id;
      }
    });

    if (foundId) {
      setDraggingId(foundId);
    }
  };

  const handlePointerMove = (clientX: number, clientY: number) => {
    if (!draggingId || !onUpdateStickerPos) return;
    const pos = getCanvasPos(clientX, clientY);
    if (pos) {
      onUpdateStickerPos(draggingId, pos.x, pos.y);
    }
  };

  const handlePointerUp = () => {
    setDraggingId(null);
  };

  return (
    <div className="w-full max-w-6xl px-4 py-4 space-y-6">
      {/* Top Header Controls */}
      <div className="flex flex-wrap justify-between items-center gap-4 bg-white border-2 border-pink-200 p-4 rounded-2xl shadow-sm">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1.5 transition border border-slate-300"
        >
          <ArrowLeft className="w-4 h-4" /> Review Foto
        </button>

        <div className="flex items-center gap-2">
          {/* Flip Horizontal Toggle */}
          <button
            type="button"
            onClick={() => setIsFlipped((v) => !v)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border-2 shadow-xs ${
              isFlipped
                ? "bg-pink-400 text-white border-pink-500"
                : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
            }`}
            title="Cermin Horisontal"
          >
            <FlipHorizontal className="w-4 h-4" />
            <span>Flip 🪞 {isFlipped ? "ON" : "OFF"}</span>
          </button>

          {/* Live Photo Toggle */}
          <button
            type="button"
            onClick={() => setIsLivePhotoOn(!isLivePhotoOn)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border-2 shadow-xs ${
              isLivePhotoOn
                ? "bg-pink-400 text-white border-pink-500"
                : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
            }`}
          >
            <Video className="w-4 h-4 text-pink-500" />
            <span>Live Photo 🎥 {isLivePhotoOn ? "ON" : "OFF"}</span>
          </button>
        </div>

        {/* Dual Export Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onDownloadPng}
            className="px-5 py-2.5 bg-pink-400 hover:bg-pink-500 text-white font-black text-xs sm:text-sm rounded-xl border-2 border-pink-500 shadow-md flex items-center gap-2 transition hover:scale-105 active:scale-95"
          >
            <Download className="w-4 h-4" /> Simpan PNG HD
          </button>

          {isLivePhotoOn && (
            <button
              type="button"
              onClick={onDownloadVideo}
              disabled={isExportingVideo}
              className="px-4 py-2.5 bg-purple-500 hover:bg-purple-600 text-white font-black text-xs sm:text-sm rounded-xl border-2 border-purple-600 shadow-md flex items-center gap-2 transition disabled:opacity-50 hover:scale-105 active:scale-95"
            >
              <Video className="w-4 h-4" /> {isExportingVideo ? "Exporting..." : "Simpan Video 🎥"}
            </button>
          )}
        </div>
      </div>

      {/* Main Studio Grid: Canvas Preview + Controls Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Interactive Canvas Preview Container */}
        <div className="lg:col-span-6 flex flex-col items-center gap-3">
          <div
            ref={containerRef}
            className="relative bg-white border-4 border-pink-300 p-3 sm:p-4 rounded-3xl shadow-2xl overflow-hidden flex items-center justify-center max-h-[75vh] cursor-grab active:cursor-grabbing select-none"
            onMouseDown={(e) => handlePointerDown(e.clientX, e.clientY)}
            onMouseMove={(e) => handlePointerMove(e.clientX, e.clientY)}
            onMouseUp={handlePointerUp}
            onTouchStart={(e) => {
              if (e.touches.length > 0) {
                handlePointerDown(e.touches[0].clientX, e.touches[0].clientY);
              }
            }}
            onTouchMove={(e) => {
              if (e.touches.length > 0) {
                handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
              }
            }}
            onTouchEnd={handlePointerUp}
          >
            <canvas
              ref={canvasRef}
              className="max-h-[68vh] w-auto h-auto object-contain rounded-xl shadow-inner pointer-events-none"
            />
          </div>

          <p className="text-[11px] font-bold text-slate-500 text-center">
            💡 <span className="text-pink-600">Geser / Drag</span> stiker langsung di atas kanvas pratinjau!
          </p>

          {/* Photo Position Swap Helper */}
          <div className="w-full bg-white border-2 border-pink-200 p-3 rounded-2xl space-y-2 shadow-xs">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <RefreshCw className="w-3.5 h-3.5 text-pink-500" /> Tukar Posisi Foto (Klik 2 Foto):
            </span>
            <div className="flex gap-2 justify-center">
              {shots.slice(0, 4).map((shot, idx) => (
                <button
                  key={shot.id || idx}
                  type="button"
                  onClick={() => onSwapPhotos(idx)}
                  className={`w-10 h-10 rounded-xl font-black text-xs border-2 transition ${
                    selectedForSwap === idx
                      ? "bg-pink-400 text-white border-pink-500 ring-2 ring-pink-300 scale-110"
                      : "bg-rose-50 text-pink-700 border-pink-200 hover:bg-pink-100"
                  }`}
                >
                  #{idx + 1}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Editor Control Panel */}
        <div className="lg:col-span-6 bg-white border-2 border-pink-200 rounded-3xl p-5 shadow-lg space-y-5">
          {/* Navigation Tabs */}
          <div className="flex bg-rose-50 p-1.5 rounded-2xl border border-pink-200 gap-1 overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveTab("frame")}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 whitespace-nowrap ${
                activeTab === "frame"
                  ? "bg-pink-400 text-white shadow-xs"
                  : "text-slate-600 hover:bg-pink-100"
              }`}
            >
              <Layout className="w-3.5 h-3.5" /> Bingkai & Warna
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("filter")}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 whitespace-nowrap ${
                activeTab === "filter"
                  ? "bg-pink-400 text-white shadow-xs"
                  : "text-slate-600 hover:bg-pink-100"
              }`}
            >
              <Wand2 className="w-3.5 h-3.5" /> Filter Warna
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("stickers")}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 whitespace-nowrap ${
                activeTab === "stickers"
                  ? "bg-pink-400 text-white shadow-xs"
                  : "text-slate-600 hover:bg-pink-100"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" /> Stiker Lucu
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("text")}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 whitespace-nowrap ${
                activeTab === "text"
                  ? "bg-pink-400 text-white shadow-xs"
                  : "text-slate-600 hover:bg-pink-100"
              }`}
            >
              <Palette className="w-3.5 h-3.5" /> Teks Header
            </button>
          </div>

          {/* TAB 1: FRAME & LAYOUT PRESETS */}
          {activeTab === "frame" && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700">Layout Photo Strip:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setLayout("strip")}
                    className={`py-2.5 px-4 rounded-xl text-xs font-bold border-2 transition ${
                      layout === "strip"
                        ? "bg-pink-400 text-white border-pink-500 shadow-xs"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    1x4 Vertical Strip
                  </button>
                  <button
                    type="button"
                    onClick={() => setLayout("grid")}
                    className={`py-2.5 px-4 rounded-xl text-xs font-bold border-2 transition ${
                      layout === "grid"
                        ? "bg-pink-400 text-white border-pink-500 shadow-xs"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    2x2 Grid Square
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700">Preset Bingkai Aesthetic:</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "polkadot", label: "Polkadot Cute 💖" },
                    { id: "clean", label: "Classic Clean 🤍" },
                    { id: "coquette", label: "Coquette Ribbon 🎀" },
                    { id: "y2k", label: "Y2K Cyber ✨" },
                    { id: "newspaper", label: "Newspaper 📰" },
                    { id: "film", label: "35mm Film 🎞️" },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setPreset(item.id as FramePreset)}
                      className={`py-2 px-2.5 rounded-xl text-xs font-bold border-2 transition ${
                        preset === item.id
                          ? "bg-pink-400 text-white border-pink-500 shadow-xs"
                          : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <ColorPicker
                label="Warna Dasar Latar Bingkai"
                value={frameColor}
                onChange={setFrameColor}
              />
            </div>
          )}

          {/* TAB 2: CUTE & RETRO WEBCAM TOY FILTERS */}
          {activeTab === "filter" && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700">Webcam Toy & Cute Filters:</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "none", label: "Normal ✨" },
                    { id: "soft_pink", label: "Soft Pink 🌸" },
                    { id: "warm_cafe", label: "Warm Cafe ☕" },
                    { id: "cyber_glow", label: "Cyber Glow ⚡" },
                    { id: "vintage_90s", label: "90s Vintage 🎞️" },
                    { id: "pixel", label: "Pixel Art 👾" },
                    { id: "thermal", label: "Thermal Heat 🌈" },
                    { id: "pop_art", label: "Vivid Pop Art 🎨" },
                    { id: "vhs", label: "VHS Retro CRT 📺" },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setCuteFilter(item.id as CuteFilter)}
                      className={`py-2 px-2 rounded-xl text-[11px] font-bold border-2 transition ${
                        cuteFilter === item.id
                          ? "bg-pink-400 text-white border-pink-500 shadow-xs"
                          : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <Slider
                  label="Kecerahan (Brightness)"
                  min={50}
                  max={150}
                  value={filter.brightness}
                  onChange={(val) => setFilter((prev) => ({ ...prev, brightness: val }))}
                />
                <Slider
                  label="Kontras (Contrast)"
                  min={50}
                  max={150}
                  value={filter.contrast}
                  onChange={(val) => setFilter((prev) => ({ ...prev, contrast: val }))}
                />
                <Slider
                  label="Saturasi Warna (Saturate)"
                  min={0}
                  max={200}
                  value={filter.saturation}
                  onChange={(val) => setFilter((prev) => ({ ...prev, saturation: val }))}
                />
              </div>
            </div>
          )}

          {/* TAB 3: EXPANDED 20-STICKER PALETTE */}
          {activeTab === "stickers" && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-700">Pilih Stiker Lucu (Klik untuk menambah):</label>
                {placedStickers.length > 0 && (
                  <button
                    type="button"
                    onClick={onClearStickers}
                    className="px-3 py-1 bg-rose-100 hover:bg-rose-200 text-rose-700 text-[11px] font-bold rounded-lg transition flex items-center gap-1 border border-rose-300"
                  >
                    <Trash2 className="w-3 h-3" /> Hapus Semua ({placedStickers.length})
                  </button>
                )}
              </div>

              <div className="grid grid-cols-5 gap-2.5 bg-rose-50/70 border-2 border-pink-200 p-3 rounded-2xl max-h-48 overflow-y-auto">
                {STICKER_LIBRARY.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => onAddSticker(emoji)}
                    className="p-2.5 text-2xl bg-white border-2 border-pink-200 rounded-xl hover:bg-pink-100 hover:scale-110 active:scale-90 transition duration-150 shadow-xs flex items-center justify-center"
                    title={`Tambah Stiker ${emoji}`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: TYPOGRAPHY & HEADER EDIT */}
          {activeTab === "text" && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Teks Judul Utama Footer:</label>
                <input
                  type="text"
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  placeholder="Contoh: rielllybooth ♡"
                  className="w-full px-3.5 py-2 rounded-xl border-2 border-pink-200 text-xs font-bold focus:border-pink-500 outline-none transition"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Teks Subtitle Tanggal / Pesan:</label>
                <input
                  type="text"
                  value={subtitleText}
                  onChange={(e) => setSubtitleText(e.target.value)}
                  placeholder="Contoh: ✨ 04 Agu 2026 ✨"
                  className="w-full px-3.5 py-2 rounded-xl border-2 border-pink-200 text-xs font-bold focus:border-pink-500 outline-none transition"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700">Gaya Font Typography:</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: "sans", label: "Sans Modern" },
                    { id: "serif", label: "Serif Classic" },
                    { id: "cursive", label: "Handwritten" },
                    { id: "mono", label: "Monospace" },
                  ].map((font) => (
                    <button
                      key={font.id}
                      type="button"
                      onClick={() => setFontFamily(font.id as FontFamily)}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border-2 transition ${
                        fontFamily === font.id
                          ? "bg-pink-400 text-white border-pink-500 shadow-xs"
                          : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {font.label}
                    </button>
                  ))}
                </div>
              </div>

              <ColorPicker
                label="Warna Teks Typography"
                value={textColor}
                onChange={setTextColor}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}