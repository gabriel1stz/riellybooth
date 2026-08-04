"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import confetti from "canvas-confetti";
import Navbar from "@/components/Navbar";
import LandingStep from "@/components/Steps/LandingStep";
import CaptureStep from "@/components/Steps/CaptureStep";
import ReviewStep from "@/components/Steps/ReviewStep";
import EditorStep from "@/components/Steps/EditorStep";
import { startCameraStream, stopCameraStream, captureCanvasSnapshot } from "@/lib/cameraUtils";
import { drawPhotoStrip, LayoutMode, FilterState, FramePreset } from "@/lib/canvasUtils";
import { playShutterSound, setBgmState, stopBgm } from "@/lib/audioUtils";

type Step = "landing" | "capture" | "review" | "editor";
type Shot = { id: number; dataUrl: string };

export default function RielllyBooth() {
  const [step, setStep] = useState<Step>("landing");

  // Camera & Capture State
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [currentShotIndex, setCurrentShotIndex] = useState(1);
  const [shots, setShots] = useState<Shot[]>([]);
  const [retakeIndex, setRetakeIndex] = useState<number | null>(null);

  // FX & Audio State
  const [flashFx, setFlashFx] = useState(false);
  const [isAudioOn, setIsAudioOn] = useState(false);

  // Editor State
  const [layout, setLayout] = useState<LayoutMode>("strip");
  const [preset, setPreset] = useState<FramePreset>("clean");
  const [selectedForSwap, setSelectedForSwap] = useState<number | null>(null);
  const [frameColor, setFrameColor] = useState("#ffffff");
  const [textColor, setTextColor] = useState("#000000");
  const [filter, setFilter] = useState<FilterState>({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    grayscale: 0,
  });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Handle BGM Music toggle
  useEffect(() => {
    if (step === "capture" && isAudioOn) {
      setBgmState(true);
    } else {
      setBgmState(false);
    }

    return () => {
      stopBgm();
    };
  }, [step, isAudioOn]);

  // WebRTC Stream Lifecycle Management
  useEffect(() => {
    let isActive = true;

    if (step === "capture" || retakeIndex !== null) {
      setCameraError(null);
      startCameraStream()
        .then((stream) => {
          if (!isActive) {
            stopCameraStream(stream);
            return;
          }
          mediaStreamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch((err: Error) => {
          if (isActive) {
            console.error("WebRTC Camera Error:", err);
            setCameraError(err.message || "Gagal mengoneksikan kamera.");
          }
        });
    } else {
      stopCameraStream(mediaStreamRef.current);
      mediaStreamRef.current = null;
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }

    return () => {
      isActive = false;
    };
  }, [step, retakeIndex]);

  // Handle Upload 4 Photos from Device
  const handleUploadPhotos = (files: FileList) => {
    const fileArray = Array.from(files).slice(0, 4);
    if (fileArray.length === 0) return;

    const loadedShots: { index: number; shot: Shot }[] = [];
    let loadedCount = 0;

    fileArray.forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          loadedShots.push({
            index,
            shot: { id: Date.now() + index + Math.random(), dataUrl: e.target.result as string },
          });
          loadedCount++;

          if (loadedCount === fileArray.length) {
            loadedShots.sort((a, b) => a.index - b.index);
            const finalShots = loadedShots.map((item) => item.shot);

            while (finalShots.length < 4) {
              finalShots.push(finalShots[finalShots.length - 1]);
            }

            setShots(finalShots);
            setStep("review");
          }
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // Helper for 3-2-1 Countdown Timer
  const runCountdown = (seconds: number) => {
    return new Promise<void>((resolve) => {
      let count = seconds;
      setCountdown(count);
      const timer = setInterval(() => {
        count -= 1;
        if (count > 0) {
          setCountdown(count);
        } else {
          clearInterval(timer);
          setCountdown(null);
          resolve();
        }
      }, 1000);
    });
  };

  // Trigger Flash FX & Camera Shutter Sound
  const triggerSnapshotFx = () => {
    playShutterSound();
    setFlashFx(true);
    setTimeout(() => setFlashFx(false), 250);
  };

  // Start 4-Photo Session
  const startPhotoSession = async () => {
    if (isCapturing) return;
    setIsCapturing(true);
    setShots([]);
    const tempShots: Shot[] = [];

    for (let i = 0; i < 4; i++) {
      setCurrentShotIndex(i + 1);
      await runCountdown(3);

      if (videoRef.current) {
        triggerSnapshotFx();
        const dataUrl = captureCanvasSnapshot(videoRef.current, true);
        tempShots.push({ id: Date.now() + i, dataUrl });
        setShots([...tempShots]);
      }
      await new Promise((r) => setTimeout(r, 800));
    }

    setIsCapturing(false);
    setStep("review");
  };

  // Single Photo Retake
  const handleRetakeSingle = async (index: number) => {
    if (retakeIndex !== null) return;
    setRetakeIndex(index);
    await runCountdown(3);

    if (videoRef.current) {
      triggerSnapshotFx();
      const dataUrl = captureCanvasSnapshot(videoRef.current, true);
      const updated = [...shots];
      updated[index] = { id: Date.now(), dataUrl };
      setShots(updated);
    }
    setRetakeIndex(null);
  };

  // Swap 2 Photos in Editor
  const handleSwapPhotos = (index: number) => {
    if (selectedForSwap === null) {
      setSelectedForSwap(index);
    } else {
      if (selectedForSwap !== index) {
        const updated = [...shots];
        const temp = updated[selectedForSwap];
        updated[selectedForSwap] = updated[index];
        updated[index] = temp;
        setShots(updated);
      }
      setSelectedForSwap(null);
    }
  };

  // Render HTML5 Canvas Output
  const renderCanvas = useCallback(() => {
    if (!canvasRef.current || shots.length < 4) return;
    const loadedImages: HTMLImageElement[] = [];
    let count = 0;

    shots.slice(0, 4).forEach((shot, i) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = shot.dataUrl;
      img.onload = () => {
        loadedImages[i] = img;
        count++;
        if (count === 4 && canvasRef.current) {
          drawPhotoStrip(canvasRef.current, loadedImages, layout, frameColor, textColor, filter, preset);
        }
      };
    });
  }, [shots, layout, frameColor, textColor, filter, preset]);

  useEffect(() => {
    if (step === "editor") {
      renderCanvas();
    }
  }, [step, renderCanvas]);

  // HD PNG Download & Confetti Trigger
  const handleDownload = () => {
    if (!canvasRef.current) return;
    const link = document.createElement("a");
    link.download = `rielllybooth-${Date.now()}.png`;
    link.href = canvasRef.current.toDataURL("image/png");
    link.click();

    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#f472b6", "#fb7185", "#c084fc", "#ffffff"],
      });
    } catch (e) {
      console.log("Confetti trigger:", e);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between font-sans selection:bg-pink-500 selection:text-white">
      <Navbar />

      <div className="flex-1 flex flex-col justify-center items-center py-8">
        {step === "landing" && <LandingStep onStart={() => setStep("capture")} />}

        {step === "capture" && (
          <CaptureStep
            videoRef={videoRef}
            isCapturing={isCapturing}
            countdown={countdown}
            currentShotIndex={currentShotIndex}
            onStartSession={startPhotoSession}
            onUploadPhotos={handleUploadPhotos}
            cameraError={cameraError}
            flashFx={flashFx}
            isAudioOn={isAudioOn}
            onToggleAudio={() => setIsAudioOn((v) => !v)}
          />
        )}

        {step === "review" && (
          <ReviewStep
            shots={shots}
            countdown={countdown}
            retakeIndex={retakeIndex}
            onRetakeSingle={handleRetakeSingle}
            onRetakeAll={() => setStep("capture")}
            onNextToEditor={() => setStep("editor")}
          />
        )}

        {step === "editor" && (
          <EditorStep
            canvasRef={canvasRef}
            shots={shots}
            layout={layout}
            setLayout={setLayout}
            preset={preset}
            setPreset={setPreset}
            selectedForSwap={selectedForSwap}
            onSwapPhotos={handleSwapPhotos}
            frameColor={frameColor}
            setFrameColor={setFrameColor}
            textColor={textColor}
            setTextColor={setTextColor}
            filter={filter}
            setFilter={setFilter}
            onBack={() => setStep("review")}
            onDownload={handleDownload}
          />
        )}
      </div>

      <footer className="border-t border-slate-900 py-4 text-center text-xs text-slate-500 backdrop-blur-md bg-slate-950/40">
        &copy; {new Date().getFullYear()} <span className="text-pink-400 font-bold">rielllybooth</span> ♡ Virtual Photobooth Aesthetic. All rights reserved.
      </footer>
    </main>
  );
}