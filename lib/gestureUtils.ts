/**
 * AI Gesture Detection Module using MediaPipe HandLandmarker tasks-vision.
 * Detects Peace / V-Sign ✌️ gesture in video frames.
 */

import { HandLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

let landmarkerInstance: HandLandmarker | null = null;
let isInitializing = false;

export const getHandLandmarker = async (): Promise<HandLandmarker | null> => {
  if (landmarkerInstance) return landmarkerInstance;
  if (isInitializing) return null;

  try {
    isInitializing = true;
    const vision = await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
    );
    landmarkerInstance = await HandLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath: "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
        delegate: "GPU",
      },
      runningMode: "VIDEO",
      numHands: 1,
    });
    isInitializing = false;
    return landmarkerInstance;
  } catch (err) {
    console.warn("MediaPipe HandLandmarker initialization warning:", err);
    isInitializing = false;
    return null;
  }
};

/**
 * Checks if hand landmarks match a Peace / V-Sign ✌️ gesture.
 * Landmark indices:
 * Index: tip 8, PIP 6
 * Middle: tip 12, PIP 10
 * Ring: tip 16, PIP 14
 * Pinky: tip 20, PIP 18
 */
export const isPeaceSignGesture = (landmarks: Array<{ x: number; y: number; z: number }>): boolean => {
  if (!landmarks || landmarks.length < 21) return false;

  const indexTip = landmarks[8];
  const indexPip = landmarks[6];

  const middleTip = landmarks[12];
  const middlePip = landmarks[10];

  const ringTip = landmarks[16];
  const ringPip = landmarks[14];

  const pinkyTip = landmarks[20];
  const pinkyPip = landmarks[18];

  // 1. Index and Middle fingers extended upwards (tip higher/smaller Y than PIP in canvas coordinates)
  const isIndexExtended = indexTip.y < indexPip.y;
  const isMiddleExtended = middleTip.y < middlePip.y;

  // 2. Ring and Pinky fingers curled down (tip lower/larger Y than PIP)
  const isRingCurled = ringTip.y > ringPip.y;
  const isPinkyCurled = pinkyTip.y > pinkyPip.y;

  // 3. Distance between Index tip and Middle tip (V-shape spread)
  const dx = indexTip.x - middleTip.x;
  const dy = indexTip.y - middleTip.y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const isVShapeSpread = dist > 0.035;

  return isIndexExtended && isMiddleExtended && isRingCurled && isPinkyCurled && isVShapeSpread;
};
