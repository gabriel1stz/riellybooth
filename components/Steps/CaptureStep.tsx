"use client";

import React, { useRef, useState, useEffect } from "react";
import { Camera, Upload, AlertCircle, RefreshCw, Hand, Sparkles, Image as ImageIcon, SwitchCamera } from "lucide-react";
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
  facingMode?: "user" | "environment";
  onToggleFacingMode?: () => void;
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

      if (video.readyState >= 2) {
        try {
          const results = landmarker.detectForVideo(video, performance.now());

          if (results.landmarks && results.landmarks.length > 0) {
            const handLandmarks = results.landmarks[0];
            const isPeace = isPeaceSignGesture(handLandmarks);

            if (isPeace && !isLockedRef.current) {
              setGestureStatus("Pose Peace Terdeteksi! Tahan 1.5 detik ✌️");

              if (!peaceStartTimeRef.current) {
                peaceStartTimeRef.current = performance.now();
              }

              const elapsed = performance.now() - peaceStartTimeRef.current;
              const progress = Math.min((elapsed / 1500) * 100, 100);
              setPeaceProgress(progress);

              if (elapsed >= 1500) {
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
        } catch (e) {
          // Silent fallback for detection errors
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
  }, [gestureEnabled, isCapturing, countdown, cameraError, onTakeSingleShot]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onUploadPhotos(e.target.files);
    }
  };

  return (
    <div className="w-full max-w-4xl px-4 py-4 space-y-6 flex flex-col items-center">
      {/* Flash FX Overlay */}
      {flashFx && (
        <div className="fixed inset-0 bg-white z-[100] animate-out fade-out duration-300 pointer-events-none" />
      )}

      {/* Top Header Status Badge */}
      <div className="w-full flex flex-wrap justify-between items-center gap-3 bg-white border-2 border-pink-200 p-4 rounded-2xl shadow-sm">
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 bg-pink-100 border border-pink-300 text-pink-700 font-extrabold text-xs rounded-full">
            Pose #{currentShotIndex} / 4
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

      {/* Main WebRTC Camera Viewport Container */}
      <div className="relative w-full max-w-2xl aspect-[4/3] bg-slate-900 border-4 border-pink-300 rounded-3xl overflow-hidden shadow-2xl flex items-center justify-center">
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

            {/* 3-2-1 Countdown Overlay */}
            {countdown !== null && (
              <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs z-30 flex items-center justify-center animate-in zoom-in duration-200">
                <span className="text-8xl font-black text-white drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)] animate-ping">
                  {countdown}
                </span>
              </div>
            )}
          </>
        )}
      </div>

      {/* Primary Action Buttons Bar */}
      <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
        <button
          type="button"
          onClick={onTakeSingleShot}
          disabled={isCapturing || !!cameraError}
          className="px-10 py-4 bg-pink-400 hover:bg-pink-500 text-white font-black text-lg rounded-2xl border-2 border-pink-500 shadow-xl flex items-center gap-3 transition hover:scale-105 active:scale-95 disabled:opacity-50"
        >
          <Camera className="w-6 h-6" />
          <span>Jepret Pose #{currentShotIndex} 📸</span>
        </button>

        {/* Hidden Upload Manual Input */}
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
          disabled={isCapturing}
          className="px-6 py-4 bg-white hover:bg-rose-50 text-slate-700 font-bold text-sm rounded-2xl border-2 border-pink-200 shadow-md flex items-center gap-2 transition hover:scale-105 active:scale-95"
        >
          <Upload className="w-5 h-5 text-pink-500" />
          <span>Upload 4 Foto</span>
        </button>
      </div>
    </div>
  );
}