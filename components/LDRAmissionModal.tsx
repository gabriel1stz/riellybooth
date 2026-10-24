"use client";

import React from "react";
import { Users, ShieldAlert, Check, X } from "lucide-react";

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
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-white border-4 border-pink-400 rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-4 text-center relative animate-in fade-in zoom-in-95 duration-200">
        <div className="inline-flex p-3 bg-pink-100 rounded-full border-2 border-pink-300 text-pink-600">
          <Users className="w-6 h-6 animate-pulse" />
        </div>

        <h3 className="text-xl font-black text-slate-800">
          Permintaan Masuk Room LDR 💖
        </h3>

        <div className="p-3 bg-pink-50 border border-pink-200 rounded-2xl text-xs space-y-1 text-slate-700">
          <p>
            <strong className="text-pink-600 font-black">{guestName}</strong> ingin bergabung ke sesi photobooth jarak jauh kamu di Room:
          </p>
          <span className="inline-block px-3 py-1 bg-white border border-pink-300 rounded-lg font-mono font-black text-sm text-pink-700">
            {roomCode}
          </span>
        </div>

        <p className="text-[11px] text-slate-500 font-medium">
          Feed kamera kalian akan disatukan berdampingan secara terenkripsi langsung (P2P). Hanya izinkan jika ini teman atau pasangan kamu!
        </p>

        <div className="grid grid-cols-2 gap-2.5 pt-2">
          <button
            type="button"
            onClick={onReject}
            className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <X className="w-4 h-4 text-rose-500" />
            <span>Tolak</span>
          </button>

          <button
            type="button"
            onClick={onApprove}
            className="py-2.5 px-3 bg-pink-500 hover:bg-pink-600 text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Check className="w-4 h-4 text-white" />
            <span>Izinkan Masuk ✅</span>
          </button>
        </div>
      </div>
    </div>
  );
}
