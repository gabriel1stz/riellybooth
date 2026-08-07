/**
 * Real-time MediaPipe 3D Face Mesh AR Filter Engine for rielllybooth ♡
 * Preloads all 8 transparent PNG filter images from /public/filters/ with error logging and immediate fallback drawing.
 */

import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

export type ARFaceFilterPreset =
  | "none"
  | "dog"
  | "coquette"
  | "cat"
  | "pixel"
  | "chef"
  | "diving"
  | "santa"
  | "strawberry"
  // Legacy aliases
  | "dog_classic"
  | "dog_coquette"
  | "cat_whiskers"
  | "pixel_glasses"
  | "chef_hat"
  | "diving_mask"
  | "santa_beard"
  | "strawberry_hat"
  | "puppy"
  | "sunglasses"
  | "coquette_blush";

let faceLandmarkerInstance: FaceLandmarker | null = null;
let isInitializingFace = false;

// Preloaded HTMLImageElement ImageCache
const ImageCache: Map<string, HTMLImageElement> = new Map();

// Exact filter paths matching /public/filters/
const filterAssetMap: Record<string, string> = {
  pixel: "/filters/pixel-glasses.png",
  pixel_glasses: "/filters/pixel-glasses.png",
  sunglasses: "/filters/pixel-glasses.png",
  cat: "/filters/cat-whiskers.png",
  cat_whiskers: "/filters/cat-whiskers.png",
  dog: "/filters/dog-classic.png",
  dog_classic: "/filters/dog-classic.png",
  puppy: "/filters/dog-classic.png",
  chef: "/filters/chef-hat.png",
  chef_hat: "/filters/chef-hat.png",
  diving: "/filters/diving-mask.png",
  diving_mask: "/filters/diving-mask.png",
  santa: "/filters/santa-beard.png",
  santa_beard: "/filters/santa-beard.png",
  santa_beard_glasses: "/filters/santa-beard.png",
  coquette: "/filters/dog-coquette.png",
  dog_coquette: "/filters/dog-coquette.png",
  coquette_blush: "/filters/dog-coquette.png",
  strawberry: "/filters/strawberry-hat.png",
  strawberry_hat: "/filters/strawberry-hat.png",
};

// Robust Preloading with Error Logging
if (typeof window !== "undefined") {
  Object.entries(filterAssetMap).forEach(([presetKey, srcPath]) => {
    if (!ImageCache.has(srcPath)) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        ImageCache.set(srcPath, img);
      };
      img.onerror = () => {
        console.error("Failed to load filter image:", srcPath);
      };
      img.src = srcPath;
      ImageCache.set(presetKey, img);
    }
  });
}

const getImageFromCache = (preset: string): HTMLImageElement | null => {
  const src = filterAssetMap[preset] || filterAssetMap.dog;
  let cached = ImageCache.get(src) || ImageCache.get(preset);
  if (!cached && typeof window !== "undefined" && src) {
    cached = new Image();
    cached.crossOrigin = "anonymous";
    cached.onerror = () => console.error("Failed to load filter image:", src);
    cached.src = src;
    ImageCache.set(src, cached);
  }
  return cached || null;
};

const normalizePresetKey = (preset: string): string => {
  if (preset === "puppy" || preset === "dog_classic") return "dog";
  if (preset === "cat_whiskers") return "cat";
  if (preset === "pixel_glasses" || preset === "sunglasses") return "pixel";
  if (preset === "coquette_blush" || preset === "dog_coquette") return "coquette";
  if (preset === "chef_hat") return "chef";
  if (preset === "diving_mask") return "diving";
  if (preset === "santa_beard" || preset === "santa") return "santa";
  if (preset === "strawberry_hat") return "strawberry";
  return preset;
};

export const getFaceLandmarker = async (): Promise<FaceLandmarker | null> => {
  if (faceLandmarkerInstance) return faceLandmarkerInstance;
  if (isInitializingFace) return null;

  try {
    isInitializingFace = true;
    const vision = await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
    );
    faceLandmarkerInstance = await FaceLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath:
          "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
        delegate: "GPU",
      },
      runningMode: "VIDEO",
      numFaces: 1,
    });
    isInitializingFace = false;
    return faceLandmarkerInstance;
  } catch (err) {
    console.warn("MediaPipe FaceLandmarker initialization warning:", err);
    isInitializingFace = false;
    return null;
  }
};

/**
 * Draws preloaded PNG filter images onto 2D canvas using ctx.drawImage().
 * Uses 3D facial landmarks if detected, or IMMEDIATE DRAWING FALLBACK (X = width/2, Y = height*0.35)
 * so filters NEVER stay blank or invisible!
 */
export const drawARFaceFilter = (
  ctx: CanvasRenderingContext2D,
  landmarks: Array<{ x: number; y: number; z: number }> | null,
  preset: string,
  width: number,
  height: number,
  isFlipped: boolean = false
) => {
  if (!preset || preset === "none") return;

  const img = getImageFromCache(preset);
  if (!img) return;

  ctx.save();

  const normKey = normalizePresetKey(preset);

  if (landmarks && landmarks.length >= 468) {
    // 1. Landmark Tracking Mode
    const getPt = (idx: number) => {
      const pt = landmarks[idx] || landmarks[0];
      const x = isFlipped ? (1 - pt.x) * width : pt.x * width;
      const y = pt.y * height;
      return { x, y };
    };

    const nose = getPt(1);             // Landmark #1
    const forehead = getPt(10);         // Landmark #10
    const noseBridge = getPt(168);      // Landmark #168
    const leftEye = getPt(33);          // Landmark #33
    const rightEye = getPt(263);        // Landmark #263
    const chin = getPt(152);            // Landmark #152
    const leftTemple = getPt(234);      // Landmark #234
    const rightTemple = getPt(454);     // Landmark #454

    const eyeDx = rightEye.x - leftEye.x;
    const eyeDy = rightEye.y - leftEye.y;
    const faceWidth = Math.hypot(eyeDx, eyeDy);
    const faceAngle = Math.atan2(eyeDy, eyeDx);
    const templeDist = Math.hypot(rightTemple.x - leftTemple.x, rightTemple.y - leftTemple.y);

    if (normKey === "pixel") {
      // Landmark #33, #263
      const eyeCenter = { x: (leftEye.x + rightEye.x) / 2, y: (leftEye.y + rightEye.y) / 2 };
      ctx.translate(eyeCenter.x, eyeCenter.y);
      ctx.rotate(faceAngle);
      const targetW = faceWidth * 1.35;
      const aspect = (img.naturalHeight || 120) / (img.naturalWidth || 300);
      const targetH = targetW * aspect;
      ctx.drawImage(img, -targetW / 2, -targetH / 2, targetW, targetH);
    } else if (normKey === "cat") {
      // Landmark #1, #117
      ctx.translate(nose.x, nose.y);
      ctx.rotate(faceAngle);
      const targetW = faceWidth * 1.5;
      const aspect = (img.naturalHeight || 200) / (img.naturalWidth || 300);
      const targetH = targetW * aspect;
      ctx.drawImage(img, -targetW / 2, -targetH * 0.45, targetW, targetH);
    } else if (normKey === "dog") {
      // Landmark #10 forehead & #1 nose
      const centerPoint = { x: (forehead.x + nose.x) / 2, y: (forehead.y + nose.y) / 2 };
      ctx.translate(centerPoint.x, centerPoint.y);
      ctx.rotate(faceAngle);
      const targetW = faceWidth * 1.6;
      const aspect = (img.naturalHeight || 250) / (img.naturalWidth || 300);
      const targetH = targetW * aspect;
      ctx.drawImage(img, -targetW / 2, -targetH * 0.4, targetW, targetH);
    } else if (normKey === "coquette") {
      // Landmark #10 forehead & cheeks
      ctx.translate(forehead.x, forehead.y + faceWidth * 0.1);
      ctx.rotate(faceAngle);
      const targetW = faceWidth * 1.6;
      const aspect = (img.naturalHeight || 250) / (img.naturalWidth || 300);
      const targetH = targetW * aspect;
      ctx.drawImage(img, -targetW / 2, -targetH * 0.35, targetW, targetH);
    } else if (normKey === "chef") {
      // Landmark #10 forehead
      ctx.translate(forehead.x, forehead.y - faceWidth * 0.35);
      ctx.rotate(faceAngle);
      const targetW = faceWidth * 1.4;
      const aspect = (img.naturalHeight || 250) / (img.naturalWidth || 300);
      const targetH = targetW * aspect;
      ctx.drawImage(img, -targetW / 2, -targetH * 0.7, targetW, targetH);
    } else if (normKey === "diving") {
      // Landmark #168 nose bridge
      ctx.translate(noseBridge.x, noseBridge.y);
      ctx.rotate(faceAngle);
      const targetW = faceWidth * 1.5;
      const aspect = (img.naturalHeight || 200) / (img.naturalWidth || 300);
      const targetH = targetW * aspect;
      ctx.drawImage(img, -targetW / 2, -targetH / 2, targetW, targetH);
    } else if (normKey === "santa") {
      // Landmark #152 chin
      ctx.translate(chin.x, chin.y + faceWidth * 0.1);
      ctx.rotate(faceAngle);
      const targetW = faceWidth * 1.7;
      const aspect = (img.naturalHeight || 300) / (img.naturalWidth || 300);
      const targetH = targetW * aspect;
      ctx.drawImage(img, -targetW / 2, -targetH * 0.65, targetW, targetH);
    } else if (normKey === "strawberry") {
      // Landmark #10 forehead & #234, #454 temples
      ctx.translate(forehead.x, forehead.y - faceWidth * 0.25);
      ctx.rotate(faceAngle);
      const targetW = templeDist * 1.6;
      const aspect = (img.naturalHeight || 220) / (img.naturalWidth || 300);
      const targetH = targetW * aspect;
      ctx.drawImage(img, -targetW / 2, -targetH * 0.6, targetW, targetH);
    } else {
      ctx.translate(nose.x, nose.y);
      const targetW = faceWidth * 1.5;
      const aspect = (img.naturalHeight || 200) / (img.naturalWidth || 300);
      const targetH = targetW * aspect;
      ctx.drawImage(img, -targetW / 2, -targetH / 2, targetW, targetH);
    }
  } else {
    // 2. IMMEDIATE DRAWING FALLBACK (X = width / 2, Y = height * 0.35)
    // DO NOT SKIP DRAWING! Draw immediately at default head position
    const centerX = width / 2;
    const centerY = height * 0.35;
    const targetW = width * 0.55;
    const aspect = (img.naturalHeight || 200) / (img.naturalWidth || 300);
    const targetH = targetW * aspect;

    ctx.translate(centerX, centerY);
    ctx.drawImage(img, -targetW / 2, -targetH / 2, targetW, targetH);
  }

  ctx.restore();
};

export const drawFaceFilterOverlay = drawARFaceFilter;
