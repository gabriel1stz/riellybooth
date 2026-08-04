/**
 * Canvas Utilities for high-resolution photo strip rendering, layout assembly,
 * CSS & pixel filter effects, Webcam Toy retro filters (Pixel Art, Thermal Heatmap,
 * Vivid Pop Art, VHS Retro CRT), Film Grain 🎞️, Soft Beauty Glow ✨, 11 Frame Presets
 * (including 5 Gen Z Viral Presets: Receipt 🧾, Concert Ticket 🎟️, K-Pop Photocard 💖,
 * Retro Manga 💥, Galau Quote 🥺), interactive sticker overlays, flip horizontal toggle,
 * custom event logo high-res sharp rendering, and customizable typography branding engine.
 */

export type LayoutMode = "strip" | "grid";

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
 * Barcode Vector Generator Helper ║▌║▌║█║▌
 */
function drawBarcodeVector(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, color: string = "#000000") {
  ctx.save();
  ctx.fillStyle = color;
  let currentX = x;
  const barWidths = [3, 1, 4, 2, 1, 5, 2, 1, 3, 2, 4, 1, 3, 5, 2, 1, 4, 2, 3];
  let idx = 0;

  while (currentX < x + w) {
    const bw = barWidths[idx % barWidths.length];
    if (idx % 2 === 0) {
      ctx.fillRect(currentX, y, Math.min(bw, x + w - currentX), h);
    }
    currentX += bw + 2;
    idx++;
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
 * Main High-Resolution Photo Strip Render Engine
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
  if (!ctx || images.length < 4) return;

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  if (layout === "strip") {
    canvas.width = 600;
    canvas.height = 1800;
  } else {
    canvas.width = 1200;
    canvas.height = 1400;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const filterString = `brightness(${filter.brightness}%) contrast(${filter.contrast}%) saturate(${filter.saturation}%) grayscale(${filter.grayscale}%)`;
  const padding = preset === "film" || preset === "receipt" ? 60 : 36;
  const bottomFooterHeight = preset === "newspaper" || preset === "receipt" || preset === "concert_ticket" ? 260 : 220;

  // STEP 1: BACKGROUND & FRAME PRESET
  ctx.save();
  if (preset === "polkadot") {
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
  } else if (preset === "y2k") {
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
  } else if (preset === "newspaper") {
    ctx.fillStyle = "#f4f1ea";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#1c1917";
    ctx.fillRect(0, 0, canvas.width, 100);

    ctx.fillStyle = "#f4f1ea";
    ctx.font = "900 36px 'Georgia', serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("THE DAILY RIELLLYBOOTH", canvas.width / 2, 50);

    ctx.fillStyle = "#e7e5e4";
    ctx.font = "italic 16px 'Georgia', serif";
    ctx.fillText("SPECIAL EDITION • MEMORIES FOR LIFE • VOL. 1", canvas.width / 2, 80);
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
    ctx.fillText("🎟️ RIELLLYBOOTH FESTIVAL VIP", canvas.width / 2, 55);
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
    // 🥺 GALAU QUOTE AESTHETIC GEN Z
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

  // STEP 2: DRAW PHOTOS WITH FILTERS & FLIP HORIZONTAL PREFERENCE
  const startYOffset = preset === "newspaper" || preset === "receipt" || preset === "concert_ticket" ? 110 : 0;

  if (layout === "strip") {
    const photoW = canvas.width - padding * 2;
    const availableH = canvas.height - bottomFooterHeight - padding * 5 - startYOffset;
    const photoH = availableH / 4;

    images.slice(0, 4).forEach((img, i) => {
      const y = startYOffset + padding + i * (photoH + padding);
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
    const photoW = (canvas.width - padding * 3) / 2;
    const availableH = canvas.height - bottomFooterHeight - padding * 3 - startYOffset;
    const photoH = availableH / 2;

    const positions = [
      { x: padding, y: startYOffset + padding },
      { x: padding * 2 + photoW, y: startYOffset + padding },
      { x: padding, y: startYOffset + padding * 2 + photoH },
      { x: padding * 2 + photoW, y: startYOffset + padding * 2 + photoH },
    ];

    images.slice(0, 4).forEach((img, i) => {
      const borderRadius =
        preset === "film"
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

  // STEP 6: CUSTOM BRAND/EVENT LOGO & TYPOGRAPHY FOOTER (SHARP HIGH-RES RENDER)
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

  // DRAW CUSTOM BRAND/EVENT LOGO IF PROVIDED WITH HIGH SHARPNESS
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
      ctx.fillText("TOTAL PRICE:", leftX, curY);
      ctx.textAlign = "right";
      ctx.fillText("PRICELESS ✨", rightX, curY);

      drawBarcodeVector(ctx, padding + 20, canvas.height - 65, canvas.width - padding * 2 - 40, 24, "#1c1917");
    } else if (preset === "concert_ticket") {
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 20px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("ADMIT ONE • SEAT A1 • VIP ZONE", canvas.width / 2, canvas.height - 140);

      ctx.fillStyle = "#38bdf8";
      ctx.font = "bold 16px sans-serif";
      ctx.fillText(displaySubtitle, canvas.width / 2, canvas.height - 105);

      drawBarcodeVector(ctx, padding + 30, canvas.height - 70, canvas.width - padding * 2 - 60, 32, "#ffffff");
    } else if (preset === "photocard") {
      ctx.fillStyle = "#db2777";
      ctx.font = `900 38px ${fontCss}`;
      ctx.textAlign = "center";
      ctx.fillText(customText || "K-POP PHOTOCARD ♡", canvas.width / 2, canvas.height - 110);

      ctx.fillStyle = "#6366f1";
      ctx.font = `bold 18px ${fontCss}`;
      ctx.fillText(displaySubtitle, canvas.width / 2, canvas.height - 60);
    } else if (preset === "retro_manga") {
      ctx.fillStyle = "#000000";
      ctx.font = `900 34px ${fontCss}`;
      ctx.textAlign = "center";
      ctx.fillText(customText || "CHAPTER 01 • CHAPTER OF LOVE", canvas.width / 2, canvas.height - 65);
    } else if (preset === "galau_quote") {
      ctx.fillStyle = "#ffffff";
      ctx.shadowColor = "rgba(0,0,0,0.4)";
      ctx.shadowBlur = 8;

      ctx.font = `italic bold 28px ${fontCss}`;
      ctx.textAlign = "center";
      ctx.fillText(customText || "“Capek sih, tapi tetep harus estetik ✨”", canvas.width / 2, canvas.height - 110);

      ctx.font = `bold 18px ${fontCss}`;
      ctx.fillText(displaySubtitle, canvas.width / 2, canvas.height - 60);
      ctx.shadowBlur = 0;
    } else if (preset === "newspaper") {
      ctx.fillStyle = "#1c1917";
      ctx.strokeStyle = "#1c1917";
      ctx.lineWidth = 3;

      ctx.beginPath();
      ctx.moveTo(padding, canvas.height - 130);
      ctx.lineTo(canvas.width - padding, canvas.height - 130);
      ctx.stroke();

      ctx.font = `bold 36px ${fontCss}`;
      ctx.textAlign = "center";
      ctx.fillText(customText || "rielllybooth", canvas.width / 2, canvas.height - 85);

      ctx.font = `italic 18px ${fontCss}`;
      ctx.fillText(displaySubtitle, canvas.width / 2, canvas.height - 45);
    } else if (preset === "y2k") {
      ctx.fillStyle = "#f472b6";
      ctx.font = `900 44px ${fontCss}`;
      ctx.textAlign = "center";
      ctx.fillText(customText || "RIELLLYBOOTH.Y2K", canvas.width / 2, canvas.height - 110);

      ctx.fillStyle = "#38bdf8";
      ctx.font = `bold 18px ${fontCss}`;
      ctx.fillText(displaySubtitle, canvas.width / 2, canvas.height - 60);
    } else if (preset === "film") {
      ctx.fillStyle = "#ffffff";
      ctx.font = `bold 38px ${fontCss}`;
      ctx.textAlign = "center";
      ctx.fillText(customText || "rielllybooth 35mm", canvas.width / 2, canvas.height - 110);

      ctx.fillStyle = "#9ca3af";
      ctx.font = `18px ${fontCss}`;
      ctx.fillText(displaySubtitle, canvas.width / 2, canvas.height - 60);
    } else {
      // Classic Clean, Coquette, & Polkadot
      ctx.fillStyle = preset === "coquette" || preset === "polkadot" ? "#db2777" : textColor || "#000000";
      ctx.font = `bold 44px ${fontCss}`;
      ctx.textAlign = "center";
      ctx.fillText(customText || "rielllybooth ♡", canvas.width / 2, canvas.height - 120);

      ctx.font = `500 20px ${fontCss}`;
      ctx.globalAlpha = 0.85;
      ctx.fillText(displaySubtitle, canvas.width / 2, canvas.height - 70);
    }
  }

  ctx.restore();
};
