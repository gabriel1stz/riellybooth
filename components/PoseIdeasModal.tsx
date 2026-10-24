"use client";

import React, { useState } from "react";
import { Sparkles, X, Users, User, Heart, Laugh, Camera } from "lucide-react";

type PoseCategory = "duo" | "solo" | "group" | "fun";

const POSE_COLLECTION: Record<
  PoseCategory,
  Array<{
    title: string;
    desc: string;
    vibe: string;
    tips: string;
    emoji: string;
    imgUrl: string;
  }>
> = {
  duo: [
    {
      title: "Cheek Heart (Pipi Hati)",
      desc: "Tempelkan telapak tangan kalian di pipi masing-masing hingga membentuk lambang cinta utuh.",
      vibe: "Cute & Sweet ♡",
      tips: "Miringkan kepala sedikit ke arah pasangan/bestie biar makin manis!",
      emoji: "🫶",
      imgUrl: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=400&q=80",
    },
    {
      title: "Back-to-Back (Saling Sandar)",
      desc: "Berdiri atau duduk saling membelakangi dan lirik kamera dengan tatapan santai.",
      vibe: "Y2K Bestie",
      tips: "Satu orang pose tangan di saku, satu lagi pegang kacamata.",
      emoji: "👯",
      imgUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
    },
    {
      title: "Peek-a-boo (Ngintip Bahu)",
      desc: "Satu orang berdiri di depan dekat kamera, satu lagi mengintip dari belakang bahu.",
      vibe: "Playful & Gemas",
      tips: "Orang di belakang kasih pose dua jari (✌️) di atas kepala teman depan.",
      emoji: "👀",
      imgUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80",
    },
    {
      title: "Double Peace Side (V di Samping)",
      desc: "Keduanya mengangkat tangan pose peace menyamping di dekat pelipis mata.",
      vibe: "Korean Idol",
      tips: "Tahan 1 detik untuk memicu Peace Auto-Take riellybooth!",
      emoji: "✌️",
      imgUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    },
  ],
  solo: [
    {
      title: "Coquette Chin Rest (Topang Dagu)",
      desc: "Topang dagu lembut dengan kedua telapak tangan terbuka seperti kelopak bunga.",
      vibe: "Soft Aesthetic",
      tips: "Senyum tipis dengan tatapan mata langsung ke lensa kamera.",
      emoji: "🎀",
      imgUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
    },
    {
      title: "Wink & Lip Pout (Kedip & Manyun)",
      desc: "Kedipkan satu mata sambil manyunkan bibir sedikit dengan pose cute.",
      vibe: "Haru Film Vibe",
      tips: "Gunakan filter 'Soft Rose' atau 'Warm Honey' di editor untuk hasil maksimal.",
      emoji: "😉",
      imgUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
    },
    {
      title: "Camera Touch (Pegang Frame)",
      desc: "Ulurkan satu tangan ke arah kamera seolah-olah menyentuh layar kaca photobooth.",
      vibe: "POV Aesthetic",
      tips: "Fokuskan pandangan pada lensa agar depth of field terasa nyata.",
      emoji: "📸",
      imgUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80",
    },
    {
      title: "Sunglasses Lower (Intip Kacamata)",
      desc: "Turunkan sedikit kacamata hitam di batang hidung dan tatap kamera di atas bingkai.",
      vibe: "Cyber Y2K",
      tips: "Padukan dengan bingkai Cyber Y2K Sparkle di riellybooth!",
      emoji: "🕶️",
      imgUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=400&q=80",
    },
  ],
  group: [
    {
      title: "Stairway Heads (Kepala Bertingkat)",
      desc: "Susun kepala kalian bertingkat vertikal: satu orang jongkok, satu duduk, satu berdiri.",
      vibe: "Squad Goals",
      tips: "Ekspresikan senyum kompak menghadap tengah.",
      emoji: "🪜",
      imgUrl: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=400&q=80",
    },
    {
      title: "Group Hug Squeeze (Pelukan Rapat)",
      desc: "Rapatkan wajah kalian semua ke dalam satu frame tengah dengan pelukan hangat.",
      vibe: "Warm Bestie",
      tips: "Gunakan layout 'Double Strip 2x4' agar semua anggota geng kebagian cetak!",
      emoji: "🤗",
      imgUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
    },
    {
      title: "Point to Center (Tunjuk Teman)",
      desc: "Semua orang menunjuk satu teman di tengah yang sedang berpose konyol.",
      vibe: "Celebration",
      tips: "Sangat pas untuk foto ulang tahun atau kelulusan wisuda.",
      emoji: "👉",
      imgUrl: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=400&q=80",
    },
  ],
  fun: [
    {
      title: "Cat Paws (Cakar Kucing Manis)",
      desc: "Bentuk kedua tangan mengepal seperti cakar kucing di samping pipi.",
      vibe: "Neko Kawaii",
      tips: "Nyalakan filter AR Kucing di kamera riellybooth!",
      emoji: "🐾",
      imgUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    },
    {
      title: "Shocked Drama (Kaget Dramatis)",
      desc: "Buka mulut dan letakkan kedua tangan di pipi dengan mata melotot lucu.",
      vibe: "Meme Face",
      tips: "Bikin variasi foto keempat kamu jadi yang paling seru di strip!",
      emoji: "😲",
      imgUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80",
    },
    {
      title: "Fish Pout (Mulut Ikan)",
      desc: "Kempiskan kedua pipi hingga membentuk mulut ikan yang menggemaskan.",
      vibe: "Goofy Fun",
      tips: "Cocok banget buat klip Live Photo boomerang MP4.",
      emoji: "🐡",
      imgUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
    },
  ],
};

type PoseIdeasModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSelectPoseIdea?: () => void;
};

export default function PoseIdeasModal({
  isOpen,
  onClose,
  onSelectPoseIdea,
}: PoseIdeasModalProps) {
  const [activeTab, setActiveTab] = useState<PoseCategory>("duo");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white border-4 border-pink-300 rounded-3xl p-5 sm:p-6 max-w-2xl w-full shadow-2xl space-y-4 relative animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-rose-100 text-rose-600 hover:bg-rose-200 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-1 shrink-0">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-pink-100 rounded-full border border-pink-300 text-pink-700 text-xs font-black">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Katalog Pose Viral</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-800">
            Inspirasi Pose Photobooth 📸
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            Bingung mau gaya apa pas countdown? Pilih ide pose estetik di bawah ini!
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex justify-center shrink-0">
          <div className="inline-flex bg-pink-50 p-1 rounded-2xl border border-pink-200 gap-1 overflow-x-auto max-w-full">
            <button
              type="button"
              onClick={() => setActiveTab("duo")}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                activeTab === "duo"
                  ? "bg-pink-500 text-white shadow-xs"
                  : "text-slate-600 hover:bg-pink-100/50"
              }`}
            >
              <Heart className="w-3.5 h-3.5" />
              <span>Berdua / Ayang 🫶</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("solo")}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                activeTab === "solo"
                  ? "bg-pink-500 text-white shadow-xs"
                  : "text-slate-600 hover:bg-pink-100/50"
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Solo Aesthetic ✨</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("group")}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                activeTab === "group"
                  ? "bg-pink-500 text-white shadow-xs"
                  : "text-slate-600 hover:bg-pink-100/50"
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Grup / Bestie 👯</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("fun")}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                activeTab === "fun"
                  ? "bg-pink-500 text-white shadow-xs"
                  : "text-slate-600 hover:bg-pink-100/50"
              }`}
            >
              <Laugh className="w-3.5 h-3.5" />
              <span>Lucu / Meme 🤪</span>
            </button>
          </div>
        </div>

        {/* Scrollable Pose Cards Grid */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {POSE_COLLECTION[activeTab].map((p, idx) => (
              <div
                key={idx}
                className="bg-pink-50/50 border-2 border-pink-200 rounded-2xl p-3.5 flex gap-3 hover:border-pink-400 transition-all hover:shadow-xs group"
              >
                {/* Visual Thumbnail */}
                <div className="w-20 h-24 rounded-xl overflow-hidden shrink-0 border border-pink-200 bg-white relative">
                  <img
                    src={p.imgUrl}
                    alt={p.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute bottom-1 right-1 bg-black/60 text-white text-[10px] px-1 py-0.5 rounded backdrop-blur-xs">
                    {p.emoji}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1 space-y-1 text-left">
                  <div className="flex items-center justify-between">
                    <h4 className="font-black text-xs sm:text-sm text-slate-800">
                      {p.title}
                    </h4>
                    <span className="text-[10px] font-bold text-pink-600 bg-white px-2 py-0.5 rounded-full border border-pink-200">
                      {p.vibe}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
                    {p.desc}
                  </p>

                  <p className="text-[10px] text-amber-700 bg-amber-50 px-2 py-1 rounded-lg border border-amber-200/60 font-semibold">
                    💡 <em>{p.tips}</em>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="shrink-0 pt-2 border-t border-pink-200 flex justify-between items-center">
          <span className="text-xs font-bold text-pink-600">
            ✌️ Pose Peace 1 detik untuk auto-jepret
          </span>

          <button
            type="button"
            onClick={() => {
              onClose();
              if (onSelectPoseIdea) onSelectPoseIdea();
            }}
            className="px-5 py-2.5 bg-pink-500 hover:bg-pink-600 text-white font-black text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
          >
            <Camera className="w-4 h-4" />
            <span>Mulai Foto Sekarang</span>
          </button>
        </div>
      </div>
    </div>
  );
}
