/**
 * Canvas Utilities for high-resolution photo strip rendering, layout assembly,
 * CSS & pixel filter effects, Webcam Toy retro filters (Pixel Art, Thermal Heatmap,
 * Vivid Pop Art, VHS Retro CRT), Film Grain 🎞️, Soft Beauty Glow ✨, 11 Frame Presets
 * (including Gen Z Viral Presets: Coquette Ribbon 🎀, Y2K Cyber ✨, Receipt Paper 🧾,
 * K-Pop Photocard 💖, Concert Ticket 🎫, Galau Quote ☕, Authentic Newspaper 📰),
 * 9 Layout Modes, interactive sticker overlays with rotation & scale transforms,
 * strict canvas photo bounds clipping, custom event logo sharp rendering, and typography branding engine.
 */

export type LayoutMode =
  | "strip_1x4"
  | "strip_3cut"
  | "grid_2x2"
  | "purikura_4cut"
  | "y2k_checker"
  | "scrapbook"
  | "spotlight"
  | "newspaper_grid"
  | "editorial_vogue"
  | "strip_2"
  | "strip_3"
  | "strip_4";

export type FramePreset =
  | "clean"
  | "coquette"
  | "coquette_black"
  | "y2k"
  | "y2k_bubbles"
  | "newspaper"
  | "film"
  | "polkadot"
  | "receipt"
  | "concert_ticket"
  | "photocard"
  | "retro_manga"
  | "galau_quote"
  | "cute_cat_paw"
  | "pastel_floral"
  | "goth_grunge"
  | "polaroid_vintage";

export type CuteFilter =
  | "none"
  | "soft_pink"
  | "warm_cafe"
  | "cyber_glow"
  | "vintage_90s"
  | "pixel"
  | "thermal"
  | "pop_art"
  | "vhs";

export type FontFamily = "sans" | "serif" | "cursive" | "mono";

export type FilterState = {
  brightness: number;
  contrast: number;
  saturation: number;
  grayscale: number;
  grain: number;
  beautyGlow: number;
  filterIntensity?: number; // 0% to 100%
};

export type PlacedSticker = {
  id: string;
  emoji: string;
  x: number;
  y: number;
  scale?: number;
  rotation?: number; // angle in degrees
};

/**
 * Helper to draw an image centered and covering its container slot with strict boundary clipping.
 */
function drawImageCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement | HTMLVideoElement,
  x: number,
  y: number,
  w: number,
  h: number,
  borderRadius: number = 0,
  isFlipped: boolean = false
) {
  ctx.save();
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  // Strict Clipping Path around container bounds
  ctx.beginPath();
  if (borderRadius > 0) {
    ctx.roundRect(x, y, w, h, borderRadius);
  } else {
    ctx.rect(x, y, w, h);
  }
  ctx.clip();

  if (isFlipped) {
    ctx.translate(x + w, y);
    ctx.scale(-1, 1);
    x = 0;
    y = 0;
  }

  const imgW = (img as HTMLVideoElement).videoWidth || img.width;
  const imgH = (img as HTMLVideoElement).videoHeight || img.height;

  if (!imgW || !imgH) {
    ctx.restore();
    return;
  }

  const imgRatio = imgW / imgH;
  const containerRatio = w / h;

  let renderW = w;
  let renderH = h;
  let offsetX = 0;
  let offsetY = 0;

  if (imgRatio > containerRatio) {
    renderW = h * imgRatio;
    offsetX = (w - renderW) / 2;
  } else {
    renderH = w / imgRatio;
    offsetY = (h - renderH) / 2;
  }

  ctx.drawImage(img, x + offsetX, y + offsetY, renderW, renderH);
  ctx.restore();
}

/**
 * Helper to apply Cute Filters, Webcam Toy Retro FX, & Soft Beauty Glow ✨ (with Filter Intensity blending)
 */
function applyCuteFilterOverlay(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  cuteFilter: CuteFilter,
  beautyGlow: number = 0,
  borderRadius: number = 0,
  filterIntensity: number = 100
) {
  if (cuteFilter === "none" && beautyGlow <= 0) return;

  const alphaMult = Math.max(0, Math.min(100, filterIntensity)) / 100;

  ctx.save();
  ctx.globalAlpha = alphaMult;

  ctx.beginPath();
  if (borderRadius > 0) {
    ctx.roundRect(x, y, w, h, borderRadius);
  } else {
    ctx.rect(x, y, w, h);
  }
  ctx.clip();

  if (beautyGlow > 0) {
    ctx.fillStyle = `rgba(255, 255, 255, ${(beautyGlow / 100) * 0.25})`;
    ctx.globalCompositeOperation = "soft-light";
    ctx.fillRect(x, y, w, h);

    ctx.fillStyle = `rgba(254, 240, 138, ${(beautyGlow / 100) * 0.15})`;
    ctx.globalCompositeOperation = "screen";
    ctx.fillRect(x, y, w, h);
  }

  if (cuteFilter === "soft_pink") {
    ctx.fillStyle = "rgba(244, 114, 182, 0.14)";
    ctx.globalCompositeOperation = "color-burn";
    ctx.fillRect(x, y, w, h);

    ctx.fillStyle = "rgba(251, 207, 232, 0.18)";
    ctx.globalCompositeOperation = "soft-light";
    ctx.fillRect(x, y, w, h);
  } else if (cuteFilter === "warm_cafe") {
    ctx.fillStyle = "rgba(180, 83, 9, 0.20)";
    ctx.globalCompositeOperation = "color";
    ctx.fillRect(x, y, w, h);

    ctx.fillStyle = "rgba(254, 243, 199, 0.15)";
    ctx.globalCompositeOperation = "soft-light";
    ctx.fillRect(x, y, w, h);
  } else if (cuteFilter === "cyber_glow") {
    ctx.fillStyle = "rgba(56, 189, 248, 0.18)";
    ctx.globalCompositeOperation = "overlay";
    ctx.fillRect(x, y, w, h);

    ctx.fillStyle = "rgba(217, 70, 239, 0.15)";
    ctx.globalCompositeOperation = "color-dodge";
    ctx.fillRect(x, y, w, h);
  } else if (cuteFilter === "vintage_90s") {
    ctx.fillStyle = "rgba(120, 53, 15, 0.18)";
    ctx.globalCompositeOperation = "multiply";
    ctx.fillRect(x, y, w, h);
  } else if (cuteFilter === "thermal") {
    ctx.fillStyle = "rgba(239, 68, 68, 0.25)";
    ctx.globalCompositeOperation = "difference";
    ctx.fillRect(x, y, w, h);

    ctx.fillStyle = "rgba(59, 130, 246, 0.3)";
    ctx.globalCompositeOperation = "color-dodge";
    ctx.fillRect(x, y, w, h);
  } else if (cuteFilter === "pop_art") {
    ctx.fillStyle = "rgba(234, 179, 8, 0.25)";
    ctx.globalCompositeOperation = "hard-light";
    ctx.fillRect(x, y, w, h);

    ctx.fillStyle = "rgba(236, 72, 153, 0.2)";
    ctx.globalCompositeOperation = "overlay";
    ctx.fillRect(x, y, w, h);
  } else if (cuteFilter === "vhs") {
    ctx.fillStyle = "rgba(16, 185, 129, 0.15)";
    ctx.globalCompositeOperation = "color-dodge";
    ctx.fillRect(x, y, w, h);

    ctx.strokeStyle = "rgba(0, 0, 0, 0.18)";
    ctx.lineWidth = 2;
    for (let sy = y; sy < y + h; sy += 6) {
      ctx.beginPath();
      ctx.moveTo(x, sy);
      ctx.lineTo(x + w, sy);
      ctx.stroke();
    }
  } else if (cuteFilter === "pixel") {
    ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
    ctx.lineWidth = 1;
    for (let px = x; px < x + w; px += 12) {
      ctx.beginPath();
      ctx.moveTo(px, y);
      ctx.lineTo(px, y + h);
      ctx.stroke();
    }
    for (let py = y; py < y + h; py += 12) {
      ctx.beginPath();
      ctx.moveTo(x, py);
      ctx.lineTo(x + w, py);
      ctx.stroke();
    }
  }

  ctx.restore();
}

/**
 * Analog Film Grain Generator 🎞️
 */
function applyFilmGrainOverlay(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  intensity: number
) {
  if (intensity <= 0) return;

  ctx.save();
  ctx.globalCompositeOperation = "overlay";
  ctx.fillStyle = "#ffffff";

  const numDots = Math.round((width * height * (intensity / 100)) / 15);
  for (let i = 0; i < numDots; i++) {
    const gx = Math.random() * width;
    const gy = Math.random() * height;
    const gSize = Math.random() * 1.8 + 0.5;
    const opacity = Math.random() * 0.25;

    ctx.fillStyle = Math.random() > 0.5 ? `rgba(255,255,255,${opacity})` : `rgba(0,0,0,${opacity})`;
    ctx.fillRect(gx, gy, gSize, gSize);
  }

  ctx.restore();
}

/**
 * Serrated Zigzag Edge Generator for Receipts 🧾
 */
function drawSerratedZigzag(ctx: CanvasRenderingContext2D, width: number, y: number, height: number = 15, numTeeth: number = 24) {
  const toothWidth = width / numTeeth;
  ctx.beginPath();
  ctx.moveTo(0, y);
  for (let i = 0; i < numTeeth; i++) {
    const x1 = i * toothWidth + toothWidth / 2;
    const x2 = (i + 1) * toothWidth;
    ctx.lineTo(x1, y + height);
    ctx.lineTo(x2, y);
  }
}

function drawY2kStar(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number, color: string) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(cx, cy - size);
  ctx.quadraticCurveTo(cx, cy, cx + size, cy);
  ctx.quadraticCurveTo(cx, cy, cx, cy + size);
  ctx.quadraticCurveTo(cx, cy, cx - size, cy);
  ctx.quadraticCurveTo(cx, cy, cx, cy - size);
  ctx.fill();
  ctx.restore();
}

function drawRibbonBow(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  scale: number = 1,
  primaryColor: string = "#f472b6",
  strokeColor: string = "#db2777",
  knotColor: string = "#ec4899"
) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(scale, scale);

  ctx.fillStyle = primaryColor;
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = 2;

  ctx.beginPath();
  ctx.ellipse(-18, -4, 16, 10, -Math.PI / 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.ellipse(18, -4, 16, 10, Math.PI / 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(-6, 2);
  ctx.quadraticCurveTo(-16, 18, -22, 28);
  ctx.lineTo(-14, 28);
  ctx.quadraticCurveTo(-8, 16, -2, 4);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(6, 2);
  ctx.quadraticCurveTo(16, 18, 22, 28);
  ctx.lineTo(14, 28);
  ctx.quadraticCurveTo(8, 16, 2, 4);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = knotColor;
  ctx.beginPath();
  ctx.roundRect(-6, -6, 12, 12, 4);
  ctx.fill();
  ctx.stroke();

  ctx.restore();
}

function drawGlossyBubble(ctx: CanvasRenderingContext2D, cx: number, cy: number, radius: number = 18) {
  ctx.save();
  const grad = ctx.createRadialGradient(cx - radius * 0.3, cy - radius * 0.3, radius * 0.1, cx, cy, radius);
  grad.addColorStop(0, "rgba(255, 255, 255, 0.8)");
  grad.addColorStop(0.5, "rgba(56, 189, 248, 0.3)");
  grad.addColorStop(1, "rgba(236, 72, 153, 0.2)");

  ctx.fillStyle = grad;
  ctx.strokeStyle = "rgba(255, 255, 255, 0.6)";
  ctx.lineWidth = 1.5;

  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.arc(cx - radius * 0.4, cy - radius * 0.4, radius * 0.25, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawCatPaw(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number = 16, mainColor: string = "#f472b6") {
  ctx.save();
  ctx.fillStyle = mainColor;
  ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
  ctx.lineWidth = 1.5;

  ctx.beginPath();
  ctx.ellipse(cx, cy + size * 0.2, size * 0.6, size * 0.45, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  const toeOffsets = [
    { x: -size * 0.5, y: -size * 0.35, r: size * 0.22 },
    { x: -size * 0.2, y: -size * 0.55, r: size * 0.22 },
    { x: size * 0.2, y: -size * 0.55, r: size * 0.22 },
    { x: size * 0.5, y: -size * 0.35, r: size * 0.22 },
  ];

  toeOffsets.forEach((t) => {
    ctx.beginPath();
    ctx.arc(cx + t.x, cy + t.y, t.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  });

  ctx.restore();
}

function drawCherryBlossom(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number = 14, petalColor: string = "#f472b6") {
  ctx.save();
  ctx.fillStyle = petalColor;

  for (let i = 0; i < 5; i++) {
    const angle = (i * Math.PI * 2) / 5 - Math.PI / 2;
    const px = cx + Math.cos(angle) * (size * 0.5);
    const py = cy + Math.sin(angle) * (size * 0.5);

    ctx.beginPath();
    ctx.ellipse(px, py, size * 0.45, size * 0.3, angle, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = "#fbbf24";
  ctx.beginPath();
  ctx.arc(cx, cy, size * 0.2, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

/**
 * Main High-Resolution Photo Strip Render Engine (Supports 9 Layout Modes & Gen Z Frames)
 */
export const drawPhotoStrip = (
  canvas: HTMLCanvasElement,
  images: (HTMLImageElement | HTMLVideoElement)[],
  layout: LayoutMode,
  frameColor: string,
  textColor: string,
  filter: FilterState,
  preset: FramePreset = "clean",
  cuteFilter: CuteFilter = "none",
  customText: string = "rielllybooth ♡",
  fontFamily: FontFamily = "sans",
  subtitleText?: string,
  stickers: PlacedSticker[] = [],
  isFlipped: boolean = false,
  customLogoImg?: HTMLImageElement | null
): void => {
  const ctx = canvas.getContext("2d");
  if (!ctx || images.length === 0) return;

  const isNewspaper = preset === "newspaper" || layout === "newspaper_grid";

  // Determine target canvas dimensions based on layout modes
  let photoCount = 4;
  let targetW = 600;
  let targetH = 1800;

  if (layout === "strip_3cut" || layout === "strip_3") {
    photoCount = 3;
    targetW = 600;
    targetH = 1450;
  } else if (layout === "strip_1x4" || layout === "strip_4" || layout === "y2k_checker") {
    photoCount = 4;
    targetW = 600;
    targetH = 1800;
  } else if (layout === "grid_2x2" || layout === "purikura_4cut" || layout === "scrapbook") {
    photoCount = 4;
    targetW = 1200;
    targetH = 1400;
  } else if (layout === "spotlight" || layout === "editorial_vogue") {
    photoCount = 4;
    targetW = 1000;
    targetH = 1600;
  } else if (isNewspaper) {
    // Precise 1200 x 1800 Newspaper Canvas Dimensions
    photoCount = 4;
    targetW = 1200;
    targetH = 1800;
  } else if (layout === "strip_2") {
    photoCount = 2;
    targetW = 600;
    targetH = 1100;
  }

  // Set dimensions only when changed to avoid canvas clear flicker
  if (canvas.width !== targetW) canvas.width = targetW;
  if (canvas.height !== targetH) canvas.height = targetH;

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const filterString = `brightness(${filter.brightness}%) contrast(${filter.contrast}%) saturate(${filter.saturation}%) grayscale(${filter.grayscale}%)`;
  const padding = preset === "film" || preset === "receipt" || preset === "polaroid_vintage" ? 60 : 36;
  const bottomFooterHeight = isNewspaper ? 0 : preset === "concert_ticket" ? 240 : 220;
  const filterIntensity = filter.filterIntensity ?? 100;

  // STEP 1: BACKGROUND & FRAME PRESETS
  ctx.save();
  if (isNewspaper) {
    // 📰 AUTHENTIC VINTAGE NEWSPAPER FRAME ENGINE ($1200x1800px CANVAS)
    ctx.fillStyle = "#f4f1ea";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Outer Decorative Double Rules
    ctx.strokeStyle = "#1c1917";
    ctx.lineWidth = 3;
    ctx.strokeRect(30, 30, 1140, 1740);
    ctx.lineWidth = 1;
    ctx.strokeRect(36, 36, 1128, 1728);

    // 1. Top Info Bar (Y = 60px)
    ctx.fillStyle = "#1c1917";
    ctx.font = "bold 16px 'Georgia', 'Times New Roman', serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("★ NEWSPAPER PHOTOBOOTH ★   •   EDISI SPESIAL • JAKARTA & SURABAYA   •   VOL. IV NO. 104", canvas.width / 2, 60);

    // Top Double Divider Rule Line (Y = 85px)
    ctx.beginPath();
    ctx.moveTo(45, 83);
    ctx.lineTo(1155, 83);
    ctx.moveTo(45, 87);
    ctx.lineTo(1155, 87);
    ctx.stroke();

    // Main Header Title: "RIELLLYBOOTH" (Y = 160px, 72px BOLD SERIF)
    ctx.font = "bold 72px 'Georgia', 'Times New Roman', serif";
    ctx.fillText("RIELLLYBOOTH", canvas.width / 2, 155);

    // Divider Rule Line (Y = 195px)
    ctx.beginPath();
    ctx.moveTo(45, 195);
    ctx.lineTo(1155, 195);
    ctx.stroke();

    // Tagline (Y = 220px, 20px ITALIC SERIF)
    ctx.font = "italic 20px 'Georgia', 'Times New Roman', serif";
    ctx.fillText('"Today wasn\'t just an ordinary day — it was our timeless scene at rielllybooth."', canvas.width / 2, 222);

    // Middle Divider Rule Line (Y = 245px)
    ctx.beginPath();
    ctx.moveTo(45, 245);
    ctx.lineTo(1155, 245);
    ctx.stroke();

  } else if (preset === "polkadot") {
    ctx.fillStyle = frameColor || "#fce7f3";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#f472b6";
    ctx.globalAlpha = 0.35;
    const dotSpacing = 40;
    const dotRadius = 8;
    for (let dx = 20; dx < canvas.width; dx += dotSpacing) {
      for (let dy = 20; dy < canvas.height; dy += dotSpacing) {
        ctx.beginPath();
        ctx.arc(dx, dy, dotRadius, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1.0;
  } else if (preset === "coquette") {
    ctx.fillStyle = "#fff1f2";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "#f472b6";
    ctx.lineWidth = 4;
    ctx.setLineDash([8, 8]);
    ctx.strokeRect(12, 12, canvas.width - 24, canvas.height - 24);
    ctx.setLineDash([]);
  } else if (preset === "coquette_black") {
    ctx.fillStyle = frameColor || "#fce7f3";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "#18181b";
    ctx.lineWidth = 4;
    ctx.setLineDash([8, 8]);
    ctx.strokeRect(12, 12, canvas.width - 24, canvas.height - 24);
    ctx.setLineDash([]);
  } else if (preset === "y2k_bubbles") {
    const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    grad.addColorStop(0, "#f1f5f9");
    grad.addColorStop(0.5, "#e2e8f0");
    grad.addColorStop(1, "#cbd5e1");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  } else if (preset === "cute_cat_paw") {
    ctx.fillStyle = frameColor || "#fffbeb";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  } else if (preset === "pastel_floral") {
    const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    grad.addColorStop(0, "#fdf4ff");
    grad.addColorStop(0.5, "#fae8ff");
    grad.addColorStop(1, "#fce7f3");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  } else if (preset === "goth_grunge") {
    ctx.fillStyle = "#09090b";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "#27272a";
    ctx.lineWidth = 4;
    ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);
    ctx.strokeRect(16, 16, canvas.width - 32, canvas.height - 32);
  } else if (preset === "polaroid_vintage") {
    ctx.fillStyle = frameColor || "#fafaf9";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  } else if (preset === "y2k" || layout === "y2k_checker") {
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "rgba(244, 114, 182, 0.2)";
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
  } else if (preset === "film") {
    ctx.fillStyle = "#0d0d0d";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#ffffff";
    const holeW = 20;
    const holeH = 28;
    const holeGap = 44;

    for (let y = 30; y < canvas.height - 30; y += holeGap) {
      ctx.beginPath();
      ctx.roundRect(18, y, holeW, holeH, 4);
      ctx.fill();

      ctx.beginPath();
      ctx.roundRect(canvas.width - 38, y, holeW, holeH, 4);
      ctx.fill();
    }
  } else if (preset === "receipt") {
    // 🧾 RECEIPT PAPER STYLED FRAME WITH SERRATED EDGES
    ctx.fillStyle = "#fafaf9";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#e7e5e4";
    drawSerratedZigzag(ctx, canvas.width, 0, 16, 28);
    ctx.fill();
    drawSerratedZigzag(ctx, canvas.width, canvas.height - 16, 16, 28);
    ctx.fill();

    ctx.fillStyle = "#1c1917";
    ctx.font = "900 30px monospace";
    ctx.textAlign = "center";
    ctx.fillText("RECEIPT #88219 • RIELLLYBOOTH", canvas.width / 2, 50);
  } else if (preset === "concert_ticket") {
    // 🎟️ MUSIC FESTIVAL CONCERT TICKET STUB WITH BARCODE & PERFORATED BOUNDS
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#ec4899";
    ctx.fillRect(0, 0, canvas.width, 90);

    ctx.fillStyle = "#ffffff";
    ctx.font = "900 34px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("🎟️ RIELLLYBOOTH FESTIVAL VIP", canvas.width / 2, 45);

    // Perforated Dashed Rule Line
    ctx.strokeStyle = "#475569";
    ctx.lineWidth = 3;
    ctx.setLineDash([12, 10]);
    ctx.beginPath();
    ctx.moveTo(0, canvas.height - 180);
    ctx.lineTo(canvas.width, canvas.height - 180);
    ctx.stroke();
    ctx.setLineDash([]);

    // Ticket Stub Barcode Lines at Bottom
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(40, canvas.height - 160, canvas.width - 80, 60);

    ctx.fillStyle = "#0f172a";
    for (let bx = 60; bx < canvas.width - 60; bx += Math.floor(Math.random() * 10 + 6)) {
      ctx.fillRect(bx, canvas.height - 150, Math.random() > 0.5 ? 4 : 2, 40);
    }
  } else if (preset === "photocard") {
    // 💖 K-POP PHOTOCARD BINDER SLEEVE
    const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    grad.addColorStop(0, "#fce7f3");
    grad.addColorStop(0.5, "#e0e7ff");
    grad.addColorStop(1, "#fbcfe8");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  } else if (preset === "retro_manga") {
    // 💥 JAPANESE RETRO MANGA COMIC STRIP
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "rgba(0,0,0,0.05)";
    for (let mx = 0; mx < canvas.width; mx += 16) {
      for (let my = 0; my < canvas.height; my += 16) {
        ctx.beginPath();
        ctx.arc(mx, my, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  } else if (preset === "galau_quote") {
    // ☕ GALAU QUOTE AESTHETIC GEN Z
    const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    grad.addColorStop(0, "#cbd5e1");
    grad.addColorStop(0.5, "#f472b6");
    grad.addColorStop(1, "#fda4af");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  } else {
    ctx.fillStyle = frameColor || "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  ctx.restore();

  // STEP 2: DRAW PHOTOS ACCORDING TO THE LAYOUT MODES WITH STRICT CLIPPING
  if (isNewspaper) {
    // 📰 PRECISE NEWSPAPER PHOTO BOUNDS & NON-OVERLAPPING ARTICLE COLUMNS
    // 2. Top Large Main Photo Slot: X = 70px, Y = 260px, W = 1060px, H = 600px
    const mainX = 70;
    const mainY = 260;
    const mainW = 1060;
    const mainH = 600;

    if (images[0]) {
      ctx.save();
      ctx.filter = filterString;
      // Strict Clip Main Photo Box
      drawImageCover(ctx, images[0], mainX, mainY, mainW, mainH, 0, isFlipped);
      ctx.restore();

      ctx.strokeStyle = "#1c1917";
      ctx.lineWidth = 3;
      ctx.strokeRect(mainX, mainY, mainW, mainH);

      applyCuteFilterOverlay(ctx, mainX, mainY, mainW, mainH, cuteFilter, filter.beautyGlow, 0, filterIntensity);

      // Photo Figure Caption (Y = 880px, 16px ITALIC SERIF)
      ctx.save();
      ctx.fillStyle = "#1c1917";
      ctx.font = "italic 16px 'Georgia', 'Times New Roman', serif";
      ctx.textAlign = "left";
      ctx.textBaseline = "top";
      ctx.fillText("▲ FIG 1.0 — Live capture recorded in high definition at rielllybooth studio booth.", mainX, 880);
      ctx.restore();
    }

    // 3. Bottom 3 Small Photo Slots (Y = 920px, 330 x 330px each)
    const botY = 920;
    const botW = 330;
    const botH = 330;

    const botPositions = [70, 435, 800];

    images.slice(1, 4).forEach((img, i) => {
      const bx = botPositions[i];

      ctx.save();
      ctx.filter = filterString;
      // Strict Clip Bottom Photo Boxes
      drawImageCover(ctx, img, bx, botY, botW, botH, 0, isFlipped);
      ctx.restore();

      ctx.strokeStyle = "#1c1917";
      ctx.lineWidth = 2;
      ctx.strokeRect(bx, botY, botW, botH);

      applyCuteFilterOverlay(ctx, bx, botY, botW, botH, cuteFilter, filter.beautyGlow, 0, filterIntensity);
    });

    // 4. BOTTOM ARTICLE CAPTIONS & PARAGRAPHS (STRICT SPACING AT Y = 1280px)
    const columnTitles = [
      "FOTO DULU AJA BLAY",
      "OUR STORY",
      "AWAS GAGAL MOVE ON"
    ];
    const columnTexts = [
      "Berhenti jadi pelangi untuk orang yang buta warna ya blay.",
      "Beda temen beda aksi, Salah temen bocor informasi.",
      "Warga diimbau tidak menatap photo strip ini terlalu lama apabila belum sepenuhnya move on."
    ];

    // Vertical Divider Rules between column articles
    ctx.save();
    ctx.strokeStyle = "rgba(28, 25, 23, 0.35)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(417.5, 1280);
    ctx.lineTo(417.5, 1680);
    ctx.moveTo(782.5, 1280);
    ctx.lineTo(782.5, 1680);
    ctx.stroke();

    ctx.fillStyle = "#1c1917";
    ctx.textBaseline = "top";

    botPositions.forEach((bx, i) => {
      // Column Headline (Y = 1280px) - 20px BOLD SERIF
      ctx.font = "bold 20px 'Georgia', 'Times New Roman', serif";
      ctx.textAlign = "center";
      ctx.fillText(columnTitles[i], bx + botW / 2, 1280);

      // Rule below Column Headline
      ctx.beginPath();
      ctx.moveTo(bx + 10, 1308);
      ctx.lineTo(bx + botW - 10, 1308);
      ctx.stroke();

      // Body Paragraph Text (Y = 1320px) - 15px SERIF with 22px Line Height
      ctx.font = "15px 'Georgia', 'Times New Roman', serif";
      ctx.fillStyle = "#1c1917";
      ctx.textAlign = "left";

      // Word wrapper inside 330px column bounds
      const words = columnTexts[i].split(" ");
      let line = "";
      let lineY = 1320;
      const maxColWidth = botW - 12;

      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + " ";
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxColWidth && n > 0) {
          ctx.fillText(line, bx + 6, lineY);
          line = words[n] + " ";
          lineY += 22;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, bx + 6, lineY);
    });

    // 5. FOOTER GAZETTE BAR (Y = 1700px)
    ctx.beginPath();
    ctx.moveTo(45, 1685);
    ctx.lineTo(1155, 1685);
    ctx.stroke();

    ctx.fillStyle = "#1c1917";
    ctx.font = "bold 15px 'Georgia', 'Times New Roman', serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("RIELLLYBOOTH GAZETTE  •  ALL RIGHTS RESERVED 2026  •  OFFICIAL EDITION  •  WWW.RIELLLYBOOTH.MY.ID", canvas.width / 2, 1715);
    ctx.restore();

  } else if (layout === "spotlight") {
    // Spotlight Layout: 1 Large Top Main Photo + 3 Bottom Thumbnails
    const topW = canvas.width - padding * 2;
    const topH = (canvas.height - bottomFooterHeight - padding * 3) * 0.65;
    const botW = (canvas.width - padding * 4) / 3;
    const botH = (canvas.height - bottomFooterHeight - padding * 3) * 0.32;

    if (images[0]) {
      ctx.save();
      ctx.filter = filterString;
      drawImageCover(ctx, images[0], padding, padding, topW, topH, 16, isFlipped);
      ctx.restore();
      applyCuteFilterOverlay(ctx, padding, padding, topW, topH, cuteFilter, filter.beautyGlow, 16, filterIntensity);
    }

    images.slice(1, 4).forEach((img, i) => {
      const bx = padding + i * (botW + padding);
      const by = padding * 2 + topH;
      ctx.save();
      ctx.filter = filterString;
      drawImageCover(ctx, img, bx, by, botW, botH, 12, isFlipped);
      ctx.restore();
      applyCuteFilterOverlay(ctx, bx, by, botW, botH, cuteFilter, filter.beautyGlow, 12, filterIntensity);
    });
  } else if (layout === "editorial_vogue") {
    // Vogue Magazine Grid: 1 Hero Photo + 3 Side/Bottom Magazine Grid
    const heroW = (canvas.width - padding * 3) * 0.6;
    const heroH = canvas.height - bottomFooterHeight - padding * 2;
    const sideW = (canvas.width - padding * 3) * 0.38;
    const sideH = (heroH - padding * 2) / 3;

    if (images[0]) {
      ctx.save();
      ctx.filter = filterString;
      drawImageCover(ctx, images[0], padding, padding, heroW, heroH, 16, isFlipped);
      ctx.restore();
      applyCuteFilterOverlay(ctx, padding, padding, heroW, heroH, cuteFilter, filter.beautyGlow, 16, filterIntensity);
    }

    images.slice(1, 4).forEach((img, i) => {
      const sx = padding * 2 + heroW;
      const sy = padding + i * (sideH + padding);
      ctx.save();
      ctx.filter = filterString;
      drawImageCover(ctx, img, sx, sy, sideW, sideH, 12, isFlipped);
      ctx.restore();
      applyCuteFilterOverlay(ctx, sx, sy, sideW, sideH, cuteFilter, filter.beautyGlow, 12, filterIntensity);
    });
  } else if (layout.startsWith("strip") || layout === "y2k_checker") {
    const topMargin = preset === "concert_ticket" ? 100 : padding;
    const photoW = canvas.width - padding * 2;
    const availableH = canvas.height - topMargin - bottomFooterHeight - padding * photoCount;
    const photoH = availableH / photoCount;

    images.slice(0, photoCount).forEach((img, i) => {
      const y = topMargin + i * (photoH + padding);
      const borderRadius =
        preset === "film"
          ? 4
          : preset === "photocard"
          ? 24
          : preset === "coquette" || preset === "polkadot"
          ? 16
          : preset === "retro_manga"
          ? 0
          : 12;

      ctx.save();
      ctx.filter = filterString;
      drawImageCover(ctx, img, padding, y, photoW, photoH, borderRadius, isFlipped);
      ctx.restore();

      if (preset === "retro_manga") {
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 6;
        ctx.strokeRect(padding, y, photoW, photoH);
      }

      applyCuteFilterOverlay(ctx, padding, y, photoW, photoH, cuteFilter, filter.beautyGlow, borderRadius, filterIntensity);

      if (preset === "film") {
        ctx.save();
        ctx.fillStyle = "#f59e0b";
        ctx.font = "bold 16px monospace";
        ctx.fillText(`0${i + 1} A`, 10, y + photoH / 2);
        ctx.fillText(`KODAK 400`, canvas.width - 52, y + photoH / 2);
        ctx.restore();
      }
    });
  } else {
    // grid_2x2, purikura_4cut, scrapbook
    const topMargin = preset === "concert_ticket" ? 100 : padding;
    const photoW = (canvas.width - padding * 3) / 2;
    const availableH = canvas.height - topMargin - bottomFooterHeight - padding * 2;
    const photoH = availableH / 2;

    const positions = [
      { x: padding, y: topMargin },
      { x: padding * 2 + photoW, y: topMargin },
      { x: padding, y: topMargin + photoH + padding },
      { x: padding * 2 + photoW, y: topMargin + photoH + padding },
    ];

    images.slice(0, 4).forEach((img, i) => {
      const borderRadius =
        layout === "purikura_4cut"
          ? 32
          : preset === "film"
          ? 4
          : preset === "photocard"
          ? 28
          : preset === "coquette" || preset === "polkadot"
          ? 20
          : preset === "retro_manga"
          ? 0
          : 16;

      ctx.save();
      ctx.filter = filterString;
      drawImageCover(ctx, img, positions[i].x, positions[i].y, photoW, photoH, borderRadius, isFlipped);
      ctx.restore();

      if (preset === "retro_manga") {
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 6;
        ctx.strokeRect(positions[i].x, positions[i].y, photoW, photoH);
      }

      applyCuteFilterOverlay(ctx, positions[i].x, positions[i].y, photoW, photoH, cuteFilter, filter.beautyGlow, borderRadius, filterIntensity);
    });
  }

  // STEP 3: PRESET DECORATIVE VECTORS
  if (preset === "coquette") {
    drawRibbonBow(ctx, padding + 20, 40, 0.9);
    drawRibbonBow(ctx, canvas.width - padding - 20, 40, 0.9);
    drawRibbonBow(ctx, canvas.width / 2, canvas.height - bottomFooterHeight + 10, 1.1);
  } else if (preset === "coquette_black") {
    drawRibbonBow(ctx, padding + 20, 40, 0.9, "#18181b", "#000000", "#3f3f46");
    drawRibbonBow(ctx, canvas.width - padding - 20, 40, 0.9, "#18181b", "#000000", "#3f3f46");
    drawRibbonBow(ctx, canvas.width / 2, canvas.height - bottomFooterHeight + 10, 1.1, "#18181b", "#000000", "#3f3f46");
  } else if (preset === "y2k_bubbles") {
    drawGlossyBubble(ctx, 50, 60, 22);
    drawGlossyBubble(ctx, canvas.width - 60, 120, 16);
    drawGlossyBubble(ctx, 80, canvas.height - 180, 26);
    drawGlossyBubble(ctx, canvas.width - 70, canvas.height - 80, 20);
    drawY2kStar(ctx, padding + 15, 30, 14, "#06b6d4");
    drawY2kStar(ctx, canvas.width - padding - 15, 30, 14, "#ec4899");
    drawY2kStar(ctx, canvas.width / 2, canvas.height - bottomFooterHeight + 20, 18, "#94a3b8");
  } else if (preset === "cute_cat_paw") {
    drawCatPaw(ctx, 45, 45, 16, "#f472b6");
    drawCatPaw(ctx, canvas.width - 45, 45, 16, "#f472b6");
    drawCatPaw(ctx, 55, canvas.height - bottomFooterHeight + 25, 18, "#ec4899");
    drawCatPaw(ctx, canvas.width - 55, canvas.height - bottomFooterHeight + 25, 18, "#ec4899");
  } else if (preset === "pastel_floral") {
    drawCherryBlossom(ctx, 45, 45, 14, "#f472b6");
    drawCherryBlossom(ctx, canvas.width - 45, 45, 14, "#f472b6");
    drawCherryBlossom(ctx, 50, canvas.height - bottomFooterHeight + 25, 16, "#ec4899");
    drawCherryBlossom(ctx, canvas.width - 50, canvas.height - bottomFooterHeight + 25, 16, "#ec4899");
  } else if (preset === "goth_grunge") {
    drawY2kStar(ctx, padding + 15, 30, 16, "#06b6d4");
    drawY2kStar(ctx, canvas.width - padding - 15, 30, 16, "#e11d48");
    drawY2kStar(ctx, canvas.width / 2, canvas.height - bottomFooterHeight + 20, 20, "#06b6d4");
  } else if (preset === "polaroid_vintage") {
    ctx.save();
    ctx.fillStyle = "#ef4444";
    ctx.font = "bold 18px 'Courier New', monospace";
    ctx.textAlign = "right";
    const todayStr = new Date();
    const dateStamp = `'${todayStr.getFullYear().toString().substring(2)} ${String(todayStr.getMonth() + 1).padStart(2, "0")} ${String(todayStr.getDate()).padStart(2, "0")}`;
    ctx.fillText(dateStamp, canvas.width - 30, canvas.height - 30);
    ctx.restore();
  } else if (preset === "y2k") {
    drawY2kStar(ctx, padding + 15, 30, 14, "#ec4899");
    drawY2kStar(ctx, canvas.width - padding - 15, 30, 14, "#38bdf8");
    drawY2kStar(ctx, canvas.width / 2, canvas.height - bottomFooterHeight + 20, 18, "#f472b6");
  } else if (preset === "photocard") {
    drawRibbonBow(ctx, padding + 20, 40, 0.8);
    drawY2kStar(ctx, canvas.width - padding - 20, 40, 16, "#ec4899");
    drawY2kStar(ctx, padding + 25, canvas.height - bottomFooterHeight + 20, 18, "#38bdf8");
  } else if (preset === "retro_manga") {
    ctx.save();
    ctx.fillStyle = "#ffffff";
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 4;

    ctx.beginPath();
    ctx.ellipse(canvas.width / 2, canvas.height - bottomFooterHeight + 35, 140, 35, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#000000";
    ctx.font = "900 22px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("SUGOI! 💖 (すごい)", canvas.width / 2, canvas.height - bottomFooterHeight + 42);
    ctx.restore();
  }

  // STEP 4: INTERACTIVE DRAGGABLE STICKERS OVERLAY WITH ROTATION & SCALE TRANSFORMS
  if (stickers && stickers.length > 0) {
    ctx.save();
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    stickers.forEach((st) => {
      ctx.save();
      ctx.translate(st.x, st.y);
      if (st.rotation) {
        ctx.rotate((st.rotation * Math.PI) / 180);
      }
      const fontSize = Math.round((st.scale || 1) * 48);
      ctx.font = `${fontSize}px sans-serif`;
      ctx.fillText(st.emoji, 0, 0);
      ctx.restore();
    });
    ctx.restore();
  }

  // STEP 5: ANALOG FILM GRAIN OVERLAY 🎞️
  if (filter.grain && filter.grain > 0) {
    applyFilmGrainOverlay(ctx, canvas.width, canvas.height, filter.grain);
  }

  // STEP 6: CUSTOM BRAND/EVENT LOGO & TYPOGRAPHY FOOTER (Non-newspaper presets)
  if (!isNewspaper) {
    ctx.save();
    ctx.filter = "none";
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    const defaultDate = new Date().toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    const displaySubtitle = subtitleText !== undefined ? subtitleText : `✨ ${defaultDate} ✨`;

    let fontCss = "'Plus Jakarta Sans', system-ui, sans-serif";
    if (fontFamily === "serif") fontCss = "'Georgia', 'Times New Roman', serif";
    else if (fontFamily === "cursive") fontCss = "'Brush Script MT', 'Comic Sans MS', cursive";
    else if (fontFamily === "mono") fontCss = "monospace";

    // DRAW CUSTOM BRAND/EVENT LOGO IF PROVIDED
    if (customLogoImg) {
      const maxLogoW = 240;
      const maxLogoH = 85;
      const logoRatio = customLogoImg.width / customLogoImg.height;

      let drawW = maxLogoW;
      let drawH = maxLogoW / logoRatio;

      if (drawH > maxLogoH) {
        drawH = maxLogoH;
        drawW = maxLogoH * logoRatio;
      }

      const logoX = (canvas.width - drawW) / 2;
      const logoY = canvas.height - 150;

      ctx.drawImage(customLogoImg, logoX, logoY, drawW, drawH);

      ctx.fillStyle = textColor || "#000000";
      ctx.font = `500 18px ${fontCss}`;
      ctx.textAlign = "center";
      ctx.fillText(displaySubtitle, canvas.width / 2, canvas.height - 60);
    } else {
      // REGULAR TYPOGRAPHY & GEN Z FOOTERS
      if (preset === "receipt") {
        ctx.fillStyle = textColor || "#1c1917";
        ctx.font = "14px monospace";
        ctx.textAlign = "left";

        const leftX = padding + 10;
        const rightX = canvas.width - padding - 10;
        let curY = canvas.height - 175;

        ctx.fillText("1x Cute Pose Snapshot", leftX, curY);
        ctx.textAlign = "right";
        ctx.fillText("Rp 0", rightX, curY);

        curY += 24;
        ctx.textAlign = "left";
        ctx.fillText("1x Good Vibes Only", leftX, curY);
        ctx.textAlign = "right";
        ctx.fillText("Rp 0", rightX, curY);

        curY += 30;
        ctx.strokeStyle = textColor || "#1c1917";
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(leftX, curY);
        ctx.lineTo(rightX, curY);
        ctx.stroke();
        ctx.setLineDash([]);

        curY += 24;
        ctx.font = "bold 16px monospace";
        ctx.textAlign = "left";
        ctx.fillText("TOTAL", leftX, curY);
        ctx.textAlign = "right";
        ctx.fillText("PAID WITH LOVE ♡", rightX, curY);
      } else if (preset === "concert_ticket") {
        ctx.fillStyle = textColor || "#ffffff";
        ctx.font = `bold 24px ${fontCss}`;
        ctx.textAlign = "center";
        ctx.fillText(customText || "rielllybooth ♡", canvas.width / 2, canvas.height - 85);
        ctx.font = `500 16px ${fontCss}`;
        ctx.fillText(displaySubtitle, canvas.width / 2, canvas.height - 45);
      } else {
        ctx.fillStyle = textColor || "#000000";

        ctx.font = `800 32px ${fontCss}`;
        ctx.textAlign = "center";
        ctx.fillText(customText || "rielllybooth ♡", canvas.width / 2, canvas.height - 120);

        ctx.font = `500 18px ${fontCss}`;
        ctx.fillText(displaySubtitle, canvas.width / 2, canvas.height - 70);
      }
    }

    ctx.restore();
  }
};
