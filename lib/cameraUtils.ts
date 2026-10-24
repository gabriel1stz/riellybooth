/**
 * Camera Utility module for WebRTC stream management, video frame snapshot capturing,
 * front/back camera facing mode switching, and MP4/WebM Live Photo snippet recording.
 */

export const startCameraStream = async (facingMode: "user" | "environment" = "user"): Promise<MediaStream> => {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    throw new Error("Kamera tidak didukung pada peramban ini.");
  }

  try {
    return await navigator.mediaDevices.getUserMedia({
      video: {
        width: { ideal: 1280 },
        height: { ideal: 720 },
        facingMode: facingMode,
      },
      audio: false,
    });
  } catch (err: unknown) {
    console.warn("Retrying camera stream initialization with default constraints...", err);
    try {
      return await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facingMode },
        audio: false,
      });
    } catch (fallbackErr: unknown) {
      if (fallbackErr instanceof Error) {
        if (fallbackErr.name === "NotReadableError") {
          throw new Error("Kamera sedang digunakan oleh aplikasi lain (Zoom, OBS, Discord, atau tab browser lain). Silakan tutup aplikasi tersebut dan coba lagi.");
        } else if (fallbackErr.name === "NotAllowedError" || fallbackErr.name === "PermissionDeniedError") {
          throw new Error("Akses kamera ditolak. Silakan berikan izin kamera pada browser Anda.");
        } else if (fallbackErr.name === "NotFoundError" || fallbackErr.name === "DevicesNotFoundError") {
          throw new Error("Perangkat kamera tidak ditemukan pada perangkat Anda.");
        }
      }
      throw new Error("Gagal menghubungkan ke kamera hardware. Pastikan kamera terhubung.");
    }
  }
};

export const stopCameraStream = (stream: MediaStream | null): void => {
  if (stream) {
    stream.getTracks().forEach((track) => {
      track.stop();
      try {
        stream.removeTrack(track);
      } catch (e) {}
    });
  }
};

/**
 * Revoke object URL to free up browser video decoder memory (especially on iOS Safari).
 */
export const revokeBlobUrl = (url?: string): void => {
  if (url && url.startsWith("blob:")) {
    try {
      URL.revokeObjectURL(url);
    } catch (e) {}
  }
};

/**
 * Capture high-resolution un-mirrored snapshot from active WebRTC video element.
 * Text on clothing and faces read correctly non-flipped.
 */
export const captureCanvasSnapshot = (
  videoEl: HTMLVideoElement,
  mirror: boolean = false,
  arCanvasEl?: HTMLCanvasElement | null,
  filters?: { brightness?: number; contrast?: number; beautyGlow?: number }
): string => {
  const canvas = document.createElement("canvas");
  const width = videoEl.videoWidth || 1280;
  const height = videoEl.videoHeight || 720;

  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  ctx.save();
  if (mirror) {
    ctx.translate(width, 0);
    ctx.scale(-1, 1);
  }

  if (filters) {
    const b = filters.brightness ?? 100;
    const c = filters.contrast ?? 100;
    ctx.filter = `brightness(${b}%) contrast(${c}%)`;
  }

  ctx.drawImage(videoEl, 0, 0, width, height);

  if (arCanvasEl) {
    ctx.filter = "none";
    ctx.drawImage(arCanvasEl, 0, 0, width, height);
  }

  ctx.restore();

  // Compress snapshot as JPEG 85% to reduce RAM usage on mobile devices
  return canvas.toDataURL("image/jpeg", 0.85);
};

/**
 * Record 1.5-second short live video snippet (MP4 preferred, WebM fallback).
 * Supports MediaStream or composite HTMLCanvasElement stream.
 */
export const recordLiveVideoSnippet = (
  stream: MediaStream | HTMLCanvasElement,
  durationMs: number = 1500
): Promise<string> => {
  return new Promise((resolve) => {
    try {
      if (typeof window === "undefined" || typeof MediaRecorder === "undefined") {
        return resolve("");
      }

      let mediaStream: MediaStream;
      if (stream instanceof HTMLCanvasElement) {
        const captureFn =
          stream.captureStream ||
          (stream as unknown as { webkitCaptureStream?: (fps?: number) => MediaStream }).webkitCaptureStream;
        if (!captureFn) {
          return resolve("");
        }
        mediaStream = captureFn.call(stream, 30);
      } else {
        mediaStream = stream;
      }

      let options: MediaRecorderOptions | undefined = undefined;
      let effectiveMime = "video/mp4";

      if (typeof MediaRecorder.isTypeSupported === "function") {
        if (MediaRecorder.isTypeSupported("video/mp4;codecs=avc1")) {
          options = { mimeType: "video/mp4;codecs=avc1" };
          effectiveMime = "video/mp4";
        } else if (MediaRecorder.isTypeSupported("video/mp4")) {
          options = { mimeType: "video/mp4" };
          effectiveMime = "video/mp4";
        } else if (MediaRecorder.isTypeSupported("video/webm;codecs=vp9")) {
          options = { mimeType: "video/webm;codecs=vp9" };
          effectiveMime = "video/webm";
        } else if (MediaRecorder.isTypeSupported("video/webm")) {
          options = { mimeType: "video/webm" };
          effectiveMime = "video/webm";
        }
      }

      let recorder: MediaRecorder;
      try {
        recorder = options ? new MediaRecorder(mediaStream, options) : new MediaRecorder(mediaStream);
      } catch (optErr) {
        // iOS Safari fallback: initialize without mimeType option
        recorder = new MediaRecorder(mediaStream);
      }

      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = () => {
        try {
          const blobType = recorder.mimeType || effectiveMime;
          const blob = new Blob(chunks, { type: blobType });
          const videoUrl = URL.createObjectURL(blob);
          resolve(videoUrl);
        } catch (blobErr) {
          console.warn("Failed to create live video blob:", blobErr);
          resolve("");
        }
      };

      recorder.start();
      setTimeout(() => {
        try {
          if (recorder.state !== "inactive") {
            recorder.stop();
          }
        } catch (stopErr) {
          resolve("");
        }
      }, durationMs);
    } catch (err) {
      console.warn("Live photo snippet recording failed fallback:", err);
      resolve("");
    }
  });
};
