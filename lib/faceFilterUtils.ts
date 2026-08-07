/**
 * Real-time MediaPipe 3D Face Mesh AR Filter Engine for rielllybooth ♡
 * Strictly renders 8 transparent PNG filter images from /public/filters/ using HTMLImageElement & ctx.drawImage()
 * anchored to MediaPipe Face Mesh 3D facial landmarks.
 */

import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

export type ARFaceFilterPreset =
  | "none"
  | "pixel_glasses"
  | "cat_whiskers"
  | "dog_classic"
  | "chef_hat"
  | "diving_mask"
  | "santa_beard"
  | "dog_coquette"
  | "strawberry_hat"
  // Legacy aliases
  | "puppy"
  | "cat"
  | "sunglasses"
  | "coquette_blush"
  | "santa"
  | "strawberry";

let faceLandmarkerInstance: FaceLandmarker | null = null;
let isInitializingFace = false;

// Preloaded HTMLImageElement Cache
const filterImagesCache: Map<string, HTMLImageElement> = new Map();

const filterAssetMap: Record<string, string> = {
  pixel_glasses: "/filters/pixel-glasses.png",
  sunglasses: "/filters/pixel-glasses.png",
  cat_whiskers: "/filters/cat-whiskers.png",
  cat: "/filters/cat-whiskers.png",
  dog_classic: "/filters/dog-classic.png",
  puppy: "/filters/dog-classic.png",
  chef_hat: "/filters/chef-hat.png",
  diving_mask: "/filters/diving-mask.png",
  santa_beard: "/filters/santa-beard.png",
  santa: "/filters/santa-beard.png",
  dog_coquette: "/filters/dog-coquette.png",
  coquette_blush: "/filters/dog-coquette.png",
  strawberry_hat: "/filters/strawberry-hat.png",
  strawberry: "/filters/strawberry-hat.png",
};

// Preload all 8 PNG filter image assets
if (typeof window !== "undefined") {
  Object.entries(filterAssetMap).forEach(([presetKey, srcPath]) => {
    if (!filterImagesCache.has(srcPath)) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = srcPath;
      img.onload = () => {
        filterImagesCache.set(srcPath, img);
      };
      // Store under key as well
      filterImagesCache.set(presetKey, img);
    }
  });
}

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
 * Draws preloaded PNG filter images onto 2D canvas using ctx.drawImage() anchored to MediaPipe facial landmarks.
 */
export const drawARFaceFilter = (
  ctx: CanvasRenderingContext2D,
  landmarks: Array<{ x: number; y: number; z: number }>,
  preset: ARFaceFilterPreset,
  width: number,
  height: number,
  isFlipped: boolean = false
) => {
  if (!landmarks || landmarks.length < 468 || preset === "none") return;

  const getPt = (idx: number) => {
    const pt = landmarks[idx] || landmarks[0];
    const x = isFlipped ? (1 - pt.x) * width : pt.x * width;
    const y = pt.y * height;
    return { x, y };
  };

  // Landmark Anchors
  const nose = getPt(1);             // Landmark #1 (Nose tip)
  const forehead = getPt(10);         // Landmark #10 (Top Forehead)
  const noseBridge = getPt(168);      // Landmark #168 (Nose Bridge)
  const leftCheek = getPt(117);       // Landmark #117 (Left Cheek)
  const rightCheek = getPt(346);      // Landmark #346 (Right Cheek)
  const leftEye = getPt(33);          // Landmark #33 (Left Eye outer)
  const rightEye = getPt(263);        // Landmark #263 (Right Eye outer)
  const chin = getPt(152);            // Landmark #152 (Chin)
  const leftTemple = getPt(234);      // Landmark #234 (Left Temple)
  const rightTemple = getPt(454);     // Landmark #454 (Right Temple)

  // Face Geometry Calculations
  const eyeDx = rightEye.x - leftEye.x;
  const eyeDy = rightEye.y - leftEye.y;
  const faceWidth = Math.hypot(eyeDx, eyeDy);
  const faceAngle = Math.atan2(eyeDy, eyeDx);
  const templeDist = Math.hypot(rightTemple.x - leftTemple.x, rightTemple.y - leftTemple.y);

  // Normalize Preset Key
  const normPreset =
    preset === "puppy"
      ? "dog_classic"
      : preset === "cat"
      ? "cat_whiskers"
      : preset === "sunglasses"
      ? "pixel_glasses"
      : preset === "coquette_blush"
      ? "dog_coquette"
      : preset === "santa"
      ? "santa_beard"
      : preset === "strawberry"
      ? "strawberry_hat"
      : preset;

  const assetSrc = filterAssetMap[normPreset];
  let img = assetSrc ? filterImagesCache.get(assetSrc) : null;

  // Fallback to load on-the-fly if not yet cached
  if (!img && assetSrc && typeof window !== "undefined") {
    img = new Image();
    img.crossOrigin = "anonymous";
    img.src = assetSrc;
    filterImagesCache.set(assetSrc, img);
  }

  if (!img || !img.src) return;

  ctx.save();

  if (normPreset === "pixel_glasses") {
    // 1. Pixel Glasses (#33, #263)
    const eyeCenter = { x: (leftEye.x + rightEye.x) / 2, y: (leftEye.y + rightEye.y) / 2 };
    ctx.translate(eyeCenter.x, eyeCenter.y);
    ctx.rotate(faceAngle);
    const targetW = faceWidth * 1.35;
    const aspect = (img.naturalHeight || 120) / (img.naturalWidth || 300);
    const targetH = targetW * aspect;
    ctx.drawImage(img, -targetW / 2, -targetH / 2, targetW, targetH);
  } else if (normPreset === "cat_whiskers") {
    // 2. Cat Whiskers (#1, #117)
    ctx.translate(nose.x, nose.y);
    ctx.rotate(faceAngle);
    const targetW = faceWidth * 1.5;
    const aspect = (img.naturalHeight || 200) / (img.naturalWidth || 300);
    const targetH = targetW * aspect;
    ctx.drawImage(img, -targetW / 2, -targetH * 0.45, targetW, targetH);
  } else if (normPreset === "dog_classic") {
    // 3. Classic Dog (Centered between #10 Forehead & #1 Nose)
    const centerPoint = { x: (forehead.x + nose.x) / 2, y: (forehead.y + nose.y) / 2 };
    ctx.translate(centerPoint.x, centerPoint.y);
    ctx.rotate(faceAngle);
    const targetW = faceWidth * 1.6;
    const aspect = (img.naturalHeight || 250) / (img.naturalWidth || 300);
    const targetH = targetW * aspect;
    ctx.drawImage(img, -targetW / 2, -targetH * 0.4, targetW, targetH);
  } else if (normPreset === "chef_hat") {
    // 4. Chef Hat (Above Forehead #10)
    ctx.translate(forehead.x, forehead.y - faceWidth * 0.35);
    ctx.rotate(faceAngle);
    const targetW = faceWidth * 1.4;
    const aspect = (img.naturalHeight || 250) / (img.naturalWidth || 300);
    const targetH = targetW * aspect;
    ctx.drawImage(img, -targetW / 2, -targetH * 0.7, targetW, targetH);
  } else if (normPreset === "diving_mask") {
    // 5. Diving Mask (Over Nose Bridge #168)
    ctx.translate(noseBridge.x, noseBridge.y);
    ctx.rotate(faceAngle);
    const targetW = faceWidth * 1.5;
    const aspect = (img.naturalHeight || 200) / (img.naturalWidth || 300);
    const targetH = targetW * aspect;
    ctx.drawImage(img, -targetW / 2, -targetH / 2, targetW, targetH);
  } else if (normPreset === "santa_beard") {
    // 6. Santa Beard (Over Chin #152)
    ctx.translate(chin.x, chin.y + faceWidth * 0.1);
    ctx.rotate(faceAngle);
    const targetW = faceWidth * 1.7;
    const aspect = (img.naturalHeight || 300) / (img.naturalWidth || 300);
    const targetH = targetW * aspect;
    ctx.drawImage(img, -targetW / 2, -targetH * 0.65, targetW, targetH);
  } else if (normPreset === "dog_coquette") {
    // 7. Dog Coquette (Over Forehead #10 & Cheeks)
    ctx.translate(forehead.x, forehead.y + faceWidth * 0.1);
    ctx.rotate(faceAngle);
    const targetW = faceWidth * 1.6;
    const aspect = (img.naturalHeight || 250) / (img.naturalWidth || 300);
    const targetH = targetW * aspect;
    ctx.drawImage(img, -targetW / 2, -targetH * 0.35, targetW, targetH);
  } else if (normPreset === "strawberry_hat") {
    // 8. Strawberry Hat (Over Forehead #10 scaled to face width #234, #454)
    ctx.translate(forehead.x, forehead.y - faceWidth * 0.25);
    ctx.rotate(faceAngle);
    const targetW = templeDist * 1.6;
    const aspect = (img.naturalHeight || 220) / (img.naturalWidth || 300);
    const targetH = targetW * aspect;
    ctx.drawImage(img, -targetW / 2, -targetH * 0.6, targetW, targetH);
  }

  ctx.restore();
};
