"use client";

import React, { useEffect, useRef, useState } from "react";
import type { FramePreset, LayoutMode } from "@/lib/canvasUtils";

type FramePreviewThumbProps = {
  preset: FramePreset;
  layout?: LayoutMode;
  frameColor?: string;
  textColor?: string;
  title: string;
};

const SAMPLE_SRCS = [
  "/samples/pose1.jpg",
  "/samples/pose2.jpg",
  "/samples/pose3.jpg",
  "/samples/pose4.jpg",
];

let cachedSampleImagesPromise: Promise<HTMLImageElement[]> | null = null;

function loadSampleImagesOnce(): Promise<HTMLImageElement[]> {
  if (cachedSampleImagesPromise) return cachedSampleImagesPromise;

  cachedSampleImagesPromise = Promise.all(
    SAMPLE_SRCS.map(
      (src) =>
        new Promise<HTMLImageElement>((resolve) => {
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.onload = () => resolve(img);
          img.onerror = () => resolve(img);
          img.src = src;
        })
    )
  );

  return cachedSampleImagesPromise;
}

export default function FramePreviewThumb({
  preset,
  layout = "strip_1x4",
  frameColor = "#fce7f3",
  textColor = "#392633",
  title,
}: FramePreviewThumbProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isRendered, setIsRendered] = useState(false);

  // Lazy-trigger rendering only when scrolled near viewport
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "240px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    let cancelled = false;

    Promise.all([import("@/lib/canvasUtils"), loadSampleImagesOnce()])
      .then(([{ drawPhotoStrip }, images]) => {
        if (cancelled || !canvasRef.current) return;
        const validImages = images.filter((img) => img.naturalWidth > 0);
        if (validImages.length === 0) return;

        drawPhotoStrip(
          canvasRef.current,
          validImages,
          layout,
          frameColor,
          textColor,
          {
            brightness: 102,
            contrast: 102,
            saturation: 100,
            grayscale: preset === "newspaper" || preset === "riellmatics_news" ? 100 : 0,
            grain: 0,
            beautyGlow: 0,
          },
          preset,
          "none",
          "riellybooth",
          "sans",
          "EST. 2026",
          [],
          false
        );
        setIsRendered(true);
      })
      .catch((err) => {
        console.warn("Frame preview render error:", preset, err);
      });

    return () => {
      cancelled = true;
    };
  }, [isVisible, preset, layout, frameColor, textColor]);

  return (
    <div
      ref={containerRef}
      className="w-full h-56 sm:h-64 rounded-2xl overflow-hidden border border-black/10 bg-[#FFF0F4]/70 relative flex items-center justify-center p-2.5"
    >
      {!isRendered && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 bg-[#FFF9F0]">
          <div className="w-20 h-32 rounded-lg bg-[#F8D8E3]/70 border border-[#E9B8CA]" />
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#8B7180]">
            Loading preview
          </span>
        </div>
      )}
      <canvas
        ref={canvasRef}
        aria-label={`Preview frame ${title}`}
        className={`max-w-full max-h-full w-auto h-auto object-contain rounded-md shadow-polaroid transition-opacity duration-300 group-hover:scale-[1.03] ${
          isRendered ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}
