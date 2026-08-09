"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Download, ArrowLeft, RefreshCw, Layout, Palette, Sparkles, Video, Wand2, FlipHorizontal, Trash2, Image as ImageIcon, Upload, Share2, RefreshCcw, Undo2, Redo2, RotateCw, ZoomIn, X } from "lucide-react";
import { LayoutMode, FramePreset, CuteFilter, FontFamily, FilterState, PlacedSticker } from "@/lib/canvasUtils";
import ColorPicker from "../UI/ColorPicker";
import Slider from "../UI/Slider";

type Shot = { id: number; dataUrl: string; videoBlobUrl?: string };

const STICKER_LIBRARY = [
  "🎀", "💖", "🍒", "🧸", "✨", "👑", "✌️", "🐱",
  "🐰", "🌸", "🍭", "🕶️", "👻", "⭐", "🍓", "🦋",
  "🍩", "🐾", "🍦", "🎈"
];

type HistoryState = {
  layout: LayoutMode;
  preset: FramePreset;
  cuteFilter: CuteFilter;
  customText: string;
  fontFamily: FontFamily;
  subtitleText: string;
  placedStickers: PlacedSticker[];
  frameColor: string;
  textColor: string;
  filter: FilterState;
  isFlipped: boolean;
};

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
  onUpdateStickerTransform?: (id: string, scale: number, rotation: number) => void;
  onDeleteSticker?: (id: string) => void;
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
  onUpdateStickerTransform,
  onDeleteSticker,
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
  const [activeTab, setActiveTab] = useState<"layout" | "frame" | "filter" | "stickers">("layout");
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [selectedStickerId, setSelectedStickerId] = useState<string | null>(null);
  const [isUpdatingCanvas, setIsUpdatingCanvas] = useState(false);

  // Undo / Redo History Stack State
  const historyRef = useRef<HistoryState[]>([]);
  const historyIndexRef = useRef<number>(-1);
  const isUndoRedoActionRef = useRef<boolean>(false);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  // Function to push current state to History Stack
  const pushHistoryState = useCallback(() => {
    if (isUndoRedoActionRef.current) {
      isUndoRedoActionRef.current = false;
      return;
    }
    const currentState: HistoryState = {
      layout,
      preset,
      cuteFilter,
      customText,
      fontFamily,
      subtitleText,
      placedStickers: JSON.parse(JSON.stringify(placedStickers)),
      frameColor,
      textColor,
      filter: { ...filter },
      isFlipped,
    };

    // Trim redo stack if we're not at the end
    const newHistory = historyRef.current.slice(0, historyIndexRef.current + 1);
    newHistory.push(currentState);
    historyRef.current = newHistory;
    historyIndexRef.current = newHistory.length - 1;

    setCanUndo(historyIndexRef.current > 0);
    setCanRedo(false);
  }, [layout, preset, cuteFilter, customText, fontFamily, subtitleText, placedStickers, frameColor, textColor, filter, isFlipped]);

  // Initial history snapshot
  useEffect(() => {
    if (historyRef.current.length === 0) {
      pushHistoryState();
    }
  }, [pushHistoryState]);

  // Push to history when user edits options (debounced / track state changes)
  useEffect(() => {
    pushHistoryState();
  }, [layout, preset, cuteFilter, frameColor, textColor, filter.filterIntensity, filter.grain, filter.beautyGlow, filter.brightness, filter.contrast, filter.saturation, placedStickers, isFlipped]);

  // Perform Undo
  const handleUndo = () => {
    if (historyIndexRef.current > 0) {
      isUndoRedoActionRef.current = true;
      historyIndexRef.current -= 1;
      const targetState = historyRef.current[historyIndexRef.current];
      if (targetState) {
        setLayout(targetState.layout);
        setPreset(targetState.preset);
        setCuteFilter(targetState.cuteFilter);
        setCustomText(targetState.customText);
        setFontFamily(targetState.fontFamily);
        setSubtitleText(targetState.subtitleText);
        setFrameColor(targetState.frameColor);
        setTextColor(targetState.textColor);
        setFilter(targetState.filter);
        setIsFlipped(targetState.isFlipped);
      }
      setCanUndo(historyIndexRef.current > 0);
      setCanRedo(historyIndexRef.current < historyRef.current.length - 1);
    }
  };

  // Perform Redo
  const handleRedo = () => {
    if (historyIndexRef.current < historyRef.current.length - 1) {
      isUndoRedoActionRef.current = true;
      historyIndexRef.current += 1;
      const targetState = historyRef.current[historyIndexRef.current];
      if (targetState) {
        setLayout(targetState.layout);
        setPreset(targetState.preset);
        setCuteFilter(targetState.cuteFilter);
        setCustomText(targetState.customText);
        setFontFamily(targetState.fontFamily);
        setSubtitleText(targetState.subtitleText);
        setFrameColor(targetState.frameColor);
        setTextColor(targetState.textColor);
        setFilter(targetState.filter);
        setIsFlipped(targetState.isFlipped);
      }
      setCanUndo(historyIndexRef.current > 0);
      setCanRedo(historyIndexRef.current < historyRef.current.length - 1);
    }
  };

  // Trigger anti-flicker brief loading overlay during layout/preset/filter transitions
  useEffect(() => {
    setIsUpdatingCanvas(true);
    const timer = setTimeout(() => setIsUpdatingCanvas(false), 180);
    return () => clearTimeout(timer);
  }, [layout, preset, cuteFilter, frameColor, textColor, filter]);

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

  const getDOMPos = (x: number, y: number) => {
    if (!canvasRef.current) return null;
    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = rect.width / canvasRef.current.width;
    const scaleY = rect.height / canvasRef.current.height;

    return {
      left: x * scaleX,
      top: y * scaleY,
    };
  };

  const handlePointerDown = (clientX: number, clientY: number) => {
    const pos = getCanvasPos(clientX, clientY);
    if (!pos || placedStickers.length === 0) return;

    let foundId: string | null = null;
    let minDist = 70;

    placedStickers.forEach((st) => {
      const dist = Math.hypot(st.x - pos.x, st.y - pos.y);
      if (dist < minDist) {
        minDist = dist;
        foundId = st.id;
      }
    });

    if (foundId) {
      setDraggingId(foundId);
      setSelectedStickerId(foundId);
    } else {
      setSelectedStickerId(null);
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

  const selectedSticker = placedStickers.find((st) => st.id === selectedStickerId);

  return (
    <div className="w-full max-w-6xl px-2 sm:px-4 py-3 space-y-4 sm:space-y-6">
      {/* 1. TOP SECTION: ACTION HEADER & NAVIGATION BAR WITH UNDO / REDO */}
      <div className="flex flex-wrap justify-between items-center gap-3 bg-white border-2 border-pink-200 p-3 sm:p-4 rounded-2xl shadow-sm">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onBack}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1.5 transition border border-slate-300"
          >
            <ArrowLeft className="w-4 h-4" /> Review Foto
          </button>

          {/* UNDO & REDO BUTTONS */}
          <button
            type="button"
            onClick={handleUndo}
            disabled={!canUndo}
            className="p-2 bg-slate-100 hover:bg-pink-100 disabled:opacity-40 disabled:hover:bg-slate-100 text-slate-700 rounded-xl transition border border-slate-300 flex items-center gap-1 text-xs font-bold"
            title="Batal / Undo (↺)"
          >
            <Undo2 className="w-4 h-4 text-pink-500" />
            <span className="hidden sm:inline">Undo</span>
          </button>

          <button
            type="button"
            onClick={handleRedo}
            disabled={!canRedo}
            className="p-2 bg-slate-100 hover:bg-pink-100 disabled:opacity-40 disabled:hover:bg-slate-100 text-slate-700 rounded-xl transition border border-slate-300 flex items-center gap-1 text-xs font-bold"
            title="Ulang / Redo (↻)"
          >
            <Redo2 className="w-4 h-4 text-pink-500" />
            <span className="hidden sm:inline">Redo</span>
          </button>
        </div>

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
      </div>

      {/* 2. MIDDLE SECTION: CENTERED CANVAS PREVIEW CARD + CONTROL TABS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 items-start">
        {/* Left Interactive Canvas Preview Container */}
        <div className="lg:col-span-6 flex flex-col items-center gap-2 sticky top-16 z-30 bg-rose-50/95 backdrop-blur-md p-2 rounded-2xl shadow-md overflow-hidden mb-3 lg:mb-0 lg:static lg:bg-transparent lg:p-0 lg:shadow-none w-full">
          {/* Top Status Pill */}
          <div className="w-full flex items-center justify-between px-2 py-1">
            <span className="text-[11px] font-black text-pink-600 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-pink-500" /> KANVAS PRATINJAU STUDIO
            </span>
            <span className="text-[10px] font-bold text-slate-500">
              Live Photo: {isLivePhotoOn ? "ON 🎥" : "OFF"}
            </span>
          </div>

          {/* RESPONSIVE FLEX CARD CONTAINER BOX FOR MOBILE CANVAS PREVIEW */}
          <div
            ref={containerRef}
            className="relative w-full max-w-sm sm:max-w-md mx-auto p-3 flex items-center justify-center bg-white rounded-3xl shadow-md overflow-hidden cursor-grab active:cursor-grabbing select-none"
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
            {/* Anti-Flicker Smooth Overlay Loader during transitions */}
            {isUpdatingCanvas && (
              <div className="absolute inset-0 bg-white/70 backdrop-blur-xs z-40 flex items-center justify-center gap-2 pointer-events-none transition-opacity duration-150">
                <Sparkles className="w-5 h-5 text-pink-500 animate-spin" />
                <span className="text-xs font-black text-slate-800">Memperbarui Tampilan...</span>
              </div>
            )}

            <canvas
              ref={canvasRef}
              className="max-w-full max-h-[40vh] sm:max-h-[500px] w-auto h-auto object-contain rounded-xl shadow-inner pointer-events-none"
            />

            {/* DELETE (X) BADGE OVER SELECTED STICKER ON CANVAS OVERLAY */}
            {selectedSticker && (() => {
              const domPos = getDOMPos(selectedSticker.x, selectedSticker.y);
              if (!domPos) return null;
              return (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onDeleteSticker) onDeleteSticker(selectedSticker.id);
                    setSelectedStickerId(null);
                  }}
                  style={{
                    left: `${domPos.left + 15}px`,
                    top: `${domPos.top - 15}px`,
                  }}
                  className="absolute z-50 p-1 bg-rose-500 hover:bg-rose-600 text-white rounded-full shadow-lg border border-white transition transform hover:scale-110 active:scale-95"
                  title="Hapus Stiker Ini (x)"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              );
            })()}
          </div>

          <p className="hidden lg:block text-[11px] font-bold text-slate-500 text-center">
            💡 <span className="text-pink-600">Geser / Drag</span> stiker langsung di atas kanvas pratinjau!
          </p>
        </div>

        {/* Right Editor Control Panel (4-TAB NAVIGATION BAR) */}
        <div className="lg:col-span-6 bg-white border-2 border-pink-200 rounded-3xl p-4 sm:p-5 shadow-lg space-y-4 sm:space-y-5">
          {/* Navigation Control Tabs */}
          <div className="flex bg-rose-50 p-1.5 rounded-2xl border border-pink-200 gap-1 overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveTab("layout")}
              className={`flex-1 py-2 px-2 rounded-xl text-[11px] sm:text-xs font-bold transition flex items-center justify-center gap-1 whitespace-nowrap ${
                activeTab === "layout"
                  ? "bg-pink-400 text-white shadow-xs"
                  : "text-slate-600 hover:bg-pink-100"
              }`}
            >
              <Layout className="w-3.5 h-3.5" /> Layout & Swap
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("frame")}
              className={`flex-1 py-2 px-2 rounded-xl text-[11px] sm:text-xs font-bold transition flex items-center justify-center gap-1 whitespace-nowrap ${
                activeTab === "frame"
                  ? "bg-pink-400 text-white shadow-xs"
                  : "text-slate-600 hover:bg-pink-100"
              }`}
            >
              <Palette className="w-3.5 h-3.5" /> Bingkai & Warna
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("filter")}
              className={`flex-1 py-2 px-2 rounded-xl text-[11px] sm:text-xs font-bold transition flex items-center justify-center gap-1 whitespace-nowrap ${
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
              className={`flex-1 py-2 px-2 rounded-xl text-[11px] sm:text-xs font-bold transition flex items-center justify-center gap-1 whitespace-nowrap ${
                activeTab === "stickers"
                  ? "bg-pink-400 text-white shadow-xs"
                  : "text-slate-600 hover:bg-pink-100"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" /> Stiker & Logo
            </button>
          </div>

          {/* TAB 1: EXPANDED LAYOUT GRIDS (9 OPTIONS) & PHOTO SWAP */}
          {activeTab === "layout" && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700">Pilih Layout Potongan Foto (9 Options):</label>
                <div className="max-h-44 overflow-y-auto p-2 border border-pink-100 rounded-2xl bg-rose-50/30 grid grid-cols-2 sm:grid-cols-3 gap-2 scrollbar-thin scrollbar-thumb-pink-300">
                  {[
                    { id: "newspaper_grid", label: "Newspaper Grid 📰" },
                    { id: "strip_1x4", label: "Strip 1x4 🎞️" },
                    { id: "strip_3cut", label: "Strip 3-Cut ✂️" },
                    { id: "grid_2x2", label: "Grid 2x2 🏁" },
                    { id: "purikura_4cut", label: "Purikura 4-Cut 💖" },
                    { id: "y2k_checker", label: "Y2K Checker Strip ✨" },
                    { id: "scrapbook", label: "Scrapbook Washi 🎨" },
                    { id: "spotlight", label: "Spotlight Grid 🌟" },
                    { id: "editorial_vogue", label: "Vogue Magazine 💄" },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setLayout(item.id as LayoutMode)}
                      className={`py-2 px-2 rounded-xl text-[11px] font-bold border-2 transition ${
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

              {/* Photo Position Swap Helper Thumbnails */}
              <div className="w-full bg-rose-50/80 border border-pink-200 p-3 rounded-2xl space-y-2 shadow-xs">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <RefreshCw className="w-3.5 h-3.5 text-pink-500" /> Tukar Urutan Foto (Klik 2 Foto):
                </span>
                <div className="grid grid-cols-4 gap-2">
                  {[0, 1, 2, 3].map((idx) => {
                    const shot = shots[idx];
                    if (!shot) return null;
                    return (
                      <button
                        key={shot.id || idx}
                        type="button"
                        onClick={() => onSwapPhotos(idx)}
                        className={`relative aspect-square rounded-xl overflow-hidden border-2 transition ${
                          selectedForSwap === idx
                            ? "border-pink-500 ring-4 ring-pink-300 scale-105"
                            : "border-pink-200 hover:border-pink-400"
                        }`}
                      >
                        <img src={shot.dataUrl} alt={`Pos #${idx + 1}`} className="w-full h-full object-cover" />
                        <span className="absolute bottom-1 right-1 bg-slate-900/80 text-white text-[9px] font-black px-1.5 py-0.5 rounded">
                          #{idx + 1}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: FIXED NEWSPAPER & EXPANDED GEN Z FRAME PRESETS */}
          {activeTab === "frame" && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700">Preset Bingkai Viral Gen Z Indonesia:</label>
                <div className="max-h-48 overflow-y-auto p-2 border border-pink-100 rounded-2xl bg-rose-50/30 grid grid-cols-2 sm:grid-cols-3 gap-2 scrollbar-thin scrollbar-thumb-pink-300">
                  {[
                    { id: "cupids_letter", label: "💌 Cupid's Letter" },
                    { id: "passport", label: "✈️ Passport Memories" },
                    { id: "toy_story", label: "🤠 Toy Story" },
                    { id: "spongebob", label: "🧽 SpongeBob" },
                    { id: "among_us", label: "📮 Among Us" },
                    { id: "happy_birthday", label: "🎂 Happy Birthday" },
                    { id: "skena_coquette", label: "🎀 Skena Coquette" },
                    { id: "galau_club", label: "💅 Gen Z Galau Club" },
                    { id: "pestapora_pass", label: "🎫 Pestapora Pass" },
                    { id: "struk_jaksel", label: "🧾 Struk Cafe Jaksel" },
                    { id: "photocard_bias", label: "📸 Photocard Idol Bias" },
                    { id: "coquette", label: "Coquette Ribbon 🎀" },
                    { id: "coquette_black", label: "Coquette Black 🖤" },
                    { id: "cyber_y2k_pink", label: "Cyber Pink Y2K 💖" },
                    { id: "y2k", label: "Y2K Cyber ✨" },
                    { id: "y2k_bubbles", label: "Y2K Bubbles 🫧" },
                    { id: "vintage_newspaper_dark", label: "Dark Newspaper 🗞️" },
                    { id: "retro_cassette", label: "Retro Cassette 📼" },
                    { id: "kawaii_boba", label: "Kawaii Boba 🧋" },
                    { id: "heart_washi_tape", label: "Heart Washi Tape 💌" },
                    { id: "cute_cat_paw", label: "Cute Cat Paw 🐾" },
                    { id: "pastel_floral", label: "Pastel Floral 🌸" },
                    { id: "goth_grunge", label: "Goth Grunge 🖤" },
                    { id: "polaroid_vintage", label: "Polaroid Vintage 📸" },
                    { id: "newspaper", label: "Newspaper 📰" },
                    { id: "receipt", label: "Struk Belanja 🧾" },
                    { id: "photocard", label: "K-Pop Photocard 💖" },
                    { id: "concert_ticket", label: "Tiket Konser 🎟️" },
                    { id: "galau_quote", label: "Quote Galau ☕" },
                    { id: "polkadot", label: "Polkadot Cute 💖" },
                    { id: "retro_manga", label: "Komik Strip 💥" },
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

          {/* TAB 3: CUTE & RETRO WEBCAM TOY FILTERS + INTENSITY SLIDER */}
          {activeTab === "filter" && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700">Webcam Toy & Cute Filters:</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "none", label: "Original ✨" },
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
                {/* FILTER INTENSITY SLIDER (0% to 100%) */}
                <Slider
                  label="Intensitas Filter 🎨 (Filter Blend)"
                  min={0}
                  max={100}
                  value={filter.filterIntensity ?? 100}
                  onChange={(val) => setFilter((prev) => ({ ...prev, filterIntensity: val }))}
                />
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

          {/* TAB 4: STICKERS & TRANSFORM CONTROLS & CUSTOM LOGO */}
          {activeTab === "stickers" && (
            <div className="space-y-4 animate-in fade-in duration-200">
              {/* STICKER TRANSFORM CONTROLS FOR SELECTED STICKER */}
              {selectedSticker && onUpdateStickerTransform && (
                <div className="space-y-3 bg-pink-50 border-2 border-pink-300 p-3.5 rounded-2xl shadow-xs animate-in zoom-in-95 duration-150">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-black text-pink-700 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-pink-500" /> Kontrol Stiker {selectedSticker.emoji}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        if (onDeleteSticker) onDeleteSticker(selectedSticker.id);
                        setSelectedStickerId(null);
                      }}
                      className="px-2.5 py-1 bg-rose-500 hover:bg-rose-600 text-white text-[11px] font-bold rounded-lg transition flex items-center gap-1 shadow-xs"
                    >
                      <Trash2 className="w-3 h-3" /> Hapus Stiker (x)
                    </button>
                  </div>

                  <Slider
                    label={`Ukuran Stiker (Scale: ${((selectedSticker.scale || 1) * 100).toFixed(0)}%)`}
                    min={30}
                    max={300}
                    value={Math.round((selectedSticker.scale || 1) * 100)}
                    onChange={(val) => onUpdateStickerTransform(selectedSticker.id, val / 100, selectedSticker.rotation || 0)}
                  />

                  <Slider
                    label={`Rotasi Stiker (${selectedSticker.rotation || 0}°)`}
                    min={-180}
                    max={180}
                    value={selectedSticker.rotation || 0}
                    onChange={(val) => onUpdateStickerTransform(selectedSticker.id, selectedSticker.scale || 1, val)}
                  />
                </div>
              )}

              {/* UPLOAD CUSTOM BRAND LOGO SECTION */}
              <div className="space-y-2 bg-rose-50 border-2 border-pink-200 p-3.5 rounded-2xl">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-pink-500" /> Logo Brand / Event Kustom (PNG):
                </label>

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
              </div>

              {/* STICKER PALETTE */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-700">Pilih Stiker Lucu (Klik untuk menambah):</label>
                  {placedStickers.length > 0 && (
                    <button
                      type="button"
                      onClick={onClearStickers}
                      className="px-2.5 py-1 bg-rose-100 hover:bg-rose-200 text-rose-700 text-[11px] font-bold rounded-lg transition flex items-center gap-1 border border-rose-300"
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

              {/* FOOTER TEXT EDITORS */}
              {!customLogoUrl && (
                <div className="space-y-1.5 pt-1">
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

              <ColorPicker
                label="Warna Teks Typography"
                value={textColor}
                onChange={setTextColor}
              />
            </div>
          )}
        </div>
      </div>

      {/* 3. BOTTOM SECTION: DOWNLOAD CARDS, SHARE & RE-TAKE BUTTONS */}
      <div className="space-y-4 pt-4 border-t-2 border-pink-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          {/* Card 1: PNG HD Photo Strip */}
          <div className="bg-white border-2 border-pink-300 p-3.5 sm:p-4 rounded-2xl shadow-sm flex items-center justify-between gap-3">
            <div className="space-y-1">
              <span className="text-xs font-black text-pink-600 uppercase tracking-wider flex items-center gap-1">
                <Download className="w-3.5 h-3.5" /> Foto Statis
              </span>
              <h4 className="text-xs sm:text-sm font-black text-slate-800">Simpan Foto Statis (PNG HD)</h4>
              <p className="text-[11px] text-slate-500 font-medium">Format gambar resolusi tinggi tanpa watermark.</p>
            </div>
            <button
              type="button"
              onClick={onDownloadPng}
              className="px-4 sm:px-5 py-2.5 sm:py-3 bg-pink-400 hover:bg-pink-500 text-white font-black text-xs sm:text-sm rounded-xl border-2 border-pink-500 shadow-md transition hover:scale-105 active:scale-95 shrink-0"
            >
              Simpan PNG ⬇️
            </button>
          </div>

          {/* Card 2: Live Video (MP4 / REELS 🎥) */}
          <div className="bg-white border-2 border-purple-300 p-3.5 sm:p-4 rounded-2xl shadow-sm flex items-center justify-between gap-3">
            <div className="space-y-1">
              <span className="text-xs font-black text-purple-600 uppercase tracking-wider flex items-center gap-1">
                <Video className="w-3.5 h-3.5" /> Moving Video
              </span>
              <h4 className="text-xs sm:text-sm font-black text-slate-800">Simpan Live Video (MP4 / REELS 🎥)</h4>
              <p className="text-[11px] text-slate-500 font-medium">Video gerak klip pendek siap unggah ke Story & Reels.</p>
            </div>
            <button
              type="button"
              onClick={onDownloadVideo}
              disabled={isExportingVideo || !isLivePhotoOn}
              className="px-4 py-2.5 sm:py-3 bg-purple-500 hover:bg-purple-600 text-white font-black text-xs sm:text-sm rounded-xl border-2 border-purple-600 shadow-md transition disabled:opacity-50 hover:scale-105 active:scale-95 shrink-0"
            >
              {isExportingVideo ? "Exporting..." : "Simpan MP4 🎥"}
            </button>
          </div>
        </div>

        {/* Share & Retake Session Buttons */}
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={onOpenShareModal}
            className="px-6 py-3 bg-purple-100 hover:bg-purple-200 text-purple-800 font-extrabold text-xs sm:text-sm rounded-2xl border border-purple-300 transition shadow-xs flex items-center gap-2"
          >
            <Share2 className="w-4 h-4 text-purple-600" />
            <span>Bagikan ke Story / Sosmed 📲</span>
          </button>

          <button
            type="button"
            onClick={onBack}
            className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm rounded-2xl border border-slate-300 transition shadow-xs flex items-center gap-2"
          >
            <RefreshCcw className="w-4 h-4 text-slate-500" />
            <span>Foto Ulang / Ganti Pose 🔄</span>
          </button>
        </div>
      </div>
    </div>
  );
}