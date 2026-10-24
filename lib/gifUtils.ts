import { GIFEncoder, quantize, applyPalette } from "gifenc";

/**
 * Capture an animated GIF from a live canvas element (e.g. Live Photo moving strip)
 * Automatically resizes to optimal resolution (~400px width) for fast encoding and small file size.
 */
export async function createGifFromCanvas(
  canvas: HTMLCanvasElement,
  options: {
    frameCount?: number;
    delay?: number; // in milliseconds per frame
    maxWidth?: number;
    onProgress?: (progress: number) => void;
  } = {}
): Promise<Blob> {
  const { frameCount = 10, delay = 180, maxWidth = 380, onProgress } = options;

  const originalWidth = canvas.width;
  const originalHeight = canvas.height;

  // Scale down proportionately for lightweight GIF
  const scale = Math.min(1, maxWidth / originalWidth);
  const targetWidth = Math.round(originalWidth * scale);
  const targetHeight = Math.round(originalHeight * scale);

  const offscreen = document.createElement("canvas");
  offscreen.width = targetWidth;
  offscreen.height = targetHeight;
  const offCtx = offscreen.getContext("2d", { willReadFrequently: true });
  if (!offCtx) {
    throw new Error("Unable to create offscreen canvas context");
  }

  const gif = GIFEncoder();

  for (let i = 0; i < frameCount; i++) {
    // Draw current canvas state into scaled offscreen canvas
    offCtx.clearRect(0, 0, targetWidth, targetHeight);
    offCtx.drawImage(canvas, 0, 0, targetWidth, targetHeight);

    const imageData = offCtx.getImageData(0, 0, targetWidth, targetHeight);
    const { data } = imageData;

    // Quantize 256 colors palette
    const palette = quantize(data, 256);
    const index = applyPalette(data, palette);

    gif.writeFrame(index, targetWidth, targetHeight, {
      palette,
      delay,
    });

    if (onProgress) {
      onProgress(Math.round(((i + 1) / frameCount) * 100));
    }

    // Small delay between frame samples
    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  gif.finish();

  const bytes = gif.bytes();
  return new Blob([bytes.buffer as ArrayBuffer], { type: "image/gif" });
}
