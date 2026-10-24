"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Users,
  Link2,
  Copy,
  Check,
  Share2,
  Video,
  Sparkles,
  X,
  MessageCircle,
  Heart,
  Wifi,
  Laptop,
  Smartphone,
  Camera,
  ArrowRight,
  RefreshCcw,
} from "lucide-react";

type LDRRemoteModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onStartLDRSession: (roomId: string, isHost: boolean) => void;
};

export default function LDRRemoteModal({
  isOpen,
  onClose,
  onStartLDRSession,
}: LDRRemoteModalProps) {
  const [roomId, setRoomId] = useState("");
  const [inputRoomId, setInputRoomId] = useState("");
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeTab, setActiveTab] = useState<"create" | "join">("create");

  useEffect(() => {
    if (isOpen && !roomId) {
      // Generate memorable 6-char room code
      const code = "RLY-" + Math.floor(1000 + Math.random() * 9000);
      setRoomId(code);
    }
  }, [isOpen, roomId]);

  if (!isOpen) return null;

  const roomUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/?ldr=${roomId}`
      : `https://riellybooth.my.id/?ldr=${roomId}`;

  const shareText = `Yuk foto bareng aku di riellybooth dari jarak jauh! 👯‍♀️📸 Klik link ini buat join satu strip foto sama aku 👉 ${roomUrl}`;

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(roomUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleStartHost = () => {
    onStartLDRSession(roomId, true);
    onClose();
  };

  const handleJoinGuest = () => {
    if (!inputRoomId.trim()) return;
    const cleanId = inputRoomId.trim().toUpperCase();
    onStartLDRSession(cleanId, false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white border-4 border-pink-300 rounded-3xl p-5 sm:p-7 max-w-lg w-full shadow-2xl space-y-5 relative animate-in fade-in zoom-in-95 duration-200 max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full bg-rose-100 text-rose-600 hover:bg-rose-200 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Banner */}
        <div className="text-center space-y-1.5">
          <div className="inline-flex p-3 bg-pink-100 rounded-full border border-pink-300 text-pink-600 mb-1">
            <Users className="w-7 h-7 animate-bounce" />
          </div>
          <div className="inline-block px-3 py-0.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-[11px] font-black rounded-full uppercase tracking-wider shadow-xs">
            🔥 Fitur Eksklusif #1
          </div>
          <h3 className="text-2xl font-black text-slate-800">
            Mode Berdua Jarak Jauh (LDR) 👯‍♀️
          </h3>
          <p className="text-xs text-slate-600 font-medium max-w-sm mx-auto leading-relaxed">
            Kalian terpisah jarak? Kirim link ke pacar atau bestie kamu, lalu jepret foto bareng di <strong>1 photo strip</strong> yang sama secara realtime!
          </p>
        </div>

        {/* Tab Switcher: Buat Room vs Gabung Room */}
        <div className="flex bg-rose-50 p-1.5 rounded-2xl border border-pink-200 text-xs font-black">
          <button
            type="button"
            onClick={() => setActiveTab("create")}
            className={`flex-1 py-2 rounded-xl transition-all ${
              activeTab === "create"
                ? "bg-white text-pink-600 shadow-sm border border-pink-300"
                : "text-slate-600 hover:text-pink-600"
            }`}
          >
            ✨ Buat Room Baru (Host)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("join")}
            className={`flex-1 py-2 rounded-xl transition-all ${
              activeTab === "join"
                ? "bg-white text-pink-600 shadow-sm border border-pink-300"
                : "text-slate-600 hover:text-pink-600"
            }`}
          >
            🔑 Gabung Room Teman
          </button>
        </div>

        {activeTab === "create" ? (
          <div className="space-y-4">
            {/* Room Code Card */}
            <div className="bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50 border-2 border-pink-200 p-4 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-pink-800">Kode Room Kamu:</span>
                <span className="px-3 py-1 bg-white font-mono font-black text-sm text-pink-600 rounded-xl border border-pink-300 tracking-widest shadow-xs">
                  {roomId}
                </span>
              </div>

              {/* Shareable Link Box */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-600">
                  Kirim link ini ke teman kamu:
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={roomUrl}
                    className="w-full bg-white px-3 py-2 rounded-xl border border-pink-300 text-xs font-mono text-slate-700 select-all outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="px-3 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-xl text-xs font-black transition flex items-center gap-1 shrink-0 cursor-pointer shadow-xs"
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedLink ? "Disalin!" : "Salin"}</span>
                  </button>
                </div>
              </div>

              {/* Quick WhatsApp Share Button */}
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-3 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs rounded-xl flex items-center justify-center gap-2 transition shadow-xs"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Kirim Link via WhatsApp</span>
              </a>
            </div>

            {/* How it works info */}
            <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl text-[11px] text-slate-600 space-y-1.5 font-medium">
              <div className="font-bold text-slate-800 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-pink-500" />
                <span>Cara Kerja Mode LDR:</span>
              </div>
              <ul className="list-disc pl-4 space-y-1">
                <li>Teman buka link dari HP atau laptop mereka.</li>
                <li>Kamera kalian berdua akan otomatis terhubung di satu layar.</li>
                <li>Pose 1 & 3 untuk kamu, Pose 2 & 4 untuk teman kamu (bergantian seru!).</li>
              </ul>
            </div>

            {/* Action CTA */}
            <button
              type="button"
              onClick={handleStartHost}
              className="w-full py-3.5 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-black text-sm rounded-2xl shadow-md border-2 border-pink-600 flex items-center justify-center gap-2 transition hover:scale-102 active:scale-95 cursor-pointer"
            >
              <Camera className="w-4 h-4" />
              <span>Buka Kamera & Tunggu Teman Join 📸</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-rose-50 border-2 border-pink-200 p-4 rounded-2xl space-y-3">
              <label className="text-xs font-bold text-slate-700">
                Masukkan Kode Room dari Teman:
              </label>
              <input
                type="text"
                placeholder="Contoh: RLY-4819"
                value={inputRoomId}
                onChange={(e) => setInputRoomId(e.target.value)}
                className="w-full bg-white px-4 py-2.5 rounded-xl border-2 border-pink-300 text-sm font-mono font-black text-slate-800 tracking-wider placeholder:font-sans placeholder:font-normal placeholder:text-slate-400 outline-none uppercase focus:border-pink-500 transition"
              />
              <p className="text-[11px] text-slate-500">
                Minta temanmu untuk klik "Mode Berdua Jarak Jauh" lalu salin kodenya.
              </p>
            </div>

            <button
              type="button"
              onClick={handleJoinGuest}
              disabled={!inputRoomId.trim()}
              className="w-full py-3.5 bg-pink-500 hover:bg-pink-600 disabled:opacity-50 text-white font-black text-sm rounded-2xl shadow-md border-2 border-pink-600 flex items-center justify-center gap-2 transition hover:scale-102 active:scale-95 cursor-pointer"
            >
              <span>Gabung ke Room 🚀</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
