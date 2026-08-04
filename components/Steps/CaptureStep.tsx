"use client";

import React, { useRef, useState, useEffect } from "react";
import { Camera, Upload, AlertCircle, RefreshCw, Hand, Sparkles, Image as ImageIcon, SwitchCamera } from "lucide-react";
import { getHandLandmarker, isPeaceSignGesture } from "@/lib/gestureUtils";

type Shot = { id: number; dataUrl: string; videoBlobUrl?: string };

type CaptureStepProps = {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  isCapturing: boolean;
  countdown: number | null;
  currentShotIndex: number;
  shotsCount: number;
  shots: Shot[];
  cameraError: string | null;
  onTakeSingleShot: () => void;
  onUploadPhotos: (files: FileList) => void;
  flashFx: boolean;
  isAudioOn: boolean;
  onToggleAudio: () => void;
  facingMode?: "user" | "environment";
  onToggleFacingMode?: () => void;
};

export default function CaptureStep({
  videoRef,
  isCapturing,
  countdown,
  currentShotIndex,
  shotsCount,
  shots,
  cameraError,
  onTakeSingleShot,
  onUploadPhotos,
  flashFx,
  isAudioOn,
  onToggleAudio,
  facingMode = "user",
  onToggleFacingMode,
}: CaptureStepProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Gesture Detection State
  const [gestureEnabled, setGestureEnabled] = useState(true);
  const [gestureStatus, setGestureStatus] = useState<string | null>(null);
  const [peaceProgress, setPeaceProgress] = useState(0);

  const peaceStartTimeRef = useRef<number | null>(null);
  const isLockedRef = useRef(false);

  // MediaPipe Hand Detection Loop (Streamlined Peace Trigger ✌️ - 1 Second)
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

      if (video.readyState >= 2) {
        try {
          const results = landmarker.detectForVideo(video, performance.now());

          if (results.landmarks && results.landmarks.length > 0) {
            const handLandmarks = results.landmarks[0];
            const isPeace = isPeaceSignGesture(handLandmarks);

            if (isPeace && !isLockedRef.current) {
              setGestureStatus("Pose Peace Terdeteksi! Tahan 1 detik ✌️");

              if (!peaceStartTimeRef.current) {
                peaceStartTimeRef.current = performance.now();
              }

              const elapsed = performance.now() - peaceStartTimeRef.current;
              const progress = Math.min((elapsed / 1000) * 100, 100);
              setPeaceProgress(progress);

              if (elapsed >= 1000) {
                isLockedRef.current = true;
                setPeaceProgress(100);
                setGestureStatus("Jepret! 📸");
                onTakeSingleShot();
              }
            } else if (!isPeace) {
              peaceStartTimeRef.current = null;
              setPeaceProgress(0);
              setGestureStatus(null);
              isLockedRef.current = false;
            }
          } else {
            peaceStartTimeRef.current = null;
            setPeaceProgress(0);
            setGestureStatus(null);
            isLockedRef.current = false;
          }
        } catch (err) {
          console.warn("Gesture recognition loop error:", err);
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
  }, [gestureEnabled, isCapturing, countdown, cameraError, onTakeSingleShot, videoRef]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onUploadPhotos(e.target.files);
    }
  };

  // Dynamic Action Button Label Generator
  const getButtonLabel = () => {
    if (countdown !== null) return `Capturing... (${countdown}s)`;
    if (isCapturing) return "Cooldown...";
    return `Jepret Manual (3s) 📸`;
  };

  return (
    <div className="w-full max-w-4xl px-2 sm:px-4 py-2 sm:py-4 flex flex-col items-center gap-4 sm:gap-6 animate-in fade-in duration-300">
      {/* Camera Snapshot Flash Screen FX */}
      {flashFx && (
        <div className="fixed inset-0 bg-white z-[100] animate-out fade-out duration-300 pointer-events-none" />
      )}

      {/* Loading Transition Screen Overlay when completing 4 shots */}
      {shotsCount === 4 && (
        <div className="fixed inset-0 bg-rose-50/95 backdrop-blur-md z-[90] flex flex-col items-center justify-center p-6 text-center space-y-4 animate-in fade-in duration-300">
          <Sparkles className="w-12 h-12 text-pink-500 animate-spin" />
          <h3 className="text-2xl font-black text-slate-800">Memuat Review Foto... ✨</h3>
          <p className="text-xs text-slate-600 font-medium">Menyusun 4 pose foto terbaikmu ke Studio Review!</p>
        </div>
      )}

      {/* Top Header Status Badge with Shot Counter Badge */}
      <div className="w-full flex flex-wrap justify-between items-center gap-3 bg-white border-2 border-pink-200 p-3 sm:p-4 rounded-2xl shadow-sm">
        <div className="flex items-center gap-3">
          <span className="px-3.5 py-1.5 bg-pink-500 text-white font-extrabold text-xs sm:text-sm rounded-full shadow-xs tracking-wider">
            SHOT {Math.min(currentShotIndex, 4)} / 4
          </span>
          <h3 className="text-base sm:text-lg font-black text-slate-800">
            {shotsCount < 4 ? `Jepret Foto #${currentShotIndex}` : "Selesai 4 Pose! ✨"}
          </h3>
        </div>

        <div className="flex items-center gap-2">
          {/* Front/Back Camera Switcher Toggle */}
          {onToggleFacingMode && (
            <button
              type="button"
              onClick={onToggleFacingMode}
              disabled={isCapturing}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border-2 shadow-xs ${
                facingMode === "environment"
                  ? "bg-purple-500 text-white border-purple-600"
                  : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
              }`}
              title="Ganti Kamera Depan / Belakang"
            >
              <SwitchCamera className="w-4 h-4" />
              <span>Kamera {facingMode === "user" ? "Depan 🤳" : "Belakang 📷"}</span>
            </button>
          )}

          {/* Peace Gesture Toggle */}
          <button
            type="button"
            onClick={() => setGestureEnabled((v) => !v)}
            disabled={isCapturing}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border-2 shadow-xs ${
              gestureEnabled
                ? "bg-pink-400 text-white border-pink-500"
                : "bg-slate-100 text-slate-500 border-slate-300"
            }`}
          >
            <Hand className="w-4 h-4" />
            <span>Gesture ✌️ {gestureEnabled ? "ON" : "OFF"}</span>
          </button>
        </div>
      </div>

      {/* Main WebRTC Camera Viewport Container (EXTRA LARGE MOBILE VIEWPORT) */}
      <div className="relative w-full max-w-3xl aspect-[3/4] sm:aspect-[4/3] bg-slate-900 border-2 sm:border-4 border-pink-300 rounded-3xl overflow-hidden shadow-xl sm:shadow-2xl flex items-center justify-center">
        {cameraError ? (
          <div className="p-6 text-center space-y-3 text-white max-w-md">
            <AlertCircle className="w-12 h-12 text-rose-400 mx-auto animate-bounce" />
            <h4 className="font-black text-lg">Kamera Tidak Terhubung</h4>
            <p className="text-xs text-rose-200 font-medium leading-relaxed">
              {cameraError}
            </p>
            <p className="text-[11px] text-slate-300">
              Pastikan Anda mengizinkan akses webcam pada browser atau unggah foto manual dari galeri perangkat.
            </p>
          </div>
        ) : (
          <>
            {/* Live WebRTC Camera Stream */}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover ${facingMode === "user" ? "-scale-x-100" : ""}`}
            />

            {/* Gesture Progress Overlay */}
            {gestureStatus && (
              <div className="absolute top-4 inset-x-4 z-20 flex flex-col items-center gap-1">
                <div className="px-4 py-2 bg-slate-900/80 backdrop-blur-md border border-pink-400 text-white text-xs font-black rounded-full shadow-lg flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-pink-400 animate-spin" />
                  <span>{gestureStatus}</span>
                </div>
                {peaceProgress > 0 && (
                  <div className="w-48 bg-slate-800/80 rounded-full h-2 overflow-hidden border border-pink-400/50 mt-1">
                    <div
                      className="bg-pink-400 h-full transition-all duration-75"
                      style={{ width: `${peaceProgress}%` }}
                    />
                  </div>
                )}
              </div>
            )}

            {/* CLEAN BACKDROP BLUR & COUNTDOWN OVERLAY (NO "SMILE!" COOLDOWN TEXT) */}
            {countdown !== null && (
              <div className="absolute inset-0 backdrop-blur-2xl bg-slate-950/70 transition-all duration-500 z-30 flex flex-col items-center justify-center gap-3">
                <span className="text-8xl sm:text-9xl font-black text-white drop-shadow-[0_10px_10px_rgba(0,0,0,0.8)] animate-ping">
                  {countdown}
                </span>
              </div>
            )}
          </>
        )}
      </div>

      {/* CIRCULAR STEP TRACKER THUMBNAILS (SHOT X / 4 & PROGRESS THUMBNAILS BENEATH VIDEO) */}
      <div className="flex items-center justify-center gap-3 py-1">
        {[0, 1, 2, 3].map((idx) => {
          const shot = shots[idx];
          const isActive = idx === shotsCount;
          return (
            <div key={idx} className="flex flex-col items-center gap-1">
              <div
                className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 flex items-center justify-center overflow-hidden transition-all duration-300 shadow-md ${
                  shot
                    ? "border-pink-500 bg-white scale-105"
                    : isActive
                    ? "border-pink-400 bg-pink-100 ring-4 ring-pink-200 animate-pulse"
                    : "border-slate-300 bg-slate-100 text-slate-400"
                }`}
              >
                {shot ? (
                  <img src={shot.dataUrl} alt={`Thumb #${idx + 1}`} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xs font-black">0{idx + 1}</span>
                )}
              </div>
              <span className={`text-[10px] font-bold ${shot ? "text-pink-600" : "text-slate-400"}`}>
                #{idx + 1}
              </span>
            </div>
          );
        })}
      </div>

      {/* Main Control Action Bar (Dynamic Button Label) */}
      <div className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-lg">
        {/* Main Camera Shutter Trigger Button */}
        <button
          type="button"
          onClick={onTakeSingleShot}
          disabled={isCapturing || countdown !== null || !!cameraError}
          className="w-full py-4 bg-pink-400 hover:bg-pink-500 text-white font-black text-base sm:text-lg rounded-2xl border-4 border-pink-500 shadow-xl transition-all duration-150 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <Camera className="w-6 h-6 animate-pulse" />
          <span>{getButtonLabel()}</span>
        </button>

        {/* Manual Gallery Upload Option */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="w-full sm:w-auto px-4 py-3 bg-white hover:bg-rose-50 text-slate-700 font-bold text-xs rounded-2xl border-2 border-pink-200 shadow-sm transition flex items-center justify-center gap-2 shrink-0"
        >
          <ImageIcon className="w-4 h-4 text-pink-500" />
          <span>Upload Galeri 🖼️</span>
        </button>
      </div>

      {/* User Helper Directive Badge */}
      <p className="text-xs text-slate-500 font-medium text-center max-w-md">
        💡 <strong className="text-pink-600">Tips:</strong> Tunjukkan pose Peace (✌️) selama 1 detik di depan kamera untuk otomatis jepret!
      </p>
    </div>
  );
}