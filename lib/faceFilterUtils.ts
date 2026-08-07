/**
 * Real-time MediaPipe 3D Face Mesh AR Filter Engine for rielllybooth ♡
 * Tracks 468 facial landmarks and renders AR Face Filters (puppy, cat_whiskers, coquette_blush, sunglasses).
 */

import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

export type ARFaceFilterPreset = "none" | "puppy" | "cat_whiskers" | "coquette_blush" | "sunglasses";

let faceLandmarkerInstance: FaceLandmarker | null = null;
let isInitializingFace = false;

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
        modelAssetPath: "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
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
 * Draws AR Face Filter Overlay vectors onto 2D canvas using 468 MediaPipe Face Mesh landmarks.
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

  const eyeDx = rightEye.x - leftEye.x;
  const eyeDy = rightEye.y - leftEye.y;
  const faceWidth = Math.hypot(eyeDx, eyeDy);
  const faceAngle = Math.atan2(eyeDy, eyeDx);

  ctx.save();

  if (preset === "puppy") {
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
    // Left Ear
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

    // Right Ear
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
  } else if (preset === "cat_whiskers") {
    // 1. Cat Nose
    ctx.fillStyle = "#f472b6";
    ctx.beginPath();
    ctx.ellipse(nose.x, nose.y + 2, faceWidth * 0.08, faceWidth * 0.06, 0, 0, Math.PI * 2);
    ctx.fill();

    // 2. Cat Whiskers
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

    // 3. Pointy Cat Ears
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
    ctx.fillStyle = "#f472b6";
    ctx.beginPath();
    ctx.moveTo(-earW / 3, -5);
    ctx.lineTo(0, -earH * 0.75);
    ctx.lineTo(earW / 3, -5);
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
    ctx.fillStyle = "#f472b6";
    ctx.beginPath();
    ctx.moveTo(-earW / 3, -5);
    ctx.lineTo(0, -earH * 0.75);
    ctx.lineTo(earW / 3, -5);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  } else if (preset === "coquette_blush") {
    // Soft Pink Blush Circles
    const blushR = faceWidth * 0.28;

    const leftGrad = ctx.createRadialGradient(leftCheek.x, leftCheek.y, blushR * 0.1, leftCheek.x, leftCheek.y, blushR);
    leftGrad.addColorStop(0, "rgba(244, 114, 182, 0.65)");
    leftGrad.addColorStop(1, "rgba(244, 114, 182, 0)");
    ctx.fillStyle = leftGrad;
    ctx.beginPath();
    ctx.arc(leftCheek.x, leftCheek.y, blushR, 0, Math.PI * 2);
    ctx.fill();

    const rightGrad = ctx.createRadialGradient(rightCheek.x, rightCheek.y, blushR * 0.1, rightCheek.x, rightCheek.y, blushR);
    rightGrad.addColorStop(0, "rgba(244, 114, 182, 0.65)");
    rightGrad.addColorStop(1, "rgba(244, 114, 182, 0)");
    ctx.fillStyle = rightGrad;
    ctx.beginPath();
    ctx.arc(rightCheek.x, rightCheek.y, blushR, 0, Math.PI * 2);
    ctx.fill();

    // Ribbon Bows
    const drawBow = (bx: number, by: number, scale: number) => {
      ctx.save();
      ctx.translate(bx, by);
      ctx.scale(scale, scale);
      ctx.fillStyle = "#ff5588";
      ctx.beginPath();
      ctx.ellipse(-14, 0, 14, 10, 0, 0, Math.PI * 2);
      ctx.ellipse(14, 0, 14, 10, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(0, 0, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    drawBow(forehead.x - faceWidth * 0.5, forehead.y, faceWidth * 0.012);
    drawBow(forehead.x + faceWidth * 0.5, forehead.y, faceWidth * 0.012);
  } else if (preset === "sunglasses") {
    // Dark Sunglasses
    ctx.save();
    const eyeCenter = {
      x: (leftEye.x + rightEye.x) / 2,
      y: (leftEye.y + rightEye.y) / 2,
    };
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

    ctx.beginPath();
    ctx.moveTo(-6, -glassH * 0.1);
    ctx.lineTo(6, -glassH * 0.1);
    ctx.stroke();

    ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
    ctx.beginPath();
    ctx.moveTo(-glassW - 2, -glassH / 3);
    ctx.lineTo(-glassW + 16, -glassH / 3);
    ctx.lineTo(-glassW + 4, glassH / 3);
    ctx.lineTo(-glassW - 14, glassH / 3);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(10, -glassH / 3);
    ctx.lineTo(28, -glassH / 3);
    ctx.lineTo(16, glassH / 3);
    ctx.lineTo(-2, glassH / 3);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }

  ctx.restore();
};
