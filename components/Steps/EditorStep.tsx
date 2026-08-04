"use client";

import React, { useState, useRef } from "react";
import { Download, ArrowLeft, RefreshCw, Layout, Palette, Sparkles, Video, Wand2, FlipHorizontal, Trash2, Image as ImageIcon, Upload, Share2 } from "lucide-react";
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
  customLogoUrl: string | null;
  onUploadCustomLogo: (file: File) => void;
  onClearCustomLogo: () => void;
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
  onOpenShareModal: () => void;
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
  customLogoUrl,
  onUploadCustomLogo,
  onClearCustomLogo,
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
  onOpenShareModal,
  isExportingVideo,
}: EditorStepProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<"frame" | "filter" | "text" | "stickers" | "adjust">("frame");
  const [draggingId, setDraggingId] = useState<string | null>(null);

  // Throttled Pointer Event Handlers for Draggable Stickers
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
      requestAnimationFrame(() => {
        onUpdateStickerPos(draggingId, pos.x, pos.y);
      });
    }
  };

  const handlePointerUp = () => {
    setDraggingId(null);
  };

  const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onUploadCustomLogo(e.target.files[0]);
    }
  };

  return (
    <div className="w-full max-w-6xl px-4 py-4 space-y-6">
      {/* Top Header Controls Bar */}
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

          {/* Share to Story Button */}
          <button
            type="button"
            onClick={onOpenShareModal}
            className="px-3.5 py-2 bg-purple-100 hover:bg-purple-200 text-purple-700 text-xs font-bold rounded-xl border border-purple-300 flex items-center gap-1.5 transition shadow-xs"
          >
            <Share2 className="w-4 h-4 text-purple-500" /> Share 📲
          </button>
        </div>
      </div>

      {/* DISTINCT DIRECT DOWNLOAD CARDS (NO QR CARDS) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card 1: PNG HD Photo Strip */}
        <div className="bg-white border-2 border-pink-300 p-4 rounded-2xl shadow-sm flex items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-black text-pink-600 uppercase tracking-wider flex items-center gap-1">
              <Download className="w-3.5 h-3.5" /> Foto Statis
            </span>
            <h4 className="text-sm font-black text-slate-800">Simpan Foto Statis (PNG HD)</h4>
            <p className="text-[11px] text-slate-500 font-medium">Format gambar resolusi tinggi tanpa watermark.</p>
          </div>
          <button
            type="button"
            onClick={onDownloadPng}
            className="px-5 py-3 bg-pink-400 hover:bg-pink-500 text-white font-black text-xs sm:text-sm rounded-xl border-2 border-pink-500 shadow-md transition hover:scale-105 active:scale-95 shrink-0"
          >
            Simpan PNG HD ⬇️
          </button>
        </div>

        {/* Card 2: Live Video (MP4 / REELS 🎥) */}
        <div className="bg-white border-2 border-purple-300 p-4 rounded-2xl shadow-sm flex items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-black text-purple-600 uppercase tracking-wider flex items-center gap-1">
              <Video className="w-3.5 h-3.5" /> Moving Video
            </span>
            <h4 className="text-sm font-black text-slate-800">Simpan Live Video (MP4 / REELS 🎥)</h4>
            <p className="text-[11px] text-slate-500 font-medium">Video gerak klip pendek siap unggah ke Story & Reels.</p>
          </div>
          <button
            type="button"
            onClick={onDownloadVideo}
            disabled={isExportingVideo || !isLivePhotoOn}
            className="px-4 py-3 bg-purple-500 hover:bg-purple-600 text-white font-black text-xs sm:text-sm rounded-xl border-2 border-purple-600 shadow-md transition disabled:opacity-50 hover:scale-105 active:scale-95 shrink-0"
          >
            {isExportingVideo ? "Exporting..." : "Simpan MP4 🎥"}
          </button>
        </div>
      </div>

      {/* Main Studio Grid: Canvas Preview + Controls Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Interactive Canvas Preview Container (MOBILE FLEXIBLE SCALING FIX) */}
        <div className="lg:col-span-6 flex flex-col items-center gap-3 lg:sticky lg:top-24 w-full">
          <div
            ref={containerRef}
            className="relative bg-white border-4 border-pink-300 rounded-3xl shadow-2xl overflow-hidden flex items-center justify-center max-h-[55vh] sm:max-h-[650px] w-full p-2 cursor-grab active:cursor-grabbing select-none"
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
              className="max-w-full max-h-full object-contain h-auto w-auto rounded-xl shadow-inner pointer-events-none"
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
              <Layout className="w-3.5 h-3.5" /> Bingkai & Layout
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
              <Palette className="w-3.5 h-3.5" /> Brand Logo & Teks
            </button>
          </div>

          {/* TAB 1: FRAME & EXPANDED 4-LAYOUT SELECTOR (strip_2, strip_3, strip_4, grid_2x2) */}
          {activeTab === "frame" && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700">Pilih Layout Potongan Foto:</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: "strip_2", label: "2-Cut Strip" },
                    { id: "strip_3", label: "3-Cut Strip" },
                    { id: "strip_4", label: "4-Cut Strip" },
                    { id: "grid_2x2", label: "2x2 Grid" },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setLayout(item.id as LayoutMode)}
                      className={`py-2.5 px-3 rounded-xl text-xs font-bold border-2 transition ${
                        layout === item.id
                          ? "bg-pink-400 text-white border-pink-500 shadow-xs"
                          : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700">Preset Bingkai Viral Gen Z:</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { id: "polkadot", label: "Polkadot Cute 💖" },
                    { id: "receipt", label: "Struk Belanja 🧾" },
                    { id: "concert_ticket", label: "Tiket Konser 🎟️" },
                    { id: "photocard", label: "K-Pop Photocard 💖" },
                    { id: "retro_manga", label: "Komik Strip 💥" },
                    { id: "galau_quote", label: "Quote Galau 🥺" },
                    { id: "coquette", label: "Coquette Ribbon 🎀" },
                    { id: "y2k", label: "Y2K Cyber ✨" },
                    { id: "newspaper", label: "Newspaper 📰" },
                    { id: "film", label: "35mm Film 🎞️" },
                    { id: "clean", label: "Classic Clean 🤍" },
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

          {/* TAB 2: CUTE & RETRO WEBCAM TOY FILTERS + GRAIN & BEAUTY GLOW */}
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
                  label="Film Grain 🎞️ (Analog Noise)"
                  min={0}
                  max={100}
                  value={filter.grain || 0}
                  onChange={(val) => setFilter((prev) => ({ ...prev, grain: val }))}
                />
                <Slider
                  label="Soft Beauty Glow ✨ (Bloom Effect)"
                  min={0}
                  max={100}
                  value={filter.beautyGlow || 0}
                  onChange={(val) => setFilter((prev) => ({ ...prev, beautyGlow: val }))}
                />
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

          {/* TAB 3: EXPANDED STICKER PALETTE */}
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

          {/* TAB 4: CUSTOM LOGO & TYPOGRAPHY HEADER */}
          {activeTab === "text" && (
            <div className="space-y-4 animate-in fade-in duration-200">
              {/* UPLOAD CUSTOM BRAND LOGO SECTION */}
              <div className="space-y-2 bg-rose-50 border-2 border-pink-200 p-3.5 rounded-2xl">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-pink-500" /> Logo Brand / Event Kustom (PNG):
                </label>
                <p className="text-[11px] text-slate-600 font-medium">
                  Pasang logo acara atau brand milikmu di bagian bawah photo strip.
                </p>

                <input
                  ref={logoInputRef}
                  type="file"
                  accept="image/png, image/jpeg, image/svg+xml"
                  onChange={handleLogoFileChange}
                  className="hidden"
                />

                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => logoInputRef.current?.click()}
                    className="flex-1 py-2 px-3 bg-pink-400 hover:bg-pink-500 text-white font-bold text-xs rounded-xl border border-pink-500 transition shadow-xs flex items-center justify-center gap-1.5"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{customLogoUrl ? "Ganti Logo Brand" : "Upload Logo (PNG)"}</span>
                  </button>

                  {customLogoUrl && (
                    <button
                      type="button"
                      onClick={onClearCustomLogo}
                      className="py-2 px-3 bg-rose-100 hover:bg-rose-200 text-rose-700 font-bold text-xs rounded-xl border border-rose-300 transition"
                    >
                      Hapus Logo
                    </button>
                  )}
                </div>

                {customLogoUrl && (
                  <div className="flex items-center gap-2 pt-2 border-t border-pink-200">
                    <span className="text-[11px] font-bold text-pink-600">Logo Aktif:</span>
                    <img src={customLogoUrl} alt="Custom Logo" className="h-8 max-w-[120px] object-contain border rounded p-1 bg-white" />
                  </div>
                )}
              </div>

              {!customLogoUrl && (
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
              )}

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