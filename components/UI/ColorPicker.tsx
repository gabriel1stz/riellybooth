import React from "react";

type ColorPickerProps = {
  label: string;
  value: string;
  onChange: (color: string) => void;
  presetColors?: string[];
};

const DEFAULT_PRESETS = [
  "#ffffff",
  "#fff0f4",
  "#fff9f0",
  "#f8d8e3",
  "#f48fb1",
  "#e84d91",
  "#c084fc",
  "#38bdf8",
  "#34d399",
  "#fde047",
  "#392633",
  "#000000",
];

export default function ColorPicker({
  label,
  value,
  onChange,
  presetColors = DEFAULT_PRESETS,
}: ColorPickerProps) {
  return (
    <div className="space-y-2 bg-[#FFF0F4] border-2 border-[#E9B8CA] p-3 rounded-2xl shadow-xs">
      <div className="flex justify-between items-center">
        <label className="text-xs font-heading font-bold text-[#392633]">{label}</label>
        <div className="flex items-center gap-2 bg-white border border-[#E9B8CA] px-2 py-0.5 rounded-lg shadow-xs">
          <div
            className="w-3.5 h-3.5 rounded-full border border-[#E9B8CA] shadow-inner"
            style={{ backgroundColor: value }}
          />
          <span className="text-[11px] font-mono uppercase text-[#392633] font-bold">
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
            className="w-full h-8 rounded-xl bg-transparent cursor-pointer border border-[#E9B8CA] p-0 overflow-hidden"
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
              className={`w-6 h-6 rounded-full border-2 transition-all duration-200 cursor-pointer ${
                value.toLowerCase() === color.toLowerCase()
                  ? "border-[#E84D91] scale-110 ring-2 ring-[#F8D8E3] shadow-xs"
                  : "border-[#E9B8CA] hover:scale-105"
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
