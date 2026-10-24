"use client";

import React from "react";
import { ShieldCheck, Lock, EyeOff, Music, Camera, X, CheckCircle2, Sparkles } from "lucide-react";

type PrivacyModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function PrivacyModal({ isOpen, onClose }: PrivacyModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white border-4 border-pink-300 rounded-3xl p-5 sm:p-7 max-w-lg w-full shadow-2xl space-y-5 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full bg-rose-100 text-rose-600 hover:bg-rose-200 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Banner */}
        <div className="text-center space-y-1.5">
          <div className="inline-flex p-3 bg-emerald-100 rounded-full border border-emerald-300 text-emerald-600 mb-1">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h3 className="text-2xl font-black text-slate-800">
            Privasi & Keamanan 🔒
          </h3>
          <p className="text-xs text-slate-600 font-medium max-w-sm mx-auto leading-relaxed">
            Keamanan momen dan privasi kamu adalah prioritas nomor 1 di <strong>riellybooth</strong>.
          </p>
        </div>

        {/* Privacy Highlights */}
        <div className="space-y-3">
          <div className="bg-emerald-50 border-2 border-emerald-200 p-3.5 rounded-2xl flex items-start gap-3">
            <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl shrink-0 mt-0.5">
              <EyeOff className="w-4 h-4" />
            </div>
            <div className="space-y-0.5">
              <h4 className="text-xs font-black text-emerald-950">
                100% Pemrosesan Lokal (Zero Server Upload)
              </h4>
              <p className="text-[11px] text-emerald-900 leading-relaxed font-medium">
                Semua foto, video live photo, dan stiker diproses <strong>hanya di dalam memori browser kamu</strong> menggunakan HTML5 Canvas & WebRTC. Foto kamu TIDAK PERNAH dikirim atau disimpan di server mana pun.
              </p>
            </div>
          </div>

          <div className="bg-rose-50 border-2 border-pink-200 p-3.5 rounded-2xl flex items-start gap-3">
            <div className="p-2 bg-pink-100 text-pink-700 rounded-xl shrink-0 mt-0.5">
              <Camera className="w-4 h-4" />
            </div>
            <div className="space-y-0.5">
              <h4 className="text-xs font-black text-pink-950">
                Akses Kamera Transparan & Aman
              </h4>
              <p className="text-[11px] text-pink-900 leading-relaxed font-medium">
                Kamera hanya aktif saat kamu berada di layar capture photobooth. Begitu kamu pindah tab atau selesai berfoto, stream kamera hardware langsung dimatikan secara total.
              </p>
            </div>
          </div>

          <div className="bg-purple-50 border-2 border-purple-200 p-3.5 rounded-2xl flex items-start gap-3">
            <div className="p-2 bg-purple-100 text-purple-700 rounded-xl shrink-0 mt-0.5">
              <Lock className="w-4 h-4" />
            </div>
            <div className="space-y-0.5">
              <h4 className="text-xs font-black text-purple-950">
                Analytics Ramah Privasi (Tanpa Cookies Pelacak)
              </h4>
              <p className="text-[11px] text-purple-900 leading-relaxed font-medium">
                Kami tidak melacak identitas pribadi atau menjual data ke pihak ketiga. Statistik web hanya berupa data agregat anonim (misal: jumlah photostrip yang dibuat & frame favorit) untuk pengembangan fitur baru.
              </p>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl flex items-start gap-3">
            <div className="p-2 bg-slate-200 text-slate-700 rounded-xl shrink-0 mt-0.5">
              <Music className="w-4 h-4" />
            </div>
            <div className="space-y-0.5">
              <h4 className="text-xs font-black text-slate-900">
                Lisensi Musik & Aset Legal
              </h4>
              <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                Audio BGM menggunakan musik Royalty-Free lisensi <strong>Creative Commons Zero (CC0) / Public Domain</strong>. Foto sampel inspirasi pose berasal dari <strong>Unsplash Free License</strong>.
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-3 bg-pink-400 hover:bg-pink-500 text-white font-black text-xs sm:text-sm rounded-2xl shadow-md border-2 border-pink-500 transition cursor-pointer"
        >
          Saya Mengerti ✨
        </button>
      </div>
    </div>
  );
}
