"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Download,
  ArrowLeft,
  RefreshCw,
  Layout,
  Palette,
  Sparkles,
  Video,
  Wand2,
  FlipHorizontal,
  Trash2,
  Image as ImageIcon,
  Upload,
  Share2,
  RefreshCcw,
  Undo2,
  Redo2,
  X,
  Heart,
} from "lucide-react";
import { LayoutMode, FramePreset, CuteFilter, FontFamily, FilterState, PlacedSticker, PhotoShape, FramePattern, ExportBackdrop, BackdropRatio, BACKDROP_OPTIONS } from "@/lib/canvasUtils";
import ColorPicker from "../UI/ColorPicker";
import Slider from "../UI/Slider";

type Shot = { id: number; dataUrl: string; videoBlobUrl?: string };

const STICKER_PACKS = [
  { id: "all", name: "Semua", stickers: ["🎀", "💖", "🍒", "🌸", "🧸", "✨", "⭐", "💫", "🕶️", "🦋", "☕", "🥐", "🧁", "✌️", "👑", "🎃", "👻", "🦇", "🕷️", "🕸️", "💌", "🐰", "🐾"] },
  { id: "coquette", name: "🎀 Cute", stickers: ["🎀", "💖", "🍒", "🌸", "🧸", "🍰", "🍓", "🧁", "💌", "🐰", "🐱", "🐾"] },
  { id: "y2k", name: "✨ Y2K", stickers: ["✨", "⭐", "💫", "🕶️", "🦋", "💿", "⚡", "🔮", "💅", "🔥", "👑", "✌️"] },
  { id: "spooky", name: "🎃 Spooky", stickers: ["🎃", "👻", "🦇", "🕷️", "🕸️", "🍬", "🧙‍♀️", "💀", "🕯️", "🧛", "🖤", "🔮"] },
  { id: "cafe", name: "☕ Cafe", stickers: ["☕", "🥐", "🍩", "🍦", "🎈", "🍭", "🥑", "🥦", "🍕", "🍔", "🥤", "🛹"] },
  { id: "indo", name: "🇮🇩 Merah Putih", stickers: ["🇮🇩", "🦅", "🎗️", "🛵", "🎸", "🎵", "🏆", "🌟", "🎉", "🔥", "👏", "🤍"] },
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
  onApplyStickerPack?: (stickers: PlacedSticker[]) => void;
  onClearStickers: () => void;
  photoShape?: PhotoShape;
  setPhotoShape?: (shape: PhotoShape) => void;
  framePattern?: FramePattern;
  setFramePattern?: (pattern: FramePattern) => void;
  onUpdateStickerPos?: (id: string, x: number, y: number) => void;
  onUpdateStickerTransform?: (id: string, scale: number, rotation: number) => void;
  onDeleteSticker?: (id: string) => void;
  customLogoUrl: string | null;
  onUploadCustomLogo: (file: File) => void;
  onClearCustomLogo: () => void;
  customFrameOverlayUrl?: string | null;
  onUploadCustomFrameOverlay?: (file: File) => void;
  onClearCustomFrameOverlay?: () => void;
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
  exportBackdrop?: ExportBackdrop;
  setExportBackdrop?: (bg: ExportBackdrop) => void;
  backdropRatio?: BackdropRatio;
  setBackdropRatio?: (ratio: BackdropRatio) => void;
  customBackdropUrl?: string | null;
  onUploadCustomBackdrop?: (file: File) => void;
  onClearCustomBackdrop?: () => void;
  onCanvasMount?: () => void;
  onBack: () => void;
  onDownloadPng: () => void;
  onDownloadVideo: () => void;
  onDownloadGif?: () => void;
  onOpenShareModal: () => void;
  isExportingPng?: boolean;
  isExportingVideo: boolean;
  isExportingGif?: boolean;
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
  onApplyStickerPack,
  onClearStickers,
  photoShape = "rounded",
  setPhotoShape,
  framePattern = "none",
  setFramePattern,
  onUpdateStickerPos,
  onUpdateStickerTransform,
  onDeleteSticker,
  customLogoUrl,
  onUploadCustomLogo,
  onClearCustomLogo,
  customFrameOverlayUrl,
  onUploadCustomFrameOverlay,
  onClearCustomFrameOverlay,
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
  exportBackdrop = "pastel_stars",
  setExportBackdrop,
  backdropRatio = "feed",
  setBackdropRatio,
  customBackdropUrl,
  onUploadCustomBackdrop,
  onClearCustomBackdrop,
  onCanvasMount,
  onBack,
  onDownloadPng,
  onDownloadVideo,
  onDownloadGif,
  onOpenShareModal,
  isExportingPng = false,
  isExportingVideo,
  isExportingGif = false,
}: EditorStepProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const frameOverlayInputRef = useRef<HTMLInputElement>(null);
  const customBackdropInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<"layout" | "frame" | "filter" | "stickers">("layout");
  const [selectedStickerPack, setSelectedStickerPack] = useState<string>("all");
  const [presetCategory, setPresetCategory] = useState<"all" | "editorial" | "coquette" | "retro" | "pop">("all");
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

    const newHistory = historyRef.current.slice(0, historyIndexRef.current + 1);
    newHistory.push(currentState);
    historyRef.current = newHistory;
    historyIndexRef.current = newHistory.length - 1;

    setCanUndo(historyIndexRef.current > 0);
    setCanRedo(false);
  }, [layout, preset, cuteFilter, customText, fontFamily, subtitleText, placedStickers, frameColor, textColor, filter, isFlipped]);

  useEffect(() => {
    if (historyRef.current.length === 0) {
      pushHistoryState();
    }
  }, [pushHistoryState]);

  useEffect(() => {
    pushHistoryState();
  }, [layout, preset, cuteFilter, frameColor, textColor, filter.filterIntensity, filter.grain, filter.beautyGlow, filter.brightness, filter.contrast, filter.saturation, placedStickers, isFlipped]);

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

  const isFirstRenderRef = useRef(true);
  const [isPrinting, setIsPrinting] = useState(true);

  useEffect(() => {
    onCanvasMount?.();
    const printTimer = setTimeout(() => setIsPrinting(false), 1150);
    return () => clearTimeout(printTimer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isFirstRenderRef.current) {
      isFirstRenderRef.current = false;
      return;
    }
    setIsUpdatingCanvas(true);
    const timer = setTimeout(() => setIsUpdatingCanvas(false), 180);
    return () => clearTimeout(timer);
  }, [layout, preset, cuteFilter, frameColor, textColor, filter]);

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

  const valoStats = React.useMemo(() => {
    let ign = "guraisu";
    let role = "Smoker";
    let agent = "Clove";
    let rank = "Ascendant";
    let line = "Kaget anjg, game sialan";

    if (customText && customText !== "riellybooth ♡") {
      if (customText.includes("|")) {
        const parts = customText.split("|");
        if (parts[0]) ign = parts[0];
        if (parts[1]) role = parts[1];
        if (parts[2]) agent = parts[2];
        if (parts[3]) rank = parts[3];
        if (parts[4]) line = parts[4];
      } else {
        ign = customText;
      }
    }
    if (subtitleText && subtitleText.trim() && !subtitleText.includes("✨")) {
      line = subtitleText.trim();
    }
    return { ign, role, agent, rank, line };
  }, [customText, subtitleText]);

  const updateValoField = (field: string, val: string) => {
    const updated = { ...valoStats, [field]: val };
    setCustomText(`${updated.ign}|${updated.role}|${updated.agent}|${updated.rank}|${updated.line}`);
  };

  const studentStats = React.useMemo(() => {
    let name = "STEFANY PUTRI";
    let idNo = "2024-08912";
    let grade = "CLASS 3-A";
    let major = "VISUAL ARTS & MUSIC";
    let dob = "16 AUG 2006";

    if (customText && customText !== "riellybooth ♡") {
      if (customText.includes("|")) {
        const parts = customText.split("|");
        if (parts[0]) name = parts[0];
        if (parts[1]) idNo = parts[1];
        if (parts[2]) grade = parts[2];
        if (parts[3]) major = parts[3];
        if (parts[4]) dob = parts[4];
      } else {
        name = customText;
      }
    }
    if (subtitleText && subtitleText.trim() && !subtitleText.includes("✨")) {
      grade = subtitleText.trim();
    }
    return { name, idNo, grade, major, dob };
  }, [customText, subtitleText]);

  const updateStudentField = (field: string, val: string) => {
    const updated = { ...studentStats, [field]: val };
    setCustomText(`${updated.name}|${updated.idNo}|${updated.grade}|${updated.major}|${updated.dob}`);
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

  const handleFrameOverlayFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && onUploadCustomFrameOverlay) {
      onUploadCustomFrameOverlay(e.target.files[0]);
    }
  };

  const selectedSticker = placedStickers.find((st) => st.id === selectedStickerId);

  return (
    <div className="w-full max-w-6xl px-2 sm:px-4 py-3 space-y-4 sm:space-y-6">
      {/* 1. TOP ACTION HEADER & TOOLBAR */}
      <div className="flex flex-wrap justify-between items-center gap-3 scrapbook-paper p-3 sm:p-4 shadow-paper">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onBack}
            className="px-4 py-2 bg-white hover:bg-[#FFF0F4] text-[#392633] text-xs font-heading font-bold rounded-xl flex items-center gap-1.5 transition border border-[#E9B8CA] cursor-pointer shadow-xs"
          >
            <ArrowLeft className="w-4 h-4 text-[#E84D91]" /> Review Foto
          </button>

          {/* UNDO & REDO */}
          <button
            type="button"
            onClick={handleUndo}
            disabled={!canUndo}
            className="p-2 bg-white hover:bg-[#FFF0F4] disabled:opacity-40 text-[#392633] rounded-xl transition border border-[#E9B8CA] flex items-center gap-1 text-xs font-heading font-bold cursor-pointer shadow-xs"
            title="Batal / Undo (↺)"
          >
            <Undo2 className="w-4 h-4 text-[#E84D91]" />
            <span className="hidden sm:inline">Undo</span>
          </button>

          <button
            type="button"
            onClick={handleRedo}
            disabled={!canRedo}
            className="p-2 bg-white hover:bg-[#FFF0F4] disabled:opacity-40 text-[#392633] rounded-xl transition border border-[#E9B8CA] flex items-center gap-1 text-xs font-heading font-bold cursor-pointer shadow-xs"
            title="Ulang / Redo (↻)"
          >
            <Redo2 className="w-4 h-4 text-[#E84D91]" />
            <span className="hidden sm:inline">Redo</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* Flip Horizontal Toggle */}
          <button
            type="button"
            onClick={() => setIsFlipped((v) => !v)}
            className={`px-3.5 py-2 rounded-xl text-xs font-heading font-bold transition flex items-center gap-1.5 border-2 shadow-xs cursor-pointer ${isFlipped
              ? "bg-[#E84D91] text-white border-[#E84D91]"
              : "bg-white text-[#392633] border-[#E9B8CA] hover:bg-[#FFF0F4]"
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
            className={`px-3.5 py-2 rounded-xl text-xs font-heading font-bold transition flex items-center gap-1.5 border-2 shadow-xs cursor-pointer ${isLivePhotoOn
              ? "bg-[#E84D91] text-white border-[#E84D91]"
              : "bg-white text-[#392633] border-[#E9B8CA] hover:bg-[#FFF0F4]"
              }`}
          >
            <Video className="w-4 h-4" />
            <span>Live Photo {isLivePhotoOn ? "ON" : "OFF"}</span>
          </button>
        </div>
      </div>

      {/* 2. MIDDLE SECTION: CANVAS STUDIO PREVIEW + TABS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-start">
        {/* Left Interactive Canvas Preview Container */}
        <div className="lg:col-span-6 flex flex-col items-center gap-2 sticky top-16 z-30 bg-[#FFF0F4] p-2 rounded-2xl shadow-paper lg:static lg:bg-transparent lg:p-0 lg:shadow-none w-full">
          <div className="w-full flex items-center justify-between px-2 py-1 gap-2">
            <span className="text-[11px] font-heading font-bold text-[#E84D91] uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[#E84D91]" /> KANVAS PRATINJAU
            </span>
            <div className="flex items-center gap-1.5">
              {(() => {
                const isTwoSlot =
                  layout === "strip_2" ||
                  preset === "daily_rielly" ||
                  preset === "student_kalcer" ||
                  preset === "rielly_archive" ||
                  preset === "after_hours" ||
                  preset === "sunday_edition" ||
                  preset === "contact_sheet" ||
                  preset === "valorant_id" ||
                  preset === "cupids_letter";
                const isThreeSlot =
                  layout === "strip_3cut" ||
                  layout === "strip_3" ||
                  preset === "hut_ri_81_3strip" ||
                  preset === "supermarket_crate";
                const isOneSlot = preset === "student_id";
                const slotLabel = isOneSlot
                  ? "1-Photo Slot"
                  : isTwoSlot
                    ? "2-Photo Slot"
                    : isThreeSlot
                      ? "3-Photo Slot"
                      : "4-Photo Slot";
                return (
                  <span className="px-2 py-0.5 rounded-full bg-[#FFF9F0] border border-[#E9B8CA] text-[10px] font-mono font-bold text-[#392633]">
                    {slotLabel}
                  </span>
                );
              })()}
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${isLivePhotoOn
                    ? "bg-[#E84D91] text-white border-[#E84D91]"
                    : "bg-white text-[#8B7180] border-[#E9B8CA]"
                  }`}
              >
                LIVE {isLivePhotoOn ? "ON" : "OFF"}
              </span>
            </div>
          </div>

          {/* Aesthetic Outer Backdrop Stage + Vintage Print Dispenser Slot */}
          {(() => {
            const activeBackdrop =
              exportBackdrop === "custom" && customBackdropUrl
                ? {
                    id: "custom" as ExportBackdrop,
                    label: "BG Custom",
                    stageStyle: {
                      backgroundImage: `url('${customBackdropUrl}')`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                    } as React.CSSProperties,
                    isDark: false,
                  }
                : BACKDROP_OPTIONS.find((b) => b.id === exportBackdrop) || BACKDROP_OPTIONS[1];
            return (
              <div className="w-full max-w-sm sm:max-w-md mx-auto flex flex-col items-center gap-2.5">
                {/* Outer Big Aesthetic Box (Matches Export Backdrop) */}
                <div
                  style={activeBackdrop.stageStyle}
                  className="relative w-full rounded-3xl border-2 border-[#E9B8CA] shadow-paper px-4 pt-3.5 pb-4 flex flex-col items-center overflow-hidden transition-all duration-300"
                >
                  {/* Dispenser Lip sitting cleanly inside top of the aesthetic box */}
                  <div className="relative z-20 w-48 sm:w-56 h-3.5 bg-[#392633] rounded-full border-2 border-[#E9B8CA]/90 flex items-center justify-center shadow-md">
                    <div className="w-[88%] h-1.5 bg-[#120B10] rounded-full shadow-inner" />
                  </div>

                  {/* Print Chute Clip Mask: strip slides smoothly out of the slot into the aesthetic box */}
                  <div className="relative z-10 w-full -mt-1.5 pt-3 pb-2 overflow-hidden flex justify-center">
                    <div className="animate-print-drop inline-flex justify-center">
                      <div
                        ref={containerRef}
                        className="relative inline-flex items-center justify-center rounded-2xl shadow-[0_14px_34px_-6px_rgba(57,38,51,0.28)] ring-1 ring-white/70 cursor-grab active:cursor-grabbing select-none"
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
                        {/* Anti-Flicker Smooth Overlay Loader */}
                        {isUpdatingCanvas && (
                          <div className="absolute inset-0 bg-white/85 rounded-2xl z-40 flex items-center justify-center gap-2 pointer-events-none transition-opacity duration-150">
                            <Sparkles className="w-5 h-5 text-[#E84D91] animate-spin" />
                            <span className="text-xs font-heading font-bold text-[#392633]">Memperbarui...</span>
                          </div>
                        )}

                        <canvas
                          ref={canvasRef}
                          className="block max-w-full max-h-[46vh] sm:max-h-[500px] w-auto h-auto rounded-2xl pointer-events-none"
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
                              className="absolute z-50 p-1 bg-[#E84D91] hover:bg-[#F48FB1] text-white rounded-full shadow-lg border border-white transition transform hover:scale-110 active:scale-95 cursor-pointer"
                              title="Hapus Stiker Ini (x)"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Subtle Status Tag outside the aesthetic backdrop box so preview stays 100% clean */}
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#8B7180]">
                  {isPrinting
                    ? "Printing photo strip..."
                    : exportBackdrop === "none"
                      ? "Strip Polos · Ready to customize"
                      : `${activeBackdrop.label} (${backdropRatio === "story" ? "9:16 Story" : "4:5 Feed"})`}
                </span>

                {/* Quick Aesthetic Backdrop Picker (Preview + Export PNG/MP4/GIF) */}
                {setExportBackdrop && (
                  <div className="w-full bg-[#FFF9F0] border border-[#E9B8CA] rounded-2xl p-2.5 space-y-2 shadow-xs">
                    <div className="flex items-center justify-between gap-2 px-0.5">
                      <span className="text-[11px] font-heading font-bold text-[#392633]">
                        Background Estetik File
                      </span>
                      {exportBackdrop !== "none" && setBackdropRatio ? (
                        <div className="inline-flex items-center bg-[#FFF0F4] border border-[#E9B8CA] rounded-full p-0.5 gap-0.5">
                          <button
                            type="button"
                            onClick={() => setBackdropRatio("feed")}
                            className={`px-2 py-0.5 rounded-full text-[10px] font-heading font-bold transition cursor-pointer ${
                              backdropRatio === "feed"
                                ? "bg-[#E84D91] text-white"
                                : "text-[#8B7180] hover:text-[#392633]"
                            }`}
                          >
                            4:5 Feed
                          </button>
                          <button
                            type="button"
                            onClick={() => setBackdropRatio("story")}
                            className={`px-2 py-0.5 rounded-full text-[10px] font-heading font-bold transition cursor-pointer ${
                              backdropRatio === "story"
                                ? "bg-[#E84D91] text-white"
                                : "text-[#8B7180] hover:text-[#392633]"
                            }`}
                          >
                            9:16 Story
                          </button>
                        </div>
                      ) : (
                        <span className="text-[10px] font-mono text-[#8B7180]">Tanpa BG</span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
                      {/* Custom User Backdrop Upload Button */}
                      {onUploadCustomBackdrop && (
                        <>
                          <input
                            ref={customBackdropInputRef}
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                onUploadCustomBackdrop(e.target.files[0]);
                              }
                            }}
                            className="hidden"
                          />
                          <button
                            type="button"
                            onClick={() => customBackdropInputRef.current?.click()}
                            className={`shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-[10px] font-heading font-bold transition cursor-pointer ${
                              exportBackdrop === "custom"
                                ? "bg-[#E84D91] text-white border-[#E84D91] shadow-xs"
                                : "bg-[#FFF0F4] text-[#E84D91] border-[#F48FB1] hover:bg-[#F8D8E3]"
                            }`}
                            title="Upload foto/wallpaper sendiri dari galeri"
                          >
                            <Upload className="w-3 h-3 shrink-0" />
                            <span>{customBackdropUrl ? "Ganti BG" : "+ Upload BG"}</span>
                          </button>
                          {customBackdropUrl && exportBackdrop === "custom" && onClearCustomBackdrop && (
                            <button
                              type="button"
                              onClick={onClearCustomBackdrop}
                              className="shrink-0 p-1.5 rounded-xl border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 transition cursor-pointer"
                              title="Hapus BG Custom"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          )}
                        </>
                      )}

                      {BACKDROP_OPTIONS.map((bg) => {
                        const isSelected = exportBackdrop === bg.id;
                        return (
                          <button
                            key={bg.id}
                            type="button"
                            onClick={() => setExportBackdrop(bg.id)}
                            className={`shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-[10px] font-heading font-bold transition cursor-pointer ${
                              isSelected
                                ? "bg-[#E84D91] text-white border-[#E84D91] shadow-xs"
                                : "bg-white text-[#392633] border-[#E9B8CA] hover:bg-[#FFF0F4]"
                            }`}
                          >
                            <span
                              className="w-3.5 h-3.5 rounded-full border border-black/15 shrink-0"
                              style={{ background: bg.swatchStyle }}
                            />
                            <span>{bg.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })()}

          <p className="hidden lg:block text-[11px] font-sans font-medium text-[#8B7180] text-center">
            <span className="text-[#E84D91] font-bold">Tips:</span> Geser / drag stiker langsung di atas kanvas pratinjau.
          </p>
        </div>

        {/* Right Editor Control Panel (4-TAB NAVIGATION) */}
        <div className="lg:col-span-6 scrapbook-paper p-4 sm:p-5 shadow-paper space-y-4 sm:space-y-5">
          {/* Always-mounted hidden PNG frame overlay input (accessible from both Frame & Sticker tabs) */}
          <input
            ref={frameOverlayInputRef}
            type="file"
            accept="image/png"
            onChange={handleFrameOverlayFileChange}
            className="hidden"
          />

          {/* Navigation Control Tabs */}
          <div className="flex bg-[#FFF0F4] p-1.5 rounded-2xl border border-[#E9B8CA] gap-1 overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveTab("layout")}
              className={`flex-1 py-2 px-2 rounded-xl text-[11px] sm:text-xs font-heading font-bold transition flex items-center justify-center gap-1 whitespace-nowrap cursor-pointer ${activeTab === "layout"
                ? "bg-[#E84D91] text-white shadow-xs"
                : "text-[#8B7180] hover:bg-[#FFF9F0]"
                }`}
            >
              <Layout className="w-3.5 h-3.5" /> Layout & Swap
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("frame")}
              className={`flex-1 py-2 px-2 rounded-xl text-[11px] sm:text-xs font-heading font-bold transition flex items-center justify-center gap-1 whitespace-nowrap cursor-pointer ${activeTab === "frame"
                ? "bg-[#E84D91] text-white shadow-xs"
                : "text-[#8B7180] hover:bg-[#FFF9F0]"
                }`}
            >
              <Palette className="w-3.5 h-3.5" /> Bingkai & Warna
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("filter")}
              className={`flex-1 py-2 px-2 rounded-xl text-[11px] sm:text-xs font-heading font-bold transition flex items-center justify-center gap-1 whitespace-nowrap cursor-pointer ${activeTab === "filter"
                ? "bg-[#E84D91] text-white shadow-xs"
                : "text-[#8B7180] hover:bg-[#FFF9F0]"
                }`}
            >
              <Wand2 className="w-3.5 h-3.5" /> Filter Warna
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("stickers")}
              className={`flex-1 py-2 px-2 rounded-xl text-[11px] sm:text-xs font-heading font-bold transition flex items-center justify-center gap-1 whitespace-nowrap cursor-pointer ${activeTab === "stickers"
                ? "bg-[#E84D91] text-white shadow-xs"
                : "text-[#8B7180] hover:bg-[#FFF9F0]"
                }`}
            >
              <Sparkles className="w-3.5 h-3.5" /> Stiker & Logo
            </button>
          </div>

          {/* TAB 1: LAYOUT & PHOTO SWAP */}
          {activeTab === "layout" && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="space-y-2">
                <label className="text-xs font-heading font-bold text-[#392633]">Pilih Layout Potongan Foto (10 Options):</label>
                <div className="max-h-48 overflow-y-auto p-2 border border-[#E9B8CA] rounded-2xl bg-white grid grid-cols-2 sm:grid-cols-3 gap-2 scrollbar-thin">
                  {[
                    { id: "strip_2x4", label: "Double Strip 2x4" },
                    { id: "newspaper_grid", label: "Newspaper Grid" },
                    { id: "strip_1x4", label: "Strip 1x4" },
                    { id: "strip_3cut", label: "Strip 3-Cut" },
                    { id: "strip_2", label: "Strip 2-Cut" },
                    { id: "grid_2x2", label: "Grid 2x2" },
                    { id: "purikura_4cut", label: "Purikura 4-Cut" },
                    { id: "y2k_checker", label: "Y2K Checker Strip" },
                    { id: "scrapbook", label: "Scrapbook Washi" },
                    { id: "spotlight", label: "Spotlight Grid" },
                    { id: "editorial_vogue", label: "Vogue Magazine" },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setLayout(item.id as LayoutMode)}
                      className={`py-2 px-2 rounded-xl text-[11px] font-heading font-bold border-2 transition cursor-pointer ${layout === item.id
                        ? "bg-[#E84D91] text-white border-[#E84D91] shadow-xs"
                        : "bg-[#FFF9F0] text-[#392633] border-[#E9B8CA] hover:bg-[#FFF0F4]"
                        }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Photo Position Swap Helper Thumbnails */}
              <div className="w-full bg-[#FFF0F4] border-2 border-[#E9B8CA] p-3 rounded-2xl space-y-2 shadow-xs">
                <span className="text-xs font-heading font-bold text-[#392633] flex items-center gap-1.5">
                  <RefreshCw className="w-3.5 h-3.5 text-[#E84D91]" /> Tukar Urutan Foto (Klik 2 Foto):
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
                        className={`relative aspect-square rounded-xl overflow-hidden border-2 transition cursor-pointer ${selectedForSwap === idx
                          ? "border-[#E84D91] ring-4 ring-[#F8D8E3] scale-105"
                          : "border-[#E9B8CA] hover:border-[#E84D91]"
                          }`}
                      >
                        <img src={shot.dataUrl} alt={`Pos #${idx + 1}`} className="w-full h-full object-cover" />
                        <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[9px] font-mono px-1.5 py-0.5 rounded">
                          #{idx + 1}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: FRAME PRESETS & PALETTE */}
          {activeTab === "frame" && (
            <div className="space-y-4 animate-in fade-in duration-200">
              {/* Quick Shortcut: Upload Custom PNG Frame (Auto-Cutout) right inside Frame tab */}
              {onUploadCustomFrameOverlay && (
                <div className="bg-gradient-to-r from-[#FFF0F4] to-[#FFF9F0] border border-[#E9B8CA] p-3 rounded-2xl flex flex-wrap items-center justify-between gap-2">
                  <div className="space-y-0.5 min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#E84D91] shrink-0" />
                      <span className="text-xs font-heading font-bold text-[#392633]">
                        Bingkai PNG Sendiri (Auto-Cutout)
                      </span>
                      {customFrameOverlayUrl && (
                        <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded-full">
                          Aktif
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-[#8B7180] font-sans">
                      Upload PNG transparan dari Canva/Pinterest — lubang foto &amp; rasio terdeteksi otomatis.
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => frameOverlayInputRef.current?.click()}
                      className="px-3 py-1.5 bg-[#E84D91] hover:bg-[#D93D82] text-white font-heading font-bold text-[11px] rounded-xl transition flex items-center gap-1 cursor-pointer"
                    >
                      <Upload className="w-3 h-3" />
                      <span>{customFrameOverlayUrl ? "Ganti PNG" : "Upload PNG"}</span>
                    </button>
                    {customFrameOverlayUrl && onClearCustomFrameOverlay && (
                      <button
                        type="button"
                        onClick={onClearCustomFrameOverlay}
                        className="px-2.5 py-1.5 bg-white hover:bg-rose-50 text-rose-600 font-heading font-bold text-[11px] rounded-xl border border-rose-200 transition cursor-pointer"
                      >
                        Hapus
                      </button>
                    )}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-heading font-bold text-[#392633]">Pilihan Bingkai & Koleksi:</label>
                  <span className="text-[10px] font-heading font-bold text-[#E84D91] bg-[#FFF0F4] px-2.5 py-0.5 rounded-full border border-[#E9B8CA] uppercase tracking-wider">
                    Scrapbook Edition
                  </span>
                </div>

                {/* Preset Category Pills Filter */}
                <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                  {[
                    { id: "all", label: "Semua" },
                    { id: "editorial", label: "Editorial Archive" },
                    { id: "coquette", label: "Coquette" },
                    { id: "retro", label: "Y2K & Retro" },
                    { id: "pop", label: "Event & Pop" },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setPresetCategory(cat.id as any)}
                      className={`px-3 py-1 rounded-xl text-xs font-heading font-bold transition whitespace-nowrap cursor-pointer ${presetCategory === cat.id
                        ? "bg-[#392633] text-white shadow-xs"
                        : "bg-white text-[#8B7180] border border-[#E9B8CA] hover:bg-[#FFF0F4]"
                        }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                <div className="max-h-56 overflow-y-auto p-2 border border-[#E9B8CA] rounded-2xl bg-white grid grid-cols-2 sm:grid-cols-3 gap-2 scrollbar-thin">
                  {[
                    // Editorial Archive Collection
                    { id: "newspaper", label: "The Rielly Times (4-Photo)", category: "editorial" },
                    { id: "daily_rielly", label: "The Daily Rielly (2-Photo)", category: "editorial" },
                    { id: "riellmatics_news", label: "Riellmatics News", category: "editorial" },

                    // Coquette Collection
                    { id: "coquette", label: "Coquette Ribbon", category: "coquette" },
                    { id: "coquette_black", label: "Coquette Black", category: "coquette" },
                    { id: "skena_coquette", label: "Skena Coquette", category: "coquette" },
                    { id: "cupids_letter", label: "Cupid's Letter", category: "coquette" },
                    { id: "heart_washi_tape", label: "Heart Washi Tape", category: "coquette" },
                    { id: "cute_cat_paw", label: "Cute Cat Paw", category: "coquette" },
                    { id: "pastel_floral", label: "Pastel Floral", category: "coquette" },
                    { id: "kawaii_boba", label: "Kawaii Boba", category: "coquette" },
                    { id: "polkadot", label: "Polkadot Cute", category: "coquette" },

                    // Y2K & Retro Collection
                    { id: "y2k", label: "Y2K Cyber", category: "retro" },
                    { id: "y2k_bubbles", label: "Y2K Bubbles", category: "retro" },
                    { id: "cyber_y2k_pink", label: "Cyber Pink Y2K", category: "retro" },
                    { id: "retro_manga", label: "Komik Strip", category: "retro" },
                    { id: "retro_cassette", label: "Retro Cassette", category: "retro" },
                    { id: "film", label: "35mm Film", category: "retro" },
                    { id: "polaroid_vintage", label: "Polaroid Vintage", category: "retro" },
                    { id: "goth_grunge", label: "Goth Grunge", category: "retro" },
                    { id: "vintage_newspaper_dark", label: "Dark Newspaper", category: "retro" },

                    // Event & Pop Culture Collection
                    { id: "halloween_spooky", label: "Halloween Spooky", category: "pop" },
                    { id: "hut_ri_81_3strip", label: "HUT RI 81 (3-Strip)", category: "pop" },
                    { id: "hut_ri_81_4strip", label: "HUT RI 81 (4-Strip)", category: "pop" },
                    { id: "student_id", label: "Student ID Card", category: "pop" },
                    { id: "school_4cut", label: "Manner High (4-Cut)", category: "pop" },
                    { id: "supermarket_crate", label: "Fruit Market Crate", category: "pop" },
                    { id: "valorant_id", label: "Tactical Agent ID", category: "pop" },
                    { id: "pestapora_pass", label: "Musikfest VIP Pass", category: "pop" },
                    { id: "struk_jaksel", label: "Struk Cafe Jaksel", category: "pop" },
                    { id: "photocard_bias", label: "Photocard Idol Bias", category: "pop" },
                    { id: "passport", label: "Passport Memories", category: "pop" },
                    { id: "toy_story", label: "Space Cowboy", category: "pop" },
                    { id: "spongebob", label: "Yellow Sponge", category: "pop" },
                    { id: "among_us", label: "Space Impostor", category: "pop" },
                    { id: "happy_birthday", label: "Happy Birthday", category: "pop" },
                    { id: "galau_club", label: "Gen Z Galau Club", category: "pop" },
                    { id: "receipt", label: "Struk Belanja", category: "pop" },
                    { id: "photocard", label: "K-Pop Photocard", category: "pop" },
                    { id: "concert_ticket", label: "Tiket Konser", category: "pop" },
                    { id: "galau_quote", label: "Quote Galau", category: "pop" },
                    { id: "clean", label: "Classic Clean", category: "pop" },
                  ]
                    .filter((item) => presetCategory === "all" || item.category === presetCategory)
                    .map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setPreset(item.id as FramePreset);
                          if (item.id === "daily_rielly" || item.id === "student_kalcer") {
                            setFrameColor("#FAF7F0");
                            setTextColor("#111111");
                            setFontFamily("serif");
                            setCustomText("RIELLYBOOTH");
                            setSubtitleText("A Moment Worth Keeping");
                          } else if (item.id === "riellmatics_news" || item.id === "photomatics_news") {
                            setLayout("strip_2x4");
                            setFrameColor("#ffffff");
                            setTextColor("#000000");
                            setFontFamily("serif");
                            setCustomText("RIELLMATICS");
                            setSubtitleText("Memory di sudut");
                          } else if (item.id === "halloween_spooky") {
                            setLayout("strip_1x4");
                            setFrameColor("#0b0314");
                            setTextColor("#f97316");
                            setFontFamily("serif");
                            setCustomText("TRICK OR TREAT");
                            setSubtitleText("HALLOWEEN 2026 • RIELLYBOOTH ♡");
                          }
                        }}
                        className={`py-2 px-2.5 rounded-xl text-xs font-heading font-bold border-2 transition cursor-pointer ${preset === item.id
                          ? "bg-[#E84D91] text-white border-[#E84D91] shadow-xs"
                          : "bg-[#FFF9F0] text-[#392633] border-[#E9B8CA] hover:bg-[#FFF0F4]"
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

              {/* Patterned Frame Swatches */}
              {setFramePattern && (
                <div className="space-y-2 pt-1">
                  <label className="text-xs font-heading font-bold text-[#392633]">Pola Latar Bingkai (Pattern):</label>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                    {[
                      { id: "none", label: "Solid" },
                      { id: "gingham", label: "Gingham" },
                      { id: "polkadot", label: "Polkadot" },
                      { id: "stripes", label: "Stripes" },
                      { id: "checker", label: "Checker" },
                      { id: "grid", label: "Grid" },
                    ].map((pat) => (
                      <button
                        key={pat.id}
                        type="button"
                        onClick={() => setFramePattern(pat.id as FramePattern)}
                        className={`py-1.5 px-2 rounded-xl text-[11px] font-heading font-bold border-2 transition cursor-pointer ${framePattern === pat.id
                          ? "bg-[#E84D91] text-white border-[#E84D91] shadow-xs"
                          : "bg-[#FFF9F0] text-[#392633] border-[#E9B8CA] hover:bg-[#FFF0F4]"
                          }`}
                      >
                        {pat.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Photo Shape Cutout Mask */}
              {setPhotoShape && (
                <div className="space-y-2 pt-1">
                  <label className="text-xs font-heading font-bold text-[#392633]">Bentuk Potongan Foto (Shape):</label>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { id: "rounded", label: "Rounded" },
                      { id: "rect", label: "Sharp" },
                      { id: "circle", label: "Oval" },
                      { id: "heart", label: "Heart" },
                    ].map((sh) => (
                      <button
                        key={sh.id}
                        type="button"
                        onClick={() => setPhotoShape(sh.id as PhotoShape)}
                        className={`py-2 px-2 rounded-xl text-xs font-heading font-bold border-2 transition cursor-pointer ${photoShape === sh.id
                          ? "bg-[#392633] text-white border-[#392633] shadow-xs"
                          : "bg-white text-[#392633] border-[#E9B8CA] hover:bg-[#FFF0F4]"
                          }`}
                      >
                        {sh.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: RETRO WEBCAM TOY & BEAUTY FILTERS */}
          {activeTab === "filter" && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="space-y-2">
                <label className="text-xs font-heading font-bold text-[#392633]">Webcam Toy & Cute Filters:</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "none", label: "Original" },
                    { id: "digicam_ccd", label: "Digicam CCD" },
                    { id: "soft_pink", label: "Soft Pink" },
                    { id: "warm_cafe", label: "Warm Cafe" },
                    { id: "cyber_glow", label: "Cyber Glow" },
                    { id: "vintage_90s", label: "90s Vintage" },
                    { id: "pixel", label: "Pixel Art" },
                    { id: "thermal", label: "Thermal Heat" },
                    { id: "pop_art", label: "Vivid Pop Art" },
                    { id: "vhs", label: "VHS Retro CRT" },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setCuteFilter(item.id as CuteFilter)}
                      className={`py-2 px-2 rounded-xl text-[11px] font-heading font-bold border-2 transition cursor-pointer ${cuteFilter === item.id
                        ? "bg-[#E84D91] text-white border-[#E84D91] shadow-xs"
                        : "bg-[#FFF9F0] text-[#392633] border-[#E9B8CA] hover:bg-[#FFF0F4]"
                        }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <Slider
                  label="Intensitas Filter (Blend)"
                  min={0}
                  max={100}
                  value={filter.filterIntensity ?? 100}
                  onChange={(val) => setFilter((prev) => ({ ...prev, filterIntensity: val }))}
                />
                <Slider
                  label="Film Grain (Analog Noise)"
                  min={0}
                  max={100}
                  value={filter.grain || 0}
                  onChange={(val) => setFilter((prev) => ({ ...prev, grain: val }))}
                />
                <Slider
                  label="Soft Beauty Glow (Bloom)"
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

          {/* TAB 4: STICKERS, CUSTOM LOGO & PNG OVERLAY */}
          {activeTab === "stickers" && (
            <div className="space-y-4 animate-in fade-in duration-200">
              {/* STICKER TRANSFORM CONTROLS FOR SELECTED STICKER */}
              {selectedSticker && onUpdateStickerTransform && (
                <div className="space-y-3 bg-[#FFF0F4] border-2 border-[#E9B8CA] p-3.5 rounded-2xl shadow-xs animate-in zoom-in-95 duration-150">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-heading font-bold text-[#E84D91] flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-[#E84D91]" /> Kontrol Stiker {selectedSticker.emoji}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        if (onDeleteSticker) onDeleteSticker(selectedSticker.id);
                        setSelectedStickerId(null);
                      }}
                      className="px-2.5 py-1 bg-rose-500 hover:bg-rose-600 text-white text-[11px] font-heading font-bold rounded-lg transition flex items-center gap-1 shadow-xs cursor-pointer"
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

              {/* ONE-CLICK CURATED STICKER PACKS */}
              {onApplyStickerPack && (
                <div className="space-y-2 bg-[#FFF9F0] border-2 border-[#E9B8CA] p-3.5 rounded-2xl">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-heading font-bold text-[#392633]">
                      Paket Stiker Instan (1-Klik):
                    </span>
                    <span className="text-[10px] font-mono text-[#8B7180] uppercase">Quick Decor</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { id: "none", label: "No Stickers", emojis: [] as string[] },
                      { id: "coquette", label: "Coquette Ribbon", emojis: ["🎀", "🌸", "💖", "🎀"] },
                      { id: "y2k", label: "Y2K Stars", emojis: ["✨", "🦋", "⭐", "💫"] },
                      { id: "cafe", label: "Cafe Cute", emojis: ["☕", "🥐", "🧸", "🧁"] },
                      { id: "retro", label: "Retro Stamp", emojis: ["🍒", "🕶️", "✌️", "👑"] },
                    ].map((pack) => (
                      <button
                        key={pack.id}
                        type="button"
                        onClick={() => {
                          if (pack.emojis.length === 0) {
                            onApplyStickerPack([]);
                            return;
                          }
                          const cw = canvasRef.current?.width || 600;
                          const ch = canvasRef.current?.height || 1800;
                          const anchors: Array<[number, number, number]> = [
                            [0.14, 0.09, -12],
                            [0.86, 0.28, 12],
                            [0.14, 0.54, -10],
                            [0.86, 0.76, 14],
                          ];
                          const scaledStickers: PlacedSticker[] = pack.emojis.map((emoji, idx) => ({
                            id: `pk-${pack.id}-${idx}-${Date.now()}`,
                            emoji,
                            x: Math.round(cw * anchors[idx][0]),
                            y: Math.round(ch * anchors[idx][1]),
                            scale: cw >= 1000 ? 1.25 : 1.05,
                            rotation: anchors[idx][2],
                          }));
                          onApplyStickerPack(scaledStickers);
                        }}
                        className="px-3 py-1.5 rounded-full text-[11px] font-heading font-bold bg-white hover:bg-[#FFF0F4] text-[#392633] hover:text-[#E84D91] border-2 border-[#E9B8CA] hover:border-[#E84D91] transition cursor-pointer"
                      >
                        {pack.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* UPLOAD CUSTOM FULL-FRAME PNG OVERLAY */}
              <div className="space-y-2 bg-gradient-to-r from-[#FFF0F4] to-[#FFF9F0] border-2 border-[#E9B8CA] p-3.5 rounded-2xl">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-heading font-bold text-[#392633] flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#E84D91]" /> Bingkai Custom Sendiri (PNG Transparan):
                  </label>
                  {customFrameOverlayUrl && (
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-300">
                      Aktif ✨
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-[#8B7180] font-sans font-medium">
                  Upload PNG transparan desain sendiri (Canva/Photoshop/Pinterest). Sistem otomatis mendeteksi lubang foto &amp; menyesuaikan rasio asli PNG (anti gepeng!).
                </p>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => frameOverlayInputRef.current?.click()}
                    className="flex-1 py-2 px-3 bg-[#E84D91] hover:bg-[#F48FB1] text-white font-heading font-bold text-xs rounded-xl border border-[#E84D91] transition shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{customFrameOverlayUrl ? "Ganti Bingkai PNG" : "Upload Bingkai Sendiri (PNG)"}</span>
                  </button>

                  {customFrameOverlayUrl && (
                    <button
                      type="button"
                      onClick={onClearCustomFrameOverlay}
                      className="py-2 px-3 bg-white hover:bg-rose-50 text-rose-700 font-heading font-bold text-xs rounded-xl border border-rose-300 transition cursor-pointer"
                    >
                      Hapus
                    </button>
                  )}
                </div>
              </div>

              {/* UPLOAD CUSTOM BRAND LOGO */}
              <div className="space-y-2 bg-[#FFF0F4] border-2 border-[#E9B8CA] p-3.5 rounded-2xl">
                <label className="text-xs font-heading font-bold text-[#392633] flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-[#E84D91]" /> Logo Brand / Event Kustom (PNG):
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
                    className="flex-1 py-2 px-3 bg-[#E84D91] hover:bg-[#F48FB1] text-white font-heading font-bold text-xs rounded-xl border border-[#E84D91] transition shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{customLogoUrl ? "Ganti Logo Brand" : "Upload Logo (PNG)"}</span>
                  </button>

                  {customLogoUrl && (
                    <button
                      type="button"
                      onClick={onClearCustomLogo}
                      className="py-2 px-3 bg-white hover:bg-rose-50 text-rose-700 font-heading font-bold text-xs rounded-xl border border-rose-300 transition cursor-pointer"
                    >
                      Hapus Logo
                    </button>
                  )}
                </div>
              </div>

              {/* STICKER PALETTE */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-heading font-bold text-[#392633]">Pilih Stiker Lucu (Klik untuk menambah):</label>
                  {placedStickers.length > 0 && (
                    <button
                      type="button"
                      onClick={onClearStickers}
                      className="px-2.5 py-1 bg-white hover:bg-rose-50 text-rose-700 text-[11px] font-heading font-bold rounded-lg transition flex items-center gap-1 border border-rose-300 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" /> Hapus Semua ({placedStickers.length})
                    </button>
                  )}
                </div>

                <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                  {STICKER_PACKS.map((pack) => (
                    <button
                      key={pack.id}
                      type="button"
                      onClick={() => setSelectedStickerPack(pack.id)}
                      className={`px-3 py-1 rounded-full text-xs font-heading font-bold whitespace-nowrap transition border cursor-pointer ${selectedStickerPack === pack.id
                        ? "bg-[#E84D91] text-white border-[#E84D91] shadow-xs"
                        : "bg-white text-[#392633] border-[#E9B8CA] hover:bg-[#FFF0F4]"
                        }`}
                    >
                      {pack.name}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-5 sm:grid-cols-6 gap-2 bg-[#FFF0F4] border-2 border-[#E9B8CA] p-3 rounded-2xl max-h-48 overflow-y-auto">
                  {(STICKER_PACKS.find((p) => p.id === selectedStickerPack) || STICKER_PACKS[0]).stickers.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => onAddSticker(emoji)}
                      className="p-2.5 text-2xl bg-white border border-[#E9B8CA] rounded-xl hover:bg-[#F8D8E3] hover:scale-110 active:scale-90 transition duration-150 shadow-xs flex items-center justify-center cursor-pointer"
                      title={`Tambah Stiker ${emoji}`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* SPECIAL VALORANT / STUDENT FORM OR REGULAR FOOTER TEXT */}
              {preset === "valorant_id" ? (
                <div className="space-y-3 bg-stone-900 border-2 border-red-500/60 p-3.5 rounded-2xl text-stone-100 shadow-md">
                  <div className="flex items-center justify-between border-b border-stone-700 pb-2">
                    <span className="text-red-400 font-mono font-bold text-xs tracking-wider">
                      🎯 VALORANT IDENTIFICATION
                    </span>
                    <span className="text-[10px] text-stone-400 font-mono">PROTOCOL // 00</span>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-mono text-stone-300">IGN (In-Game Name):</label>
                    <input
                      type="text"
                      value={valoStats.ign}
                      onChange={(e) => updateValoField("ign", e.target.value)}
                      placeholder="Contoh: guraisu"
                      className="w-full px-3 py-1.5 rounded-xl bg-stone-800 border border-stone-700 text-xs font-mono text-white focus:border-red-500 outline-none transition"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[11px] font-mono text-stone-300">Role:</label>
                      <select
                        value={valoStats.role}
                        onChange={(e) => updateValoField("role", e.target.value)}
                        className="w-full px-2 py-1.5 rounded-xl bg-stone-800 border border-stone-700 text-xs font-mono text-white focus:border-red-500 outline-none transition"
                      >
                        <option value="Smoker">💨 Smoker</option>
                        <option value="Duelist">⚔️ Duelist</option>
                        <option value="Initiator">🎯 Initiator</option>
                        <option value="Sentinel">🛡️ Sentinel</option>
                        <option value="Flex">✨ Flex</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-mono text-stone-300">Favorite Agent:</label>
                      <input
                        type="text"
                        value={valoStats.agent}
                        onChange={(e) => updateValoField("agent", e.target.value)}
                        placeholder="Contoh: Clove"
                        className="w-full px-2.5 py-1.5 rounded-xl bg-stone-800 border border-stone-700 text-xs font-mono text-white focus:border-red-500 outline-none transition"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-mono text-stone-300">Peak Rank:</label>
                    <select
                      value={valoStats.rank}
                      onChange={(e) => updateValoField("rank", e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-xl bg-stone-800 border border-stone-700 text-xs font-mono text-white focus:border-red-500 outline-none transition"
                    >
                      <option value="Radiant">👑 Radiant</option>
                      <option value="Immortal">💎 Immortal</option>
                      <option value="Ascendant">🟢 Ascendant</option>
                      <option value="Diamond">🔷 Diamond</option>
                      <option value="Platinum">💠 Platinum</option>
                      <option value="Gold">🟡 Gold</option>
                      <option value="Silver">⚪ Silver</option>
                      <option value="Bronze">🟤 Bronze</option>
                      <option value="Iron">⚫ Iron</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-mono text-stone-300">Most Said Line:</label>
                    <input
                      type="text"
                      value={valoStats.line}
                      onChange={(e) => updateValoField("line", e.target.value)}
                      placeholder="Contoh: Kaget anjg, game sialan"
                      className="w-full px-3 py-1.5 rounded-xl bg-stone-800 border border-stone-700 text-xs font-mono text-white focus:border-red-500 outline-none transition"
                    />
                  </div>
                </div>
              ) : preset === "student_id" ? (
                <div className="space-y-3 bg-stone-900 border-2 border-blue-500/60 p-3.5 rounded-2xl text-stone-100 shadow-md">
                  <div className="flex items-center justify-between border-b border-stone-700 pb-2">
                    <span className="text-blue-400 font-mono font-bold text-xs tracking-wider">
                      🪪 STUDENT IDENTIFICATION CARD
                    </span>
                    <span className="text-[10px] text-stone-400 font-mono">MANNER HIGH</span>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-mono text-stone-300">Nama Siswa / Name:</label>
                    <input
                      type="text"
                      value={studentStats.name}
                      onChange={(e) => updateStudentField("name", e.target.value)}
                      placeholder="Contoh: STEFANY PUTRI"
                      className="w-full px-3 py-1.5 rounded-xl bg-stone-800 border border-stone-700 text-xs font-mono text-white focus:border-blue-500 outline-none transition"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[11px] font-mono text-stone-300">No. Pelajar / ID:</label>
                      <input
                        type="text"
                        value={studentStats.idNo}
                        onChange={(e) => updateStudentField("idNo", e.target.value)}
                        placeholder="2024-08912"
                        className="w-full px-2.5 py-1.5 rounded-xl bg-stone-800 border border-stone-700 text-xs font-mono text-white focus:border-blue-500 outline-none transition"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-mono text-stone-300">Kelas / Grade:</label>
                      <input
                        type="text"
                        value={studentStats.grade}
                        onChange={(e) => updateStudentField("grade", e.target.value)}
                        placeholder="CLASS 3-A"
                        className="w-full px-2.5 py-1.5 rounded-xl bg-stone-800 border border-stone-700 text-xs font-mono text-white focus:border-blue-500 outline-none transition"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[11px] font-mono text-stone-300">Jurusan / Club:</label>
                      <input
                        type="text"
                        value={studentStats.major}
                        onChange={(e) => updateStudentField("major", e.target.value)}
                        placeholder="VISUAL ARTS"
                        className="w-full px-2.5 py-1.5 rounded-xl bg-stone-800 border border-stone-700 text-xs font-mono text-white focus:border-blue-500 outline-none transition"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-mono text-stone-300">Tgl Lahir / DOB:</label>
                      <input
                        type="text"
                        value={studentStats.dob}
                        onChange={(e) => updateStudentField("dob", e.target.value)}
                        placeholder="16 AUG 2006"
                        className="w-full px-2.5 py-1.5 rounded-xl bg-stone-800 border border-stone-700 text-xs font-mono text-white focus:border-blue-500 outline-none transition"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {!customLogoUrl && (
                    <div className="space-y-1.5 pt-1">
                      <label className="text-xs font-heading font-bold text-[#392633]">Teks Judul Utama Footer:</label>
                      <input
                        type="text"
                        value={customText}
                        onChange={(e) => setCustomText(e.target.value)}
                        placeholder="Contoh: RiellyBooth ♡"
                        className="w-full px-3.5 py-2 rounded-xl border-2 border-[#E9B8CA] text-xs font-heading font-bold focus:border-[#E84D91] outline-none transition bg-white"
                      />
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className="text-xs font-heading font-bold text-[#392633]">Teks Subtitle Tanggal / Pesan:</label>
                    <input
                      type="text"
                      value={subtitleText}
                      onChange={(e) => setSubtitleText(e.target.value)}
                      placeholder="Contoh: ✨ 14 Nov 2026 ✨"
                      className="w-full px-3.5 py-2 rounded-xl border-2 border-[#E9B8CA] text-xs font-sans font-medium focus:border-[#E84D91] outline-none transition bg-white"
                    />
                  </div>

                  <ColorPicker
                    label="Warna Teks Typography"
                    value={textColor}
                    onChange={setTextColor}
                  />
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 3. BOTTOM SECTION: EXPORT CARDS (PNG, VIDEO MP4, GIF) & SHARE */}
      <div className="space-y-4 pt-4 border-t-2 border-[#E9B8CA]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: PNG HD Photo Strip */}
          <div className="scrapbook-paper p-4 flex flex-col justify-between gap-3 shadow-paper">
            <div className="space-y-1">
              <span className="text-[10px] font-heading font-bold text-[#E84D91] uppercase tracking-wider inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#FFF0F4] border border-[#E9B8CA]">
                <Download className="w-3 h-3" /> Foto Statis
              </span>
              <h4 className="text-sm font-heading font-bold text-[#392633]">Simpan Foto (PNG HD)</h4>
              <p className="text-[11px] text-[#8B7180] font-sans font-medium">Resolusi tinggi tajam tanpa watermark, siap cetak 4R.</p>
            </div>
            <button
              type="button"
              onClick={onDownloadPng}
              disabled={isExportingPng}
              className="w-full py-2.5 scrapbook-btn text-xs sm:text-sm flex items-center justify-center gap-1.5 cursor-pointer text-center disabled:opacity-60"
            >
              <Download className="w-4 h-4" />
              <span>{isExportingPng ? "Menyimpan PNG..." : "Simpan PNG HD"}</span>
            </button>
          </div>

          {/* Card 2: Live Video (MP4 / REELS) */}
          <div className="scrapbook-paper p-4 flex flex-col justify-between gap-3 shadow-paper">
            <div className="space-y-1">
              <span className="text-[10px] font-heading font-bold text-purple-700 uppercase tracking-wider inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-50 border border-purple-200">
                <Video className="w-3 h-3" /> Moving Video
              </span>
              <h4 className="text-sm font-heading font-bold text-[#392633]">Live Video (MP4 / Reels)</h4>
              <p className="text-[11px] text-[#8B7180] font-sans font-medium">Video gerak klip pendek boomerang siap share ke Story.</p>
            </div>
            <button
              type="button"
              onClick={onDownloadVideo}
              disabled={isExportingVideo || !isLivePhotoOn}
              className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-heading font-bold text-xs sm:text-sm rounded-full shadow-paper transition disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Video className="w-4 h-4" />
              <span>{isExportingVideo ? "Exporting MP4..." : "Simpan MP4"}</span>
            </button>
          </div>

          {/* Card 3: Animated GIF */}
          <div className="scrapbook-paper p-4 flex flex-col justify-between gap-3 shadow-paper">
            <div className="space-y-1">
              <span className="text-[10px] font-heading font-bold text-emerald-700 uppercase tracking-wider inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200">
                <Sparkles className="w-3 h-3" /> Loop Animasi
              </span>
              <h4 className="text-sm font-heading font-bold text-[#392633]">Simpan GIF Animasi</h4>
              <p className="text-[11px] text-[#8B7180] font-sans font-medium">Format GIF gerak looping tanpa henti, cocok buat WhatsApp & Telegram.</p>
            </div>
            <button
              type="button"
              onClick={onDownloadGif}
              disabled={isExportingGif || !isLivePhotoOn}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-heading font-bold text-xs sm:text-sm rounded-full shadow-paper transition disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isExportingGif ? "Membuat GIF..." : "Simpan GIF"}</span>
            </button>
          </div>
        </div>

        {/* Share & Retake Session Buttons */}
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={onOpenShareModal}
            className="px-6 py-3 scrapbook-btn text-xs sm:text-sm flex items-center gap-2 cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
            <span>Bagikan ke Story / Sosmed</span>
          </button>

          <button
            type="button"
            onClick={onBack}
            className="px-6 py-3 scrapbook-btn-secondary text-xs sm:text-sm flex items-center gap-2 cursor-pointer"
          >
            <RefreshCcw className="w-4 h-4 text-[#8B7180]" />
            <span>Foto Ulang / Ganti Pose</span>
          </button>
        </div>
      </div>
    </div>
  );
}
