"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import confetti from "canvas-confetti";
import Navbar from "@/components/Navbar";
import LandingStep from "@/components/Steps/LandingStep";
import CaptureStep from "@/components/Steps/CaptureStep";
import ReviewStep from "@/components/Steps/ReviewStep";
import EditorStep from "@/components/Steps/EditorStep";
import { startCameraStream, stopCameraStream, captureCanvasSnapshot, recordLiveVideoSnippet } from "@/lib/cameraUtils";
import { drawPhotoStrip, LayoutMode, FilterState, FramePreset, CuteFilter, FontFamily, PlacedSticker } from "@/lib/canvasUtils";
import { playShutterSound, setBgmState, stopBgm } from "@/lib/audioUtils";

type Step = "landing" | "capture" | "review" | "editor";
type Shot = { id: number; dataUrl: string; videoBlobUrl?: string };

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

  // FX & Audio State - DEFAULT AUDIO ON FOR CAPTURE SESSION
  const [flashFx, setFlashFx] = useState(false);
  const [isAudioOn, setIsAudioOn] = useState(true);

  // Live Photo & Editor State
  const [isLivePhotoOn, setIsLivePhotoOn] = useState(true);
  const [layout, setLayout] = useState<LayoutMode>("strip");
  const [preset, setPreset] = useState<FramePreset>("polkadot");
  const [cuteFilter, setCuteFilter] = useState<CuteFilter>("none");
  const [customText, setCustomText] = useState("rielllybooth ♡");
  const [fontFamily, setFontFamily] = useState<FontFamily>("sans");
  const [subtitleText, setSubtitleText] = useState("");
  const [placedStickers, setPlacedStickers] = useState<PlacedSticker[]>([]);
  const [selectedForSwap, setSelectedForSwap] = useState<number | null>(null);
  const [frameColor, setFrameColor] = useState("#fce7f3");
  const [textColor, setTextColor] = useState("#db2777");
  const [filter, setFilter] = useState<FilterState>({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    grayscale: 0,
  });
  const [isExportingVideo, setIsExportingVideo] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Set default subtitle date
  useEffect(() => {
    const today = new Date().toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    setSubtitleText(`✨ ${today} ✨`);
  }, []);

  // Handle BGM Music lifecycle (ONLY PLAY DURING CAPTURE STEP)
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

  // Direct Click Handler to Start Photobooth Session & BGM
  const handleStartCapture = () => {
    setShots([]);
    setCurrentShotIndex(1);
    setIsAudioOn(true);
    // Explicitly start audio inside user click event stack
    setBgmState(true);
    setStep("capture");
  };

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

  // Per-Shot Individual Trigger (1 Peace Gesture ✌️ = 1 Photo)
  const handleTakeSingleShot = async () => {
    if (isCapturing || shots.length >= 4) return;
    setIsCapturing(true);

    await runCountdown(3);

    let videoBlobUrl = "";
    if (mediaStreamRef.current) {
      videoBlobUrl = await recordLiveVideoSnippet(mediaStreamRef.current, 1500);
    }

    if (videoRef.current) {
      triggerSnapshotFx();
      const dataUrl = captureCanvasSnapshot(videoRef.current, true);
      const newShot: Shot = {
        id: Date.now() + shots.length,
        dataUrl,
        videoBlobUrl,
      };

      const updatedShots = [...shots, newShot];
      setShots(updatedShots);

      if (updatedShots.length < 4) {
        setCurrentShotIndex(updatedShots.length + 1);
      } else {
        setTimeout(() => {
          setStep("review");
        }, 500);
      }
    }

    setIsCapturing(false);
  };

  // Single Photo Retake
  const handleRetakeSingle = async (index: number) => {
    if (retakeIndex !== null) return;
    setRetakeIndex(index);
    await runCountdown(3);

    let videoBlobUrl = "";
    if (mediaStreamRef.current) {
      videoBlobUrl = await recordLiveVideoSnippet(mediaStreamRef.current, 1500);
    }

    if (videoRef.current) {
      triggerSnapshotFx();
      const dataUrl = captureCanvasSnapshot(videoRef.current, true);
      const updated = [...shots];
      updated[index] = { id: Date.now(), dataUrl, videoBlobUrl };
      setShots(updated);
    }
    setRetakeIndex(null);
  };

  // Retake All Shots
  const handleRetakeAll = () => {
    setShots([]);
    setCurrentShotIndex(1);
    setIsAudioOn(true);
    setBgmState(true);
    setStep("capture");
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

  // Handle Adding Stickers to Canvas
  const handleAddSticker = (emoji: string) => {
    const newSticker: PlacedSticker = {
      id: Date.now().toString() + Math.random().toString(),
      emoji,
      x: 100 + Math.random() * 400,
      y: 200 + Math.random() * 1100,
      scale: 1,
    };
    setPlacedStickers((prev) => [...prev, newSticker]);
  };

  const handleClearStickers = () => {
    setPlacedStickers([]);
  };

  // Render HTML5 Canvas Output
  const renderCanvas = useCallback(
    (videoElements?: HTMLVideoElement[]) => {
      if (!canvasRef.current || shots.length < 4) return;

      if (isLivePhotoOn && videoElements && videoElements.length === 4) {
        drawPhotoStrip(
          canvasRef.current,
          videoElements,
          layout,
          frameColor,
          textColor,
          filter,
          preset,
          cuteFilter,
          customText,
          fontFamily,
          subtitleText,
          placedStickers
        );
        return;
      }

      // Static Image Render
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
            drawPhotoStrip(
              canvasRef.current,
              loadedImages,
              layout,
              frameColor,
              textColor,
              filter,
              preset,
              cuteFilter,
              customText,
              fontFamily,
              subtitleText,
              placedStickers
            );
          }
        };
      });
    },
    [shots, layout, frameColor, textColor, filter, preset, cuteFilter, customText, fontFamily, subtitleText, isLivePhotoOn, placedStickers]
  );

  // Video Animation Loop for Live Photo Canvas Rendering
  useEffect(() => {
    let animId: number;
    let videoElements: HTMLVideoElement[] = [];

    if (step === "editor" && isLivePhotoOn && shots.some((s) => s.videoBlobUrl)) {
      videoElements = shots.slice(0, 4).map((shot) => {
        const vid = document.createElement("video");
        vid.src = shot.videoBlobUrl || shot.dataUrl;
        vid.autoplay = true;
        vid.loop = true;
        vid.muted = true;
        vid.playsInline = true;
        vid.play().catch(() => {});
        return vid;
      });

      const loop = () => {
        renderCanvas(videoElements);
        animId = requestAnimationFrame(loop);
      };
      loop();
    } else if (step === "editor") {
      renderCanvas();
    }

    return () => {
      if (animId) cancelAnimationFrame(animId);
      videoElements.forEach((v) => {
        v.pause();
        v.removeAttribute("src");
        v.load();
      });
    };
  }, [step, isLivePhotoOn, shots, renderCanvas]);

  // HD PNG Download & Confetti Trigger
  const handleDownloadPng = () => {
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

  // Live Video (WebM / Boomerang) Export
  const handleDownloadVideo = async () => {
    if (!canvasRef.current || isExportingVideo) return;
    setIsExportingVideo(true);

    try {
      const canvasStream = canvasRef.current.captureStream(30);
      let mimeType = "video/webm;codecs=vp9";
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = "video/webm";
      }

      const recorder = new MediaRecorder(canvasStream, { mimeType });
      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.download = `rielllybooth-live-${Date.now()}.webm`;
        link.href = url;
        link.click();
        setIsExportingVideo(false);

        try {
          confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        } catch (e) {}
      };

      recorder.start();
      setTimeout(() => {
        if (recorder.state !== "inactive") {
          recorder.stop();
        }
      }, 3500);
    } catch (err) {
      console.warn("Live video export failed:", err);
      setIsExportingVideo(false);
    }
  };

  return (
    <main className="min-h-screen bg-rose-50/50 text-slate-800 flex flex-col justify-between font-sans selection:bg-pink-400 selection:text-white">
      <Navbar
        isAudioOn={isAudioOn}
        onToggleAudio={() => setIsAudioOn((v) => !v)}
      />

      <div className="flex-1 flex flex-col justify-center items-center py-8">
        {step === "landing" && (
          <LandingStep onStart={handleStartCapture} />
        )}

        {step === "capture" && (
          <CaptureStep
            videoRef={videoRef}
            isCapturing={isCapturing}
            countdown={countdown}
            currentShotIndex={currentShotIndex}
            shotsCount={shots.length}
            onTakeSingleShot={handleTakeSingleShot}
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
            onRetakeAll={handleRetakeAll}
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
            cuteFilter={cuteFilter}
            setCuteFilter={setCuteFilter}
            customText={customText}
            setCustomText={setCustomText}
            fontFamily={fontFamily}
            setFontFamily={setFontFamily}
            subtitleText={subtitleText}
            setSubtitleText={setSubtitleText}
            isLivePhotoOn={isLivePhotoOn}
            setIsLivePhotoOn={setIsLivePhotoOn}
            placedStickers={placedStickers}
            onAddSticker={handleAddSticker}
            onClearStickers={handleClearStickers}
            selectedForSwap={selectedForSwap}
            onSwapPhotos={handleSwapPhotos}
            frameColor={frameColor}
            setFrameColor={setFrameColor}
            textColor={textColor}
            setTextColor={setTextColor}
            filter={filter}
            setFilter={setFilter}
            onBack={() => setStep("review")}
            onDownloadPng={handleDownloadPng}
            onDownloadVideo={handleDownloadVideo}
            isExportingVideo={isExportingVideo}
          />
        )}
      </div>

      <footer className="border-t border-pink-200 py-4 text-center text-xs text-slate-600 bg-white/80 backdrop-blur-md">
        &copy; {new Date().getFullYear()} <span className="text-pink-500 font-bold">rielllybooth</span> ♡ Virtual Photobooth Aesthetic. All rights reserved.
      </footer>
    </main>
  );
}