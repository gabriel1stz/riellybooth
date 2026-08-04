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
    <div className="space-y-1.5 bg-rose-50/60 border-2 border-pink-200 p-3 rounded-xl">
      <div className="flex justify-between items-center text-xs font-bold">
        <span className="text-slate-700">{label}</span>
        <span className="text-pink-600 font-mono bg-pink-100 px-2 py-0.5 rounded border border-pink-300">
          {value}%
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-pink-500 bg-slate-200 rounded-lg cursor-pointer h-2 transition-all hover:bg-slate-300"
      />
    </div>
  );
}