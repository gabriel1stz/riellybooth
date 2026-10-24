"use client";

import React, { useState } from "react";
import { AlertCircle, Smartphone, RefreshCw, X, Check, ChevronRight } from "lucide-react";

type PlatformTab = "ios" | "android" | "desktop";

type CameraPermissionGuideProps = {
  isOpen: boolean;
  onClose: () => void;
  onRetry: () => void;
  onUploadInstead: () => void;
};

export default function CameraPermissionGuide({
  isOpen,
  onClose,
  onRetry,
  onUploadInstead,
}: CameraPermissionGuideProps) {
  const [activePlatform, setActivePlatform] = useState<PlatformTab>("ios");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white border-4 border-rose-300 rounded-3xl p-5 sm:p-6 max-w-lg w-full shadow-2xl space-y-4 relative animate-in fade-in zoom-in-95 duration-200">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-rose-100 text-rose-600 hover:bg-rose-200 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-1">
          <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto border border-rose-200">
            <AlertCircle className="w-6 h-6 animate-bounce" />
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-800">
            Izin Kamera Belum Aktif 📷
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            Browser membutuhkan izin akses webcam/kamera agar kamu bisa foto.
          </p>
        </div>

        {/* Platform Selector Tabs */}
        <div className="flex justify-center">
          <div className="inline-flex bg-slate-100 p-1 rounded-2xl border border-slate-200 gap-1">
            <button
              type="button"
              onClick={() => setActivePlatform("ios")}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer ${
                activePlatform === "ios"
                  ? "bg-rose-500 text-white shadow-xs"
                  : "text-slate-600 hover:bg-slate-200"
              }`}
            >
              <span>🍎 iPhone / iPad</span>
            </button>
            <button
              type="button"
              onClick={() => setActivePlatform("android")}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer ${
                activePlatform === "android"
                  ? "bg-rose-500 text-white shadow-xs"
                  : "text-slate-600 hover:bg-slate-200"
              }`}
            >
              <span>🤖 Android (Chrome)</span>
            </button>
            <button
              type="button"
              onClick={() => setActivePlatform("desktop")}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer ${
                activePlatform === "desktop"
                  ? "bg-rose-500 text-white shadow-xs"
                  : "text-slate-600 hover:bg-slate-200"
              }`}
            >
              <span>💻 Laptop / PC</span>
            </button>
          </div>
        </div>

        {/* Step-by-Step Instructions */}
        <div className="bg-rose-50/60 border-2 border-rose-200 rounded-2xl p-4 text-left space-y-3">
          {activePlatform === "ios" && (
            <div className="space-y-2.5 text-xs text-slate-700 font-medium">
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[11px] font-black flex items-center justify-center shrink-0 mt-0.5">
                  1
                </span>
                <p>
                  Buka aplikasi <strong>Pengaturan (Settings)</strong> iPhone kamu.
                </p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[11px] font-black flex items-center justify-center shrink-0 mt-0.5">
                  2
                </span>
                <p>
                  Scroll ke bawah, pilih <strong>Safari</strong> lalu pilih <strong>Kamera (Camera)</strong>.
                </p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[11px] font-black flex items-center justify-center shrink-0 mt-0.5">
                  3
                </span>
                <p>
                  Ubah setelan dari <em>Tolak/Tanya</em> menjadi <strong>Izinkan (Allow)</strong>.
                </p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[11px] font-black flex items-center justify-center shrink-0 mt-0.5">
                  4
                </span>
                <p>
                  Kembali ke Safari dan refresh halaman ini!
                </p>
              </div>
            </div>
          )}

          {activePlatform === "android" && (
            <div className="space-y-2.5 text-xs text-slate-700 font-medium">
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[11px] font-black flex items-center justify-center shrink-0 mt-0.5">
                  1
                </span>
                <p>
                  Ketuk <strong>ikon setelan / gembok</strong> di sebelah kiri alamat web (URL bar).
                </p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[11px] font-black flex items-center justify-center shrink-0 mt-0.5">
                  2
                </span>
                <p>
                  Pilih <strong>Izin (Permissions)</strong> atau <strong>Setelan Situs</strong>.
                </p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[11px] font-black flex items-center justify-center shrink-0 mt-0.5">
                  3
                </span>
                <p>
                  Nyalakan toggle <strong>Kamera</strong> ke posisi <strong>Izinkan (Allow)</strong>.
                </p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[11px] font-black flex items-center justify-center shrink-0 mt-0.5">
                  4
                </span>
                <p>
                  Refresh halaman Chrome kamu!
                </p>
              </div>
            </div>
          )}

          {activePlatform === "desktop" && (
            <div className="space-y-2.5 text-xs text-slate-700 font-medium">
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[11px] font-black flex items-center justify-center shrink-0 mt-0.5">
                  1
                </span>
                <p>
                  Klik ikon gembok / slider di sebelah kiri <strong>https://riellybooth.my.id</strong>.
                </p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[11px] font-black flex items-center justify-center shrink-0 mt-0.5">
                  2
                </span>
                <p>
                  Pastikan <strong>Camera</strong> disetel ke <strong>Allow</strong> (Izinkan).
                </p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[11px] font-black flex items-center justify-center shrink-0 mt-0.5">
                  3
                </span>
                <p>
                  Klik tombol <strong>Reload</strong> browser atau tekan <code>Ctrl + R</code> / <code>Cmd + R</code>.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 pt-1">
          <button
            type="button"
            onClick={() => {
              onClose();
              onRetry();
            }}
            className="flex-1 py-3 bg-rose-500 hover:bg-rose-600 text-white font-black text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Coba Kamera Lagi 🔄</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              onUploadInstead();
            }}
            className="py-3 px-4 bg-white hover:bg-slate-50 text-slate-700 font-black text-xs rounded-xl border border-slate-300 transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Upload Foto dari Galeri Aja 🖼️</span>
          </button>
        </div>
      </div>
    </div>
  );
}
