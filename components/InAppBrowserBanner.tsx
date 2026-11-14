"use client";

import React, { useState, useEffect } from "react";
import { AlertTriangle, ExternalLink, Copy, Check, X } from "lucide-react";

export default function InAppBrowserBanner() {
  const [isInApp, setIsInApp] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [appName, setAppName] = useState("TikTok / Instagram");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const ua = navigator.userAgent || navigator.vendor || (window as any).opera;

    const isInstagram = /Instagram/i.test(ua);
    const isTikTok = /TikTok|BytedanceWebview/i.test(ua);
    const isFB = /FBAN|FBAV/i.test(ua);
    const isLine = /Line/i.test(ua);

    if (isInstagram) {
      setAppName("Instagram");
      setIsInApp(true);
    } else if (isTikTok) {
      setAppName("TikTok");
      setIsInApp(true);
    } else if (isFB) {
      setAppName("Facebook");
      setIsInApp(true);
    } else if (isLine) {
      setAppName("LINE");
      setIsInApp(true);
    }
  }, []);

  if (!isInApp || dismissed) return null;

  const currentUrl = typeof window !== "undefined" ? window.location.href : "https://riellybooth.my.id";

  const handleCopy = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleOpenChrome = () => {
    if (typeof window === "undefined") return;
    const isAndroid = /Android/i.test(navigator.userAgent);
    if (isAndroid) {
      const cleanUrl = currentUrl.replace(/^https?:\/\//, "");
      window.location.href = `intent://${cleanUrl}#Intent;scheme=https;package=com.android.chrome;end`;
    } else {
      handleCopy();
      alert("Link disalin! Buka aplikasi Safari di iPhone kamu dan tempel link ini di address bar.");
    }
  };

  return (
    <div className="w-full bg-gradient-to-r from-amber-500 via-[#E84D91] to-[#F48FB1] text-white px-4 py-2.5 shadow-md flex items-center justify-between gap-3 text-xs font-heading font-semibold animate-in slide-in-from-top duration-300 z-50 sticky top-0">
      <div className="flex items-center gap-2 max-w-2xl">
        <AlertTriangle className="w-5 h-5 shrink-0 text-amber-200 animate-bounce" />
        <span className="leading-tight font-sans text-xs">
          Kamu membuka lewat browser bawaan <strong>{appName}</strong>. Kamera sering diblokir! Klik titik tiga (⋮) lalu pilih <strong>&ldquo;Buka di Browser (Chrome/Safari)&rdquo;</strong> agar kamera berfungsi.
        </span>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={handleOpenChrome}
          className="px-3 py-1.5 bg-white text-[#392633] hover:bg-[#FFF0F4] rounded-xl text-[11px] font-heading font-bold transition flex items-center gap-1 shadow-xs cursor-pointer"
        >
          <ExternalLink className="w-3.5 h-3.5 text-[#E84D91]" />
          <span>Buka di Browser</span>
        </button>

        <button
          type="button"
          onClick={handleCopy}
          className="px-2.5 py-1.5 bg-white/20 hover:bg-white/30 text-white rounded-xl text-[11px] font-heading font-bold transition flex items-center gap-1 cursor-pointer"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? "Disalin!" : "Salin"}</span>
        </button>

        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="p-1 hover:bg-white/20 rounded-lg transition text-white/80 hover:text-white cursor-pointer"
          title="Tutup peringatan"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
