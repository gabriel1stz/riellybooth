"use client";

import React, { useState } from "react";
import { Repeat, ArrowRight, Sparkles, Video, Play, RefreshCcw } from "lucide-react";

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
  const [isLivePhotoOn, setIsLivePhotoOn] = useState(true);
  // Default selected indices for Korean 6-shot mode (first 4 shots selected by default)
  const [selectedIndices, setSelectedIndices] = useState<number[]>([0, 1, 2, 3]);

  const isKoreanMode = shots.length > 4;

  const handleToggleSelect = (idx: number) => {
    if (!isKoreanMode) return;
    if (selectedIndices.includes(idx)) {
      setSelectedIndices((prev) => prev.filter((i) => i !== idx));
    } else {
      if (selectedIndices.length >= 4) {
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
    <div className="w-full max-w-4xl space-y-6 sm:space-y-8 px-3 sm:px-4 py-4 animate-in fade-in duration-300">
      {/* Header */}
      <div className="text-center space-y-2.5">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#FFF9F0] rounded-full border-2 border-[#E9B8CA] text-[#E84D91] text-xs font-heading font-bold shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-[#E84D91]" />
          <span>
            {isKoreanMode ? "Mode Photobooth Korea (Ambil 6, Pilih 4)" : "Review Pose Foto Kamu"}
          </span>
        </div>

        <h3 className="text-3xl sm:text-4xl font-heading font-bold tracking-tight text-[#392633]">
          {isKoreanMode ? "Pilih 4 Pose Terbaik untuk Strip Kamu" : "Review Hasil Jepretan"}
        </h3>

        <p className="text-[#8B7180] text-xs sm:text-sm max-w-md mx-auto font-sans font-medium">
          {isKoreanMode
            ? `Ketuk kartu foto untuk memilih atau menukar urutan pose (${selectedIndices.length}/4 dipilih).`
            : "Kamu bisa mengulang foto tertentu atau langsung lanjut ke Studio Hias."}
        </p>

        {/* Live Photo Toggle Switch */}
        <div className="pt-1">
          <button
            type="button"
            onClick={() => setIsLivePhotoOn((v) => !v)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 text-xs font-heading font-bold transition-all shadow-xs cursor-pointer ${
              isLivePhotoOn
                ? "bg-[#E84D91] text-white border-[#E84D91]"
                : "bg-white text-[#392633] border-[#E9B8CA] hover:bg-[#FFF0F4]"
            }`}
          >
            <Video className="w-4 h-4" />
            <span>Live Photo (Moving Video): {isLivePhotoOn ? "AKTIF" : "MATI"}</span>
          </button>
        </div>
      </div>

      {/* Grid Review Polaroid Cards */}
      <div
        className={`grid gap-4 sm:gap-5 ${
          isKoreanMode
            ? "grid-cols-2 md:grid-cols-3"
            : shots.length === 2
              ? "grid-cols-2 max-w-xl mx-auto"
              : shots.length === 3
                ? "grid-cols-2 md:grid-cols-3 max-w-3xl mx-auto"
                : "grid-cols-2 md:grid-cols-4"
        }`}
      >
        {shots.map((shot, idx) => {
          const isSelected = selectedIndices.includes(idx);
          const orderNumber = selectedIndices.indexOf(idx) + 1;

          return (
            <div
              key={shot.id || idx}
              onClick={() => handleToggleSelect(idx)}
              className={`relative bg-white rounded-2xl overflow-hidden border-2 shadow-paper group flex flex-col justify-between transition-all duration-300 hover:shadow-paper-lg cursor-pointer ${
                isKoreanMode && isSelected
                  ? "border-[#E84D91] ring-4 ring-[#F8D8E3] scale-102"
                  : isKoreanMode
                  ? "border-[#E9B8CA] opacity-60 hover:opacity-100"
                  : "border-[#E9B8CA]"
              }`}
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100 flex items-center justify-center">
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
                <span className="absolute top-2 left-2 bg-[#FFF9F0] text-[10px] text-[#392633] font-heading font-bold px-2 py-0.5 rounded-md border border-[#E9B8CA] shadow-xs">
                  Pose #{idx + 1}
                </span>

                {/* Korean Mode Selection Badge */}
                {isKoreanMode && (
                  <div className="absolute top-2 right-2">
                    {isSelected ? (
                      <span className="w-7 h-7 rounded-full bg-[#E84D91] text-white font-heading font-black text-xs flex items-center justify-center shadow-md animate-in zoom-in-75">
                        #{orderNumber}
                      </span>
                    ) : (
                      <span className="w-7 h-7 rounded-full bg-white/80 text-[#8B7180] font-bold text-xs flex items-center justify-center border border-[#E9B8CA]">
                        +
                      </span>
                    )}
                  </div>
                )}

                {/* Live Photo indicator badge */}
                {isLivePhotoOn && shot.videoBlobUrl && !isKoreanMode && (
                  <span className="absolute top-2 right-2 bg-[#E84D91] text-white text-[9px] font-heading font-bold px-1.5 py-0.5 rounded flex items-center gap-1 shadow-xs">
                    <Play className="w-2.5 h-2.5 fill-current" /> Live
                  </span>
                )}
              </div>

              <div className="p-2 sm:p-2.5 bg-white border-t border-[#F8D8E3] flex items-center justify-between gap-1">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRetakeSingle(idx);
                  }}
                  className="w-full py-1.5 px-2 bg-[#FFF0F4] hover:bg-[#F8D8E3] text-[11px] font-heading font-bold text-[#E84D91] rounded-xl border border-[#E9B8CA] transition flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Repeat className="w-3 h-3 text-[#E84D91]" /> Ulangi Foto #{idx + 1}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 pt-4 border-t-2 border-[#E9B8CA]">
        <button
          type="button"
          onClick={onRetakeAll}
          className="w-full sm:w-auto px-6 py-3.5 scrapbook-btn-secondary flex items-center justify-center gap-2 text-xs sm:text-sm cursor-pointer"
        >
          <RefreshCcw className="w-4 h-4 text-[#8B7180]" />
          <span>Ulangi Semua (Reset)</span>
        </button>

        <button
          type="button"
          onClick={handleProceed}
          disabled={isKoreanMode && selectedIndices.length !== 4}
          className="w-full sm:w-auto px-8 py-3.5 scrapbook-btn text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <span>
            {isKoreanMode
              ? `Pakai 4 Pose Terpilih (${selectedIndices.length}/4)`
              : "Lanjut ke Studio Hias"}
          </span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
