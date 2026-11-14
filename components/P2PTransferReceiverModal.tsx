"use client";

import React from "react";
import { Download, X, ShieldCheck, Smartphone } from "lucide-react";

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
    <div className="fixed inset-0 bg-stone-900/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="scrapbook-paper bg-[#FFF9F0] border-4 border-[#E9B8CA] p-6 max-w-sm w-full shadow-paper-lg space-y-4 text-center relative animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-[#FFF0F4] text-[#E84D91] hover:bg-[#F8D8E3] border border-[#E9B8CA] transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="inline-flex p-3 bg-[#FFF0F4] rounded-full border-2 border-[#E9B8CA] text-[#E84D91]">
          <Smartphone className="w-6 h-6 animate-pulse" />
        </div>

        <h3 className="text-xl font-heading font-bold text-[#392633]">
          {receivedDataUrl ? "Strip Diterima dari Laptop! 🎉" : "Menerima Photo Strip..."}
        </h3>

        <div className="px-3 py-2 bg-white border border-[#E9B8CA] rounded-xl text-xs font-heading font-bold text-[#E84D91] shadow-xs">
          {status}
        </div>

        {receivedDataUrl && (
          <div className="space-y-3">
            <div className="border-2 border-[#E9B8CA] rounded-2xl p-2 bg-white max-h-72 overflow-y-auto flex justify-center shadow-inner">
              <img
                src={receivedDataUrl}
                alt="Received Photo Strip"
                className="max-h-64 object-contain rounded-xl shadow-xs"
              />
            </div>

            <button
              type="button"
              onClick={handleDownload}
              className="w-full py-3.5 px-4 scrapbook-btn text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download className="w-5 h-5" />
              <span>Simpan ke Galeri HP 📥</span>
            </button>
          </div>
        )}

        <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#8B7180] font-sans font-medium pt-1">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>100% WebRTC P2P Langsung · Zero Server Storage</span>
        </div>
      </div>
    </div>
  );
}
