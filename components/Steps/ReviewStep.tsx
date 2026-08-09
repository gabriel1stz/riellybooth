"use client";

import React, { useState } from "react";
import { Repeat, ArrowRight, Camera, Sparkles, Video, Play, RefreshCcw } from "lucide-react";

type Shot = { id: number; dataUrl: string; videoBlobUrl?: string };

type ReviewStepProps = {
  shots: Shot[];
  countdown: number | null;
  retakeIndex: number | null;
  onRetakeSingle: (index: number) => void;
  onRetakeAll: () => void;
  onNextToEditor: () => void;
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

  return (
    <div className="w-full max-w-4xl space-y-6 sm:space-y-8 px-3 sm:px-4 py-3 sm:py-4">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-pink-100 rounded-full border border-pink-300 text-pink-700 text-xs font-bold shadow-xs">
          <Sparkles className="w-3.5 h-3.5" /> Pratinjau Pose Foto
        </div>
        <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-800">
          Review Hasil Jepretanmu
        </h3>
        <p className="text-slate-600 text-xs sm:text-sm max-w-md mx-auto font-medium">
          Kamu bisa mengulang foto tertentu atau langsung lanjut ke Studio Hias.
        </p>

        {/* Live Photo Toggle Switch */}
        <div className="pt-1 sm:pt-2">
          <button
            type="button"
            onClick={() => setIsLivePhotoOn((v) => !v)}
            className={`inline-flex items-center gap-2 px-4 sm:px-5 py-2 rounded-full border-2 text-xs font-bold transition-all duration-300 ease-in-out shadow-xs ${
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

      {/* 4 Photo Grid Review Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {shots.map((shot, idx) => (
          <div
            key={shot.id || idx}
            className="relative bg-white rounded-2xl overflow-hidden border-2 border-pink-200 shadow-md group flex flex-col justify-between transition-all duration-300 hover:shadow-xl"
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

              <span className="absolute top-2 left-2 bg-white/90 backdrop-blur-md text-[10px] text-pink-600 font-black px-2 py-0.5 rounded-md border border-pink-200 shadow-xs">
                #{idx + 1}
              </span>

              {isLivePhotoOn && shot.videoBlobUrl && (
                <span className="absolute top-2 right-2 bg-pink-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1 shadow-xs">
                  <Play className="w-2.5 h-2.5 fill-current" /> Live
                </span>
              )}
            </div>

            <div className="p-2.5 sm:p-3 bg-white border-t border-pink-100">
              <button
                type="button"
                onClick={() => onRetakeSingle(idx)}
                className="w-full py-2 px-2.5 bg-rose-50 hover:bg-rose-100 text-[11px] sm:text-xs font-bold text-rose-700 rounded-xl border border-pink-200 transition-all duration-300 ease-in-out flex items-center justify-center gap-1.5"
              >
                <Repeat className="w-3.5 h-3.5 text-pink-500" /> Ulangi Foto Ini
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Action Buttons: Secondary Ulangi Semua & Primary Pink Lanjut ke Studio Hias */}
      <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 pt-4 border-t border-pink-200">
        <button
          type="button"
          onClick={onRetakeAll}
          className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-slate-50 border-2 border-slate-300 font-bold rounded-2xl text-slate-700 transition-all duration-300 ease-in-out flex items-center justify-center gap-2 text-xs sm:text-sm shadow-xs"
        >
          <RefreshCcw className="w-4 h-4 text-slate-500" /> Ulangi Semua (Reset)
        </button>
        <button
          type="button"
          onClick={onNextToEditor}
          className="w-full sm:w-auto px-8 py-3.5 bg-pink-400 hover:bg-pink-500 border-2 border-pink-500 font-black text-white rounded-2xl shadow-md transition-all duration-300 ease-in-out flex items-center justify-center gap-2 text-xs sm:text-sm hover:scale-105 active:scale-95"
        >
          <span>Lanjut ke Studio Hias</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}