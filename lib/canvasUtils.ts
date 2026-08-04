/**
 * Canvas Utilities for high-resolution photo strip rendering, layout assembly,
 * CSS & pixel filter effects, Webcam Toy retro filters (Pixel Art, Thermal Heatmap,
 * Vivid Pop Art, VHS Retro CRT), Film Grain 🎞️, Soft Beauty Glow ✨, 11 Frame Presets
 * (including Gen Z Viral Presets: Coquette Ribbon 🎀, Y2K Cyber ✨, Receipt Paper 🧾,
 * K-Pop Photocard 💖, Concert Ticket 🎫, Galau Quote ☕, Newspaper 📰),
 * 9 Layout Modes, interactive sticker overlays, flip horizontal toggle,
 * custom event logo high-res sharp rendering, and customizable typography branding engine.
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
  | "y2k"
  | "newspaper"
  | "film"
  | "polkadot"
  | "receipt"
  | "concert_ticket"
  | "photocard"
  | "retro_manga"
  | "galau_quote";

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
};

export type PlacedSticker = {
  id: string;
  emoji: string;
  x: number;
  y: number;
  scale?: number;
};

/**
 * Helper to draw an image centered and covering its container slot without stretching.
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

  if (borderRadius > 0) {
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, borderRadius);
    ctx.clip();
  }

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
 * Helper to apply Cute Filters, Webcam Toy Retro FX, & Soft Beauty Glow ✨
 */
function applyCuteFilterOverlay(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  cuteFilter: CuteFilter,
  beautyGlow: number = 0,
  borderRadius: number = 0
) {
  ctx.save();
  if (borderRadius > 0) {
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, borderRadius);
    ctx.clip();
  }

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

function drawRibbonBow(ctx: CanvasRenderingContext2D, cx: number, cy: number, scale: number = 1) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(scale, scale);

  ctx.fillStyle = "#f472b6";
  ctx.strokeStyle = "#db2777";
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

  ctx.fillStyle = "#ec4899";
  ctx.beginPath();
  ctx.roundRect(-6, -6, 12, 12, 4);
  ctx.fill();
  ctx.stroke();

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

  // Determine target canvas dimensions based on 9 layout modes
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
    photoCount = 4;
    targetW = 1100;
    targetH = 1500;
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
  const padding = preset === "film" || preset === "receipt" ? 60 : 36;
  const bottomFooterHeight = isNewspaper || preset === "receipt" || preset === "concert_ticket" ? 220 : 220;

  // STEP 1: BACKGROUND & FRAME PRESETS (OVERHAULED NEWSPAPER & GEN Z FRAMES)
  ctx.save();
  if (isNewspaper) {
    // Authentic Newsprint Paper Texture
    ctx.fillStyle = "#f4f1ea";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Decorative Header Rule Lines
    ctx.strokeStyle = "#1c1917";
    ctx.lineWidth = 3;
    ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);

    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(30, 135);
    ctx.lineTo(canvas.width - 30, 135);
    ctx.stroke();

    // Ribbons on Top Header Left & Right
    drawRibbonBow(ctx, 60, 55, 1.0);
    drawRibbonBow(ctx, canvas.width - 60, 55, 1.0);

    // Headline: Bold "RIELLLYBOOTH"
    ctx.fillStyle = "#1c1917";
    ctx.font = "900 48px 'Georgia', serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("RIELLLYBOOTH", canvas.width / 2, 55);

    // Edition Date & Tagline
    ctx.font = "italic 15px 'Georgia', serif";
    ctx.fillText("EST. 2026 • EDITION #882 • SPECIAL MEMORIES FOR LIFE", canvas.width / 2, 92);

    ctx.font = "italic 13px 'Georgia', serif";
    ctx.fillText('"Today wasn\'t just an ordinary day — it was our timeless scene at rielllybooth."', canvas.width / 2, 118);

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
    // 🎟️ MUSIC FESTIVAL CONCERT TICKET STUB
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#ec4899";
    ctx.fillRect(0, 0, canvas.width, 90);

    ctx.fillStyle = "#ffffff";
    ctx.font = "900 34px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("🎟️ RIELLLYBOOTH FESTIVAL VIP", canvas.width / 2, 45);
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

  // STEP 2: DRAW PHOTOS ACCORDING TO THE LAYOUT MODES
  if (isNewspaper) {
    // OVERHAULED NEWSPAPER LAYOUT: 1 Large main photo on top + 3 smaller photos side-by-side at bottom
    const topW = canvas.width - padding * 2;
    const topH = 650;
    const topY = 150;

    if (images[0]) {
      ctx.save();
      ctx.filter = filterString;
      drawImageCover(ctx, images[0], padding, topY, topW, topH, 0, isFlipped);
      ctx.restore();
      applyCuteFilterOverlay(ctx, padding, topY, topW, topH, cuteFilter, filter.beautyGlow, 0);

      // Border frame around top main photo
      ctx.strokeStyle = "#1c1917";
      ctx.lineWidth = 3;
      ctx.strokeRect(padding, topY, topW, topH);
    }

    const botY = topY + topH + 30;
    const botW = (canvas.width - padding * 4) / 3;
    const botH = 340;
    const captions = ["THE BEST VIBES", "UNFILTERED JOY", "CORE MEMORIES"];

    images.slice(1, 4).forEach((img, i) => {
      const bx = padding + i * (botW + padding);

      ctx.save();
      ctx.filter = filterString;
      drawImageCover(ctx, img, bx, botY, botW, botH, 0, isFlipped);
      ctx.restore();

      ctx.strokeStyle = "#1c1917";
      ctx.lineWidth = 2;
      ctx.strokeRect(bx, botY, botW, botH);

      applyCuteFilterOverlay(ctx, bx, botY, botW, botH, cuteFilter, filter.beautyGlow, 0);

      // Newspaper Captions & Column Articles under 3 bottom photos
      ctx.save();
      ctx.fillStyle = "#1c1917";
      ctx.font = "bold 15px 'Georgia', serif";
      ctx.textAlign = "center";
      ctx.fillText(captions[i], bx + botW / 2, botY + botH + 24);

      // Newspaper Article Snippet Lines
      ctx.fillStyle = "#44403c";
      ctx.font = "10px 'Georgia', serif";
      ctx.fillText("Special Edition • rielllybooth", bx + botW / 2, botY + botH + 42);
      ctx.restore();
    });

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
      applyCuteFilterOverlay(ctx, padding, padding, topW, topH, cuteFilter, filter.beautyGlow, 16);
    }

    images.slice(1, 4).forEach((img, i) => {
      const bx = padding + i * (botW + padding);
      const by = padding * 2 + topH;
      ctx.save();
      ctx.filter = filterString;
      drawImageCover(ctx, img, bx, by, botW, botH, 12, isFlipped);
      ctx.restore();
      applyCuteFilterOverlay(ctx, bx, by, botW, botH, cuteFilter, filter.beautyGlow, 12);
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
      applyCuteFilterOverlay(ctx, padding, padding, heroW, heroH, cuteFilter, filter.beautyGlow, 16);
    }

    images.slice(1, 4).forEach((img, i) => {
      const sx = padding * 2 + heroW;
      const sy = padding + i * (sideH + padding);
      ctx.save();
      ctx.filter = filterString;
      drawImageCover(ctx, img, sx, sy, sideW, sideH, 12, isFlipped);
      ctx.restore();
      applyCuteFilterOverlay(ctx, sx, sy, sideW, sideH, cuteFilter, filter.beautyGlow, 12);
    });
  } else if (layout.startsWith("strip") || layout === "y2k_checker") {
    const photoW = canvas.width - padding * 2;
    const availableH = canvas.height - bottomFooterHeight - padding * (photoCount + 1);
    const photoH = availableH / photoCount;

    images.slice(0, photoCount).forEach((img, i) => {
      const y = padding + i * (photoH + padding);
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

      applyCuteFilterOverlay(ctx, padding, y, photoW, photoH, cuteFilter, filter.beautyGlow, borderRadius);

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
    const photoW = (canvas.width - padding * 3) / 2;
    const availableH = canvas.height - bottomFooterHeight - padding * 3;
    const photoH = availableH / 2;

    const positions = [
      { x: padding, y: padding },
      { x: padding * 2 + photoW, y: padding },
      { x: padding, y: padding * 2 + photoH },
      { x: padding * 2 + photoW, y: padding * 2 + photoH },
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

      applyCuteFilterOverlay(ctx, positions[i].x, positions[i].y, photoW, photoH, cuteFilter, filter.beautyGlow, borderRadius);
    });
  }

  // STEP 3: PRESET DECORATIVE VECTORS
  if (preset === "coquette") {
    drawRibbonBow(ctx, padding + 20, 40, 0.9);
    drawRibbonBow(ctx, canvas.width - padding - 20, 40, 0.9);
    drawRibbonBow(ctx, canvas.width / 2, canvas.height - bottomFooterHeight + 10, 1.1);
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

  // STEP 4: INTERACTIVE DRAGGABLE STICKERS OVERLAY
  if (stickers && stickers.length > 0) {
    ctx.save();
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    stickers.forEach((st) => {
      const fontSize = Math.round((st.scale || 1) * 48);
      ctx.font = `${fontSize}px sans-serif`;
      ctx.fillText(st.emoji, st.x, st.y);
    });
    ctx.restore();
  }

  // STEP 5: ANALOG FILM GRAIN OVERLAY 🎞️
  if (filter.grain && filter.grain > 0) {
    applyFilmGrainOverlay(ctx, canvas.width, canvas.height, filter.grain);
  }

  // STEP 6: CUSTOM BRAND/EVENT LOGO & TYPOGRAPHY FOOTER
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

    ctx.fillStyle = preset === "coquette" || preset === "polkadot" ? "#db2777" : textColor || "#000000";
    ctx.font = `500 18px ${fontCss}`;
    ctx.textAlign = "center";
    ctx.fillText(displaySubtitle, canvas.width / 2, canvas.height - 60);
  } else {
    // REGULAR TYPOGRAPHY & GEN Z FOOTERS
    if (preset === "receipt") {
      ctx.fillStyle = "#1c1917";
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
      ctx.strokeStyle = "#1c1917";
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
    } else if (isNewspaper) {
      ctx.fillStyle = "#1c1917";
      ctx.font = "bold 24px 'Georgia', serif";
      ctx.textAlign = "center";
      ctx.fillText(customText || "rielllybooth ♡", canvas.width / 2, canvas.height - 80);

      ctx.font = "italic 15px 'Georgia', serif";
      ctx.fillText(displaySubtitle, canvas.width / 2, canvas.height - 45);
    } else {
      ctx.fillStyle = preset === "coquette" || preset === "polkadot" ? "#db2777" : textColor || "#000000";

      ctx.font = `800 32px ${fontCss}`;
      ctx.textAlign = "center";
      ctx.fillText(customText || "rielllybooth ♡", canvas.width / 2, canvas.height - 120);

      ctx.font = `500 18px ${fontCss}`;
      ctx.fillText(displaySubtitle, canvas.width / 2, canvas.height - 70);
    }
  }

  ctx.restore();
};
