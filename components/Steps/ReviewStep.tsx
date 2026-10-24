"use client";

import React, { useState } from "react";
import { Repeat, ArrowRight, Camera, Sparkles, Video, Play, RefreshCcw, Check, CheckCircle2 } from "lucide-react";

type Shot = { id: number; dataUrl: string; videoBlobUrl?: string };

type ReviewStepProps = {
  shots: Shot[];
  countdown: number | null;
  retakeIndex: number | null;
  onRetakeSingle: (index: number) => void;
  onRetakeAll: () => void;
  onNextToEditor: (chosenShots?: Shot[]) => void;
};

export default function ReviewStep({
  shots,
  countdown,
  retakeIndex,
  onRetakeSingle,
  onRetakeAll,
  onNextToEditor,
}: ReviewStepProps) {
  const [isLivePhotoOn, setIsLivePhotoOn] = useState(false);
  // Default selected indices for Korean 6-shot mode (first 4 shots selected by default)
  const [selectedIndices, setSelectedIndices] = useState<number[]>([0, 1, 2, 3]);

  const isKoreanMode = shots.length > 4;

  const handleToggleSelect = (idx: number) => {
    if (!isKoreanMode) return;
    if (selectedIndices.includes(idx)) {
      // Remove index
      setSelectedIndices((prev) => prev.filter((i) => i !== idx));
    } else {
      if (selectedIndices.length >= 4) {
        // Replace last one or prompt
        setSelectedIndices((prev) => [...prev.slice(1), idx]);
      } else {
        setSelectedIndices((prev) => [...prev, idx]);
      }
    }
  };

  const handleProceed = () => {
    if (isKoreanMode) {
      if (selectedIndices.length !== 4) {
        alert("Pilih tepat 4 foto untuk masuk ke strip ya!");
        return;
      }
      const finalShots = selectedIndices.map((i) => shots[i]);
      onNextToEditor(finalShots);
    } else {
      onNextToEditor();
    }
  };

  return (
    <div className="w-full max-w-4xl space-y-6 sm:space-y-8 px-3 sm:px-4 py-3 sm:py-4 animate-in fade-in duration-300">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-pink-100 rounded-full border border-pink-300 text-pink-700 text-xs font-bold shadow-xs">
          <Sparkles className="w-3.5 h-3.5" />
          <span>
            {isKoreanMode ? "🇰🇷 Mode Photobooth Korea (Ambil 6, Pilih 4)" : "Pratinjau Pose Foto"}
          </span>
        </div>

        <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-800">
          {isKoreanMode ? "Pilih 4 Pose Terbaik untuk Strip Kamu" : "Review Hasil Jepretanmu"}
        </h3>

        <p className="text-slate-600 text-xs sm:text-sm max-w-md mx-auto font-medium">
          {isKoreanMode
            ? `Ketuk kartu foto untuk memilih atau menukar urutan pose (${selectedIndices.length}/4 dipilih).`
            : "Kamu bisa mengulang foto tertentu atau langsung lanjut ke Studio Hias."}
        </p>

        {/* Live Photo Toggle Switch */}
        <div className="pt-1 sm:pt-2">
          <button
            type="button"
            onClick={() => setIsLivePhotoOn((v) => !v)}
            className={`inline-flex items-center gap-2 px-4 sm:px-5 py-2 rounded-full border-2 text-xs font-bold transition-all duration-300 ease-in-out shadow-xs cursor-pointer ${
              isLivePhotoOn
                ? "bg-pink-400 text-white border-pink-500"
                : "bg-white text-slate-700 border-slate-300"
            }`}
          >
            <Video className="w-4 h-4 text-pink-500" />
            <span>Live Photo 🎥 (Moving Video) : {isLivePhotoOn ? "AKTIF 🔥" : "MATI"}</span>
          </button>
        </div>
      </div>

      {/* Grid Review Cards (2 cols on mobile, 3 or 4 cols on desktop) */}
      <div className={`grid gap-3 sm:gap-4 ${isKoreanMode ? "grid-cols-2 md:grid-cols-3" : "grid-cols-2 md:grid-cols-4"}`}>
        {shots.map((shot, idx) => {
          const isSelected = selectedIndices.includes(idx);
          const orderNumber = selectedIndices.indexOf(idx) + 1;

          return (
            <div
              key={shot.id || idx}
              onClick={() => handleToggleSelect(idx)}
              className={`relative bg-white rounded-2xl overflow-hidden border-3 shadow-md group flex flex-col justify-between transition-all duration-300 hover:shadow-xl cursor-pointer ${
                isKoreanMode && isSelected
                  ? "border-pink-500 ring-4 ring-pink-200 scale-102"
                  : isKoreanMode
                  ? "border-slate-200 opacity-60 hover:opacity-100"
                  : "border-pink-200"
              }`}
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100 flex items-center justify-center">
                {isLivePhotoOn && shot.videoBlobUrl ? (
                  <video
                    src={shot.videoBlobUrl}
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="auto"
                    onCanPlay={(e) => e.currentTarget.play()}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src={shot.dataUrl}
                    alt={`Pose #${idx + 1}`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                )}

                {/* Left Badge: Pose Index */}
                <span className="absolute top-2 left-2 bg-white/90 backdrop-blur-md text-[10px] text-slate-700 font-black px-2 py-0.5 rounded-md border border-slate-200 shadow-xs">
                  Pose #{idx + 1}
                </span>

                {/* Korean Mode Selection Badge */}
                {isKoreanMode && (
                  <div className="absolute top-2 right-2">
                    {isSelected ? (
                      <span className="w-7 h-7 rounded-full bg-pink-500 text-white font-black text-xs flex items-center justify-center shadow-md animate-in zoom-in-75">
                        #{orderNumber}
                      </span>
                    ) : (
                      <span className="w-7 h-7 rounded-full bg-white/80 text-slate-400 font-bold text-xs flex items-center justify-center border border-slate-300">
                        +
                      </span>
                    )}
                  </div>
                )}

                {/* Live Photo indicator badge */}
                {isLivePhotoOn && shot.videoBlobUrl && !isKoreanMode && (
                  <span className="absolute top-2 right-2 bg-pink-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1 shadow-xs">
                    <Play className="w-2.5 h-2.5 fill-current" /> Live
                  </span>
                )}
              </div>

              <div className="p-2 sm:p-2.5 bg-white border-t border-pink-100 flex items-center justify-between gap-1">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRetakeSingle(idx);
                  }}
                  className="w-full py-1.5 px-2 bg-rose-50 hover:bg-rose-100 text-[11px] font-bold text-rose-700 rounded-xl border border-pink-200 transition flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Repeat className="w-3 h-3 text-pink-500" /> Ulangi Foto
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 pt-4 border-t border-pink-200">
        <button
          type="button"
          onClick={onRetakeAll}
          className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-slate-50 border-2 border-slate-300 font-bold rounded-2xl text-slate-700 transition flex items-center justify-center gap-2 text-xs sm:text-sm shadow-xs cursor-pointer"
        >
          <RefreshCcw className="w-4 h-4 text-slate-500" /> Ulangi Semua (Reset)
        </button>

        <button
          type="button"
          onClick={handleProceed}
          disabled={isKoreanMode && selectedIndices.length !== 4}
          className="w-full sm:w-auto px-8 py-3.5 bg-pink-400 hover:bg-pink-500 disabled:opacity-50 border-2 border-pink-500 font-black text-white rounded-2xl shadow-md transition flex items-center justify-center gap-2 text-xs sm:text-sm hover:scale-105 active:scale-95 cursor-pointer"
        >
          <span>
            {isKoreanMode
              ? `Pakai 4 Pose Terpilih (${selectedIndices.length}/4) 🎀`
              : "Lanjut ke Studio Hias"}
          </span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}