"use client";

import React from "react";
import { Repeat, ArrowRight, Camera, Sparkles } from "lucide-react";

type Shot = { id: number; dataUrl: string };

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
  return (
    <div className="w-full max-w-4xl space-y-8 px-4 py-4">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-pink-500/10 rounded-full border border-pink-500/20 text-pink-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" /> Pratinjau Pose Foto
        </div>
        <h3 className="text-3xl font-black tracking-tight text-white">
          Review Hasil Jepretanmu
        </h3>
        <p className="text-slate-400 text-sm max-w-md mx-auto">
          Pose ada yang kurang pas? Kamu bisa mengulang foto tertentu atau langsung lanjut ke Studio Hias.
        </p>
      </div>

      {/* 4 Photo Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {shots.map((shot, idx) => (
          <div
            key={shot.id || idx}
            className="relative bg-slate-900/90 rounded-2xl overflow-hidden border border-slate-800/90 shadow-xl group flex flex-col justify-between"
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-950">
              <img
                src={shot.dataUrl}
                alt={`Pose #${idx + 1}`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <span className="absolute top-2 left-2 bg-slate-950/80 backdrop-blur-md text-[10px] text-pink-300 font-bold px-2 py-0.5 rounded-md border border-white/10">
                #{idx + 1}
              </span>
            </div>

            <div className="p-3 bg-slate-900/80 border-t border-slate-800">
              <button
                type="button"
                onClick={() => onRetakeSingle(idx)}
                disabled={retakeIndex !== null}
                className="w-full py-2 px-3 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-xs font-semibold text-slate-200 rounded-xl transition flex items-center justify-center gap-1.5"
              >
                <Repeat className="w-3.5 h-3.5 text-pink-400" /> Foto Ulang #{idx + 1}
              </button>
            </div>

            {/* Individual Countdown Overlay */}
            {retakeIndex === idx && (
              <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs z-20 flex flex-col items-center justify-center gap-2">
                <span className="text-5xl font-black text-pink-400 animate-ping">
                  {countdown}
                </span>
                <span className="text-xs font-bold text-slate-300">Ulang Foto #{idx + 1}...</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Navigation & Action Buttons */}
      <div className="flex flex-wrap justify-center gap-4 pt-4 border-t border-slate-800/80">
        <button
          type="button"
          onClick={onRetakeAll}
          className="px-6 py-3.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 font-semibold rounded-2xl text-slate-300 transition flex items-center gap-2 text-sm"
        >
          <Camera className="w-4 h-4 text-slate-400" /> Ulangi Semua Foto
        </button>
        <button
          type="button"
          onClick={onNextToEditor}
          className="px-8 py-3.5 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 font-bold text-white rounded-2xl shadow-xl shadow-pink-500/25 transition flex items-center gap-2 text-sm hover:scale-105"
        >
          Lanjut ke Studio Editor <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}