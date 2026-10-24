"use client";

import React, { useRef, useState, useEffect } from "react";
import {
  Camera,
  Upload,
  AlertCircle,
  RefreshCw,
  Hand,
  Sparkles,
  Image as ImageIcon,
  SwitchCamera,
  Sliders,
  SlidersHorizontal,
  Lightbulb,
  HelpCircle,
  Smile,
  X,
  Zap,
} from "lucide-react";
import { getHandLandmarker, isPeaceSignGesture } from "@/lib/gestureUtils";
import { getFaceLandmarker, drawARFaceFilter, ARFaceFilterPreset } from "@/lib/faceFilterUtils";
import PoseIdeasModal from "@/components/PoseIdeasModal";
import CameraPermissionGuide from "@/components/CameraPermissionGuide";

type Shot = { id: number; dataUrl: string; videoBlobUrl?: string };

type CaptureStepProps = {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  arCanvasRef?: React.RefObject<HTMLCanvasElement | null>;
  isCapturing: boolean;
  countdown: number | null;
  currentShotIndex: number;
  shotsCount: number;
  shots: Shot[];
  cameraError: string | null;
  onTakeSingleShot: (
    timerDelay?: number,
    filters?: { brightness?: number; contrast?: number; beautyGlow?: number }
  ) => void;
  onUploadPhotos: (files: FileList) => void;
  flashFx: boolean;
  isAudioOn: boolean;
  onToggleAudio: () => void;
  facingMode?: "user" | "environment";
  onToggleFacingMode?: () => void;
  retakeIndex?: number | null;
  maxShots?: number;
  onToggleSessionMode?: (mode: "standard_4" | "korean_6") => void;
};

const AR_FILTER_OPTIONS: Array<{
  id: ARFaceFilterPreset;
  label: string;
  emoji: string;
}> = [
  { id: "none", label: "Polos", emoji: "❌" },
  { id: "coquette", label: "Coquette Blush", emoji: "🎀" },
  { id: "pixel", label: "Pixel Y2K", emoji: "🕶️" },
  { id: "cat", label: "Kucing", emoji: "🐱" },
  { id: "dog", label: "Puppy", emoji: "🐶" },
  { id: "strawberry", label: "Strawberry", emoji: "🍓" },
  { id: "chef", label: "Chef Hat", emoji: "👨‍🍳" },
  { id: "diving", label: "Diving Mask", emoji: "🤿" },
  { id: "santa", label: "Santa Beard", emoji: "🎅" },
];

export default function CaptureStep({
  videoRef,
  arCanvasRef,
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
  retakeIndex = null,
  maxShots = 4,
  onToggleSessionMode,
}: CaptureStepProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const localArCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const activeArCanvasRef = arCanvasRef || localArCanvasRef;

  // Shutter & Timer Trigger Mode: "gesture" | "timer_3" | "timer_5" | "instant"
  const [triggerMode, setTriggerMode] = useState<"gesture" | "timer_3" | "timer_5" | "instant">("gesture");

  // Camera Tuning Sliders State (Kecerahan ☀️ & Beauty Glow ✨)
  const [cameraBrightness, setCameraBrightness] = useState(105); // 80 - 150%
  const [cameraContrast, setCameraContrast] = useState(105); // 80 - 130%
  const [beautyGlow, setBeautyGlow] = useState(0); // 0 - 100%
  const [showTuning, setShowTuning] = useState(false);

  // AR Face Filter State
  const [arFilterPreset, setArFilterPreset] = useState<ARFaceFilterPreset>("none");
  const [showFilterPicker, setShowFilterPicker] = useState(false);

  // Modals
  const [showPoseIdeas, setShowPoseIdeas] = useState(false);
  const [showPermissionGuide, setShowPermissionGuide] = useState(false);
  const [showPreCaptureTips, setShowPreCaptureTips] = useState(true);
  const [isLowPowerMode, setIsLowPowerMode] = useState(false);

  // Gesture Detection State
  const [gestureEnabled, setGestureEnabled] = useState(true);
  const [gestureStatus, setGestureStatus] = useState<string | null>(null);
  const [peaceProgress, setPeaceProgress] = useState(0);

  const peaceStartTimeRef = useRef<number | null>(null);
  const isLockedRef = useRef(false);

  // Real-time MediaPipe Hand Detection Loop (Peace Gesture ✌️)
  useEffect(() => {
    let animFrameId: number;
    let active = true;

    if (triggerMode !== "gesture" || !gestureEnabled || isCapturing || countdown !== null || cameraError) {
      setGestureStatus(null);
      setPeaceProgress(0);
      peaceStartTimeRef.current = null;
      return;
    }

    let frameSkip = 0;
    const runDetection = async () => {
      frameSkip++;
      if (isLowPowerMode && frameSkip % 3 !== 0) {
        if (active) animFrameId = requestAnimationFrame(runDetection);
        return;
      }

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
                onTakeSingleShot(0, {
                  brightness: cameraBrightness,
                  contrast: cameraContrast,
                  beautyGlow,
                });
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
  }, [
    triggerMode,
    gestureEnabled,
    isCapturing,
    countdown,
    cameraError,
    onTakeSingleShot,
    videoRef,
    cameraBrightness,
    cameraContrast,
    beautyGlow,
    isLowPowerMode,
  ]);

  // Real-time MediaPipe 3D Face Mesh AR Filter Loop
  useEffect(() => {
    let animId: number;
    let active = true;

    if (arFilterPreset === "none" || !videoRef.current || !activeArCanvasRef.current || cameraError) {
      if (activeArCanvasRef.current) {
        const ctx = activeArCanvasRef.current.getContext("2d");
        if (ctx) ctx.clearRect(0, 0, activeArCanvasRef.current.width, activeArCanvasRef.current.height);
      }
      return;
    }

    let faceSkip = 0;
    const runFaceMesh = async () => {
      faceSkip++;
      if (isLowPowerMode && faceSkip % 2 !== 0) {
        if (active) animId = requestAnimationFrame(runFaceMesh);
        return;
      }

      const landmarker = await getFaceLandmarker();
      if (!landmarker || !videoRef.current || !activeArCanvasRef.current || !active) return;
      const video = videoRef.current;
      const canvas = activeArCanvasRef.current;

      if (video.readyState >= 2) {
        if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
          canvas.width = video.videoWidth || 1280;
          canvas.height = video.videoHeight || 720;
        }

        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          try {
            const results = landmarker.detectForVideo(video, performance.now());
            if (results.faceLandmarks && results.faceLandmarks.length > 0) {
              drawARFaceFilter(
                ctx,
                results.faceLandmarks[0],
                arFilterPreset,
                canvas.width,
                canvas.height,
                facingMode === "user"
              );
            }
          } catch (e) {
            console.warn("Face mesh loop error:", e);
          }
        }
      }

      if (active) animId = requestAnimationFrame(runFaceMesh);
    };

    runFaceMesh();

    return () => {
      active = false;
      if (animId) cancelAnimationFrame(animId);
    };
  }, [arFilterPreset, facingMode, cameraError, activeArCanvasRef, videoRef, isLowPowerMode]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onUploadPhotos(e.target.files);
    }
  };

  // Dynamic Action Button Label Generator
  const getButtonLabel = () => {
    if (countdown !== null) return `Capturing... (${countdown}s)`;
    if (isCapturing) return "Cooldown...";
    if (triggerMode === "gesture") return "Jepret Manual (3s) 📸";
    if (triggerMode === "timer_3") return "Mulai Timer 3s ⏱️";
    if (triggerMode === "timer_5") return "Mulai Timer 5s ⏱️";
    return "Jepret Instan ⚡";
  };

  const handleShutterClick = () => {
    const filters = {
      brightness: cameraBrightness,
      contrast: cameraContrast,
      beautyGlow,
    };

    if (triggerMode === "instant") {
      onTakeSingleShot(0, filters);
    } else if (triggerMode === "timer_5") {
      onTakeSingleShot(5, filters);
    } else {
      onTakeSingleShot(3, filters);
    }
  };

  return (
    <div className="w-full max-w-4xl px-2 sm:px-4 py-2 sm:py-4 flex flex-col items-center gap-3 sm:gap-4 animate-in fade-in duration-300">
      {/* Camera Snapshot Flash Screen FX */}
      {flashFx && (
        <div className="fixed inset-0 bg-white z-[100] animate-out fade-out duration-300 pointer-events-none" />
      )}

      {/* Top Header Status Badge with Shot Counter Badge */}
      <div className="w-full flex flex-wrap justify-between items-center gap-3 bg-white border-2 border-pink-200 p-3 sm:p-4 rounded-2xl shadow-sm">
        <div className="flex items-center gap-2.5">
          <span
            className={`px-3.5 py-1.5 font-extrabold text-xs sm:text-sm rounded-full shadow-xs tracking-wider ${
              retakeIndex !== null && retakeIndex !== undefined
                ? "bg-amber-500 text-white animate-pulse"
                : "bg-pink-500 text-white"
            }`}
          >
            {retakeIndex !== null && retakeIndex !== undefined
              ? `RETAKE FOTO #${retakeIndex + 1}`
              : `SHOT ${Math.min(currentShotIndex, maxShots)} / ${maxShots}`}
          </span>

          <h3 className="text-sm sm:text-base font-black text-slate-800">
            {retakeIndex !== null && retakeIndex !== undefined
              ? `Mengulang Pose #${retakeIndex + 1} ✨`
              : shotsCount < maxShots
              ? `Jepret Foto #${currentShotIndex}`
              : `Selesai ${maxShots} Pose! ✨`}
          </h3>
        </div>

        {/* Action Quick Tools: Pose Ideas + Filter Wajah + Tuning + Switch Camera */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Pose Ideas Guide Trigger */}
          <button
            type="button"
            onClick={() => setShowPoseIdeas(true)}
            className="px-3 py-1.5 rounded-xl text-xs font-black bg-amber-50 hover:bg-amber-100 text-amber-800 border-2 border-amber-300 transition flex items-center gap-1.5 shadow-xs cursor-pointer"
            title="Lihat Ide Pose"
          >
            <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
            <span>Ide Pose 💡</span>
          </button>

          {/* AR Face Filter Toggle Trigger */}
          <button
            type="button"
            onClick={() => setShowFilterPicker((v) => !v)}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition flex items-center gap-1.5 border-2 shadow-xs cursor-pointer ${
              arFilterPreset !== "none"
                ? "bg-purple-500 text-white border-purple-600 shadow-xs"
                : "bg-white text-slate-700 border-slate-300 hover:bg-purple-50"
            }`}
            title="Filter Wajah AR Props"
          >
            <Smile className="w-3.5 h-3.5" />
            <span>Filter Wajah 🎭</span>
          </button>

          {/* Camera Tuning Dropdown Trigger */}
          <button
            type="button"
            onClick={() => setShowTuning((v) => !v)}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition flex items-center gap-1.5 border-2 shadow-xs cursor-pointer ${
              showTuning
                ? "bg-pink-500 text-white border-pink-600 shadow-xs"
                : "bg-white text-slate-700 border-slate-300 hover:bg-pink-50"
            }`}
            title="Tuning Kecerahan & Glow"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Tuning ☀️</span>
          </button>

          {/* Low Power / HP Kentang Mode Toggle */}
          <button
            type="button"
            onClick={() => setIsLowPowerMode((v) => !v)}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition flex items-center gap-1.5 border-2 shadow-xs cursor-pointer ${
              isLowPowerMode
                ? "bg-amber-400 text-slate-900 border-amber-500 shadow-xs"
                : "bg-white text-slate-700 border-slate-300 hover:bg-amber-50"
            }`}
            title="Mode Hemat: Meringankan kerja HP kentang biar FPS lancar & gak panas"
          >
            <Zap className="w-3.5 h-3.5 text-amber-600" />
            <span>{isLowPowerMode ? "Hemat ON ⚡" : "Mode Hemat"}</span>
          </button>

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
              <SwitchCamera className="w-3.5 h-3.5" />
              <span>{facingMode === "user" ? "Depan 🤳" : "Belakang 📷"}</span>
            </button>
          )}

          {/* Peace Gesture Quick Toggle */}
          <button
            type="button"
            onClick={() => {
              if (triggerMode === "gesture") {
                setGestureEnabled((v) => !v);
              } else {
                setTriggerMode("gesture");
                setGestureEnabled(true);
              }
            }}
            disabled={isCapturing}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border-2 shadow-xs cursor-pointer ${
              triggerMode === "gesture" && gestureEnabled
                ? "bg-pink-400 text-white border-pink-500"
                : "bg-slate-100 text-slate-500 border-slate-300"
            }`}
          >
            <Hand className="w-3.5 h-3.5" />
            <span>Gesture ✌️ {triggerMode === "gesture" && gestureEnabled ? "ON" : "OFF"}</span>
          </button>
        </div>
      </div>

      {/* EXPANDABLE AR FACE PROPS FILTER DRAWER */}
      {showFilterPicker && (
        <div className="w-full bg-white/95 backdrop-blur-md p-3 rounded-2xl border-2 border-purple-200 shadow-md space-y-2 animate-in slide-in-from-top-2 duration-200 text-left">
          <div className="flex justify-between items-center">
            <span className="text-xs font-black text-purple-900 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              <span>Pilih Filter / Props Wajah Real-Time 🎭:</span>
            </span>
            <button
              type="button"
              onClick={() => setShowFilterPicker(false)}
              className="p-1 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {AR_FILTER_OPTIONS.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setArFilterPreset(f.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition flex items-center gap-1.5 cursor-pointer ${
                  arFilterPreset === f.id
                    ? "bg-purple-600 text-white shadow-xs"
                    : "bg-purple-50 text-purple-900 hover:bg-purple-100"
                }`}
              >
                <span>{f.emoji}</span>
                <span>{f.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* EXPANDABLE CAMERA TUNING DRAWER (BRIGHTNESS & BEAUTY GLOW SLIDERS) */}
      {showTuning && (
        <div className="w-full bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border-2 border-pink-200 shadow-md space-y-3 animate-in slide-in-from-top-2 duration-200 text-left">
          <div className="flex justify-between items-center">
            <span className="text-xs font-black text-pink-900 flex items-center gap-1">
              <Sliders className="w-3.5 h-3.5 text-pink-600" />
              <span>Tuning Kecerahan & Skin Glow Kamera:</span>
            </span>
            <button
              type="button"
              onClick={() => setShowTuning(false)}
              className="p-1 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Brightness */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold text-slate-700">
                <span>☀️ Kecerahan (Brightness):</span>
                <span>{cameraBrightness}%</span>
              </div>
              <input
                type="range"
                min="80"
                max="150"
                value={cameraBrightness}
                onChange={(e) => setCameraBrightness(Number(e.target.value))}
                className="w-full accent-pink-500"
              />
            </div>

            {/* Contrast */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold text-slate-700">
                <span>🎯 Kontras:</span>
                <span>{cameraContrast}%</span>
              </div>
              <input
                type="range"
                min="80"
                max="135"
                value={cameraContrast}
                onChange={(e) => setCameraContrast(Number(e.target.value))}
                className="w-full accent-pink-500"
              />
            </div>

            {/* Beauty Glow */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold text-slate-700">
                <span>✨ Beauty Soft Glow:</span>
                <span>{beautyGlow}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={beautyGlow}
                onChange={(e) => setBeautyGlow(Number(e.target.value))}
                className="w-full accent-pink-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* MODE SHUTTER SELECTOR TABS + SESSION MODE */}
      <div className="w-full flex flex-wrap justify-between items-center gap-2">
        {/* Shutter Trigger Mode */}
        <div className="inline-flex bg-white/95 backdrop-blur-xs p-1 rounded-2xl border-2 border-pink-200 shadow-xs gap-1 max-w-full overflow-x-auto">
          <button
            type="button"
            onClick={() => {
              setTriggerMode("gesture");
              setGestureEnabled(true);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              triggerMode === "gesture"
                ? "bg-pink-500 text-white shadow-xs"
                : "text-slate-600 hover:bg-pink-50"
            }`}
          >
            <span>✌️ Auto Peace</span>
          </button>

          <button
            type="button"
            onClick={() => setTriggerMode("timer_3")}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              triggerMode === "timer_3"
                ? "bg-pink-500 text-white shadow-xs"
                : "text-slate-600 hover:bg-pink-50"
            }`}
          >
            <span>⏱️ Timer 3s</span>
          </button>

          <button
            type="button"
            onClick={() => setTriggerMode("timer_5")}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              triggerMode === "timer_5"
                ? "bg-pink-500 text-white shadow-xs"
                : "text-slate-600 hover:bg-pink-50"
            }`}
          >
            <span>⏱️ Timer 5s</span>
          </button>

          <button
            type="button"
            onClick={() => setTriggerMode("instant")}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              triggerMode === "instant"
                ? "bg-pink-500 text-white shadow-xs"
                : "text-slate-600 hover:bg-pink-50"
            }`}
          >
            <span>⚡ Instan</span>
          </button>
        </div>

        {/* Korean Mode Switcher (Ambil 6, Pilih 4) */}
        {onToggleSessionMode && (
          <div className="inline-flex bg-white/95 p-1 rounded-2xl border-2 border-pink-200 shadow-xs gap-1">
            <button
              type="button"
              onClick={() => onToggleSessionMode("standard_4")}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer ${
                maxShots === 4
                  ? "bg-pink-500 text-white shadow-xs"
                  : "text-slate-600 hover:bg-pink-50"
              }`}
            >
              <span>4 Pose</span>
            </button>
            <button
              type="button"
              onClick={() => onToggleSessionMode("korean_6")}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer ${
                maxShots === 6
                  ? "bg-pink-500 text-white shadow-xs"
                  : "text-slate-600 hover:bg-pink-50"
              }`}
              title="Gaya photobooth Korea: ambil 6 foto lalu pilih 4 terbaik"
            >
              <span>🇰🇷 Ambil 6 (Pilih 4)</span>
            </button>
          </div>
        )}
      </div>

      {/* PRE-CAPTURE AESTHETIC TIPS BANNER */}
      {showPreCaptureTips && (
        <div className="w-full max-w-3xl bg-amber-50/95 border-2 border-amber-300 p-2.5 sm:p-3 rounded-2xl flex items-center justify-between gap-3 text-xs font-bold text-amber-950 shadow-xs animate-in fade-in duration-200">
          <div className="flex items-center gap-2 text-left">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>Tips Hasil Estetik:</strong> Posisikan wajah di tengah viewfinder, hadap sumber cahaya depan (jangan membelakangi jendela/backlight), dan senyum terbaikmu! ✨
            </span>
          </div>
          <button
            type="button"
            onClick={() => setShowPreCaptureTips(false)}
            className="p-1 hover:bg-amber-200/80 rounded-lg text-amber-800 transition shrink-0 cursor-pointer"
            title="Tutup Tips"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main WebRTC Camera Viewport Container */}
      <div className="relative w-full max-w-3xl aspect-[3/4] sm:aspect-[4/3] bg-slate-900 border-2 sm:border-4 border-pink-300 rounded-3xl overflow-hidden shadow-xl sm:shadow-2xl flex items-center justify-center">
        {cameraError ? (
          <div className="p-6 text-center space-y-3 text-white max-w-md">
            <AlertCircle className="w-12 h-12 text-rose-400 mx-auto animate-bounce" />
            <h4 className="font-black text-lg">Kamera Tidak Terhubung</h4>
            <p className="text-xs text-rose-200 font-medium leading-relaxed">
              {cameraError}
            </p>

            <div className="flex flex-col gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowPermissionGuide(true)}
                className="w-full py-2.5 px-3 bg-rose-500 hover:bg-rose-600 text-white font-extrabold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <HelpCircle className="w-4 h-4" />
                <span>Panduan Buka Izin Kamera 📱</span>
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-2.5 px-3 bg-white/20 hover:bg-white/30 text-white font-bold text-xs rounded-xl transition cursor-pointer"
              >
                <span>Upload Foto dari Galeri Saja 🖼️</span>
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Live WebRTC Camera Stream with Tuned Filters */}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              style={{
                filter: `brightness(${cameraBrightness}%) contrast(${cameraContrast}%) ${
                  beautyGlow > 0
                    ? `drop-shadow(0 0 ${beautyGlow * 0.12}px rgba(255, 180, 210, 0.45))`
                    : ""
                }`,
              }}
              className={`w-full h-full object-cover ${facingMode === "user" ? "-scale-x-100" : ""}`}
            />

            {/* Real-time AR Face Filter Overlay Canvas */}
            <canvas
              ref={activeArCanvasRef}
              className={`absolute inset-0 w-full h-full object-cover pointer-events-none z-20 ${
                facingMode === "user" ? "-scale-x-100" : ""
              }`}
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

            {/* COUNTDOWN OVERLAY */}
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

      {/* CIRCULAR STEP TRACKER THUMBNAILS (SHOT X / maxShots) */}
      <div className="flex items-center justify-center gap-2.5 py-1">
        {Array.from({ length: maxShots }).map((_, idx) => {
          const shot = shots[idx];
          const isRetakeTarget = retakeIndex === idx;
          const isActive = retakeIndex !== null ? isRetakeTarget : idx === shotsCount;
          return (
            <div key={idx} className="flex flex-col items-center gap-1">
              <div
                className={`w-11 h-11 sm:w-13 sm:h-13 rounded-full border-2 flex items-center justify-center overflow-hidden transition-all duration-300 shadow-md ${
                  isRetakeTarget
                    ? "border-amber-500 bg-amber-100 ring-4 ring-amber-300 animate-pulse scale-110"
                    : shot
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
              <span
                className={`text-[9px] sm:text-[10px] font-bold ${
                  isRetakeTarget
                    ? "text-amber-600 font-extrabold"
                    : shot
                    ? "text-pink-600"
                    : "text-slate-400"
                }`}
              >
                #{idx + 1} {isRetakeTarget ? "(Ulang)" : ""}
              </span>
            </div>
          );
        })}
      </div>

      {/* Main Control Action Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-lg">
        {/* Main Camera Shutter Trigger Button */}
        <button
          type="button"
          onClick={handleShutterClick}
          disabled={isCapturing || countdown !== null || !!cameraError}
          className="w-full py-4 bg-pink-400 hover:bg-pink-500 text-white font-black text-base sm:text-lg rounded-2xl border-4 border-pink-500 shadow-xl transition-all duration-150 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
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
          className="w-full sm:w-auto px-4 py-3 bg-white hover:bg-rose-50 text-slate-700 font-bold text-xs rounded-2xl border-2 border-pink-200 shadow-sm transition flex items-center justify-center gap-2 shrink-0 cursor-pointer"
        >
          <ImageIcon className="w-4 h-4 text-pink-500" />
          <span>Upload Galeri 🖼️</span>
        </button>
      </div>

      {/* User Helper Directive Badge */}
      <p className="text-xs text-slate-500 font-medium text-center max-w-md">
        💡 <strong className="text-pink-600">Tips:</strong>{" "}
        {triggerMode === "gesture"
          ? "Tunjukkan pose Peace (✌️) selama 1 detik di depan kamera untuk otomatis jepret!"
          : triggerMode === "timer_3"
          ? "Timer 3 detik siap! Tekan tombol jepret lalu bersiap pose estetik."
          : triggerMode === "timer_5"
          ? "Timer 5 detik memberikan waktu ekstra buat atur posisi bareng bestie!"
          : "Mode instan akan langsung mengambil foto tanpa countdown."}
      </p>

      {/* POSE IDEAS MODAL */}
      <PoseIdeasModal
        isOpen={showPoseIdeas}
        onClose={() => setShowPoseIdeas(false)}
      />

      {/* CAMERA PERMISSION GUIDE MODAL */}
      <CameraPermissionGuide
        isOpen={showPermissionGuide}
        onClose={() => setShowPermissionGuide(false)}
        onRetry={() => {
          if (onToggleFacingMode) onToggleFacingMode();
        }}
        onUploadInstead={() => fileInputRef.current?.click()}
      />
    </div>
  );
}