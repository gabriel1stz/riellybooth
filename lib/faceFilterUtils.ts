/**
 * Real-time MediaPipe 3D Face Mesh AR Filter Engine for rielllybooth ♡
 * Tracks 468 facial landmarks and renders AR Face Filters:
 * 1. pixel_glasses (Pixel Glasses 🕶️)
 * 2. cat (Cat Whiskers 🐱)
 * 3. dog_classic (Classic Snapchat Dog 🐶)
 * 4. chef_hat (Chef Hat 👨‍🍳)
 * 5. diving_mask (Snorkeling Mask 🤿)
 * 6. santa (Santa Beard & Glasses 🎅)
 * 7. dog_coquette (Coquette Dog & Kiss Stamp 🎀💋)
 * 8. strawberry (Strawberry Bonnet 🍓)
 */

import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

export type ARFaceFilterPreset =
  | "none"
  | "dog_classic"
  | "dog_coquette"
  | "cat"
  | "pixel_glasses"
  | "chef_hat"
  | "diving_mask"
  | "santa"
  | "strawberry"
  // Legacy backward-compatible aliases
  | "puppy"
  | "cat_whiskers"
  | "coquette_blush"
  | "sunglasses";

let faceLandmarkerInstance: FaceLandmarker | null = null;
let isInitializingFace = false;

// Preloaded PNG Filter Image Cache
const filterImagesCache: Map<string, HTMLImageElement> = new Map();

const filterAssetMap: Record<string, string> = {
  pixel_glasses: "/filters/pixel-glasses.png",
  sunglasses: "/filters/pixel-glasses.png",
  cat: "/filters/cat-whiskers.png",
  cat_whiskers: "/filters/cat-whiskers.png",
  dog_classic: "/filters/dog-classic.png",
  puppy: "/filters/dog-classic.png",
  chef_hat: "/filters/chef-hat.png",
  diving_mask: "/filters/diving-mask.png",
  santa: "/filters/santa-beard.png",
  dog_coquette: "/filters/dog-coquette.png",
  coquette_blush: "/filters/dog-coquette.png",
  strawberry: "/filters/strawberry-hat.png",
};

// Preload filter assets in browser environment
if (typeof window !== "undefined") {
  Object.entries(filterAssetMap).forEach(([preset, src]) => {
    if (!filterImagesCache.has(src)) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = src;
      img.onload = () => {
        filterImagesCache.set(src, img);
      };
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
 * Draws AR Face Filter Overlay vectors & PNG assets onto 2D canvas using 468 MediaPipe Face Mesh landmarks.
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
    const pt = landmarks[idx];
    const x = isFlipped ? (1 - pt.x) * width : pt.x * width;
    const y = pt.y * height;
    return { x, y };
  };

  const nose = getPt(1);
  const forehead = getPt(10);
  const leftCheek = getPt(117);
  const rightCheek = getPt(346);
  const leftEye = getPt(33);
  const rightEye = getPt(263);
  const chin = getPt(152);

  const eyeDx = rightEye.x - leftEye.x;
  const eyeDy = rightEye.y - leftEye.y;
  const faceWidth = Math.hypot(eyeDx, eyeDy);
  const faceAngle = Math.atan2(eyeDy, eyeDx);

  ctx.save();

  // Normalize filter preset key
  const normPreset =
    preset === "puppy"
      ? "dog_classic"
      : preset === "cat_whiskers"
      ? "cat"
      : preset === "coquette_blush"
      ? "dog_coquette"
      : preset === "sunglasses"
      ? "pixel_glasses"
      : preset;

  // Try PNG image asset overlay first if loaded
  const assetSrc = filterAssetMap[normPreset];
  const cachedImg = assetSrc ? filterImagesCache.get(assetSrc) : null;

  if (cachedImg && cachedImg.complete && cachedImg.naturalWidth > 0) {
    ctx.save();
    if (normPreset === "pixel_glasses") {
      const eyeCenter = { x: (leftEye.x + rightEye.x) / 2, y: (leftEye.y + rightEye.y) / 2 };
      ctx.translate(eyeCenter.x, eyeCenter.y);
      ctx.rotate(faceAngle);
      const w = faceWidth * 1.4;
      const h = (w * cachedImg.naturalHeight) / cachedImg.naturalWidth;
      ctx.drawImage(cachedImg, -w / 2, -h / 2, w, h);
    } else if (normPreset === "chef_hat" || normPreset === "strawberry") {
      ctx.translate(forehead.x, forehead.y - faceWidth * 0.4);
      ctx.rotate(faceAngle);
      const w = faceWidth * 1.5;
      const h = (w * cachedImg.naturalHeight) / cachedImg.naturalWidth;
      ctx.drawImage(cachedImg, -w / 2, -h / 2, w, h);
    } else if (normPreset === "santa") {
      ctx.translate(forehead.x, forehead.y + faceWidth * 0.3);
      ctx.rotate(faceAngle);
      const w = faceWidth * 1.8;
      const h = (w * cachedImg.naturalHeight) / cachedImg.naturalWidth;
      ctx.drawImage(cachedImg, -w / 2, -h / 2, w, h);
    } else {
      ctx.translate(nose.x, nose.y - faceWidth * 0.2);
      ctx.rotate(faceAngle);
      const w = faceWidth * 1.6;
      const h = (w * cachedImg.naturalHeight) / cachedImg.naturalWidth;
      ctx.drawImage(cachedImg, -w / 2, -h / 2, w, h);
    }
    ctx.restore();
  }

  // High quality vector fallback drawing logic
  if (normPreset === "dog_classic") {
    // 1. Puppy Nose Tip
    ctx.fillStyle = "#27272a";
    ctx.beginPath();
    ctx.ellipse(nose.x, nose.y + 4, faceWidth * 0.14, faceWidth * 0.1, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.ellipse(nose.x - faceWidth * 0.04, nose.y + 2, faceWidth * 0.04, faceWidth * 0.03, 0, 0, Math.PI * 2);
    ctx.fill();

    // 2. Floppy Puppy Ears on Head
    const earScale = faceWidth * 0.7;
    ctx.save();
    ctx.translate(forehead.x - faceWidth * 0.6, forehead.y - faceWidth * 0.2);
    ctx.rotate(faceAngle - 0.2);
    ctx.fillStyle = "#78350f";
    ctx.beginPath();
    ctx.ellipse(0, 0, earScale * 0.4, earScale * 0.8, 0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#fbcfe8";
    ctx.beginPath();
    ctx.ellipse(0, 0, earScale * 0.25, earScale * 0.6, 0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.translate(forehead.x + faceWidth * 0.6, forehead.y - faceWidth * 0.2);
    ctx.rotate(faceAngle + 0.2);
    ctx.fillStyle = "#78350f";
    ctx.beginPath();
    ctx.ellipse(0, 0, earScale * 0.4, earScale * 0.8, -0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#fbcfe8";
    ctx.beginPath();
    ctx.ellipse(0, 0, earScale * 0.25, earScale * 0.6, -0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  } else if (normPreset === "dog_coquette") {
    // Floppy ears with pink ribbon bow + lipstick kiss stamp on cheek
    const earScale = faceWidth * 0.7;
    ctx.save();
    ctx.translate(forehead.x - faceWidth * 0.6, forehead.y - faceWidth * 0.2);
    ctx.rotate(faceAngle - 0.2);
    ctx.fillStyle = "#ff75c3";
    ctx.beginPath();
    ctx.ellipse(0, 0, earScale * 0.4, earScale * 0.8, 0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.translate(forehead.x + faceWidth * 0.6, forehead.y - faceWidth * 0.2);
    ctx.rotate(faceAngle + 0.2);
    ctx.fillStyle = "#ff75c3";
    ctx.beginPath();
    ctx.ellipse(0, 0, earScale * 0.4, earScale * 0.8, -0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Lipstick Kiss Mark on Cheek
    ctx.save();
    ctx.translate(rightCheek.x + 10, rightCheek.y + 10);
    ctx.rotate(0.2);
    ctx.fillStyle = "#ff007f";
    ctx.beginPath();
    ctx.ellipse(-8, 0, 10, 6, -0.3, 0, Math.PI * 2);
    ctx.ellipse(8, 0, 10, 6, 0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  } else if (normPreset === "cat") {
    ctx.fillStyle = "#f472b6";
    ctx.beginPath();
    ctx.ellipse(nose.x, nose.y + 2, faceWidth * 0.08, faceWidth * 0.06, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "#18181b";
    ctx.lineWidth = 3;
    ctx.lineCap = "round";

    for (let i = -1; i <= 1; i++) {
      ctx.beginPath();
      ctx.moveTo(leftCheek.x, leftCheek.y + i * 8);
      ctx.lineTo(leftCheek.x - faceWidth * 0.5, leftCheek.y + i * 16);
      ctx.stroke();
    }
    for (let i = -1; i <= 1; i++) {
      ctx.beginPath();
      ctx.moveTo(rightCheek.x, rightCheek.y + i * 8);
      ctx.lineTo(rightCheek.x + faceWidth * 0.5, rightCheek.y + i * 16);
      ctx.stroke();
    }

    const earW = faceWidth * 0.45;
    const earH = faceWidth * 0.6;

    ctx.save();
    ctx.translate(forehead.x - faceWidth * 0.45, forehead.y - faceWidth * 0.1);
    ctx.rotate(faceAngle - 0.2);
    ctx.fillStyle = "#18181b";
    ctx.beginPath();
    ctx.moveTo(-earW / 2, 0);
    ctx.lineTo(0, -earH);
    ctx.lineTo(earW / 2, 0);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.translate(forehead.x + faceWidth * 0.45, forehead.y - faceWidth * 0.1);
    ctx.rotate(faceAngle + 0.2);
    ctx.fillStyle = "#18181b";
    ctx.beginPath();
    ctx.moveTo(-earW / 2, 0);
    ctx.lineTo(0, -earH);
    ctx.lineTo(earW / 2, 0);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  } else if (normPreset === "pixel_glasses") {
    ctx.save();
    const eyeCenter = { x: (leftEye.x + rightEye.x) / 2, y: (leftEye.y + rightEye.y) / 2 };
    ctx.translate(eyeCenter.x, eyeCenter.y);
    ctx.rotate(faceAngle);

    const glassW = faceWidth * 0.7;
    const glassH = faceWidth * 0.38;

    ctx.fillStyle = "#09090b";
    ctx.strokeStyle = "#ec4899";
    ctx.lineWidth = 4;

    ctx.beginPath();
    ctx.roundRect(-glassW - 6, -glassH / 2, glassW, glassH, 12);
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.roundRect(6, -glassH / 2, glassW, glassH, 12);
    ctx.fill();
    ctx.stroke();

    ctx.restore();
  } else if (normPreset === "chef_hat") {
    ctx.save();
    ctx.translate(forehead.x, forehead.y - faceWidth * 0.4);
    ctx.rotate(faceAngle);
    ctx.fillStyle = "#ffffff";
    ctx.strokeStyle = "#e2e8f0";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.ellipse(0, -faceWidth * 0.2, faceWidth * 0.5, faceWidth * 0.4, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillRect(-faceWidth * 0.35, -faceWidth * 0.1, faceWidth * 0.7, faceWidth * 0.35);
    ctx.restore();
  } else if (normPreset === "diving_mask") {
    ctx.save();
    const eyeCenter = { x: (leftEye.x + rightEye.x) / 2, y: (leftEye.y + rightEye.y) / 2 };
    ctx.translate(eyeCenter.x, eyeCenter.y);
    ctx.rotate(faceAngle);
    ctx.fillStyle = "#f59e0b";
    ctx.beginPath();
    ctx.roundRect(-faceWidth * 0.75, -faceWidth * 0.25, faceWidth * 1.5, faceWidth * 0.5, 20);
    ctx.fill();
    ctx.fillStyle = "rgba(56, 189, 248, 0.7)";
    ctx.beginPath();
    ctx.ellipse(-faceWidth * 0.35, 0, faceWidth * 0.28, faceWidth * 0.18, 0, 0, Math.PI * 2);
    ctx.ellipse(faceWidth * 0.35, 0, faceWidth * 0.28, faceWidth * 0.18, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  } else if (normPreset === "santa") {
    ctx.save();
    ctx.translate(forehead.x, forehead.y - faceWidth * 0.3);
    ctx.rotate(faceAngle);
    ctx.fillStyle = "#ef4444";
    ctx.beginPath();
    ctx.moveTo(-faceWidth * 0.6, 0);
    ctx.lineTo(0, -faceWidth * 0.8);
    ctx.lineTo(faceWidth * 0.6, 0);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(-faceWidth * 0.65, -10, faceWidth * 1.3, 20);
    ctx.restore();
  } else if (normPreset === "strawberry") {
    ctx.save();
    ctx.translate(forehead.x, forehead.y - faceWidth * 0.3);
    ctx.rotate(faceAngle);
    ctx.fillStyle = "#ef4444";
    ctx.beginPath();
    ctx.arc(0, 0, faceWidth * 0.55, Math.PI, 0);
    ctx.fill();
    ctx.fillStyle = "#22c55e";
    ctx.beginPath();
    ctx.ellipse(0, -faceWidth * 0.5, faceWidth * 0.2, faceWidth * 0.1, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  ctx.restore();
};
