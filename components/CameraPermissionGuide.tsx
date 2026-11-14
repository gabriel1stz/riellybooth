"use client";

import React, { useState } from "react";
import { AlertCircle, RefreshCw, X, HelpCircle } from "lucide-react";

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
    <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="scrapbook-paper bg-[#FFF9F0] border-4 border-[#E9B8CA] p-5 sm:p-6 max-w-lg w-full shadow-paper-lg space-y-4 relative animate-in fade-in zoom-in-95 duration-200">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-[#FFF0F4] text-[#E84D91] hover:bg-[#F8D8E3] border border-[#E9B8CA] transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-1">
          <div className="w-12 h-12 rounded-2xl bg-[#FFF0F4] text-[#E84D91] flex items-center justify-center mx-auto border-2 border-[#E9B8CA]">
            <AlertCircle className="w-6 h-6 animate-bounce" />
          </div>
          <h3 className="text-xl sm:text-2xl font-heading font-bold text-[#392633]">
            Izin Kamera Belum Aktif 📷
          </h3>
          <p className="text-xs text-[#8B7180] font-sans font-medium">
            Browser membutuhkan izin akses kamera agar kamu bisa mengambil foto.
          </p>
        </div>

        {/* Platform Selector Tabs */}
        <div className="flex justify-center">
          <div className="inline-flex bg-[#FFF0F4] p-1 rounded-2xl border border-[#E9B8CA] gap-1">
            <button
              type="button"
              onClick={() => setActivePlatform("ios")}
              className={`px-3 py-1.5 rounded-xl text-xs font-heading font-bold transition cursor-pointer ${
                activePlatform === "ios"
                  ? "bg-[#E84D91] text-white shadow-xs"
                  : "text-[#8B7180] hover:bg-white"
              }`}
            >
              <span>🍎 iPhone / iPad</span>
            </button>
            <button
              type="button"
              onClick={() => setActivePlatform("android")}
              className={`px-3 py-1.5 rounded-xl text-xs font-heading font-bold transition cursor-pointer ${
                activePlatform === "android"
                  ? "bg-[#E84D91] text-white shadow-xs"
                  : "text-[#8B7180] hover:bg-white"
              }`}
            >
              <span>🤖 Android (Chrome)</span>
            </button>
            <button
              type="button"
              onClick={() => setActivePlatform("desktop")}
              className={`px-3 py-1.5 rounded-xl text-xs font-heading font-bold transition cursor-pointer ${
                activePlatform === "desktop"
                  ? "bg-[#E84D91] text-white shadow-xs"
                  : "text-[#8B7180] hover:bg-white"
              }`}
            >
              <span>💻 Laptop / PC</span>
            </button>
          </div>
        </div>

        {/* Step-by-Step Instructions */}
        <div className="bg-white border-2 border-[#E9B8CA] rounded-2xl p-4 text-left space-y-3 shadow-xs">
          {activePlatform === "ios" && (
            <div className="space-y-2.5 text-xs text-[#392633] font-sans font-medium">
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#E84D91] text-white text-[11px] font-heading font-bold flex items-center justify-center shrink-0 mt-0.5">
                  1
                </span>
                <p>
                  Buka aplikasi <strong>Pengaturan (Settings)</strong> iPhone kamu.
                </p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#E84D91] text-white text-[11px] font-heading font-bold flex items-center justify-center shrink-0 mt-0.5">
                  2
                </span>
                <p>
                  Scroll ke bawah, pilih <strong>Safari</strong> lalu pilih <strong>Kamera (Camera)</strong>.
                </p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#E84D91] text-white text-[11px] font-heading font-bold flex items-center justify-center shrink-0 mt-0.5">
                  3
                </span>
                <p>
                  Ubah setelan dari <em>Tolak/Tanya</em> menjadi <strong>Izinkan (Allow)</strong>.
                </p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#E84D91] text-white text-[11px] font-heading font-bold flex items-center justify-center shrink-0 mt-0.5">
                  4
                </span>
                <p>
                  Kembali ke Safari dan refresh halaman ini!
                </p>
              </div>
            </div>
          )}

          {activePlatform === "android" && (
            <div className="space-y-2.5 text-xs text-[#392633] font-sans font-medium">
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#E84D91] text-white text-[11px] font-heading font-bold flex items-center justify-center shrink-0 mt-0.5">
                  1
                </span>
                <p>
                  Ketuk <strong>ikon setelan / gembok</strong> di sebelah kiri alamat web (URL bar).
                </p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#E84D91] text-white text-[11px] font-heading font-bold flex items-center justify-center shrink-0 mt-0.5">
                  2
                </span>
                <p>
                  Pilih <strong>Izin (Permissions)</strong> atau <strong>Setelan Situs</strong>.
                </p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#E84D91] text-white text-[11px] font-heading font-bold flex items-center justify-center shrink-0 mt-0.5">
                  3
                </span>
                <p>
                  Nyalakan toggle <strong>Kamera</strong> ke posisi <strong>Izinkan (Allow)</strong>.
                </p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#E84D91] text-white text-[11px] font-heading font-bold flex items-center justify-center shrink-0 mt-0.5">
                  4
                </span>
                <p>
                  Refresh halaman Chrome kamu!
                </p>
              </div>
            </div>
          )}

          {activePlatform === "desktop" && (
            <div className="space-y-2.5 text-xs text-[#392633] font-sans font-medium">
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#E84D91] text-white text-[11px] font-heading font-bold flex items-center justify-center shrink-0 mt-0.5">
                  1
                </span>
                <p>
                  Klik ikon gembok / slider di sebelah kiri <strong>https://riellybooth.my.id</strong>.
                </p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#E84D91] text-white text-[11px] font-heading font-bold flex items-center justify-center shrink-0 mt-0.5">
                  2
                </span>
                <p>
                  Pastikan <strong>Camera</strong> disetel ke <strong>Allow</strong> (Izinkan).
                </p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#E84D91] text-white text-[11px] font-heading font-bold flex items-center justify-center shrink-0 mt-0.5">
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
        <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
          <button
            type="button"
            onClick={() => {
              onClose();
              onRetry();
            }}
            className="flex-1 py-3 scrapbook-btn text-xs flex items-center justify-center gap-1.5 cursor-pointer"
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
            className="py-3 px-4 scrapbook-btn-secondary text-xs flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Upload dari Galeri Aja 🖼️</span>
          </button>
        </div>
      </div>
    </div>
  );
}
