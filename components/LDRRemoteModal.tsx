"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  Copy,
  Check,
  Camera,
  X,
  MessageCircle,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { generateLDRRoomCode } from "@/lib/ldrPeerManager";

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
      setRoomId(generateLDRRoomCode());
    }
  }, [isOpen, roomId]);

  if (!isOpen) return null;

  const roomUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/?ldr=${roomId}`
      : `https://riellybooth.my.id/?ldr=${roomId}`;

  const shareText = `Yuk foto bareng aku di RiellyBooth dari jarak jauh! 👯‍♀️📸 Klik link ini buat join satu strip foto sama aku 👉 ${roomUrl}`;

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
    <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="scrapbook-paper bg-[#FFF9F0] border-4 border-[#E9B8CA] p-5 sm:p-7 max-w-lg w-full shadow-paper-lg space-y-5 relative animate-in fade-in zoom-in-95 duration-200 max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-[#FFF0F4] text-[#E84D91] hover:bg-[#F8D8E3] border border-[#E9B8CA] transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Banner */}
        <div className="text-center space-y-1.5">
          <div className="inline-flex p-3 bg-[#FFF0F4] rounded-full border border-[#E9B8CA] text-[#E84D91] mb-1">
            <Users className="w-7 h-7 animate-bounce" />
          </div>
          <div className="inline-block px-3 py-0.5 bg-[#E84D91] text-white text-[11px] font-heading font-bold rounded-full uppercase tracking-wider shadow-xs">
            🔥 Fitur Eksklusif #1
          </div>
          <h3 className="text-2xl sm:text-3xl font-heading font-bold text-[#392633]">
            Mode Jarak Jauh (LDR) 👯‍♀️
          </h3>
          <p className="text-xs text-[#8B7180] font-sans font-medium max-w-sm mx-auto leading-relaxed">
            Kalian terpisah jarak? Kirim link ke pacar atau bestie kamu, lalu jepret foto bareng di <strong>1 photo strip</strong> yang sama secara realtime!
          </p>
        </div>

        {/* Tab Switcher: Buat Room vs Gabung Room */}
        <div className="flex bg-[#FFF0F4] p-1.5 rounded-2xl border border-[#E9B8CA] text-xs font-heading font-bold">
          <button
            type="button"
            onClick={() => setActiveTab("create")}
            className={`flex-1 py-2 rounded-xl transition-all cursor-pointer ${activeTab === "create"
                ? "bg-white text-[#E84D91] shadow-xs border border-[#E9B8CA]"
                : "text-[#8B7180] hover:text-[#392633]"
              }`}
          >
            ✨ Buat Room Baru (Host)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("join")}
            className={`flex-1 py-2 rounded-xl transition-all cursor-pointer ${activeTab === "join"
                ? "bg-white text-[#E84D91] shadow-xs border border-[#E9B8CA]"
                : "text-[#8B7180] hover:text-[#392633]"
              }`}
          >
            🔑 Gabung Room Teman
          </button>
        </div>

        {activeTab === "create" ? (
          <div className="space-y-4">
            {/* Room Code Card */}
            <div className="bg-white border-2 border-[#E9B8CA] p-4 rounded-2xl space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-heading font-bold text-[#392633]">Kode Room Kamu:</span>
                <span className="px-3 py-1 bg-[#FFF0F4] font-mono font-bold text-sm text-[#E84D91] rounded-xl border border-[#E9B8CA] tracking-widest shadow-xs">
                  {roomId}
                </span>
              </div>

              {/* Shareable Link Box */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-sans font-medium text-[#8B7180]">
                  Kirim link ini ke teman kamu:
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={roomUrl}
                    className="w-full bg-[#FFF9F0] px-3 py-2 rounded-xl border border-[#E9B8CA] text-xs font-mono text-[#392633] select-all outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="px-3 py-2 scrapbook-btn text-xs flex items-center gap-1 shrink-0 cursor-pointer"
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
                className="w-full py-2.5 px-3 bg-emerald-500 hover:bg-emerald-600 text-white font-heading font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition shadow-xs"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Kirim Link via WhatsApp</span>
              </a>
            </div>

            {/* How it works info */}
            <div className="bg-[#FFF0F4] border border-[#E9B8CA] p-3.5 rounded-2xl text-[11px] text-[#8B7180] space-y-1.5 font-sans font-medium">
              <div className="font-heading font-bold text-[#392633] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#E84D91]" />
                <span>Cara Kerja Mode LDR:</span>
              </div>
              <ul className="list-disc pl-4 space-y-1">
                <li>Teman buka link dari HP atau laptop mereka.</li>
                <li>Kamera kalian berdua akan otomatis terhubung di satu layar.</li>
                <li>Pose bergantian secara realtime di dalam strip yang sama!</li>
              </ul>
            </div>

            {/* Action CTA */}
            <button
              type="button"
              onClick={handleStartHost}
              className="w-full py-3.5 scrapbook-btn text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <Camera className="w-4 h-4" />
              <span>Buka Kamera & Tunggu Teman Join 📸</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-white border-2 border-[#E9B8CA] p-4 rounded-2xl space-y-3 shadow-xs">
              <label className="text-xs font-heading font-bold text-[#392633]">
                Masukkan Kode Room dari Teman:
              </label>
              <input
                type="text"
                placeholder="Contoh: RLY-8X2N9K"
                value={inputRoomId}
                onChange={(e) => setInputRoomId(e.target.value)}
                className="w-full bg-[#FFF9F0] px-4 py-2.5 rounded-xl border-2 border-[#E9B8CA] text-sm font-mono font-bold text-[#392633] tracking-wider placeholder:font-sans placeholder:font-normal placeholder:text-[#8B7180] outline-none uppercase focus:border-[#E84D91] transition"
              />
              <p className="text-[11px] text-[#8B7180] font-sans font-medium">
                Maksimal 2 orang (Host + 1 Tamu). Koneksi langsung WebRTC Peer-to-Peer terenkripsi.
              </p>
            </div>

            <button
              type="button"
              onClick={handleJoinGuest}
              disabled={!inputRoomId.trim()}
              className="w-full py-3.5 scrapbook-btn disabled:opacity-50 text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer"
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
