/**
 * Camera Utility module for WebRTC stream management, video frame snapshot capturing,
 * and 1.5s Live Photo (moving photo / boomerang video) snippet recording.
 */

export const startCameraStream = async (): Promise<MediaStream> => {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    throw new Error("Kamera tidak didukung pada peramban ini.");
  }

  try {
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
    try {
      return await navigator.mediaDevices.getUserMedia({
        video: true,
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
  stream.getTracks().forEach((track) => {
    track.stop();
  });
};

/**
 * Captures video snapshot. Defaults to mirror = false (un-mirrored normal orientation)
 * so clothing text and faces read correctly!
 */
export const captureCanvasSnapshot = (
  video: HTMLVideoElement,
  mirror: boolean = false
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

/**
 * Records a 1.5-second live video snippet (Live Photo / boomerang) from camera stream using MediaRecorder.
 */
export const recordLiveVideoSnippet = (
  stream: MediaStream,
  durationMs: number = 1500
): Promise<string> => {
  return new Promise((resolve) => {
    try {
      let mimeType = "video/webm;codecs=vp9";
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = "video/webm";
      }
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = "";
      }

      const mediaRecorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      const chunks: Blob[] = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: mimeType || "video/webm" });
        const videoBlobUrl = URL.createObjectURL(blob);
        resolve(videoBlobUrl);
      };

      mediaRecorder.start();

      setTimeout(() => {
        if (mediaRecorder.state !== "inactive") {
          mediaRecorder.stop();
        }
      }, durationMs);
    } catch (err) {
      console.warn("Live photo video snippet recording unsupported or failed:", err);
      resolve("");
    }
  });
};
