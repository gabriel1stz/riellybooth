"use client";

import React, { useRef, useState, useEffect } from "react";
import { Camera, Upload, AlertCircle, RefreshCw, Volume2, VolumeX, Hand, Sparkles } from "lucide-react";
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
    <div className="w-full max-w-5xl flex flex-col items-center gap-6 px-4">
      {/* Step Guide Banner */}
      <div className="w-full bg-white border-2 border-pink-200 rounded-3xl p-5 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-pink-100 border border-pink-300 rounded-2xl text-pink-600 font-black text-base">
            #{currentShotIndex} / 4
          </div>
          <div>
            <h4 className="text-base font-black text-slate-800">
              {shotsCount === 0 && "Pose ✌️ untuk mengambil Foto #1"}
              {shotsCount === 1 && "Bagus! Pose ✌️ lagi untuk Foto #2"}
              {shotsCount === 2 && "Keren! Pose ✌️ lagi untuk Foto #3"}
              {shotsCount === 3 && "Terakhir! Pose ✌️ untuk Foto #4"}
              {shotsCount >= 4 && "Selesai! Memproses foto..."}
            </h4>
            <p className="text-xs text-slate-500 font-medium">
              Setiap gesture ✌️ mengambil 1 foto. Kumpulkan 4 pose terbaikmu!
            </p>
          </div>
        </div>

        {/* 4 Dots Progress Indicator */}
        <div className="flex items-center gap-2">
          {[0, 1, 2, 3].map((idx) => (
            <div
              key={idx}
              className={`w-3.5 h-3.5 rounded-full transition-all duration-300 ${
                idx < shotsCount
                  ? "bg-pink-500 ring-2 ring-pink-300"
                  : idx === shotsCount
                  ? "bg-pink-400 animate-ping"
                  : "bg-slate-200"
              }`}
            />
          ))}
        </div>
      </div>

      {/* EXPANDED max-w-5xl VIDEO VIEWPORT CONTAINER */}
      <div className="relative w-full aspect-video bg-slate-900 rounded-3xl overflow-hidden border-4 border-pink-300 shadow-2xl flex items-center justify-center">
        {/* FLASH FX OVERLAY */}
        {flashFx && (
          <div className="absolute inset-0 bg-white z-50 animate-out fade-out duration-300 pointer-events-none" />
        )}

        {cameraError ? (
          <div className="p-8 text-center space-y-4 max-w-md z-10 bg-white border-2 border-rose-200 rounded-3xl shadow-xl">
            <div className="p-4 bg-rose-100 rounded-full border border-rose-300 inline-block">
              <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
            </div>
            <h4 className="text-xl font-bold text-rose-600">Kamera Tidak Tersedia</h4>
            <p className="text-xs text-slate-600 leading-relaxed bg-rose-50 p-3 rounded-xl border border-rose-200 font-medium">
              {cameraError}
            </p>
            <p className="text-xs text-slate-500">
              💡 Tutup aplikasi lain yang sedang memakai kamera lalu refresh halaman.
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

        {/* Live Shot Counter Badge */}
        {!cameraError && (
          <div className="absolute top-5 left-5 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full text-xs font-bold border border-pink-200 text-pink-600 flex items-center gap-2 shadow-md z-20">
            <span className="w-2.5 h-2.5 rounded-full bg-pink-500 animate-pulse" />
            <span>Pose Foto #{currentShotIndex} dari 4</span>
          </div>
        )}

        {/* Top-Right Controls: Gesture Toggle & Audio Toggle */}
        {!cameraError && (
          <div className="absolute top-5 right-5 flex items-center gap-2 z-20">
            <button
              type="button"
              onClick={() => setGestureEnabled((v) => !v)}
              className={`px-4 py-2 rounded-full text-xs font-bold backdrop-blur-md border-2 transition-all duration-300 ease-in-out flex items-center gap-1.5 shadow-md ${
                gestureEnabled
                  ? "bg-pink-400 text-white border-pink-500"
                  : "bg-white/90 text-slate-600 border-slate-300"
              }`}
              title="Toggle Gesture Detection ✌️"
            >
              <Hand className="w-4 h-4" />
              <span>Gesture ✌️ {gestureEnabled ? "ON" : "OFF"}</span>
            </button>

            <button
              type="button"
              onClick={onToggleAudio}
              className={`p-2.5 rounded-full backdrop-blur-md border-2 text-xs font-bold transition-all duration-300 ease-in-out shadow-md ${
                isAudioOn
                  ? "bg-pink-400 text-white border-pink-500"
                  : "bg-white/90 text-slate-600 border-slate-300"
              }`}
              title="Toggle Audio BGM"
            >
              {isAudioOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>
        )}

        {/* Gesture Progress Overlay */}
        {gestureEnabled && !isCapturing && gestureStatus && (
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md px-5 py-2.5 rounded-2xl border-2 border-pink-300 text-xs font-bold text-slate-800 flex items-center gap-3 shadow-xl z-20">
            <span>{gestureStatus}</span>
            {peaceProgress > 0 && (
              <div className="w-20 h-2.5 bg-slate-100 rounded-full overflow-hidden border border-pink-300">
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

      {/* Control Action Buttons */}
      {!isCapturing && (
        <div className="flex flex-wrap justify-center items-center gap-4 w-full">
          {!cameraError ? (
            <button
              onClick={onTakeSingleShot}
              className="px-10 py-4.5 bg-pink-400 hover:bg-pink-500 font-black text-white text-lg rounded-3xl shadow-md border-2 border-pink-500 flex items-center gap-3 transition-all duration-300 ease-in-out hover:scale-105 active:scale-95"
            >
              <Camera className="w-6 h-6" /> Jepret Foto #{currentShotIndex} Sekarang
            </button>
          ) : (
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-4 bg-rose-100 hover:bg-rose-200 text-rose-700 border-2 border-rose-300 font-bold rounded-2xl transition flex items-center gap-2 text-sm shadow-xs"
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
            className="px-8 py-4.5 bg-white hover:bg-slate-50 border-2 border-slate-300 font-bold text-slate-700 rounded-3xl transition-all duration-300 ease-in-out flex items-center gap-2 text-base shadow-sm"
          >
            <Upload className="w-5 h-5 text-pink-500" /> Upload Foto dari Perangkat
          </button>
        </div>
      )}

      {isCapturing && (
        <div className="text-center text-xs font-bold text-pink-600 bg-pink-100 px-5 py-2.5 rounded-full border-2 border-pink-300 animate-pulse flex items-center gap-2 shadow-xs">
          <Sparkles className="w-4 h-4" />
          <span>📸 Mengambil Foto & Merekam Live Snippet 1.5 detik...</span>
        </div>
      )}
    </div>
  );
}