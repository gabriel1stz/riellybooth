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
  if (!stream) return;
  stream.getTracks().forEach((track) => track.stop());
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
  mirror: boolean = false
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

  ctx.drawImage(videoEl, 0, 0, width, height);
  ctx.restore();

  return canvas.toDataURL("image/png");
};

/**
 * Record 1.5-second short live video snippet (MP4 preferred, WebM fallback).
 */
export const recordLiveVideoSnippet = (
  stream: MediaStream,
  durationMs: number = 1500
): Promise<string> => {
  return new Promise((resolve) => {
    try {
      let mimeType = "video/mp4;codecs=avc1";
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = "video/mp4";
      }
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = "video/webm;codecs=vp9";
      }
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = "video/webm";
      }

      const recorder = new MediaRecorder(stream, { mimeType });
      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: mimeType });
        const videoUrl = URL.createObjectURL(blob);
        resolve(videoUrl);
      };

      recorder.start();
      setTimeout(() => {
        if (recorder.state !== "inactive") {
          recorder.stop();
        }
      }, durationMs);
    } catch (err) {
      console.warn("Live photo snippet recording failed fallback:", err);
      resolve("");
    }
  });
};
