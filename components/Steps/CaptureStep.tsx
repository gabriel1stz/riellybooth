"use client";

import React, { useRef, useState, useEffect } from "react";
import { Camera, Upload, AlertCircle, RefreshCw, Hand, Sparkles, Image as ImageIcon } from "lucide-react";
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
              setGestureStatus(`✌️ Pose Peace untuk Foto #${currentShotIndex}/4`);
            }
          } else {
            peaceStartTimeRef.current = null;
            setPeaceProgress(0);
            setGestureStatus(null);
          }
        } catch (err) {
          // Ignore transient detection errors
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
    <div className="w-full max-w-md sm:max-w-lg mx-auto flex flex-col items-center gap-5 px-4 py-2">
      {/* Top Header Status Pill */}
      <div className="flex items-center justify-between w-full">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-rose-100 rounded-full border border-rose-300 text-rose-600 text-xs font-black shadow-xs">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
          <span>STUDIO LIVE 🔴</span>
        </div>

        {/* Gesture Toggle Pill */}
        <button
          type="button"
          onClick={() => setGestureEnabled((v) => !v)}
          className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-300 border-2 flex items-center gap-1.5 shadow-xs ${
            gestureEnabled
              ? "bg-pink-400 text-white border-pink-500"
              : "bg-white text-slate-600 border-slate-300"
          }`}
          title="Toggle Gesture Detection ✌️"
        >
          <Hand className="w-3.5 h-3.5" />
          <span>Gesture ✌️ {gestureEnabled ? "ON" : "OFF"}</span>
        </button>
      </div>

      {/* PORTRAIT CAMERA VIEWPORT CONTAINER (ASPECT 3/4 WITH ROUNDED-[32px]) */}
      <div className="relative w-full aspect-[3/4] bg-slate-900 rounded-[32px] overflow-hidden border-4 border-pink-300 shadow-2xl flex items-center justify-center">
        {/* FLASH FX OVERLAY */}
        {flashFx && (
          <div className="absolute inset-0 bg-white z-50 animate-out fade-out duration-300 pointer-events-none" />
        )}

        {cameraError ? (
          <div className="p-6 text-center space-y-4 max-w-xs z-10 bg-white border-2 border-rose-200 rounded-3xl shadow-xl">
            <div className="p-3 bg-rose-100 rounded-full border border-rose-300 inline-block">
              <AlertCircle className="w-8 h-8 text-rose-500 mx-auto" />
            </div>
            <h4 className="text-lg font-bold text-rose-600">Kamera Tidak Tersedia</h4>
            <p className="text-xs text-slate-600 leading-relaxed bg-rose-50 p-2.5 rounded-xl border border-rose-200 font-medium">
              {cameraError}
            </p>
            <p className="text-[11px] text-slate-500">
              💡 Tutup aplikasi lain yang memakai kamera, lalu refresh halaman.
            </p>
          </div>
        ) : (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`w-full h-full object-cover -scale-x-100 transition-all duration-500 ease-in-out ${
              countdown !== null ? "blur-md scale-105" : "blur-none scale-100"
            }`}
          />
        )}

        {/* Overlaid Badge Top-Right: SHOT X / 4 */}
        {!cameraError && (
          <div className="absolute top-4 right-4 bg-slate-950/70 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-black border border-white/20 text-white flex items-center gap-1.5 shadow-lg z-20">
            <ImageIcon className="w-3.5 h-3.5 text-pink-400" />
            <span>SHOT {currentShotIndex} / 4</span>
          </div>
        )}

        {/* Gesture Progress Overlay */}
        {gestureEnabled && !isCapturing && gestureStatus && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md px-4 py-2 rounded-2xl border-2 border-pink-300 text-xs font-bold text-slate-800 flex items-center gap-2.5 shadow-xl z-20 w-[90%] justify-center text-center">
            <span>{gestureStatus}</span>
            {peaceProgress > 0 && (
              <div className="w-14 h-2 bg-slate-100 rounded-full overflow-hidden border border-pink-300">
                <div
                  className="h-full bg-pink-500 transition-all duration-100"
                  style={{ width: `${peaceProgress}%` }}
                />
              </div>
            )}
          </div>
        )}

        {/* Countdown Overlay */}
        {countdown !== null && (
          <div className="absolute inset-0 bg-white/40 backdrop-blur-md flex items-center justify-center z-30">
            <div className="relative flex items-center justify-center">
              <span className="text-9xl font-black text-pink-500 drop-shadow-md animate-ping">
                {countdown}
              </span>
              <span className="absolute text-9xl font-black text-pink-600">
                {countdown}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* SHOT PROGRESS TRACKER (CIRCULAR STEP BADGES 01, 02, 03, 04) */}
      <div className="w-full bg-white border-2 border-pink-200 rounded-2xl p-3 flex items-center justify-between shadow-sm">
        <span className="text-xs font-black text-slate-700 pl-1">Kemajuan Pose:</span>
        <div className="flex items-center gap-2 sm:gap-3">
          {[1, 2, 3, 4].map((num, idx) => {
            const isCompleted = idx < shotsCount;
            const isCurrent = idx === shotsCount;
            return (
              <div
                key={num}
                className={`relative flex items-center justify-center w-9 h-9 rounded-full text-xs font-black border-2 transition-all duration-300 ${
                  isCompleted
                    ? "bg-pink-400 border-pink-500 text-white shadow-xs"
                    : isCurrent
                    ? "bg-pink-100 border-pink-400 text-pink-700 ring-2 ring-pink-300"
                    : "bg-slate-50 border-slate-200 text-slate-400"
                }`}
              >
                <span>0{num}</span>
                {isCompleted && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-pink-500 border border-white" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* MAIN ACTION BUTTON (PROMINENT PINK ROUNDED PILL) */}
      {!isCapturing && (
        <div className="w-full space-y-2.5">
          {!cameraError ? (
            <button
              onClick={onTakeSingleShot}
              className="w-full py-4 px-6 bg-pink-400 hover:bg-pink-500 text-white font-black text-base sm:text-lg rounded-full shadow-md shadow-pink-200 border-2 border-pink-500 flex items-center justify-center gap-3 transition-all duration-300 ease-in-out hover:scale-[1.02] active:scale-[0.98]"
            >
              <Camera className="w-5 h-5" />
              <span>Ambil Foto ✌️ (Manual / Gesture)</span>
            </button>
          ) : (
            <button
              onClick={() => window.location.reload()}
              className="w-full py-3.5 bg-rose-100 hover:bg-rose-200 text-rose-700 border-2 border-rose-300 font-bold rounded-full transition flex items-center justify-center gap-2 text-sm"
            >
              <RefreshCw className="w-4 h-4" /> Coba Lagi / Refresh
            </button>
          )}

          {/* Upload Device Alternative */}
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
            className="w-full py-3 bg-white hover:bg-slate-50 border-2 border-slate-200 font-bold text-slate-700 rounded-full transition flex items-center justify-center gap-2 text-xs shadow-xs"
          >
            <Upload className="w-3.5 h-3.5 text-pink-500" /> Upload Foto dari Perangkat
          </button>
        </div>
      )}

      {isCapturing && (
        <div className="text-center text-xs font-bold text-pink-600 bg-pink-100 px-5 py-2.5 rounded-full border-2 border-pink-300 animate-pulse flex items-center gap-2 shadow-xs">
          <Sparkles className="w-4 h-4 text-pink-500" />
          <span>📸 Merekam Live Snippet & menjepret foto...</span>
        </div>
      )}

      {/* Cute Footer Tagline */}
      <p className="text-[11px] font-bold text-pink-600/80 text-center pt-1">
        rielllybooth • capture ur moments everywhere ✨
      </p>
    </div>
  );
}