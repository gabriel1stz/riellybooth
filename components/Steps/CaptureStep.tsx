"use client";

import React, { useRef, useState, useEffect } from "react";
import {
  Camera,
  AlertCircle,
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
  Volume2,
  VolumeX,
  Check,
} from "lucide-react";
import { getHandLandmarker, isPeaceSignGesture } from "@/lib/gestureUtils";
import { getFaceLandmarker, drawARFaceFilter, ARFaceFilterPreset } from "@/lib/faceFilterUtils";
import PoseIdeasModal from "@/components/PoseIdeasModal";
import CameraPermissionGuide from "@/components/CameraPermissionGuide";

type Shot = { id: number; dataUrl: string; videoBlobUrl?: string };

type CaptureStepProps = {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  arCanvasRef?: React.RefObject<HTMLCanvasElement | null>;
  remoteStream?: MediaStream | null;
  remoteVideoRef?: React.RefObject<HTMLVideoElement | null>;
  ldrStatusMessage?: string | null;
  onDisconnectLDR?: () => void;
  isCapturing: boolean;
  countdown: number | null;
  currentShotIndex: number;
  shotsCount: number;
  shots: Shot[];
  cameraError: string | null;
  onTakeSingleShot: (
    timerDelay?: number,
    filters?: { brightness?: number; contrast?: number; beautyGlow?: number },
    remoteVideoEl?: HTMLVideoElement | null
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
  remoteStream,
  remoteVideoRef,
  ldrStatusMessage,
  onDisconnectLDR,
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

  const fallbackRemoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const activeRemoteVideoRef = remoteVideoRef || fallbackRemoteVideoRef;

  useEffect(() => {
    if (activeRemoteVideoRef.current && remoteStream) {
      activeRemoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream, activeRemoteVideoRef]);

  // Shutter & Timer Trigger Mode: "gesture" | "timer_3" | "timer_5" | "instant"
  const [triggerMode, setTriggerMode] = useState<"gesture" | "timer_3" | "timer_5" | "instant">("gesture");

  // Camera Tuning Sliders State (Kecerahan ☀️ & Beauty Glow ✨)
  const [cameraBrightness, setCameraBrightness] = useState(105);
  const [cameraContrast, setCameraContrast] = useState(105);
  const [beautyGlow, setBeautyGlow] = useState(0);
  const [showTuning, setShowTuning] = useState(false);

  // AR Face Filter State
  const [arFilterPreset, setArFilterPreset] = useState<ARFaceFilterPreset>("none");
  const [showFilterPicker, setShowFilterPicker] = useState(false);

  // Modals
  const [showPoseIdeas, setShowPoseIdeas] = useState(false);
  const [showPermissionGuide, setShowPermissionGuide] = useState(false);
  const [isLowPowerMode, setIsLowPowerMode] = useState(false);

  // Gesture Detection State
  const [gestureEnabled, setGestureEnabled] = useState(true);
  const [gestureStatus, setGestureStatus] = useState<string | null>(null);
  const [peaceProgress, setPeaceProgress] = useState(0);

  const peaceStartTimeRef = useRef<number | null>(null);
  const isLockedRef = useRef(false);

  useEffect(() => {
    if (remoteVideoRef?.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
      remoteVideoRef.current.play().catch((e) => console.warn("Remote video play error:", e));
    }
  }, [remoteStream, remoteVideoRef]);

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
                const remoteEl = remoteStream && remoteVideoRef?.current ? remoteVideoRef.current : null;
                onTakeSingleShot(
                  0,
                  {
                    brightness: cameraBrightness,
                    contrast: cameraContrast,
                    beautyGlow,
                  },
                  remoteEl
                );
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

  const getButtonLabel = () => {
    if (countdown !== null) return `Capturing (${countdown}s)...`;
    if (isCapturing) return "Memproses...";
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
    const remoteEl = remoteStream && remoteVideoRef?.current ? remoteVideoRef.current : null;

    if (triggerMode === "instant") {
      onTakeSingleShot(0, filters, remoteEl);
    } else if (triggerMode === "timer_5") {
      onTakeSingleShot(5, filters, remoteEl);
    } else {
      onTakeSingleShot(3, filters, remoteEl);
    }
  };

  return (
    <div className="w-full max-w-4xl px-3 sm:px-4 py-2 sm:py-4 flex flex-col items-center gap-4 animate-in fade-in duration-300">
      {/* Camera Snapshot Flash Screen FX */}
      {flashFx && (
        <div className="fixed inset-0 bg-white z-[100] animate-out fade-out duration-300 pointer-events-none" />
      )}

      {/* LDR Mode Active Status Banner */}
      {(remoteStream || ldrStatusMessage) && (
        <div className="w-full max-w-3xl bg-gradient-to-r from-[#E84D91] to-[#F48FB1] text-white px-4 py-2.5 rounded-2xl flex items-center justify-between shadow-paper border-2 border-white/60 animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-white" />
            </span>
            <span className="text-xs sm:text-sm font-heading font-bold tracking-wide">
              {ldrStatusMessage || "Mode Jarak Jauh (LDR) Aktif 💖 Dua Perangkat Terhubung!"}
            </span>
          </div>
          {onDisconnectLDR && (
            <button
              type="button"
              onClick={onDisconnectLDR}
              className="px-3 py-1 bg-white/20 hover:bg-white/30 text-white text-xs font-heading font-bold rounded-xl transition cursor-pointer border border-white/40"
            >
              Tutup Sesi
            </button>
          )}
        </div>
      )}

      {/* Top Header Status Card */}
      <div className="w-full flex flex-wrap justify-between items-center gap-3 scrapbook-paper p-3.5 sm:p-4 shadow-paper">
        <div className="flex items-center gap-2.5">
          <span
            className={`px-3.5 py-1 font-heading font-bold text-xs sm:text-sm rounded-full shadow-xs tracking-wider ${
              retakeIndex !== null && retakeIndex !== undefined
                ? "bg-amber-500 text-white animate-pulse"
                : "bg-[#E84D91] text-white"
            }`}
          >
            {retakeIndex !== null && retakeIndex !== undefined
              ? `RETAKE #${retakeIndex + 1}`
              : `SHOT ${Math.min(currentShotIndex, maxShots)} / ${maxShots}`}
          </span>

          <h3 className="text-sm sm:text-base font-heading font-bold text-[#392633]">
            {retakeIndex !== null && retakeIndex !== undefined
              ? `Ulang Pose #${retakeIndex + 1} ✨`
              : shotsCount < maxShots
              ? `Jepret Foto #${currentShotIndex}`
              : `Selesai ${maxShots} Pose! ✨`}
          </h3>
        </div>

        {/* Quick Toolbar: Pose Ideas, Face Filter, Tuning, Low Power, Switch Camera */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Pose Ideas Guide Trigger */}
          <button
            type="button"
            onClick={() => setShowPoseIdeas(true)}
            className="px-3 py-1.5 rounded-xl text-xs font-heading font-bold bg-[#FFF0F4] hover:bg-[#F8D8E3] text-[#E84D91] border border-[#E9B8CA] transition flex items-center gap-1.5 shadow-xs cursor-pointer"
            title="Lihat Ide Pose"
          >
            <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
            <span>Ide Pose</span>
          </button>

          {/* AR Face Filter Toggle Trigger */}
          <button
            type="button"
            onClick={() => setShowFilterPicker((v) => !v)}
            className={`px-3 py-1.5 rounded-xl text-xs font-heading font-bold transition flex items-center gap-1.5 border shadow-xs cursor-pointer ${
              arFilterPreset !== "none"
                ? "bg-[#E84D91] text-white border-[#E84D91]"
                : "bg-white text-[#392633] border-[#E9B8CA] hover:bg-[#FFF0F4]"
            }`}
            title="Filter Wajah AR Props"
          >
            <Smile className="w-3.5 h-3.5" />
            <span>Props Wajah 🎭</span>
          </button>

          {/* Camera Tuning Dropdown Trigger */}
          <button
            type="button"
            onClick={() => setShowTuning((v) => !v)}
            className={`px-3 py-1.5 rounded-xl text-xs font-heading font-bold transition flex items-center gap-1.5 border shadow-xs cursor-pointer ${
              showTuning
                ? "bg-[#E84D91] text-white border-[#E84D91]"
                : "bg-white text-[#392633] border-[#E9B8CA] hover:bg-[#FFF0F4]"
            }`}
            title="Tuning Kecerahan & Glow"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Tuning ☀️</span>
          </button>

          {/* Low Power Mode Toggle */}
          <button
            type="button"
            onClick={() => setIsLowPowerMode((v) => !v)}
            className={`px-3 py-1.5 rounded-xl text-xs font-heading font-bold transition flex items-center gap-1.5 border shadow-xs cursor-pointer ${
              isLowPowerMode
                ? "bg-amber-400 text-[#392633] border-amber-500"
                : "bg-white text-[#392633] border-[#E9B8CA] hover:bg-amber-50"
            }`}
            title="Mode Hemat: Meringankan kerja kamera biar lancar"
          >
            <Zap className="w-3.5 h-3.5 text-amber-600" />
            <span>{isLowPowerMode ? "Hemat ON ⚡" : "Hemat"}</span>
          </button>

          {/* Front/Back Camera Switcher */}
          {onToggleFacingMode && (
            <button
              type="button"
              onClick={onToggleFacingMode}
              disabled={isCapturing}
              className="px-3 py-1.5 rounded-xl text-xs font-heading font-bold transition flex items-center gap-1.5 border border-[#E9B8CA] bg-white text-[#392633] hover:bg-[#FFF0F4] shadow-xs cursor-pointer"
              title="Ganti Kamera Depan / Belakang"
            >
              <SwitchCamera className="w-3.5 h-3.5 text-[#E84D91]" />
              <span>{facingMode === "user" ? "Depan 🤳" : "Belakang 📷"}</span>
            </button>
          )}

          {/* Gesture Toggle */}
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
            className={`px-3 py-1.5 rounded-xl text-xs font-heading font-bold transition flex items-center gap-1.5 border shadow-xs cursor-pointer ${
              triggerMode === "gesture" && gestureEnabled
                ? "bg-[#E84D91] text-white border-[#E84D91]"
                : "bg-stone-100 text-stone-500 border-stone-300"
            }`}
          >
            <Hand className="w-3.5 h-3.5" />
            <span>Peace ✌️ {triggerMode === "gesture" && gestureEnabled ? "ON" : "OFF"}</span>
          </button>
        </div>
      </div>

      {/* AR FACE PROPS FILTER DRAWER */}
      {showFilterPicker && (
        <div className="w-full bg-[#FFF9F0] p-3 rounded-2xl border-2 border-[#E9B8CA] shadow-paper space-y-2 animate-in slide-in-from-top-2 duration-200 text-left">
          <div className="flex justify-between items-center">
            <span className="text-xs font-heading font-bold text-[#E84D91] flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[#E84D91]" />
              <span>Pilih Filter / Props Wajah Real-Time 🎭:</span>
            </span>
            <button
              type="button"
              onClick={() => setShowFilterPicker(false)}
              className="p-1 text-[#8B7180] hover:text-[#392633] cursor-pointer"
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
                className={`px-3 py-1.5 rounded-xl text-xs font-heading font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  arFilterPreset === f.id
                    ? "bg-[#E84D91] text-white shadow-xs"
                    : "bg-[#FFF0F4] text-[#392633] border border-[#E9B8CA] hover:bg-[#F8D8E3]"
                }`}
              >
                <span>{f.emoji}</span>
                <span>{f.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* CAMERA TUNING DRAWER (BRIGHTNESS & BEAUTY GLOW) */}
      {showTuning && (
        <div className="w-full bg-[#FFF9F0] p-3.5 rounded-2xl border-2 border-[#E9B8CA] shadow-paper space-y-3 animate-in slide-in-from-top-2 duration-200 text-left">
          <div className="flex justify-between items-center">
            <span className="text-xs font-heading font-bold text-[#E84D91] flex items-center gap-1">
              <Sliders className="w-3.5 h-3.5 text-[#E84D91]" />
              <span>Tuning Kecerahan & Skin Glow Kamera:</span>
            </span>
            <button
              type="button"
              onClick={() => setShowTuning(false)}
              className="p-1 text-[#8B7180] hover:text-[#392633] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-sans font-bold text-[#392633]">
                <span>☀️ Kecerahan:</span>
                <span>{cameraBrightness}%</span>
              </div>
              <input
                type="range"
                min="80"
                max="150"
                value={cameraBrightness}
                onChange={(e) => setCameraBrightness(Number(e.target.value))}
                className="w-full accent-[#E84D91]"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-sans font-bold text-[#392633]">
                <span>🎯 Kontras:</span>
                <span>{cameraContrast}%</span>
              </div>
              <input
                type="range"
                min="80"
                max="135"
                value={cameraContrast}
                onChange={(e) => setCameraContrast(Number(e.target.value))}
                className="w-full accent-[#E84D91]"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-sans font-bold text-[#392633]">
                <span>✨ Beauty Soft Glow:</span>
                <span>{beautyGlow}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={beautyGlow}
                onChange={(e) => setBeautyGlow(Number(e.target.value))}
                className="w-full accent-[#E84D91]"
              />
            </div>
          </div>
        </div>
      )}

      {/* MODE SHUTTER SELECTOR TABS + SESSION MODE */}
      <div className="w-full flex flex-wrap justify-between items-center gap-2">
        {/* Trigger mode pills */}
        <div className="inline-flex bg-[#FFF9F0] p-1 rounded-2xl border-2 border-[#E9B8CA] shadow-xs gap-1 max-w-full overflow-x-auto">
          <button
            type="button"
            onClick={() => {
              setTriggerMode("gesture");
              setGestureEnabled(true);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-heading font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              triggerMode === "gesture"
                ? "bg-[#E84D91] text-white shadow-xs"
                : "text-[#8B7180] hover:bg-[#FFF0F4]"
            }`}
          >
            <span>✌️ Auto Peace</span>
          </button>

          <button
            type="button"
            onClick={() => setTriggerMode("timer_3")}
            className={`px-3 py-1.5 rounded-xl text-xs font-heading font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              triggerMode === "timer_3"
                ? "bg-[#E84D91] text-white shadow-xs"
                : "text-[#8B7180] hover:bg-[#FFF0F4]"
            }`}
          >
            <span>⏱️ Timer 3s</span>
          </button>

          <button
            type="button"
            onClick={() => setTriggerMode("timer_5")}
            className={`px-3 py-1.5 rounded-xl text-xs font-heading font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              triggerMode === "timer_5"
                ? "bg-[#E84D91] text-white shadow-xs"
                : "text-[#8B7180] hover:bg-[#FFF0F4]"
            }`}
          >
            <span>⏱️ Timer 5s</span>
          </button>

          <button
            type="button"
            onClick={() => setTriggerMode("instant")}
            className={`px-3 py-1.5 rounded-xl text-xs font-heading font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              triggerMode === "instant"
                ? "bg-[#E84D91] text-white shadow-xs"
                : "text-[#8B7180] hover:bg-[#FFF0F4]"
            }`}
          >
            <span>⚡ Instan</span>
          </button>
        </div>

        {/* Korean Mode Switcher (4 Pose vs Ambil 6 Pilih 4) */}
        {onToggleSessionMode && (
          <div className="inline-flex bg-[#FFF9F0] p-1 rounded-2xl border-2 border-[#E9B8CA] shadow-xs gap-1">
            <button
              type="button"
              onClick={() => onToggleSessionMode("standard_4")}
              className={`px-3 py-1.5 rounded-xl text-xs font-heading font-bold transition cursor-pointer ${
                maxShots === 4
                  ? "bg-[#E84D91] text-white shadow-xs"
                  : "text-[#8B7180] hover:bg-[#FFF0F4]"
              }`}
            >
              <span>4 Pose</span>
            </button>
            <button
              type="button"
              onClick={() => onToggleSessionMode("korean_6")}
              className={`px-3 py-1.5 rounded-xl text-xs font-heading font-bold transition cursor-pointer ${
                maxShots === 6
                  ? "bg-[#E84D91] text-white shadow-xs"
                  : "text-[#8B7180] hover:bg-[#FFF0F4]"
              }`}
              title="Gaya photobooth Korea: ambil 6 foto lalu pilih 4 terbaik"
            >
              <span>🇰🇷 Ambil 6 (Pilih 4)</span>
            </button>
          </div>
        )}
      </div>

      {/* ========================================================
          MAIN CAMERA AREA: Vintage Photobooth Viewport
          ======================================================== */}
      <div className="relative w-full max-w-3xl aspect-[3/4] sm:aspect-[4/3] bg-stone-950 border-4 border-[#E9B8CA] rounded-3xl overflow-hidden shadow-paper-lg flex items-center justify-center">
        {/* Vintage camera viewfinder corner marks */}
        <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-white/60 z-30 pointer-events-none" />
        <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-white/60 z-30 pointer-events-none" />
        <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-white/60 z-30 pointer-events-none" />
        <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-white/60 z-30 pointer-events-none" />

        {/* Camera Status Indicator Pill */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 bg-black/80 px-3 py-1 rounded-full border border-white/20 flex items-center gap-2 pointer-events-none text-white text-[11px] font-heading font-bold">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>LIVE STUDIO VIEW</span>
        </div>

        {cameraError ? (
          <div className="p-6 text-center space-y-3 text-white max-w-md z-30">
            <AlertCircle className="w-12 h-12 text-[#F48FB1] mx-auto animate-bounce" />
            <h4 className="font-heading font-bold text-lg">Kamera Belum Terhubung</h4>
            <p className="text-xs text-rose-200 font-sans font-medium leading-relaxed">
              {cameraError}
            </p>

            <div className="flex flex-col gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowPermissionGuide(true)}
                className="w-full py-2.5 px-3 bg-[#E84D91] hover:bg-[#F48FB1] text-white font-heading font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <HelpCircle className="w-4 h-4" />
                <span>Panduan Buka Izin Kamera 📱</span>
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-2.5 px-3 bg-white/20 hover:bg-white/30 text-white font-heading font-bold text-xs rounded-xl transition cursor-pointer"
              >
                <span>Upload Foto dari Galeri Saja 🖼️</span>
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Live Camera Stream View */}
            <div className="w-full h-full flex items-center justify-center relative">
              <div
                className={`${
                  remoteStream ? "w-1/2" : "w-full"
                } h-full relative overflow-hidden bg-black flex items-center justify-center`}
              >
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  style={{
                    filter: `brightness(${cameraBrightness}%) contrast(${cameraContrast}%)`,
                  }}
                  className={`w-full h-full object-cover ${facingMode === "user" ? "-scale-x-100" : ""}`}
                />
                {remoteStream && (
                  <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/80 text-[10px] font-heading font-bold text-white rounded-md z-10">
                    Kamu 👤
                  </div>
                )}
              </div>

              {remoteStream && (
                <>
                  <div className="w-1 h-full bg-[#E84D91] z-10 relative flex items-center justify-center">
                    <div className="w-6 h-6 rounded-full bg-[#E84D91] border-2 border-white flex items-center justify-center shadow-md">
                      <span className="text-[10px]">💖</span>
                    </div>
                  </div>

                  <div className="w-1/2 h-full relative overflow-hidden bg-black flex items-center justify-center">
                    <video
                      ref={(el) => {
                        if (remoteVideoRef) {
                          (remoteVideoRef as React.MutableRefObject<HTMLVideoElement | null>).current = el;
                        }
                        if (el && remoteStream && el.srcObject !== remoteStream) {
                          el.srcObject = remoteStream;
                          el.play().catch((e) => console.warn("Remote video auto-play error:", e));
                        }
                      }}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover -scale-x-100"
                    />
                    <div className="absolute top-2 right-2 px-2 py-0.5 bg-black/80 text-[10px] font-heading font-bold text-white rounded-md z-10">
                      Partner LDR 🌍
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Real-time AR Face Filter Overlay Canvas */}
            <canvas
              ref={activeArCanvasRef}
              className={`absolute inset-0 w-full h-full object-cover pointer-events-none z-20 ${
                facingMode === "user" ? "-scale-x-100" : ""
              }`}
            />

            {/* Gesture Progress Overlay */}
            {gestureStatus && (
              <div className="absolute top-14 inset-x-4 z-20 flex flex-col items-center gap-1">
                <div className="px-4 py-2 bg-black/90 border border-[#F48FB1] text-white text-xs font-heading font-bold rounded-full shadow-paper flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#F48FB1] animate-spin" />
                  <span>{gestureStatus}</span>
                </div>
                {peaceProgress > 0 && (
                  <div className="w-48 bg-black/80 rounded-full h-2 overflow-hidden border border-[#F48FB1]/50 mt-1">
                    <div
                      className="bg-[#E84D91] h-full transition-all duration-75"
                      style={{ width: `${peaceProgress}%` }}
                    />
                  </div>
                )}
              </div>
            )}

            {/* COUNTDOWN OVERLAY */}
            {countdown !== null && (
              <div className="absolute inset-0 bg-stone-950/85 transition-all duration-300 z-30 flex flex-col items-center justify-center gap-3">
                <span className="text-8xl sm:text-9xl font-heading font-black text-white drop-shadow-[0_8px_16px_rgba(232,77,145,0.6)] animate-ping">
                  {countdown}
                </span>
                <span className="text-sm font-handwriting text-[#F8D8E3] tracking-wider">
                  say cheese! ✌️
                </span>
              </div>
            )}
          </>
        )}
      </div>

      {/* PHOTO STRIP TRACKER THUMBNAILS */}
      <div className="flex items-center justify-center gap-2.5 py-1 select-none">
        {Array.from({ length: maxShots }).map((_, idx) => {
          const shot = shots[idx];
          const isRetakeTarget = retakeIndex === idx;
          const isActive = retakeIndex !== null ? isRetakeTarget : idx === shotsCount;
          return (
            <div key={idx} className="flex flex-col items-center gap-1">
              <div
                className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl border-2 flex items-center justify-center overflow-hidden transition-all duration-300 shadow-paper ${
                  isRetakeTarget
                    ? "border-amber-500 bg-amber-100 ring-4 ring-amber-300 animate-pulse scale-105"
                    : shot
                    ? "border-[#E84D91] bg-white scale-105"
                    : isActive
                    ? "border-[#F48FB1] bg-[#FFF0F4] ring-4 ring-[#F8D8E3] animate-pulse"
                    : "border-[#E9B8CA] bg-[#FFF9F0] text-[#8B7180]"
                }`}
              >
                {shot ? (
                  <img src={shot.dataUrl} alt={`Thumb #${idx + 1}`} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xs font-heading font-bold text-[#8B7180]">0{idx + 1}</span>
                )}
              </div>
              <span
                className={`text-[10px] font-heading font-semibold ${
                  isRetakeTarget
                    ? "text-amber-600 font-bold"
                    : shot
                    ? "text-[#E84D91]"
                    : "text-[#8B7180]"
                }`}
              >
                #{idx + 1} {isRetakeTarget ? "(Ulang)" : ""}
              </span>
            </div>
          );
        })}
      </div>

      {/* MAIN CAMERA SHUTTER & GALLERY ACTION BAR */}
      <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-lg">
        {/* Main Camera Shutter Trigger Button */}
        <button
          type="button"
          onClick={handleShutterClick}
          disabled={isCapturing || countdown !== null || !!cameraError}
          className="w-full py-4 scrapbook-btn text-base sm:text-lg flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50"
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
          className="w-full sm:w-auto px-5 py-3.5 scrapbook-btn-secondary text-xs rounded-2xl flex items-center justify-center gap-2 shrink-0 cursor-pointer"
        >
          <ImageIcon className="w-4 h-4 text-[#E84D91]" />
          <span>Upload Galeri 🖼️</span>
        </button>
      </div>

      {/* Helpful Hint */}
      <p className="text-xs text-[#8B7180] font-sans font-medium text-center max-w-md">
        💡 <strong className="text-[#E84D91]">Tips:</strong>{" "}
        {triggerMode === "gesture"
          ? "Tunjukkan pose Peace (✌️) selama 1 detik di depan kamera untuk otomatis jepret!"
          : triggerMode === "timer_3"
          ? "Timer 3 detik siap! Tekan tombol lalu berpose estetik."
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
