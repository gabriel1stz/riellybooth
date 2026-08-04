"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import confetti from "canvas-confetti";
import { Instagram, Mail, Heart, Sparkles, X, Coffee, ShieldCheck, Camera, Video, Wand2, Share2, Download, Copy, Check, MessageCircle, Twitter } from "lucide-react";
import Navbar from "@/components/Navbar";
import LandingStep from "@/components/Steps/LandingStep";
import { startCameraStream, stopCameraStream, captureCanvasSnapshot, recordLiveVideoSnippet } from "@/lib/cameraUtils";
import { drawPhotoStrip, LayoutMode, FilterState, FramePreset, CuteFilter, FontFamily, PlacedSticker } from "@/lib/canvasUtils";
import { playShutterSound, setBgmState, stopBgm } from "@/lib/audioUtils";

// Dynamic Imports for Heavy Step Components to optimize Initial JS Bundle & LCP
const CaptureStep = dynamic(() => import("@/components/Steps/CaptureStep"), {
  loading: () => <div className="p-8 text-center text-pink-500 font-bold animate-pulse">Memuat Studio Kamera... 📸</div>,
});
const ReviewStep = dynamic(() => import("@/components/Steps/ReviewStep"), {
  loading: () => <div className="p-8 text-center text-pink-500 font-bold animate-pulse">Memuat Review Foto... ✨</div>,
});
const EditorStep = dynamic(() => import("@/components/Steps/EditorStep"), {
  loading: () => <div className="p-8 text-center text-pink-500 font-bold animate-pulse">Memuat Studio Editor... 🎨</div>,
});

type Step = "landing" | "capture" | "review" | "editor";
type Shot = { id: number; dataUrl: string; videoBlobUrl?: string };

const VIRAL_CAPTION = `Baru aja foto estetik di rielllybooth ♡ Cobain bikin photo strip & Live Photo gratis tanpa watermark di sini 👉 https://riellybooth.my.id ✨`;

export default function RielllyBooth() {
  const [step, setStep] = useState<Step>("landing");

  // Camera & Facing Mode State
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [currentShotIndex, setCurrentShotIndex] = useState(1);
  const [shots, setShots] = useState<Shot[]>([]);
  const [retakeIndex, setRetakeIndex] = useState<number | null>(null);

  // FX & Audio State
  const [flashFx, setFlashFx] = useState(false);
  const [isAudioOn, setIsAudioOn] = useState(true);

  // Modals State
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [downloadedDataUrl, setDownloadedDataUrl] = useState<string | null>(null);
  const [downloadedVideoUrl, setDownloadedVideoUrl] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCaption, setCopiedCaption] = useState(false);

  // Live Photo, Custom Logo & Editor State
  const [isLivePhotoOn, setIsLivePhotoOn] = useState(true);
  const [isFlipped, setIsFlipped] = useState(false);
  const [customLogoUrl, setCustomLogoUrl] = useState<string | null>(null);
  const [customLogoImg, setCustomLogoImg] = useState<HTMLImageElement | null>(null);
  const [layout, setLayout] = useState<LayoutMode>("strip_4");
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
    grain: 0,
    beautyGlow: 0,
  });
  const [isExportingVideo, setIsExportingVideo] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Image cache map for instant flicker-free canvas redraws
  const loadedImgMapRef = useRef<Map<string, HTMLImageElement>>(new Map());

  // Set default subtitle date
  useEffect(() => {
    const today = new Date().toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    setSubtitleText(`✨ ${today} ✨`);
  }, []);

  // Preload captured/uploaded shot images into image map cache for instant drawing
  useEffect(() => {
    shots.forEach((s) => {
      if (s.dataUrl && !loadedImgMapRef.current.has(s.dataUrl)) {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = s.dataUrl;
        img.onload = () => {
          loadedImgMapRef.current.set(s.dataUrl, img);
        };
      }
    });
  }, [shots]);

  // CONTINUOUS BGM MUSIC PLAYBACK ACROSS ALL STEPS (capture -> review -> editor) ONCE STARTED
  useEffect(() => {
    if (step !== "landing" && isAudioOn) {
      setBgmState(true);
    } else if (!isAudioOn) {
      setBgmState(false);
    }

    return () => {
      if (step === "landing") {
        stopBgm();
      }
    };
  }, [step, isAudioOn]);

  // Direct Click Handler to Start Photobooth Session & BGM
  const handleStartCapture = () => {
    setShots([]);
    setCurrentShotIndex(1);
    setRetakeIndex(null);
    setIsAudioOn(true);
    setBgmState(true);
    setStep("capture");
  };

  // Custom Brand Logo Upload Handler
  const handleUploadCustomLogo = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        const url = e.target.result as string;
        setCustomLogoUrl(url);

        const img = new Image();
        img.src = url;
        img.onload = () => {
          setCustomLogoImg(img);
        };
      }
    };
    reader.readAsDataURL(file);
  };

  const handleClearCustomLogo = () => {
    setCustomLogoUrl(null);
    setCustomLogoImg(null);
  };

  // Toggle Camera Facing Mode (Front / Back)
  const handleToggleFacingMode = () => {
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
  };

  // WebRTC Stream Lifecycle Management
  useEffect(() => {
    let isActive = true;

    if (step === "capture" || retakeIndex !== null) {
      setCameraError(null);
      startCameraStream(facingMode)
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
  }, [step, retakeIndex, facingMode]);

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
          const dataUrl = e.target.result as string;
          loadedShots.push({
            index,
            shot: { id: Date.now() + index + Math.random(), dataUrl },
          });

          // Preload into cache
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.src = dataUrl;
          img.onload = () => {
            loadedImgMapRef.current.set(dataUrl, img);
          };

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
    if (isCapturing) return;
    setIsCapturing(true);

    await runCountdown(3);

    let videoBlobUrl = "";
    if (mediaStreamRef.current) {
      videoBlobUrl = await recordLiveVideoSnippet(mediaStreamRef.current, 1500);
    }

    if (videoRef.current) {
      triggerSnapshotFx();
      const dataUrl = captureCanvasSnapshot(videoRef.current, false);

      // Preload captured snapshot into image map cache
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = dataUrl;
      img.onload = () => {
        loadedImgMapRef.current.set(dataUrl, img);
      };

      if (retakeIndex !== null) {
        const updated = [...shots];
        updated[retakeIndex] = { id: Date.now(), dataUrl, videoBlobUrl };
        setShots(updated);
        setRetakeIndex(null);
        setStep("review");
      } else {
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
          }, 600);
        }
      }
    }

    setIsCapturing(false);
  };

  // Single Photo Retake Trigger
  const handleRetakeSingle = (index: number) => {
    setRetakeIndex(index);
    setCurrentShotIndex(index + 1);
    setStep("capture");
  };

  // Retake All Shots
  const handleRetakeAll = () => {
    setShots([]);
    setCurrentShotIndex(1);
    setRetakeIndex(null);
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

  // Handle Adding & Dragging Stickers on Canvas
  const handleAddSticker = (emoji: string) => {
    const newSticker: PlacedSticker = {
      id: Date.now().toString() + Math.random().toString(),
      emoji,
      x: 300,
      y: 800 + Math.random() * 200,
      scale: 1,
    };
    setPlacedStickers((prev) => [...prev, newSticker]);
  };

  const handleUpdateStickerPos = (id: string, x: number, y: number) => {
    setPlacedStickers((prev) =>
      prev.map((st) => (st.id === id ? { ...st, x, y } : st))
    );
  };

  const handleClearStickers = () => {
    setPlacedStickers([]);
  };

  // Render HTML5 Canvas Output (Instant Flicker-Free Sync Render via Image Cache)
  const renderCanvas = useCallback(
    (videoElements?: HTMLVideoElement[]) => {
      if (!canvasRef.current || shots.length === 0) return;

      if (isLivePhotoOn && videoElements && videoElements.length > 0) {
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
          placedStickers,
          isFlipped,
          customLogoImg
        );
        return;
      }

      // Static Synchronous Image Render
      const targetCount = layout === "strip_2" ? 2 : layout === "strip_3" ? 3 : 4;
      const targetShots = shots.slice(0, targetCount);
      const loadedImages: HTMLImageElement[] = [];

      for (let i = 0; i < targetShots.length; i++) {
        const cached = loadedImgMapRef.current.get(targetShots[i].dataUrl);
        if (cached) {
          loadedImages[i] = cached;
        } else {
          // If any image is still loading into cache, instantiate on the fly
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.src = targetShots[i].dataUrl;
          img.onload = () => {
            loadedImgMapRef.current.set(targetShots[i].dataUrl, img);
            renderCanvas();
          };
          return;
        }
      }

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
        placedStickers,
        isFlipped,
        customLogoImg
      );
    },
    [shots, layout, frameColor, textColor, filter, preset, cuteFilter, customText, fontFamily, subtitleText, isLivePhotoOn, placedStickers, isFlipped, customLogoImg]
  );

  // Video Animation Loop for Live Photo Canvas Rendering
  useEffect(() => {
    let animId: number;
    let videoElements: HTMLVideoElement[] = [];

    if (step === "editor" && isLivePhotoOn && shots.some((s) => s.videoBlobUrl)) {
      videoElements = shots.map((shot) => {
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

  // Helper for Mobile Device Detection
  const isMobileDevice = useCallback(() => {
    if (typeof window === "undefined") return false;
    return window.innerWidth < 768 || navigator.maxTouchPoints > 0;
  }, []);

  // Direct PNG Download Trigger with Branded Random Filename
  const handleDownloadPng = async () => {
    if (!canvasRef.current) return;
    const randomHash = Math.random().toString(36).substring(2, 8);
    const filename = `rielllybooth-${randomHash}.png`;

    const dataUrl = canvasRef.current.toDataURL("image/png");
    setDownloadedDataUrl(dataUrl);

    // Native Web Share API for Mobile Devices
    if (isMobileDevice() && navigator.share) {
      try {
        const res = await fetch(dataUrl);
        const blob = await res.blob();
        const file = new File([blob], filename, { type: "image/png" });

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: "rielllybooth ♡ Virtual Photobooth",
            text: "Baru aja foto estetik di rielllybooth ♡ Bikin photo strip & Live Photo gratis di sini! ✨",
            url: "https://riellybooth.my.id",
          });

          try {
            confetti({
              particleCount: 120,
              spread: 80,
              origin: { y: 0.6 },
              colors: ["#f472b6", "#fb7185", "#c084fc", "#ffffff"],
            });
          } catch (e) {}
          return;
        }
      } catch (shareErr) {
        console.warn("Web Share API cancelled or unsupported:", shareErr);
      }
    }

    // Direct Browser Download
    const link = document.createElement("a");
    link.download = filename;
    link.href = dataUrl;
    link.click();

    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#f472b6", "#fb7185", "#c084fc", "#ffffff"],
      });
    } catch (e) {}
  };

  // Live Photo Video Export (MP4 preferred, WebM fallback)
  const handleDownloadVideo = async () => {
    if (!canvasRef.current || isExportingVideo) return;
    setIsExportingVideo(true);

    try {
      const canvasStream = canvasRef.current.captureStream(30);
      let mimeType = "video/mp4;codecs=avc1";
      let extension = "mp4";

      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = "video/mp4";
      }
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = "video/webm;codecs=vp9";
        extension = "webm";
      }
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = "video/webm";
        extension = "webm";
      }

      const recorder = new MediaRecorder(canvasStream, { mimeType });
      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = async () => {
        const blob = new Blob(chunks, { type: mimeType });
        const url = URL.createObjectURL(blob);
        setDownloadedVideoUrl(url);

        const randomHash = Math.random().toString(36).substring(2, 8);
        const filename = `rielllybooth-live-${randomHash}.${extension}`;

        if (isMobileDevice() && navigator.share) {
          try {
            const file = new File([blob], filename, { type: mimeType });
            if (navigator.canShare && navigator.canShare({ files: [file] })) {
              await navigator.share({
                files: [file],
                title: "rielllybooth live photo",
                text: "Live photo boomerang video created with rielllybooth ♡ ✨",
              });
              setIsExportingVideo(false);
              return;
            }
          } catch (shareErr) {
            console.warn("Web Share API video cancelled:", shareErr);
          }
        }

        const link = document.createElement("a");
        link.download = filename;
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

  // NATIVE MULTI-APP SHARE HANDLER
  const handleNativeMultiAppShare = async () => {
    if (!canvasRef.current) return;
    const dataUrl = canvasRef.current.toDataURL("image/png");

    try {
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      const randomHash = Math.random().toString(36).substring(2, 8);
      const file = new File([blob], `rielllybooth-${randomHash}.png`, { type: "image/png" });

      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: "rielllybooth ♡ Virtual Photobooth",
          text: "Baru aja foto estetik di rielllybooth ♡ Bikin photo strip & Live Photo gratis di sini! ✨",
          url: "https://riellybooth.my.id",
        });
      } else {
        alert("Browser Anda belum mendukung Web Share API file. Silakan gunakan tombol Simpan PNG HD!");
      }
    } catch (err) {
      console.warn("Native file share cancelled:", err);
    }
  };

  const handleCopyShareLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleCopyCaption = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(VIRAL_CAPTION);
      setCopiedCaption(true);
      setTimeout(() => setCopiedCaption(false), 2000);
    }
  };

  return (
    <main className="min-h-screen bg-rose-50/50 text-slate-800 flex flex-col justify-between font-sans selection:bg-pink-400 selection:text-white overflow-x-hidden">
      <Navbar
        isAudioOn={isAudioOn}
        onToggleAudio={() => setIsAudioOn((v) => !v)}
        onGoHome={() => setStep("landing")}
        onOpenAbout={() => setShowAboutModal(true)}
        onOpenSupport={() => setShowSupportModal(true)}
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
            shots={shots}
            onTakeSingleShot={handleTakeSingleShot}
            onUploadPhotos={handleUploadPhotos}
            cameraError={cameraError}
            flashFx={flashFx}
            isAudioOn={isAudioOn}
            onToggleAudio={() => setIsAudioOn((v) => !v)}
            facingMode={facingMode}
            onToggleFacingMode={handleToggleFacingMode}
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
            onUpdateStickerPos={handleUpdateStickerPos}
            onClearStickers={handleClearStickers}
            customLogoUrl={customLogoUrl}
            onUploadCustomLogo={handleUploadCustomLogo}
            onClearCustomLogo={handleClearCustomLogo}
            selectedForSwap={selectedForSwap}
            onSwapPhotos={handleSwapPhotos}
            frameColor={frameColor}
            setFrameColor={setFrameColor}
            textColor={textColor}
            setTextColor={setTextColor}
            filter={filter}
            setFilter={setFilter}
            isFlipped={isFlipped}
            setIsFlipped={setIsFlipped}
            onBack={() => setStep("review")}
            onDownloadPng={handleDownloadPng}
            onDownloadVideo={handleDownloadVideo}
            onOpenShareModal={() => setShowShareModal(true)}
            isExportingVideo={isExportingVideo}
          />
        )}
      </div>

      {/* ABOUT MODAL */}
      {showAboutModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border-4 border-pink-300 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowAboutModal(false)}
              className="absolute top-4 right-4 p-1 rounded-full bg-rose-100 text-rose-600 hover:bg-rose-200 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-pink-500">
              <Sparkles className="w-5 h-5 animate-pulse" />
              <h3 className="text-2xl font-black">Tentang rielllybooth</h3>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              <strong className="text-pink-600">rielllybooth</strong> adalah aplikasi Virtual Photobooth gratis bergaya Korea & Y2K Aesthetic yang dirancang untuk mengabadikan momen serumu di mana saja tanpa watermark.
            </p>

            <div className="space-y-2 bg-rose-50 border-2 border-pink-200 p-3 rounded-2xl text-xs font-bold text-slate-700">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-pink-500" /> Auto-take gesture V-sign (✌️)
              </div>
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4 text-purple-500" /> Live Photo 🎥 moving video
              </div>
              <div className="flex items-center gap-2">
                <Wand2 className="w-4 h-4 text-sky-500" /> Retro & Webcam Toy Filters
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" /> 100% Bebas Watermark
              </div>
            </div>

            <div className="text-center pt-2">
              <button
                onClick={() => setShowAboutModal(false)}
                className="w-full py-3 bg-pink-400 hover:bg-pink-500 text-white font-black text-sm rounded-2xl shadow-md border-2 border-pink-500 transition"
              >
                Tutup Info ✨
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TRAKTEER-ONLY SUPPORT / DONATE MODAL */}
      {showSupportModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border-4 border-pink-300 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-5 relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowSupportModal(false)}
              className="absolute top-4 right-4 p-1 rounded-full bg-rose-100 text-rose-600 hover:bg-rose-200 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-1">
              <div className="inline-flex p-3 bg-pink-100 rounded-full border border-pink-300 text-pink-500">
                <Coffee className="w-6 h-6 animate-bounce" />
              </div>
              <h3 className="text-2xl font-black text-slate-800">Support / Traktir Kopi 💖</h3>
              <p className="text-xs text-slate-600 font-medium">
                Dukung server rielllybooth tetap gratis!
              </p>
            </div>

            <div className="space-y-2.5">
              <a
                href="https://teer.id/eveexyz"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full p-4 bg-rose-400 hover:bg-rose-500 text-white font-black text-sm rounded-2xl border-2 border-rose-500 flex items-center justify-between transition shadow-md hover:scale-102 active:scale-95"
              >
                <span>💖 Traktir Kopi via Trakteer</span>
                <span className="text-[10px] bg-white/20 px-2 py-1 rounded-md font-bold">Trakteer.id</span>
              </a>
            </div>

            <div className="text-center pt-1">
              <button
                onClick={() => setShowSupportModal(false)}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl border border-slate-300 transition"
              >
                Kembali
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ENHANCED SOCIAL MEDIA SHARE & VIRAL CAPTION MODAL */}
      {showShareModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border-4 border-pink-300 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 text-center relative animate-in fade-in zoom-in-95 duration-200 max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => setShowShareModal(false)}
              className="absolute top-4 right-4 p-1 rounded-full bg-rose-100 text-rose-600 hover:bg-rose-200 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="inline-flex p-3 bg-pink-100 rounded-full border border-pink-300 text-pink-500">
              <Share2 className="w-6 h-6 animate-bounce" />
            </div>

            <h3 className="text-2xl font-black text-slate-800">Bagikan ke Media Sosial 📲</h3>
            <p className="text-xs text-slate-600 font-medium">
              Share photo strip kamu ke Instagram Story, WhatsApp, TikTok & Twitter!
            </p>

            {/* Native Multi-App File Share Action */}
            <button
              type="button"
              onClick={handleNativeMultiAppShare}
              className="w-full py-3.5 px-4 bg-pink-400 hover:bg-pink-500 text-white font-black text-sm rounded-2xl border-2 border-pink-500 shadow-md flex items-center justify-center gap-2 transition hover:scale-102 active:scale-95"
            >
              <Share2 className="w-5 h-5" /> Bagikan Langsung + Foto 📲
            </button>

            {/* VIRAL CAPTION BOX */}
            <div className="bg-rose-50 border-2 border-pink-200 p-3.5 rounded-2xl text-left space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-pink-700">Caption Viral:</span>
                <button
                  type="button"
                  onClick={handleCopyCaption}
                  className="px-2.5 py-1 bg-white hover:bg-pink-100 text-pink-700 text-[11px] font-bold rounded-lg border border-pink-300 flex items-center gap-1 transition shadow-xs"
                >
                  {copiedCaption ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 text-pink-500" />}
                  <span>{copiedCaption ? "Tersalin!" : "Salin Caption"}</span>
                </button>
              </div>
              <p className="text-[11px] font-medium text-slate-700 bg-white p-2.5 rounded-xl border border-pink-200 leading-relaxed italic">
                {VIRAL_CAPTION}
              </p>
            </div>

            {/* QUICK SOCIAL SHORTCUTS GRID */}
            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(VIRAL_CAPTION)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-3 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs rounded-xl border border-emerald-600 flex items-center justify-center gap-2 transition shadow-xs"
              >
                <MessageCircle className="w-4 h-4" /> WhatsApp
              </a>

              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(VIRAL_CAPTION)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-3 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs rounded-xl border border-slate-900 flex items-center justify-center gap-2 transition shadow-xs"
              >
                <Twitter className="w-4 h-4" /> Twitter / X
              </a>
            </div>

            {/* 9:16 Aspect Story Preview Card */}
            <div className="space-y-1.5 pt-2">
              <span className="text-xs font-bold text-slate-700">Pratinjau Story (9:16):</span>
              <div className="w-full aspect-[9/16] max-h-56 bg-slate-900 rounded-2xl overflow-hidden border-2 border-pink-300 shadow-md flex items-center justify-center p-2 mx-auto">
                {downloadedDataUrl ? (
                  <img src={downloadedDataUrl} alt="Story Preview" className="h-full w-auto object-contain rounded-lg" />
                ) : (
                  <div className="text-white text-xs font-bold space-y-2">
                    <Sparkles className="w-6 h-6 text-pink-400 mx-auto animate-bounce" />
                    <p>Photo Strip Ready!</p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={handleCopyShareLink}
                className="flex-1 py-2.5 bg-rose-50 hover:bg-rose-100 text-pink-700 font-bold text-xs rounded-xl border border-pink-200 transition flex items-center justify-center gap-1.5"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-pink-500" />}
                <span>{copiedLink ? "Link Tersalin!" : "Salin Link Web"}</span>
              </button>

              <button
                type="button"
                onClick={() => setShowShareModal(false)}
                className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl border border-slate-300 transition"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SIGNATURE FOOTER INTEGRATION */}
      <footer className="border-t border-pink-200 py-6 text-center text-xs text-slate-600 bg-white/90 backdrop-blur-md flex flex-col items-center justify-center gap-3 px-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-center gap-2 font-bold text-slate-700">
          <span>&copy; {new Date().getFullYear()}</span>
          <span className="text-pink-500 font-extrabold text-sm flex items-center gap-1">
            rielllybooth ♡ <span className="text-xs">🎀</span>
          </span>
          <span className="text-slate-400">•</span>
          <span className="italic text-slate-600 font-medium">
            &ldquo;capturing ur cutiest moments everywhere ✨&rdquo;
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
          <a
            href="mailto:hello.rielllybooth@gmail.com"
            className="inline-flex items-center gap-1.5 font-bold text-slate-700 hover:text-pink-600 transition"
          >
            <Mail className="w-3.5 h-3.5 text-pink-500" />
            <span>hello.rielllybooth@gmail.com</span>
          </a>

          <span className="text-slate-300">•</span>

          <a
            href="https://instagram.com/dhikastriaaa"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-bold text-pink-600 hover:text-pink-700 transition underline"
          >
            <Instagram className="w-3.5 h-3.5" />
            <span>@dhikastriaaa</span>
          </a>

          <a
            href="https://instagram.com/rielllybooth"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-bold text-pink-600 hover:text-pink-700 transition underline"
          >
            <Instagram className="w-3.5 h-3.5" />
            <span>@rielllybooth</span>
          </a>

          <span className="text-slate-300">•</span>

          <a
            href="https://tiktok.com/@rielllybooth"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-bold text-purple-600 hover:text-purple-700 transition underline"
          >
            <Video className="w-3.5 h-3.5 text-purple-500" />
            <span>TikTok @rielllybooth</span>
          </a>
        </div>
      </footer>
    </main>
  );
}