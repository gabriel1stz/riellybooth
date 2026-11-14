"use client";

import React from "react";
import { Users, Check, X } from "lucide-react";

type LDRAmissionModalProps = {
  isOpen: boolean;
  guestName: string;
  roomCode: string;
  onApprove: () => void;
  onReject: () => void;
};

export default function LDRAmissionModal({
  isOpen,
  guestName,
  roomCode,
  onApprove,
  onReject,
}: LDRAmissionModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-stone-900/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="scrapbook-paper bg-[#FFF9F0] border-4 border-[#E9B8CA] p-6 max-w-sm w-full shadow-paper-lg space-y-4 text-center relative animate-in fade-in zoom-in-95 duration-200">
        <div className="inline-flex p-3 bg-[#FFF0F4] rounded-full border-2 border-[#E9B8CA] text-[#E84D91]">
          <Users className="w-6 h-6 animate-pulse" />
        </div>

        <h3 className="text-xl font-heading font-bold text-[#392633]">
          Permintaan Masuk Room LDR 💖
        </h3>

        <div className="p-3 bg-white border border-[#E9B8CA] rounded-2xl text-xs space-y-1 text-[#392633] shadow-xs">
          <p>
            <strong className="text-[#E84D91] font-heading">{guestName}</strong> ingin bergabung ke sesi photobooth jarak jauh kamu di Room:
          </p>
          <span className="inline-block px-3 py-1 bg-[#FFF0F4] border border-[#E9B8CA] rounded-lg font-mono font-bold text-sm text-[#E84D91]">
            {roomCode}
          </span>
        </div>

        <p className="text-[11px] text-[#8B7180] font-sans font-medium">
          Feed kamera kalian akan disatukan berdampingan secara terenkripsi langsung (P2P). Hanya izinkan jika ini teman atau pasangan kamu!
        </p>

        <div className="grid grid-cols-2 gap-2.5 pt-2">
          <button
            type="button"
            onClick={onReject}
            className="py-2.5 px-3 bg-white hover:bg-[#FFF0F4] text-[#8B7180] font-heading font-bold text-xs rounded-xl border border-[#E9B8CA] transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
          >
            <X className="w-4 h-4 text-rose-500" />
            <span>Tolak</span>
          </button>

          <button
            type="button"
            onClick={onApprove}
            className="py-2.5 px-3 scrapbook-btn text-xs flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Check className="w-4 h-4 text-white" />
            <span>Izinkan Masuk ✅</span>
          </button>
        </div>
      </div>
    </div>
  );
}
