/**
 * Camera Utility module for WebRTC stream management and video frame snapshot capturing.
 */

export const startCameraStream = async (): Promise<MediaStream> => {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    throw new Error("Kamera tidak didukung pada peramban ini.");
  }

  try {
    // Standard high quality resolution request
    return await navigator.mediaDevices.getUserMedia({
      video: {
        width: { ideal: 1280 },
        height: { ideal: 720 },
        facingMode: "user",
      },
      audio: false,
    });
  } catch (err: unknown) {
    console.warn("Retrying camera stream initialization with default constraints...", err);
    // Fallback if specific ideal constraints fail or hardware has restrictions
    try {
      return await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });
    } catch (fallbackErr: unknown) {
      if (fallbackErr instanceof Error) {
        if (fallbackErr.name === "NotReadableError") {
          throw new Error("Kamera sedang digunakan oleh aplikasi lain (Zoom, OBS, Discord, atau browser tab lain). Silakan tutup aplikasi tersebut dan coba lagi.");
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
  stream.getTracks().forEach((track) => {
    track.stop();
  });
};

export const captureCanvasSnapshot = (
  video: HTMLVideoElement,
  mirror: boolean = true
): string => {
  const canvas = document.createElement("canvas");
  const width = video.videoWidth || 1280;
  const height = video.videoHeight || 720;

  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.save();
    if (mirror) {
      ctx.translate(width, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(video, 0, 0, width, height);
    ctx.restore();
  }

  return canvas.toDataURL("image/png");
};
