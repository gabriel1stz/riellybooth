import React from "react";

type SliderProps = {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (val: number) => void;
};

export default function Slider({ label, value, min, max, onChange }: SliderProps) {
  return (
    <div className="space-y-1.5 bg-slate-950/40 border border-slate-800/80 p-3 rounded-xl">
      <div className="flex justify-between items-center text-xs font-semibold">
        <span className="text-slate-300">{label}</span>
        <span className="text-pink-400 font-mono bg-pink-500/10 px-2 py-0.5 rounded border border-pink-500/20">
          {value}%
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-pink-500 bg-slate-800 rounded-lg cursor-pointer h-2 transition-all hover:bg-slate-700"
      />
    </div>
  );
}