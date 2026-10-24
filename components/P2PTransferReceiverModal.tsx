"use client";

import React from "react";
import { Download, Sparkles, X, ShieldCheck, Smartphone, CheckCircle } from "lucide-react";

type P2PTransferReceiverModalProps = {
  isOpen: boolean;
  status: string;
  receivedDataUrl: string | null;
  filename: string;
  onClose: () => void;
};

export default function P2PTransferReceiverModal({
  isOpen,
  status,
  receivedDataUrl,
  filename,
  onClose,
}: P2PTransferReceiverModalProps) {
  if (!isOpen) return null;

  const handleDownload = () => {
    if (!receivedDataUrl) return;
    const link = document.createElement("a");
    link.href = receivedDataUrl;
    link.download = filename || `riellybooth-strip-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-white border-4 border-pink-300 rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-4 text-center relative animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-rose-100 text-rose-600 hover:bg-rose-200 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="inline-flex p-3 bg-pink-100 rounded-full border-2 border-pink-300 text-pink-600">
          <Smartphone className="w-6 h-6 animate-pulse" />
        </div>

        <h3 className="text-xl font-black text-slate-800">
          {receivedDataUrl ? "Strip Diterima dari Laptop! 🎉" : "Menerima Photo Strip..."}
        </h3>

        <div className="px-3 py-2 bg-pink-50 border border-pink-200 rounded-xl text-xs font-bold text-pink-900">
          {status}
        </div>

        {receivedDataUrl && (
          <div className="space-y-3">
            <div className="border-2 border-pink-200 rounded-2xl p-2 bg-slate-50 max-h-72 overflow-y-auto flex justify-center shadow-inner">
              <img
                src={receivedDataUrl}
                alt="Received Photo Strip"
                className="max-h-64 object-contain rounded-xl shadow-xs"
              />
            </div>

            <button
              type="button"
              onClick={handleDownload}
              className="w-full py-3.5 px-4 bg-pink-500 hover:bg-pink-600 text-white font-black text-sm rounded-2xl border-2 border-pink-600 shadow-md flex items-center justify-center gap-2 transition hover:scale-102 active:scale-95 cursor-pointer"
            >
              <Download className="w-5 h-5" />
              <span>Simpan ke Galeri HP 📥</span>
            </button>
          </div>
        )}

        <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 font-semibold pt-1">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>100% WebRTC P2P Langsung • Zero Server Upload</span>
        </div>
      </div>
    </div>
  );
}
