"use client";

import React, { useRef, useState, useEffect } from "react";
import { Camera, Upload, AlertCircle, RefreshCw, Volume2, VolumeX, Hand, Sparkles, CheckCircle2 } from "lucide-react";
import { getHandLandmarker, isPeaceSignGesture } from "@/lib/gestureUtils";

type CaptureStepProps = {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  isCapturing: boolean;
  countdown: number | null;
  currentShotIndex: number;
  shotsCount: number;
  cameraError: string | null;
  onTakeSingleShot: () => void;
  onUploadPhotos: (files: FileList) => void;
  flashFx: boolean;
  isAudioOn: boolean;
  onToggleAudio: () => void;
};

export default function CaptureStep({
  videoRef,
  isCapturing,
  countdown,
  currentShotIndex,
  shotsCount,
  cameraError,
  onTakeSingleShot,
  onUploadPhotos,
  flashFx,
  isAudioOn,
  onToggleAudio,
}: CaptureStepProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Gesture Detection State
  const [gestureEnabled, setGestureEnabled] = useState(true);
  const [gestureStatus, setGestureStatus] = useState<string | null>(null);
  const [peaceProgress, setPeaceProgress] = useState(0);

  const peaceStartTimeRef = useRef<number | null>(null);
  const isLockedRef = useRef(false);

  // MediaPipe Hand Detection Loop (Per-Shot Trigger ✌️)
  useEffect(() => {
    let animFrameId: number;
    let active = true;

    if (!gestureEnabled || isCapturing || countdown !== null || cameraError) {
      setGestureStatus(null);
      setPeaceProgress(0);
      peaceStartTimeRef.current = null;
      return;
    }

    const runDetection = async () => {
      const landmarker = await getHandLandmarker();
      if (!landmarker || !videoRef.current || !active) return;

      const video = videoRef.current;
      if (video.readyState >= 2 && !video.paused) {
        try {
          const results = landmarker.detectForVideo(video, performance.now());
          if (results && results.landmarks && results.landmarks.length > 0) {
            const handLandmarks = results.landmarks[0];
            const isPeace = isPeaceSignGesture(handLandmarks);

            if (isPeace && !isLockedRef.current) {
              const now = Date.now();
              if (!peaceStartTimeRef.current) {
                peaceStartTimeRef.current = now;
              }

              const elapsed = now - peaceStartTimeRef.current;
              const progress = Math.min(100, Math.round((elapsed / 1200) * 100));
              setPeaceProgress(progress);
              setGestureStatus(`✌️ Peace Detected! Tahan pose untuk Foto #${currentShotIndex}...`);

              if (elapsed >= 1200) {
                isLockedRef.current = true;
                setGestureStatus(`📸 Menjepret Foto #${currentShotIndex}!`);
                onTakeSingleShot();
                setTimeout(() => {
                  isLockedRef.current = false;
                }, 2000);
              }
            } else {
              peaceStartTimeRef.current = null;
              setPeaceProgress(0);
              setGestureStatus(`✌️ Tunjukkan gesture Peace untuk mengambil Foto #${currentShotIndex}/4`);
            }
          } else {
            peaceStartTimeRef.current = null;
            setPeaceProgress(0);
            setGestureStatus(null);
          }
        } catch (err) {
          // Transient frame detection error handling
        }
      }

      if (active) {
        animFrameId = requestAnimationFrame(runDetection);
      }
    };

    runDetection();

    return () => {
      active = false;
      if (animFrameId) cancelAnimationFrame(animFrameId);
    };
  }, [gestureEnabled, isCapturing, countdown, cameraError, currentShotIndex, videoRef, onTakeSingleShot]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onUploadPhotos(e.target.files);
    }
  };

  return (
    <div className="w-full max-w-3xl flex flex-col items-center gap-6 px-4">
      {/* Step Guide Banner */}
      <div className="w-full bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-pink-500/10 border border-pink-500/20 rounded-xl text-pink-400 font-bold">
            #{currentShotIndex} / 4
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">
              {shotsCount === 0 && "Pose ✌️ untuk mengambil Foto #1"}
              {shotsCount === 1 && "Bagus! Pose ✌️ lagi untuk Foto #2"}
              {shotsCount === 2 && "Keren! Pose ✌️ lagi untuk Foto #3"}
              {shotsCount === 3 && "Terakhir! Pose ✌️ untuk Foto #4"}
              {shotsCount >= 4 && "Selesai! Memproses foto..."}
            </h4>
            <p className="text-xs text-slate-400">
              Setiap gesture ✌️ mengambil 1 foto. Kumpulkan 4 pose terbaikmu!
            </p>
          </div>
        </div>

        {/* 4 Dots Progress Indicator */}
        <div className="flex items-center gap-1.5">
          {[0, 1, 2, 3].map((idx) => (
            <div
              key={idx}
              className={`w-3 h-3 rounded-full transition-all ${
                idx < shotsCount
                  ? "bg-pink-500 ring-2 ring-pink-500/40"
                  : idx === shotsCount
                  ? "bg-pink-400 animate-ping"
                  : "bg-slate-800"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Video Viewport Container */}
      <div className="relative w-full aspect-video bg-slate-950 rounded-3xl overflow-hidden border-2 border-slate-800 shadow-2xl flex items-center justify-center">
        {/* FLASH FX OVERLAY */}
        {flashFx && (
          <div className="absolute inset-0 bg-white z-50 animate-out fade-out duration-300 pointer-events-none" />
        )}

        {cameraError ? (
          <div className="p-8 text-center space-y-4 max-w-md z-10">
            <div className="p-4 bg-rose-500/10 rounded-full border border-rose-500/20 inline-block">
              <AlertCircle className="w-10 h-10 text-rose-400 mx-auto" />
            </div>
            <h4 className="text-xl font-bold text-rose-400">Kamera Tidak Tersedia</h4>
            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800">
              {cameraError}
            </p>
            <p className="text-xs text-slate-400">
              💡 Tutup aplikasi lain yang sedang memakai kamera lalu refresh halaman.
            </p>
          </div>
        ) : (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`w-full h-full object-cover -scale-x-100 transition-all duration-500 ${
              countdown !== null ? "backdrop-blur-xl bg-slate-950/70 scale-105" : "blur-none scale-100"
            }`}
          />
        )}

        {/* Live Shot Counter Badge */}
        {!cameraError && (
          <div className="absolute top-4 left-4 bg-slate-950/80 backdrop-blur-md px-4 py-2 rounded-full text-xs font-semibold border border-white/10 text-pink-300 flex items-center gap-2 shadow-lg z-20">
            <span className="w-2.5 h-2.5 rounded-full bg-pink-500 animate-pulse" />
            <span>Pose Foto #{currentShotIndex} dari 4</span>
          </div>
        )}

        {/* Top-Right Controls: Gesture Toggle & Audio Toggle */}
        {!cameraError && (
          <div className="absolute top-4 right-4 flex items-center gap-2 z-20">
            <button
              type="button"
              onClick={() => setGestureEnabled((v) => !v)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md border transition flex items-center gap-1.5 ${
                gestureEnabled
                  ? "bg-pink-500/20 text-pink-300 border-pink-500/40 shadow-lg shadow-pink-500/20"
                  : "bg-slate-950/80 text-slate-400 border-white/10"
              }`}
              title="Toggle Gesture Detection ✌️"
            >
              <Hand className="w-3.5 h-3.5" />
              <span>Gesture ✌️ {gestureEnabled ? "ON" : "OFF"}</span>
            </button>

            <button
              type="button"
              onClick={onToggleAudio}
              className={`p-2 rounded-full backdrop-blur-md border text-xs font-semibold transition ${
                isAudioOn
                  ? "bg-pink-500/20 text-pink-300 border-pink-500/40"
                  : "bg-slate-950/80 text-slate-400 border-white/10"
              }`}
              title="Toggle Audio BGM"
            >
              {isAudioOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>
        )}

        {/* Gesture Progress Overlay */}
        {gestureEnabled && !isCapturing && gestureStatus && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-slate-950/90 backdrop-blur-md px-4 py-2 rounded-2xl border border-pink-500/30 text-xs font-medium text-pink-300 flex items-center gap-3 shadow-xl z-20">
            <span>{gestureStatus}</span>
            {peaceProgress > 0 && (
              <div className="w-16 h-2 bg-slate-800 rounded-full overflow-hidden border border-pink-500/30">
                <div
                  className="h-full bg-gradient-to-r from-pink-500 to-rose-400 transition-all duration-100"
                  style={{ width: `${peaceProgress}%` }}
                />
              </div>
            )}
          </div>
        )}

        {/* Countdown Overlay */}
        {countdown !== null && (
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-md flex items-center justify-center z-30">
            <div className="relative flex items-center justify-center">
              <span className="text-9xl font-black text-pink-400 drop-shadow-[0_0_35px_rgba(244,114,182,0.8)] animate-ping">
                {countdown}
              </span>
              <span className="absolute text-9xl font-black text-white">
                {countdown}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Control Action Buttons */}
      {!isCapturing && (
        <div className="flex flex-wrap justify-center items-center gap-4 w-full">
          {!cameraError ? (
            <button
              onClick={onTakeSingleShot}
              className="px-8 py-4 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 font-bold text-white rounded-2xl shadow-xl shadow-pink-500/25 flex items-center gap-3 transition-transform hover:scale-105 active:scale-95 text-base"
            >
              <Camera className="w-5 h-5" /> Jepret Foto #{currentShotIndex} Sekarang
            </button>
          ) : (
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 font-semibold rounded-2xl transition flex items-center gap-2 text-sm"
            >
              <RefreshCw className="w-4 h-4" /> Coba Lagi / Refresh
            </button>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-6 py-4 bg-slate-900 hover:bg-slate-800 border border-slate-800 font-semibold text-slate-300 rounded-2xl transition flex items-center gap-2 text-sm shadow-md"
          >
            <Upload className="w-4 h-4 text-pink-400" /> Upload Foto dari Perangkat
          </button>
        </div>
      )}

      {isCapturing && (
        <div className="text-center text-xs font-semibold text-pink-400 bg-pink-500/10 px-4 py-2 rounded-full border border-pink-500/20 animate-pulse flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          <span>📸 Mengambil Foto & Merekam Live Snippet 1.5 detik...</span>
        </div>
      )}
    </div>
  );
}