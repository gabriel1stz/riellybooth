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
    <div className="space-y-1.5 bg-[#FFF0F4] border-2 border-[#E9B8CA] p-3 rounded-2xl shadow-xs">
      <div className="flex justify-between items-center text-xs font-heading font-bold">
        <span className="text-[#392633]">{label}</span>
        <span className="text-[#E84D91] font-mono bg-white px-2 py-0.5 rounded-lg border border-[#E9B8CA] shadow-xs">
          {value}%
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-[#E84D91] bg-stone-200 rounded-lg cursor-pointer h-2 transition-all hover:bg-stone-300"
      />
    </div>
  );
}
