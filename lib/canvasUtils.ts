/**
 * Canvas Utilities for high-resolution photo strip rendering, layout assembly,
 * CSS & pixel filter effects, Webcam Toy retro filters (Pixel Art, Thermal Heatmap,
 * Vivid Pop Art, VHS Retro CRT), Polkadot frame preset, interactive sticker overlays,
 * and customizable typography branding engine.
 */

export type LayoutMode = "strip" | "grid";

export type FramePreset = "clean" | "coquette" | "y2k" | "newspaper" | "film" | "polkadot";

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
  borderRadius: number = 0
) {
  ctx.save();

  if (borderRadius > 0) {
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, borderRadius);
    ctx.clip();
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
 * Helper to apply Cute Filters & Webcam Toy Retro Filter FX
 */
function applyCuteFilterOverlay(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  cuteFilter: CuteFilter,
  borderRadius: number = 0
) {
  if (cuteFilter === "none") return;

  ctx.save();
  if (borderRadius > 0) {
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, borderRadius);
    ctx.clip();
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
    // Webcam Toy Thermal Heatmap Effect
    ctx.fillStyle = "rgba(239, 68, 68, 0.25)";
    ctx.globalCompositeOperation = "difference";
    ctx.fillRect(x, y, w, h);

    ctx.fillStyle = "rgba(59, 130, 246, 0.3)";
    ctx.globalCompositeOperation = "color-dodge";
    ctx.fillRect(x, y, w, h);
  } else if (cuteFilter === "pop_art") {
    // Webcam Toy Vivid Pop Art Effect
    ctx.fillStyle = "rgba(234, 179, 8, 0.25)";
    ctx.globalCompositeOperation = "hard-light";
    ctx.fillRect(x, y, w, h);

    ctx.fillStyle = "rgba(236, 72, 153, 0.2)";
    ctx.globalCompositeOperation = "overlay";
    ctx.fillRect(x, y, w, h);
  } else if (cuteFilter === "vhs") {
    // Webcam Toy VHS Retro CRT Scanline Effect
    ctx.fillStyle = "rgba(16, 185, 129, 0.15)";
    ctx.globalCompositeOperation = "color-dodge";
    ctx.fillRect(x, y, w, h);

    // Draw CRT Horizontal Scanlines
    ctx.strokeStyle = "rgba(0, 0, 0, 0.18)";
    ctx.lineWidth = 2;
    for (let sy = y; sy < y + h; sy += 6) {
      ctx.beginPath();
      ctx.moveTo(x, sy);
      ctx.lineTo(x + w, sy);
      ctx.stroke();
    }
  } else if (cuteFilter === "pixel") {
    // Pixel Art Grid Effect
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
 * Draw Y2K Star Vector ✨
 */
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

/**
 * Draw Ribbon Bow Vector 🎀
 */
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
  stickers: PlacedSticker[] = []
): void => {
  const ctx = canvas.getContext("2d");
  if (!ctx || images.length < 4) return;

  if (layout === "strip") {
    canvas.width = 600;
    canvas.height = 1800;
  } else {
    canvas.width = 1200;
    canvas.height = 1400;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const filterString = `brightness(${filter.brightness}%) contrast(${filter.contrast}%) saturate(${filter.saturation}%) grayscale(${filter.grayscale}%)`;
  const padding = preset === "film" ? 60 : 36;
  const bottomFooterHeight = preset === "newspaper" ? 240 : 220;

  // ==========================================
  // STEP 1: BACKGROUND & FRAME PRESET STYLING
  // ==========================================
  ctx.save();
  if (preset === "polkadot") {
    // Polkadot Cute Pastel Background
    ctx.fillStyle = frameColor || "#fce7f3";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw Polka Dot Pattern
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
  } else {
    ctx.fillStyle = frameColor || "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  ctx.restore();

  // ==========================================
  // STEP 2: DRAW PHOTOS WITH FILTERS & LAYOUT
  // ==========================================
  const startYOffset = preset === "newspaper" ? 120 : 0;

  if (layout === "strip") {
    const photoW = canvas.width - padding * 2;
    const availableH = canvas.height - bottomFooterHeight - padding * 5 - startYOffset;
    const photoH = availableH / 4;

    images.slice(0, 4).forEach((img, i) => {
      const y = startYOffset + padding + i * (photoH + padding);
      const borderRadius = preset === "film" ? 4 : preset === "coquette" || preset === "polkadot" ? 16 : 12;

      ctx.save();
      ctx.filter = filterString;
      drawImageCover(ctx, img, padding, y, photoW, photoH, borderRadius);
      ctx.restore();

      applyCuteFilterOverlay(ctx, padding, y, photoW, photoH, cuteFilter, borderRadius);

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
      const borderRadius = preset === "film" ? 4 : preset === "coquette" || preset === "polkadot" ? 20 : 16;
      ctx.save();
      ctx.filter = filterString;
      drawImageCover(ctx, img, positions[i].x, positions[i].y, photoW, photoH, borderRadius);
      ctx.restore();

      applyCuteFilterOverlay(ctx, positions[i].x, positions[i].y, photoW, photoH, cuteFilter, borderRadius);
    });
  }

  // ==========================================
  // STEP 3: PRESET DECORATIVE VECTORS
  // ==========================================
  if (preset === "coquette") {
    drawRibbonBow(ctx, padding + 20, 40, 0.9);
    drawRibbonBow(ctx, canvas.width - padding - 20, 40, 0.9);
    drawRibbonBow(ctx, canvas.width / 2, canvas.height - bottomFooterHeight + 10, 1.1);
  } else if (preset === "y2k") {
    drawY2kStar(ctx, padding + 15, 30, 14, "#ec4899");
    drawY2kStar(ctx, canvas.width - padding - 15, 30, 14, "#38bdf8");
    drawY2kStar(ctx, canvas.width / 2, canvas.height - bottomFooterHeight + 20, 18, "#f472b6");
  }

  // ==========================================
  // STEP 4: INTERACTIVE STICKERS OVERLAY
  // ==========================================
  if (stickers && stickers.length > 0) {
    ctx.save();
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    stickers.forEach((st) => {
      const fontSize = Math.round((st.scale || 1) * 44);
      ctx.font = `${fontSize}px sans-serif`;
      ctx.fillText(st.emoji, st.x, st.y);
    });
    ctx.restore();
  }

  // ==========================================
  // STEP 5: BRANDING FOOTER & TYPOGRAPHY
  // ==========================================
  ctx.save();
  ctx.filter = "none";

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

  if (preset === "newspaper") {
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

  ctx.restore();
};
