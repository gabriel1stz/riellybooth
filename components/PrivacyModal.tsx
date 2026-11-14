"use client";

import React from "react";
import { ShieldCheck, Lock, EyeOff, Music, Camera, X } from "lucide-react";

type PrivacyModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function PrivacyModal({ isOpen, onClose }: PrivacyModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="scrapbook-paper bg-[#FFF9F0] border-4 border-[#E9B8CA] p-5 sm:p-7 max-w-lg w-full shadow-paper-lg space-y-5 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-[#FFF0F4] text-[#E84D91] hover:bg-[#F8D8E3] border border-[#E9B8CA] transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Banner */}
        <div className="text-center space-y-1.5">
          <div className="inline-flex p-3 bg-emerald-100 rounded-full border border-emerald-300 text-emerald-600 mb-1">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h3 className="text-2xl sm:text-3xl font-heading font-bold text-[#392633]">
            Privasi & Keamanan 🔒
          </h3>
          <p className="text-xs text-[#8B7180] font-sans font-medium max-w-sm mx-auto leading-relaxed">
            Keamanan momen dan privasi kamu adalah prioritas nomor 1 di <strong>RiellyBooth</strong>.
          </p>
        </div>

        {/* Privacy Highlights */}
        <div className="space-y-3 text-left">
          <div className="bg-white border-2 border-[#E9B8CA] p-3.5 rounded-2xl flex items-start gap-3 shadow-xs">
            <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl shrink-0 mt-0.5">
              <EyeOff className="w-4 h-4" />
            </div>
            <div className="space-y-0.5">
              <h4 className="text-xs font-heading font-bold text-[#392633]">
                100% Pemrosesan Lokal di Browser Kamu
              </h4>
              <p className="text-[11px] text-[#8B7180] leading-relaxed font-sans font-medium">
                Semua foto strip, filter, efek, dan Live Photo diproses <strong>langsung di memori browser kamu</strong> menggunakan HTML5 Canvas. Foto kamu TIDAK PERNAH diunggah atau disimpan di database/server kami.
              </p>
            </div>
          </div>

          <div className="bg-white border-2 border-[#E9B8CA] p-3.5 rounded-2xl flex items-start gap-3 shadow-xs">
            <div className="p-2 bg-[#FFF0F4] text-[#E84D91] rounded-xl shrink-0 mt-0.5">
              <Lock className="w-4 h-4" />
            </div>
            <div className="space-y-0.5">
              <h4 className="text-xs font-heading font-bold text-[#392633]">
                Mode LDR & Transfer HP: WebRTC P2P Terenkripsi
              </h4>
              <p className="text-[11px] text-[#8B7180] leading-relaxed font-sans font-medium">
                Pada mode jarak jauh (LDR) dan transfer scan QR, video/gambar dikirim <strong>secara langsung antar dua perangkat</strong> (Peer-to-Peer terenkripsi E2EE). Sesi otomatis berakhir dalam 30 menit dan stream video TIDAK PERNAH disimpan di server.
              </p>
            </div>
          </div>

          <div className="bg-white border-2 border-[#E9B8CA] p-3.5 rounded-2xl flex items-start gap-3 shadow-xs">
            <div className="p-2 bg-[#FFF0F4] text-[#E84D91] rounded-xl shrink-0 mt-0.5">
              <Camera className="w-4 h-4" />
            </div>
            <div className="space-y-0.5">
              <h4 className="text-xs font-heading font-bold text-[#392633]">
                Akses Kamera Transparan & Aman
              </h4>
              <p className="text-[11px] text-[#8B7180] leading-relaxed font-sans font-medium">
                Kamera hanya aktif saat kamu berada di layar capture photobooth. Begitu kamu pindah langkah atau keluar dari tab, stream kamera hardware langsung dimatikan secara total.
              </p>
            </div>
          </div>

          <div className="bg-white border-2 border-[#E9B8CA] p-3.5 rounded-2xl flex items-start gap-3 shadow-xs">
            <div className="p-2 bg-stone-100 text-stone-700 rounded-xl shrink-0 mt-0.5">
              <Music className="w-4 h-4" />
            </div>
            <div className="space-y-0.5">
              <h4 className="text-xs font-heading font-bold text-[#392633]">
                Lisensi Aset Bebas Royalti
              </h4>
              <p className="text-[11px] text-[#8B7180] leading-relaxed font-sans font-medium">
                Audio shutter disintesis langsung via Web Audio API (zero copyright). BGM berlisensi <strong>CC0 Public Domain</strong> dan foto sample dari <strong>Unsplash Free License</strong>.
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-3.5 scrapbook-btn text-xs sm:text-sm flex items-center justify-center cursor-pointer"
        >
          Saya Mengerti ✨
        </button>
      </div>
    </div>
  );
}
