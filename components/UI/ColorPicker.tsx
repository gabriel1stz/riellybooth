import React from "react";

type ColorPickerProps = {
  label: string;
  value: string;
  onChange: (color: string) => void;
  presetColors?: string[];
};

const DEFAULT_PRESETS = [
  "#ffffff",
  "#fce7f3",
  "#f472b6",
  "#fb7185",
  "#c084fc",
  "#38bdf8",
  "#34d399",
  "#fde047",
  "#000000",
];

export default function ColorPicker({
  label,
  value,
  onChange,
  presetColors = DEFAULT_PRESETS,
}: ColorPickerProps) {
  return (
    <div className="space-y-2 bg-rose-50/60 border-2 border-pink-200 p-3 rounded-xl">
      <div className="flex justify-between items-center">
        <label className="text-xs font-bold text-slate-700">{label}</label>
        <div className="flex items-center gap-2 bg-white border-2 border-pink-200 px-2 py-1 rounded-lg">
          <div
            className="w-4 h-4 rounded-full border border-slate-300 shadow-inner"
            style={{ backgroundColor: value }}
          />
          <span className="text-[11px] font-mono uppercase text-slate-800 font-bold">
            {value}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full h-8 rounded-lg bg-transparent cursor-pointer border border-slate-300 p-0 overflow-hidden"
          />
        </div>
      </div>

      {presetColors && presetColors.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {presetColors.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => onChange(color)}
              className={`w-6 h-6 rounded-full border-2 transition-all duration-300 ease-in-out ${
                value.toLowerCase() === color.toLowerCase()
                  ? "border-pink-500 scale-110 ring-2 ring-pink-300 shadow-xs"
                  : "border-slate-300 hover:scale-105"
              }`}
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
      )}
    </div>
  );
}