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
  | "hut_ri_81_3strip"
  | "hut_ri_81_4strip"
  | "valorant_id"
  | "supermarket_crate"
  | "student_id"
  | "school_4cut"
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
  | "polaroid_vintage"
  | "cyber_y2k_pink"
  | "vintage_newspaper_dark"
  | "retro_cassette"
  | "kawaii_boba"
  | "heart_washi_tape"
  | "cupids_letter"
  | "passport"
  | "skena_coquette"
  | "galau_club"
  | "pestapora_pass"
  | "struk_jaksel"
  | "photocard_bias"
  | "toy_story"
  | "spongebob"
  | "among_us"
  | "happy_birthday";

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

function drawBobaPearl(ctx: CanvasRenderingContext2D, cx: number, cy: number, radius: number = 12) {
  ctx.save();
  const grad = ctx.createRadialGradient(cx - radius * 0.3, cy - radius * 0.3, radius * 0.1, cx, cy, radius);
  grad.addColorStop(0, "#78350f");
  grad.addColorStop(0.7, "#451a03");
  grad.addColorStop(1, "#1c1917");

  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
  ctx.beginPath();
  ctx.arc(cx - radius * 0.35, cy - radius * 0.35, radius * 0.25, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawWashiTape(ctx: CanvasRenderingContext2D, x: number, y: number, width: number = 70, height: number = 20, angle: number = 0) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate((angle * Math.PI) / 180);

  ctx.fillStyle = "rgba(244, 114, 182, 0.65)";
  ctx.strokeStyle = "rgba(219, 39, 119, 0.4)";
  ctx.lineWidth = 1;

  ctx.fillRect(-width / 2, -height / 2, width, height);
  ctx.strokeRect(-width / 2, -height / 2, width, height);

  ctx.fillStyle = "#ffffff";
  ctx.font = "10px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("♥ ♥ ♥", 0, 0);

  ctx.restore();
}

function drawCassetteSpool(ctx: CanvasRenderingContext2D, cx: number, cy: number, radius: number = 22) {
  ctx.save();
  ctx.fillStyle = "#18181b";
  ctx.strokeStyle = "#ea580c";
  ctx.lineWidth = 3;

  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.arc(cx, cy, radius * 0.4, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#ea580c";
  for (let i = 0; i < 3; i++) {
    const a = (i * Math.PI * 2) / 3;
    const tx = cx + Math.cos(a) * (radius * 0.65);
    const ty = cy + Math.sin(a) * (radius * 0.65);
    ctx.beginPath();
    ctx.arc(tx, ty, 3, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

function drawWrappedCanvasText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
) {
  const words = text.split(" ");
  let line = "";
  let currentY = y;

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + " ";
    if (ctx.measureText(testLine).width > maxWidth && n > 0) {
      ctx.fillText(line.trim(), x, currentY);
      line = words[n] + " ";
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line.trim(), x, currentY);
}

function drawCloudShape(ctx: CanvasRenderingContext2D, cx: number, cy: number, scale: number = 1) {
  ctx.save();
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.arc(cx, cy, 18 * scale, Math.PI * 0.5, Math.PI * 1.5);
  ctx.arc(cx + 20 * scale, cy - 12 * scale, 20 * scale, Math.PI * 1.0, Math.PI * 1.85);
  ctx.arc(cx + 45 * scale, cy - 10 * scale, 16 * scale, Math.PI * 1.35, Math.PI * 0.15);
  ctx.arc(cx + 60 * scale, cy, 18 * scale, Math.PI * 1.5, Math.PI * 0.5);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawBikiniBottomFlower(ctx: CanvasRenderingContext2D, cx: number, cy: number, radius: number = 16, color: string = "#ec4899") {
  ctx.save();
  ctx.fillStyle = color;
  for (let i = 0; i < 5; i++) {
    const angle = (i * Math.PI * 2) / 5;
    const px = cx + Math.cos(angle) * (radius * 1.2);
    const py = cy + Math.sin(angle) * (radius * 1.2);
    ctx.beginPath();
    ctx.arc(px, py, radius, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = "#facc15";
  ctx.beginPath();
  ctx.arc(cx, cy, radius * 0.7, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawCrewmate(ctx: CanvasRenderingContext2D, cx: number, cy: number, scale: number = 1, color: string = "#ef4444") {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(scale, scale);

  ctx.fillStyle = color;
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.roundRect(-15, -25, 30, 45, 15);
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.roundRect(-22, -15, 10, 25, 5);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#38bdf8";
  ctx.beginPath();
  ctx.ellipse(3, -10, 10, 6, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.ellipse(5, -12, 4, 2, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function drawBirthdayCake(ctx: CanvasRenderingContext2D, cx: number, cy: number, scale: number = 1) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(scale, scale);

  ctx.fillStyle = "#f472b6";
  ctx.strokeStyle = "#db2777";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(-25, 0, 50, 25, 6);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#fbcfe8";
  ctx.beginPath();
  ctx.roundRect(-18, -20, 36, 20, 5);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#38bdf8";
  ctx.fillRect(-3, -32, 6, 12);

  ctx.fillStyle = "#f59e0b";
  ctx.beginPath();
  ctx.ellipse(0, -36, 4, 6, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function drawSheriffBadge(ctx: CanvasRenderingContext2D, cx: number, cy: number, radius: number = 24) {
  ctx.save();
  ctx.fillStyle = "#f59e0b";
  ctx.strokeStyle = "#b45309";
  ctx.lineWidth = 2;

  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const outerA = (i * Math.PI) / 3 - Math.PI / 2;
    const innerA = outerA + Math.PI / 6;
    const ox = cx + Math.cos(outerA) * radius;
    const oy = cy + Math.sin(outerA) * radius;
    const ix = cx + Math.cos(innerA) * (radius * 0.5);
    const iy = cy + Math.sin(innerA) * (radius * 0.5);

    if (i === 0) ctx.moveTo(ox, oy);
    else ctx.lineTo(ox, oy);
    ctx.lineTo(ix, iy);
  }
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  for (let i = 0; i < 6; i++) {
    const outerA = (i * Math.PI) / 3 - Math.PI / 2;
    const ox = cx + Math.cos(outerA) * radius;
    const oy = cy + Math.sin(outerA) * radius;
    ctx.beginPath();
    ctx.arc(ox, oy, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }

  ctx.fillStyle = "#fef3c7";
  ctx.beginPath();
  ctx.arc(cx, cy, radius * 0.42, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#b45309";
  ctx.font = "bold 8px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("SHERIFF", cx, cy);

  ctx.restore();
}

function drawSpongeBobClothingFooter(ctx: CanvasRenderingContext2D, width: number, height: number) {
  ctx.save();
  const shirtY = height - 160;
  const pantsY = height - 105;

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, shirtY, width, 55);

  ctx.fillStyle = "#ef4444";
  ctx.beginPath();
  ctx.moveTo(width / 2 - 12, shirtY);
  ctx.lineTo(width / 2 + 12, shirtY);
  ctx.lineTo(width / 2 + 16, shirtY + 25);
  ctx.lineTo(width / 2, shirtY + 48);
  ctx.lineTo(width / 2 - 16, shirtY + 25);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "#78350f";
  ctx.fillRect(0, pantsY, width, 105);

  ctx.fillStyle = "#18181b";
  const beltW = 40;
  const beltH = 14;
  for (let bx = 30; bx < width - 30; bx += (width - 60) / 4) {
    ctx.fillRect(bx, pantsY + 10, beltW, beltH);
  }

  ctx.restore();
}

function drawScallopedStampFrame(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  toothRadius: number = 8
) {
  ctx.beginPath();
  ctx.moveTo(x, y);

  // Top edge scallops
  const stepX = toothRadius * 2.4;
  for (let curX = x; curX < x + w; curX += stepX) {
    ctx.lineTo(curX, y);
    ctx.arc(curX + toothRadius, y, toothRadius, Math.PI, 0, true);
  }
  ctx.lineTo(x + w, y);

  // Right edge scallops
  for (let curY = y; curY < y + h; curY += stepX) {
    ctx.lineTo(x + w, curY);
    ctx.arc(x + w, curY + toothRadius, toothRadius, -Math.PI / 2, Math.PI / 2, true);
  }
  ctx.lineTo(x + w, y + h);

  // Bottom edge scallops
  for (let curX = x + w; curX > x; curX -= stepX) {
    ctx.lineTo(curX, y + h);
    ctx.arc(curX - toothRadius, y + h, toothRadius, 0, Math.PI, true);
  }
  ctx.lineTo(x, y + h);

  // Left edge scallops
  for (let curY = y + h; curY > y; curY -= stepX) {
    ctx.lineTo(x, curY);
    ctx.arc(x, curY - toothRadius, toothRadius, Math.PI / 2, -Math.PI / 2, true);
  }
  ctx.closePath();
}

/**
 * Official Valorant V-mark vector logo
 */
function drawValorantLogo(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number, color: string = "#ff4655") {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.fillStyle = color;
  const s = size / 40;

  // Left blade: /| shape
  ctx.beginPath();
  ctx.moveTo(-16 * s, -18 * s);
  ctx.lineTo(-4 * s, -18 * s);
  ctx.lineTo(-4 * s, 18 * s);
  ctx.lineTo(-12 * s, 18 * s);
  ctx.lineTo(-16 * s, 6 * s);
  ctx.closePath();
  ctx.fill();

  // Right blade: |\ shape
  ctx.beginPath();
  ctx.moveTo(16 * s, -18 * s);
  ctx.lineTo(4 * s, -18 * s);
  ctx.lineTo(4 * s, 6 * s);
  ctx.lineTo(12 * s, 18 * s);
  ctx.lineTo(16 * s, 18 * s);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}

/**
 * Riot Games iconic fist logo mark
 */
function drawRiotFistLogo(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number, color: string = "#ffffff") {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.fillStyle = color;
  const s = size / 30;

  // 4 fingers
  ctx.beginPath();
  ctx.moveTo(-12 * s, -10 * s);
  ctx.lineTo(-7 * s, -12 * s);
  ctx.lineTo(-7 * s, 2 * s);
  ctx.lineTo(-12 * s, 2 * s);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(-5 * s, -13 * s);
  ctx.lineTo(0 * s, -14 * s);
  ctx.lineTo(0 * s, 2 * s);
  ctx.lineTo(-5 * s, 2 * s);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(2 * s, -13 * s);
  ctx.lineTo(7 * s, -12 * s);
  ctx.lineTo(7 * s, 2 * s);
  ctx.lineTo(2 * s, 2 * s);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(9 * s, -10 * s);
  ctx.lineTo(13 * s, -8 * s);
  ctx.lineTo(13 * s, 2 * s);
  ctx.lineTo(9 * s, 2 * s);
  ctx.closePath();
  ctx.fill();

  // Palm base
  ctx.beginPath();
  ctx.moveTo(-13 * s, 4 * s);
  ctx.lineTo(13 * s, 4 * s);
  ctx.lineTo(11 * s, 14 * s);
  ctx.lineTo(-10 * s, 14 * s);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}

/**
 * Top-left tactical lanyard strap with Riot logo buckle
 */
function drawLanyardStrap(ctx: CanvasRenderingContext2D, x: number, y: number, angleDeg: number = -16) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate((angleDeg * Math.PI) / 180);

  // Drop shadow
  ctx.shadowColor = "rgba(0, 0, 0, 0.6)";
  ctx.shadowBlur = 18;
  ctx.shadowOffsetY = 10;

  // Black woven nylon strap
  ctx.fillStyle = "#18181b";
  ctx.fillRect(-45, -200, 90, 280);

  // Red accent edge stripes
  ctx.fillStyle = "#eb0029";
  ctx.fillRect(-45, -200, 6, 280);
  ctx.fillRect(39, -200, 6, 280);

  // Strap texture weave
  ctx.strokeStyle = "rgba(255, 255, 255, 0.06)";
  ctx.lineWidth = 1;
  for (let sy = -200; sy < 80; sy += 8) {
    ctx.beginPath();
    ctx.moveTo(-45, sy);
    ctx.lineTo(45, sy + 6);
    ctx.stroke();
  }

  // Buckle release / clip
  ctx.shadowBlur = 10;
  ctx.fillStyle = "#27272a";
  ctx.beginPath();
  ctx.roundRect(-52, 40, 104, 75, 12);
  ctx.fill();

  // Buckle center cutout & Riot logo
  ctx.fillStyle = "#eb0029";
  ctx.beginPath();
  ctx.roundRect(-38, 52, 76, 50, 6);
  ctx.fill();

  drawRiotFistLogo(ctx, 0, 77, 26, "#ffffff");

  ctx.restore();
}

/**
 * Top-right agent tactical keycard / sleeve ("PROTOCOL // 00")
 */
function drawTacticalKeycard(ctx: CanvasRenderingContext2D, x: number, y: number, angleDeg: number = 18) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate((angleDeg * Math.PI) / 180);

  ctx.shadowColor = "rgba(0, 0, 0, 0.65)";
  ctx.shadowBlur = 24;
  ctx.shadowOffsetY = 12;

  // Outer Cyan Metallic Bevel Card
  const grad = ctx.createLinearGradient(-130, -180, 130, 180);
  grad.addColorStop(0, "#475569");
  grad.addColorStop(0.3, "#0284c7");
  grad.addColorStop(0.7, "#0369a1");
  grad.addColorStop(1, "#334155");

  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.roundRect(-130, -190, 260, 380, 20);
  ctx.fill();

  // Cyan Neon Inner Border
  ctx.strokeStyle = "#38bdf8";
  ctx.lineWidth = 3;
  ctx.stroke();

  // Inner Dark Slate Screen
  ctx.fillStyle = "#09131d";
  ctx.beginPath();
  ctx.roundRect(-110, -170, 220, 340, 14);
  ctx.fill();

  // Chamfered cut accents
  ctx.fillStyle = "#0284c7";
  ctx.fillRect(-110, -170, 40, 8);
  ctx.fillRect(70, 162, 40, 8);

  // Large White Valorant Logo in center
  drawValorantLogo(ctx, 0, -20, 70, "#ffffff");

  // Vertical text along right edge
  ctx.save();
  ctx.rotate(Math.PI / 2);
  ctx.fillStyle = "#38bdf8";
  ctx.font = "bold 13px monospace";
  ctx.fillText("PROTOCOL // 00", -70, -85);
  ctx.restore();

  ctx.restore();
}

/**
 * Realistic Gold Metallic Keychain Ring & Riot Games Tag
 */
function drawMetallicKeychain(ctx: CanvasRenderingContext2D, x: number, y: number, radius: number = 58) {
  ctx.save();
  ctx.translate(x, y);

  ctx.shadowColor = "rgba(0, 0, 0, 0.55)";
  ctx.shadowBlur = 18;
  ctx.shadowOffsetY = 8;

  // Outer Gold Metallic Ring
  const goldGrad = ctx.createLinearGradient(-radius, -radius, radius, radius);
  goldGrad.addColorStop(0, "#b45309");
  goldGrad.addColorStop(0.2, "#fde047");
  goldGrad.addColorStop(0.4, "#d97706");
  goldGrad.addColorStop(0.6, "#fef08a");
  goldGrad.addColorStop(0.8, "#b45309");
  goldGrad.addColorStop(1, "#78350f");

  ctx.strokeStyle = goldGrad;
  ctx.lineWidth = 14;
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, Math.PI * 2);
  ctx.stroke();

  // Specular sheen ring highlight
  ctx.strokeStyle = "rgba(255, 255, 255, 0.6)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(-radius * 0.15, -radius * 0.15, radius - 4, -Math.PI / 2, 0);
  ctx.stroke();

  // Chain links cascading down
  const linkYOffsets = [radius + 12, radius + 36, radius + 60];
  linkYOffsets.forEach((ly, idx) => {
    ctx.save();
    ctx.translate(idx % 2 === 0 ? 0 : 2, ly);
    ctx.strokeStyle = goldGrad;
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.ellipse(0, 0, 9, 14, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  });

  // Hanging Tag at bottom of chain
  ctx.save();
  ctx.translate(0, radius + 115);
  ctx.rotate((-6 * Math.PI) / 180);

  ctx.fillStyle = "#0f172a";
  ctx.beginPath();
  ctx.roundRect(-42, -42, 84, 84, 12);
  ctx.fill();

  ctx.strokeStyle = "#38bdf8";
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // Red accent corner
  ctx.fillStyle = "#eb0029";
  ctx.beginPath();
  ctx.moveTo(18, 42);
  ctx.lineTo(42, 18);
  ctx.lineTo(42, 42);
  ctx.closePath();
  ctx.fill();

  // Riot Fist Logo
  drawRiotFistLogo(ctx, 0, 0, 32, "#ffffff");
  ctx.restore();

  ctx.restore();
}

/**
 * Realistic Grooved Vinyl Record Player & Album Art Center Label
 */
function drawVinylRecord(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radius: number = 290,
  albumImg?: HTMLImageElement | HTMLVideoElement,
  filterString?: string,
  isFlipped?: boolean,
  cuteFilter: CuteFilter = "none",
  beautyGlow: number = 0,
  filterIntensity: number = 100
) {
  ctx.save();

  // Outer heavy drop shadow
  ctx.shadowColor = "rgba(0, 0, 0, 0.75)";
  ctx.shadowBlur = 36;
  ctx.shadowOffsetX = -10;
  ctx.shadowOffsetY = 16;

  // Main Black Vinyl Body
  ctx.fillStyle = "#0d0d10";
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fill();

  // Reset shadow for grooves
  ctx.shadowColor = "transparent";

  // Concentric vinyl micro-grooves
  for (let r = 145; r < radius - 8; r += 4) {
    const alpha = (Math.sin(r * 1.5) * 0.05 + 0.08);
    ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
    ctx.lineWidth = r % 16 === 0 ? 1.4 : 0.8;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Specular Light Cones (Vinyl Sheen Reflections across opposite quadrants)
  const sheenGrad = ctx.createConicGradient(Math.PI / 4, cx, cy);
  sheenGrad.addColorStop(0, "rgba(255, 255, 255, 0.0)");
  sheenGrad.addColorStop(0.12, "rgba(255, 255, 255, 0.16)");
  sheenGrad.addColorStop(0.25, "rgba(255, 255, 255, 0.0)");
  sheenGrad.addColorStop(0.5, "rgba(255, 255, 255, 0.0)");
  sheenGrad.addColorStop(0.62, "rgba(255, 255, 255, 0.16)");
  sheenGrad.addColorStop(0.75, "rgba(255, 255, 255, 0.0)");
  sheenGrad.addColorStop(1.0, "rgba(255, 255, 255, 0.0)");

  ctx.fillStyle = sheenGrad;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fill();

  // Center Album Label Area
  const labelRadius = 115;

  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, labelRadius, 0, Math.PI * 2);
  ctx.clip();

  const hasValidAlbumImg =
    albumImg &&
    ((albumImg instanceof HTMLImageElement && albumImg.naturalWidth > 0 && albumImg.src && !albumImg.src.endsWith("#")) ||
      (albumImg instanceof HTMLVideoElement && albumImg.videoWidth > 0));

  if (hasValidAlbumImg) {
    // Custom/Captured photo in vinyl center
    ctx.filter = filterString || "none";
    drawImageCover(ctx, albumImg, cx - labelRadius, cy - labelRadius, labelRadius * 2, labelRadius * 2, 0, isFlipped);
    applyCuteFilterOverlay(ctx, cx - labelRadius, cy - labelRadius, labelRadius * 2, labelRadius * 2, cuteFilter, beautyGlow, 0, filterIntensity);
  } else {
    // Default Official Valorant "Die For You / Champions" Album Artwork
    ctx.fillStyle = "#eb0029";
    ctx.fillRect(cx - labelRadius, cy - labelRadius, labelRadius * 2, labelRadius * 2);

    // Dark geometric tech background
    ctx.fillStyle = "#0f1923";
    ctx.beginPath();
    ctx.moveTo(cx - labelRadius, cy + 20);
    ctx.lineTo(cx, cy - labelRadius + 10);
    ctx.lineTo(cx + labelRadius, cy + 20);
    ctx.lineTo(cx, cy + labelRadius);
    ctx.closePath();
    ctx.fill();

    // Red geometric champion crown / agent silhouette
    drawValorantLogo(ctx, cx, cy - 14, 52, "#ffffff");

    ctx.fillStyle = "#ffffff";
    ctx.font = "900 14px 'Plus Jakarta Sans', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("DIE FOR YOU", cx, cy + 40);

    ctx.fillStyle = "#ff4655";
    ctx.font = "bold 10px monospace";
    ctx.fillText("VALORANT // GRABBITZ", cx, cy + 56);
  }
  ctx.restore();

  // Inner Label Edge Ring
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(cx, cy, labelRadius, 0, Math.PI * 2);
  ctx.stroke();

  // Center Spindle Hole & Silver Grommet
  ctx.fillStyle = "#e2e8f0";
  ctx.beginPath();
  ctx.arc(cx, cy, 18, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#0a0a0c";
  ctx.beginPath();
  ctx.arc(cx, cy, 11, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

/**
 * Plastic Grocery Fruit Crate Vector Frame with Ventilation Slits & Ribbed Texture
 */
function drawPlasticCrateFrame(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  baseColor: string,
  darkColor: string,
  lightColor: string
) {
  ctx.save();

  // Subtle Outer Crate Drop Shadow
  ctx.shadowColor = "rgba(0, 0, 0, 0.15)";
  ctx.shadowBlur = 12;
  ctx.shadowOffsetY = 6;

  // 1. Outer Crate Plastic Body
  ctx.fillStyle = baseColor;
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, 18);
  ctx.fill();

  ctx.shadowColor = "transparent";

  // 2. Thick Outer Border / Rim
  ctx.strokeStyle = darkColor;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, 18);
  ctx.stroke();

  // Inner Highlight Rim
  ctx.strokeStyle = lightColor;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(x + 4, y + 4, w - 8, h - 8, 14);
  ctx.stroke();

  // 3. Crate Ventilation Slits (Top & Bottom borders)
  const slotW = 16;
  const slotH = 9;
  const slotGap = 26;

  ctx.fillStyle = darkColor;

  // Top Slits Row
  for (let sx = x + 35; sx < x + w - 40; sx += slotGap) {
    ctx.beginPath();
    ctx.roundRect(sx, y + 14, slotW, slotH, 3);
    ctx.fill();
  }

  // Bottom Slits Row
  for (let sx = x + 35; sx < x + w - 40; sx += slotGap) {
    ctx.beginPath();
    ctx.roundRect(sx, y + h - 23, slotW, slotH, 3);
    ctx.fill();
  }

  // Left & Right Vertical Slits Rows
  const vSlotW = 9;
  const vSlotH = 16;
  const vSlotGap = 26;

  for (let sy = y + 40; sy < y + h - 45; sy += vSlotGap) {
    ctx.beginPath();
    ctx.roundRect(x + 14, sy, vSlotW, vSlotH, 3);
    ctx.fill();
    ctx.beginPath();
    ctx.roundRect(x + w - 23, sy, vSlotW, vSlotH, 3);
    ctx.fill();
  }

  // Crate Corner Reinforcements (Diagonal plastic braces)
  ctx.fillStyle = darkColor;
  const cSize = 22;
  // Top-Left
  ctx.beginPath();
  ctx.moveTo(x + 6, y + cSize);
  ctx.lineTo(x + cSize, y + 6);
  ctx.lineTo(x + 6, y + 6);
  ctx.closePath();
  ctx.fill();

  // Top-Right
  ctx.beginPath();
  ctx.moveTo(x + w - 6, y + cSize);
  ctx.lineTo(x + w - cSize, y + 6);
  ctx.lineTo(x + w - 6, y + 6);
  ctx.closePath();
  ctx.fill();

  // Bottom-Left
  ctx.beginPath();
  ctx.moveTo(x + 6, y + h - cSize);
  ctx.lineTo(x + cSize, y + h - 6);
  ctx.lineTo(x + 6, y + h - 6);
  ctx.closePath();
  ctx.fill();

  // Bottom-Right
  ctx.beginPath();
  ctx.moveTo(x + w - 6, y + h - cSize);
  ctx.lineTo(x + w - cSize, y + h - 6);
  ctx.lineTo(x + w - 6, y + h - 6);
  ctx.closePath();
  ctx.fill();

  // 4. Inner Photo Opening Cutout Border
  const innerX = x + 34;
  const innerY = y + 34;
  const innerW = w - 68;
  const innerH = h - 68;

  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.roundRect(innerX, innerY, innerW, innerH, 12);
  ctx.fill();

  ctx.strokeStyle = darkColor;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.roundRect(innerX, innerY, innerW, innerH, 12);
  ctx.stroke();

  ctx.restore();
}

/**
 * Fresh Green Broccoli Vector
 */
function drawBroccoli(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number = 48) {
  ctx.save();
  ctx.translate(cx, cy);
  const s = size / 50;

  // Stalk
  ctx.fillStyle = "#86efac";
  ctx.strokeStyle = "#15803d";
  ctx.lineWidth = 2.5 * s;

  ctx.beginPath();
  ctx.moveTo(-10 * s, 10 * s);
  ctx.lineTo(-8 * s, 26 * s);
  ctx.quadraticCurveTo(0, 30 * s, 8 * s, 26 * s);
  ctx.lineTo(10 * s, 10 * s);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Florets (bumpy cloud clusters)
  ctx.fillStyle = "#22c55e";
  const florets = [
    { x: -16 * s, y: 0, r: 14 * s },
    { x: 16 * s, y: 0, r: 14 * s },
    { x: -10 * s, y: -14 * s, r: 16 * s },
    { x: 10 * s, y: -14 * s, r: 16 * s },
    { x: 0, y: -20 * s, r: 18 * s },
    { x: 0, y: -4 * s, r: 16 * s },
  ];

  ctx.fillStyle = "#16a34a";
  florets.forEach((f) => {
    ctx.beginPath();
    ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.fillStyle = "#22c55e";
  florets.forEach((f) => {
    ctx.beginPath();
    ctx.arc(f.x, f.y - 2 * s, f.r * 0.85, 0, Math.PI * 2);
    ctx.fill();
  });

  // Highlight dots
  ctx.fillStyle = "#86efac";
  ctx.beginPath();
  ctx.arc(-6 * s, -14 * s, 3 * s, 0, Math.PI * 2);
  ctx.arc(8 * s, -10 * s, 2.5 * s, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

/**
 * Fresh Kiwi Fruit Slice
 */
function drawKiwiSlice(ctx: CanvasRenderingContext2D, cx: number, cy: number, radius: number = 24) {
  ctx.save();
  ctx.translate(cx, cy);

  // Brown Fuzzy Outer Peel
  ctx.fillStyle = "#854d0e";
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, Math.PI * 2);
  ctx.fill();

  // Bright Green Flesh
  ctx.fillStyle = "#84cc16";
  ctx.beginPath();
  ctx.arc(0, 0, radius * 0.9, 0, Math.PI * 2);
  ctx.fill();

  // Pale Creamy Center Core
  ctx.fillStyle = "#fef08a";
  ctx.beginPath();
  ctx.arc(0, 0, radius * 0.35, 0, Math.PI * 2);
  ctx.fill();

  // Radiating Rays & Black Seeds
  ctx.strokeStyle = "rgba(254, 240, 138, 0.6)";
  ctx.lineWidth = 1.5;
  ctx.fillStyle = "#1c1917";

  const numSeeds = 10;
  for (let i = 0; i < numSeeds; i++) {
    const angle = (i * Math.PI * 2) / numSeeds;
    const rx = Math.cos(angle) * (radius * 0.58);
    const ry = Math.sin(angle) * (radius * 0.58);

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(Math.cos(angle) * (radius * 0.75), Math.sin(angle) * (radius * 0.75));
    ctx.stroke();

    // Black seed dot
    ctx.beginPath();
    ctx.ellipse(rx, ry, 1.8, 2.8, angle, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

/**
 * Sweet Red Strawberry Vector
 */
function drawStrawberry(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number = 26) {
  ctx.save();
  ctx.translate(cx, cy);
  const s = size / 30;

  // Berry Body
  ctx.fillStyle = "#ef4444";
  ctx.beginPath();
  ctx.moveTo(0, 22 * s);
  ctx.bezierCurveTo(-22 * s, 10 * s, -18 * s, -12 * s, 0, -12 * s);
  ctx.bezierCurveTo(18 * s, -12 * s, 22 * s, 10 * s, 0, 22 * s);
  ctx.closePath();
  ctx.fill();

  // Green Leaves Calyx
  ctx.fillStyle = "#22c55e";
  const leafAngles = [-0.6, -0.2, 0.2, 0.6];
  leafAngles.forEach((a) => {
    ctx.beginPath();
    ctx.ellipse(Math.sin(a) * 12 * s, -13 * s, 4 * s, 10 * s, a, 0, Math.PI * 2);
    ctx.fill();
  });

  // Little Stem
  ctx.strokeStyle = "#16a34a";
  ctx.lineWidth = 2.5 * s;
  ctx.beginPath();
  ctx.moveTo(0, -12 * s);
  ctx.quadraticCurveTo(3 * s, -22 * s, 8 * s, -22 * s);
  ctx.stroke();

  // Yellow Seed Dots
  ctx.fillStyle = "#fef08a";
  const seedPositions = [
    { x: -7 * s, y: -4 * s },
    { x: 0, y: -5 * s },
    { x: 7 * s, y: -4 * s },
    { x: -10 * s, y: 3 * s },
    { x: -3 * s, y: 4 * s },
    { x: 4 * s, y: 3 * s },
    { x: 10 * s, y: 3 * s },
    { x: -5 * s, y: 11 * s },
    { x: 2 * s, y: 12 * s },
    { x: 0, y: 17 * s },
  ];

  seedPositions.forEach((sp) => {
    ctx.beginPath();
    ctx.ellipse(sp.x, sp.y, 1.2 * s, 1.8 * s, 0, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.restore();
}

/**
 * Golden Sweet Mango Vector
 */
function drawMango(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number = 32) {
  ctx.save();
  ctx.translate(cx, cy);
  const s = size / 35;

  // Mango Gradient
  const grad = ctx.createRadialGradient(-6 * s, -4 * s, 4 * s, 0, 4 * s, 26 * s);
  grad.addColorStop(0, "#fbbf24");
  grad.addColorStop(0.6, "#f59e0b");
  grad.addColorStop(1, "#ea580c");

  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.moveTo(0, -18 * s);
  ctx.bezierCurveTo(18 * s, -14 * s, 26 * s, 10 * s, 10 * s, 24 * s);
  ctx.bezierCurveTo(-6 * s, 28 * s, -22 * s, 14 * s, -18 * s, -2 * s);
  ctx.bezierCurveTo(-14 * s, -16 * s, -8 * s, -18 * s, 0, -18 * s);
  ctx.closePath();
  ctx.fill();

  // Green Leaf on Top
  ctx.fillStyle = "#16a34a";
  ctx.beginPath();
  ctx.ellipse(-8 * s, -22 * s, 6 * s, 12 * s, -Math.PI / 4, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

/**
 * Creamy Fresh Avocado Half Vector
 */
function drawAvocado(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number = 32) {
  ctx.save();
  ctx.translate(cx, cy);
  const s = size / 35;

  // Dark Green Skin
  ctx.fillStyle = "#14532d";
  ctx.beginPath();
  ctx.moveTo(0, -22 * s);
  ctx.bezierCurveTo(16 * s, -18 * s, 22 * s, 6 * s, 18 * s, 22 * s);
  ctx.bezierCurveTo(12 * s, 30 * s, -12 * s, 30 * s, -18 * s, 22 * s);
  ctx.bezierCurveTo(-22 * s, 6 * s, -16 * s, -18 * s, 0, -22 * s);
  ctx.closePath();
  ctx.fill();

  // Pale Lime/Yellow Flesh
  ctx.fillStyle = "#bef264";
  ctx.beginPath();
  ctx.moveTo(0, -18 * s);
  ctx.bezierCurveTo(13 * s, -14 * s, 18 * s, 5 * s, 14 * s, 18 * s);
  ctx.bezierCurveTo(9 * s, 25 * s, -9 * s, 25 * s, -14 * s, 18 * s);
  ctx.bezierCurveTo(-18 * s, 5 * s, -13 * s, -14 * s, 0, -18 * s);
  ctx.closePath();
  ctx.fill();

  // Large Round Brown Pit
  const pitGrad = ctx.createRadialGradient(-3 * s, 4 * s, 2 * s, 0, 7 * s, 14 * s);
  pitGrad.addColorStop(0, "#92400e");
  pitGrad.addColorStop(0.7, "#78350f");
  pitGrad.addColorStop(1, "#451a03");

  ctx.fillStyle = pitGrad;
  ctx.beginPath();
  ctx.arc(0, 8 * s, 10 * s, 0, Math.PI * 2);
  ctx.fill();

  // Specular reflection on pit
  ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
  ctx.beginPath();
  ctx.arc(-3 * s, 5 * s, 3 * s, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

/**
 * Juicy Orange Citrus Slice
 */
function drawOrangeSlice(ctx: CanvasRenderingContext2D, cx: number, cy: number, radius: number = 24) {
  ctx.save();
  ctx.translate(cx, cy);

  // Orange Outer Rind
  ctx.fillStyle = "#ea580c";
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, Math.PI * 2);
  ctx.fill();

  // White Pith Layer
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.arc(0, 0, radius * 0.9, 0, Math.PI * 2);
  ctx.fill();

  // Orange Pulp Segments
  ctx.fillStyle = "#f97316";
  const numSegments = 8;
  const segRadius = radius * 0.78;

  for (let i = 0; i < numSegments; i++) {
    const startA = (i * Math.PI * 2) / numSegments + 0.08;
    const endA = ((i + 1) * Math.PI * 2) / numSegments - 0.08;

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, segRadius, startA, endA);
    ctx.closePath();
    ctx.fill();
  }

  // Small White Center Core
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.arc(0, 0, radius * 0.16, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

/**
 * Ripe Red Tomato / Hibiscus Vector
 */
function drawTomato(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number = 26) {
  ctx.save();
  ctx.translate(cx, cy);
  const s = size / 30;

  // Red Body
  ctx.fillStyle = "#ef4444";
  ctx.beginPath();
  ctx.ellipse(0, 2 * s, 16 * s, 14 * s, 0, 0, Math.PI * 2);
  ctx.fill();

  // Green Sepals
  ctx.fillStyle = "#16a34a";
  for (let i = 0; i < 5; i++) {
    const a = (i * Math.PI * 2) / 5 - Math.PI / 2;
    ctx.beginPath();
    ctx.ellipse(Math.cos(a) * 7 * s, Math.sin(a) * 7 * s - 8 * s, 3 * s, 7 * s, a, 0, Math.PI * 2);
    ctx.fill();
  }

  // Little Stem
  ctx.strokeStyle = "#15803d";
  ctx.lineWidth = 2.5 * s;
  ctx.beginPath();
  ctx.moveTo(0, -8 * s);
  ctx.lineTo(0, -16 * s);
  ctx.stroke();

  ctx.restore();
}

/**
 * Curved Sweet Yellow Banana Vector
 */
function drawBanana(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number = 36, angleDeg: number = -15) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate((angleDeg * Math.PI) / 180);
  const s = size / 40;

  // Banana Body
  ctx.fillStyle = "#facc15";
  ctx.beginPath();
  ctx.moveTo(-18 * s, 14 * s);
  ctx.quadraticCurveTo(0, 24 * s, 22 * s, -4 * s);
  ctx.quadraticCurveTo(6 * s, 10 * s, -14 * s, 4 * s);
  ctx.closePath();
  ctx.fill();

  // Banana Highlight & Ridge
  ctx.strokeStyle = "#eab308";
  ctx.lineWidth = 2 * s;
  ctx.beginPath();
  ctx.moveTo(-16 * s, 10 * s);
  ctx.quadraticCurveTo(0, 18 * s, 20 * s, -2 * s);
  ctx.stroke();

  // Brown Tips
  ctx.fillStyle = "#854d0e";
  ctx.beginPath();
  ctx.arc(-18 * s, 14 * s, 2.5 * s, 0, Math.PI * 2);
  ctx.arc(22 * s, -4 * s, 2.5 * s, 0, Math.PI * 2);
  ctx.fill();

  // Green Stem
  ctx.fillStyle = "#65a30d";
  ctx.beginPath();
  ctx.fillRect(-22 * s, 13 * s, 5 * s, 3 * s);

  ctx.restore();
}

/**
 * Juicy Purple Grape Cluster Vector
 */
function drawGrapeCluster(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number = 34) {
  ctx.save();
  ctx.translate(cx, cy);
  const s = size / 35;

  // Green Leaf on Top
  ctx.fillStyle = "#16a34a";
  ctx.beginPath();
  ctx.ellipse(-6 * s, -18 * s, 6 * s, 10 * s, -Math.PI / 4, 0, Math.PI * 2);
  ctx.fill();

  // Brown Vine Stem
  ctx.strokeStyle = "#78350f";
  ctx.lineWidth = 2 * s;
  ctx.beginPath();
  ctx.moveTo(0, -14 * s);
  ctx.quadraticCurveTo(6 * s, -22 * s, 12 * s, -18 * s);
  ctx.stroke();

  // Purple Grapes
  const grapePositions = [
    { x: -10 * s, y: -8 * s, r: 6.5 * s },
    { x: 0, y: -10 * s, r: 6.5 * s },
    { x: 10 * s, y: -8 * s, r: 6.5 * s },
    { x: -6 * s, y: 0, r: 6.5 * s },
    { x: 6 * s, y: 0, r: 6.5 * s },
    { x: -12 * s, y: 4 * s, r: 6 * s },
    { x: 0, y: 8 * s, r: 6.5 * s },
    { x: 12 * s, y: 4 * s, r: 6 * s },
    { x: -5 * s, y: 16 * s, r: 5.5 * s },
    { x: 5 * s, y: 16 * s, r: 5.5 * s },
    { x: 0, y: 24 * s, r: 5 * s },
  ];

  ctx.fillStyle = "#7c3aed";
  grapePositions.forEach((gp) => {
    ctx.beginPath();
    ctx.arc(gp.x, gp.y, gp.r, 0, Math.PI * 2);
    ctx.fill();
  });

  // Highlights
  ctx.fillStyle = "rgba(255, 255, 255, 0.45)";
  grapePositions.forEach((gp) => {
    ctx.beginPath();
    ctx.arc(gp.x - gp.r * 0.35, gp.y - gp.r * 0.35, gp.r * 0.25, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.restore();
}

/**
 * Twin Glossy Red Cherries Vector
 */
function drawTwinCherries(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number = 32) {
  ctx.save();
  ctx.translate(cx, cy);
  const s = size / 35;

  // Stems
  ctx.strokeStyle = "#16a34a";
  ctx.lineWidth = 2.5 * s;
  ctx.beginPath();
  ctx.moveTo(0, -18 * s);
  ctx.quadraticCurveTo(-12 * s, -6 * s, -12 * s, 8 * s);
  ctx.moveTo(0, -18 * s);
  ctx.quadraticCurveTo(8 * s, -4 * s, 14 * s, 6 * s);
  ctx.stroke();

  // Green Leaf at Joint
  ctx.fillStyle = "#22c55e";
  ctx.beginPath();
  ctx.ellipse(6 * s, -20 * s, 5 * s, 10 * s, Math.PI / 3, 0, Math.PI * 2);
  ctx.fill();

  // Cherry 1 (Left)
  ctx.fillStyle = "#dc2626";
  ctx.beginPath();
  ctx.arc(-12 * s, 10 * s, 9 * s, 0, Math.PI * 2);
  ctx.fill();

  // Cherry 2 (Right)
  ctx.beginPath();
  ctx.arc(14 * s, 8 * s, 8.5 * s, 0, Math.PI * 2);
  ctx.fill();

  // Specular Highlights
  ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
  ctx.beginPath();
  ctx.arc(-15 * s, 7 * s, 2.5 * s, 0, Math.PI * 2);
  ctx.arc(11 * s, 5 * s, 2.2 * s, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

/**
 * Fresh Yellow Lemon Slice
 */
function drawLemonSlice(ctx: CanvasRenderingContext2D, cx: number, cy: number, radius: number = 22) {
  ctx.save();
  ctx.translate(cx, cy);

  // Yellow Rind
  ctx.fillStyle = "#eab308";
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, Math.PI * 2);
  ctx.fill();

  // White Pith
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.arc(0, 0, radius * 0.9, 0, Math.PI * 2);
  ctx.fill();

  // Lemon Segments
  ctx.fillStyle = "#facc15";
  const numSegs = 8;
  const segR = radius * 0.78;
  for (let i = 0; i < numSegs; i++) {
    const a1 = (i * Math.PI * 2) / numSegs + 0.08;
    const a2 = ((i + 1) * Math.PI * 2) / numSegs - 0.08;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, segR, a1, a2);
    ctx.closePath();
    ctx.fill();
  }

  // White Core
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.arc(0, 0, radius * 0.15, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

/**
 * Cute Red Spotted Mushroom Vector
 */
function drawMushroom(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number = 28) {
  ctx.save();
  ctx.translate(cx, cy);
  const s = size / 30;

  // Stalk
  ctx.fillStyle = "#fef3c7";
  ctx.beginPath();
  ctx.roundRect(-6 * s, 0, 12 * s, 14 * s, 4 * s);
  ctx.fill();

  // Cap
  ctx.fillStyle = "#ef4444";
  ctx.beginPath();
  ctx.arc(0, 0, 16 * s, Math.PI, 0);
  ctx.closePath();
  ctx.fill();

  // White Spots
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.arc(-8 * s, -6 * s, 3 * s, 0, Math.PI * 2);
  ctx.arc(0, -11 * s, 3.5 * s, 0, Math.PI * 2);
  ctx.arc(8 * s, -6 * s, 2.5 * s, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

/**
 * Bright Orange Carrot Vector
 */
function drawCarrot(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number = 32, angleDeg: number = 25) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate((angleDeg * Math.PI) / 180);
  const s = size / 35;

  // Green leafy top
  ctx.fillStyle = "#22c55e";
  ctx.beginPath();
  ctx.ellipse(-5 * s, -18 * s, 3 * s, 8 * s, -0.3, 0, Math.PI * 2);
  ctx.ellipse(0, -20 * s, 3 * s, 10 * s, 0, 0, Math.PI * 2);
  ctx.ellipse(5 * s, -18 * s, 3 * s, 8 * s, 0.3, 0, Math.PI * 2);
  ctx.fill();

  // Orange carrot cone
  ctx.fillStyle = "#f97316";
  ctx.beginPath();
  ctx.moveTo(-7 * s, -12 * s);
  ctx.quadraticCurveTo(0, -14 * s, 7 * s, -12 * s);
  ctx.lineTo(0, 18 * s);
  ctx.closePath();
  ctx.fill();

  // Horizontal ridge lines
  ctx.strokeStyle = "#ea580c";
  ctx.lineWidth = 1.5 * s;
  ctx.beginPath();
  ctx.moveTo(-4 * s, -6 * s);
  ctx.lineTo(2 * s, -6 * s);
  ctx.moveTo(-2 * s, 2 * s);
  ctx.lineTo(4 * s, 2 * s);
  ctx.moveTo(-1 * s, 10 * s);
  ctx.lineTo(2 * s, 10 * s);
  ctx.stroke();

  ctx.restore();
}

/**
 * Official School Academy Shield Crest Vector
 */
function drawSchoolCrest(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number = 48) {
  ctx.save();
  ctx.translate(cx, cy);
  const s = size / 50;

  // Gold Laurel Wreath Left & Right
  ctx.fillStyle = "#d97706";
  for (let i = -4; i <= 4; i++) {
    const a = (i * Math.PI) / 8;
    // Left leaves
    ctx.beginPath();
    ctx.ellipse(-26 * s + Math.sin(a) * 4 * s, i * 6 * s, 4 * s, 8 * s, a - 0.4, 0, Math.PI * 2);
    ctx.fill();
    // Right leaves
    ctx.beginPath();
    ctx.ellipse(26 * s - Math.sin(a) * 4 * s, i * 6 * s, 4 * s, 8 * s, -a + 0.4, 0, Math.PI * 2);
    ctx.fill();
  }

  // Outer Shield Body
  ctx.fillStyle = "#1e3a8a"; // School Navy
  ctx.strokeStyle = "#d97706"; // Gold Rim
  ctx.lineWidth = 3 * s;

  ctx.beginPath();
  ctx.moveTo(-18 * s, -22 * s);
  ctx.lineTo(18 * s, -22 * s);
  ctx.lineTo(18 * s, 4 * s);
  ctx.bezierCurveTo(18 * s, 22 * s, 0, 28 * s, 0, 28 * s);
  ctx.bezierCurveTo(0, 28 * s, -18 * s, 22 * s, -18 * s, 4 * s);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Shield Inner Chevron / Division
  ctx.fillStyle = "#b91c1c"; // Crimson
  ctx.beginPath();
  ctx.moveTo(0, -22 * s);
  ctx.lineTo(18 * s, -22 * s);
  ctx.lineTo(18 * s, 4 * s);
  ctx.bezierCurveTo(18 * s, 22 * s, 0, 28 * s, 0, 28 * s);
  ctx.closePath();
  ctx.fill();

  // Gold Star / Torch Centerpiece
  ctx.fillStyle = "#fbbf24";
  ctx.font = `bold ${Math.round(18 * s)}px 'Georgia', serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("M", 0, 0);

  // Bottom Banner Ribbon
  ctx.fillStyle = "#ffffff";
  ctx.strokeStyle = "#1e3a8a";
  ctx.lineWidth = 1.5 * s;
  ctx.beginPath();
  ctx.roundRect(-24 * s, 20 * s, 48 * s, 14 * s, 3 * s);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#1e3a8a";
  ctx.font = `900 ${Math.round(7.5 * s)}px 'Plus Jakarta Sans', sans-serif`;
  ctx.fillText("MANNER HIGH", 0, 27 * s);

  ctx.restore();
}

/**
 * Circular Official Verified School Stamp Watermark
 */
function drawOfficialSchoolStamp(ctx: CanvasRenderingContext2D, cx: number, cy: number, radius: number = 52) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate((-12 * Math.PI) / 180);

  // Red/Burgundy Stamp Color with slight translucency
  const stampColor = "rgba(185, 28, 28, 0.88)";
  ctx.strokeStyle = stampColor;
  ctx.fillStyle = stampColor;

  // Outer Circular Ring
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, Math.PI * 2);
  ctx.stroke();

  // Inner Dashed / Dotted Ring
  ctx.lineWidth = 1.5;
  ctx.setLineDash([4, 3]);
  ctx.beginPath();
  ctx.arc(0, 0, radius - 6, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);

  // Inner Core Ring
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, 0, radius - 16, 0, Math.PI * 2);
  ctx.stroke();

  // Circular Curved Text
  ctx.font = "900 9px monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("★ MANNER HIGH ★", 0, -radius * 0.58);
  ctx.fillText("★ OFFICIAL SEAL ★", 0, radius * 0.58);

  // Center Bold VERIFIED
  ctx.font = "900 13px 'Plus Jakarta Sans', sans-serif";
  ctx.fillText("VERIFIED", 0, -2);
  ctx.font = "bold 8px monospace";
  ctx.fillText("STUDENT ID", 0, 10);

  ctx.restore();
}

/**
 * Cute Vintage School Clock Doodle
 */
function drawSchoolClockDoodle(ctx: CanvasRenderingContext2D, cx: number, cy: number, radius: number = 24) {
  ctx.save();
  ctx.translate(cx, cy);

  ctx.strokeStyle = "#1e3a8a";
  ctx.fillStyle = "#ffffff";
  ctx.lineWidth = 3;

  // Outer Clock Circle
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Top Bells / Loop
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(-radius * 0.6, -radius * 0.8, 6, Math.PI, 0);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(radius * 0.6, -radius * 0.8, 6, Math.PI, 0);
  ctx.stroke();

  // Clock Hands (3:00)
  ctx.strokeStyle = "#b91c1c";
  ctx.lineWidth = 2.5;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, -radius * 0.6); // 12 o'clock
  ctx.moveTo(0, 0);
  ctx.lineTo(radius * 0.5, 0); // 3 o'clock
  ctx.stroke();

  // Center Pivot Dot
  ctx.fillStyle = "#1e3a8a";
  ctx.beginPath();
  ctx.arc(0, 0, 2.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

/**
 * Cute Wooden Pencil Doodle
 */
function drawPencilDoodle(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number = 36, angleDeg: number = 35) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate((angleDeg * Math.PI) / 180);
  const s = size / 40;

  // Pink Eraser
  ctx.fillStyle = "#f472b6";
  ctx.fillRect(-6 * s, -22 * s, 12 * s, 8 * s);

  // Metal Ferrule
  ctx.fillStyle = "#94a3b8";
  ctx.fillRect(-6 * s, -14 * s, 12 * s, 4 * s);

  // Yellow Body
  ctx.fillStyle = "#facc15";
  ctx.fillRect(-6 * s, -10 * s, 12 * s, 22 * s);

  // Sharpened Wooden Tip
  ctx.fillStyle = "#fed7aa";
  ctx.beginPath();
  ctx.moveTo(-6 * s, 12 * s);
  ctx.lineTo(6 * s, 12 * s);
  ctx.lineTo(0, 22 * s);
  ctx.closePath();
  ctx.fill();

  // Graphite Lead Tip
  ctx.fillStyle = "#1e293b";
  ctx.beginPath();
  ctx.moveTo(-2.5 * s, 18 * s);
  ctx.lineTo(2.5 * s, 18 * s);
  ctx.lineTo(0, 22 * s);
  ctx.closePath();
  ctx.fill();

  // Outline
  ctx.strokeStyle = "#1e3a8a";
  ctx.lineWidth = 1.8 * s;
  ctx.strokeRect(-6 * s, -22 * s, 12 * s, 34 * s);

  ctx.restore();
}

/**
 * Gold Academic Medal with Ribbon
 */
function drawHonorMedal(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number = 36) {
  ctx.save();
  ctx.translate(cx, cy);
  const s = size / 40;

  // Tricolor Ribbon Tails
  ctx.fillStyle = "#1e3a8a"; // Navy
  ctx.beginPath();
  ctx.moveTo(-10 * s, -14 * s);
  ctx.lineTo(-14 * s, 14 * s);
  ctx.lineTo(-8 * s, 10 * s);
  ctx.lineTo(-4 * s, 14 * s);
  ctx.lineTo(0, -14 * s);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "#b91c1c"; // Crimson
  ctx.beginPath();
  ctx.moveTo(0, -14 * s);
  ctx.lineTo(4 * s, 14 * s);
  ctx.lineTo(8 * s, 10 * s);
  ctx.lineTo(14 * s, 14 * s);
  ctx.lineTo(10 * s, -14 * s);
  ctx.closePath();
  ctx.fill();

  // Gold Circular Medal
  const goldGrad = ctx.createRadialGradient(-3 * s, -3 * s, 2 * s, 0, 0, 16 * s);
  goldGrad.addColorStop(0, "#fde68a");
  goldGrad.addColorStop(0.5, "#f59e0b");
  goldGrad.addColorStop(1, "#b45309");

  ctx.fillStyle = goldGrad;
  ctx.beginPath();
  ctx.arc(0, 0, 15 * s, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "#78350f";
  ctx.lineWidth = 1.8 * s;
  ctx.stroke();

  // Center Star
  ctx.fillStyle = "#78350f";
  ctx.font = `bold ${Math.round(14 * s)}px sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("★", 0, 1 * s);

  ctx.restore();
}

/**
 * Striped School Uniform Necktie Emblem
 */
function drawSchoolTie(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number = 38) {
  ctx.save();
  ctx.translate(cx, cy);
  const s = size / 40;

  // Knot at top
  ctx.fillStyle = "#1e3a8a";
  ctx.beginPath();
  ctx.moveTo(-6 * s, -16 * s);
  ctx.lineTo(6 * s, -16 * s);
  ctx.lineTo(4 * s, -8 * s);
  ctx.lineTo(-4 * s, -8 * s);
  ctx.closePath();
  ctx.fill();

  // Tie body
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(-4 * s, -8 * s);
  ctx.lineTo(4 * s, -8 * s);
  ctx.lineTo(7 * s, 14 * s);
  ctx.lineTo(0, 22 * s);
  ctx.lineTo(-7 * s, 14 * s);
  ctx.closePath();
  ctx.clip();

  ctx.fillStyle = "#1e3a8a"; // Navy
  ctx.fill();

  // Diagonal Crimson Stripes
  ctx.fillStyle = "#b91c1c";
  for (let y = -14 * s; y < 26 * s; y += 8 * s) {
    ctx.beginPath();
    ctx.moveTo(-12 * s, y);
    ctx.lineTo(12 * s, y + 10 * s);
    ctx.lineTo(12 * s, y + 13 * s);
    ctx.lineTo(-12 * s, y + 3 * s);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();

  // Outline
  ctx.strokeStyle = "#0f172a";
  ctx.lineWidth = 1.5 * s;
  ctx.beginPath();
  ctx.moveTo(-4 * s, -8 * s);
  ctx.lineTo(4 * s, -8 * s);
  ctx.lineTo(7 * s, 14 * s);
  ctx.lineTo(0, 22 * s);
  ctx.lineTo(-7 * s, 14 * s);
  ctx.closePath();
  ctx.stroke();

  ctx.restore();
}

/**
 * School Pennant Flag Vector (MANNER HIGH)
 */
function drawSchoolPennant(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number = 44) {
  ctx.save();
  ctx.translate(cx, cy);
  const s = size / 45;

  // Flagstick
  ctx.fillStyle = "#78350f";
  ctx.fillRect(-22 * s, -18 * s, 3 * s, 36 * s);

  // Triangular Pennant
  ctx.fillStyle = "#1e3a8a";
  ctx.beginPath();
  ctx.moveTo(-20 * s, -14 * s);
  ctx.lineTo(24 * s, -2 * s);
  ctx.lineTo(-20 * s, 10 * s);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = "#fbbf24";
  ctx.lineWidth = 1.5 * s;
  ctx.stroke();

  // Text inside pennant
  ctx.fillStyle = "#ffffff";
  ctx.font = `900 ${Math.round(8 * s)}px 'Plus Jakarta Sans', sans-serif`;
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillText("MANNER", -14 * s, -2 * s);

  ctx.restore();
}

/**
 * Golden Star / Honor Ribbon Badge
 */
function drawSchoolStarBadge(ctx: CanvasRenderingContext2D, cx: number, cy: number, radius: number = 18, text: string = "★") {
  ctx.save();
  ctx.translate(cx, cy);

  // Gold Starburst
  ctx.fillStyle = "#f59e0b";
  ctx.strokeStyle = "#b45309";
  ctx.lineWidth = 1.5;

  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#ffffff";
  ctx.font = `900 ${Math.round(radius * 0.9)}px sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, 0, 0.5);

  ctx.restore();
}

/**
 * Fluttering Indonesian Merah Putih Flag Vector with Gold Finial
 */
function drawIndonesianFlag(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  w: number = 48,
  h: number = 32,
  angleDeg: number = 0,
  poleHeight: number = 64
) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate((angleDeg * Math.PI) / 180);

  // Wooden / Gold Flagpole
  ctx.fillStyle = "#b45309";
  ctx.fillRect(-w / 2 - 4, -poleHeight / 2, 4, poleHeight);

  // Gold Finial Ball at top of pole
  ctx.fillStyle = "#f59e0b";
  ctx.beginPath();
  ctx.arc(-w / 2 - 2, -poleHeight / 2, 4, 0, Math.PI * 2);
  ctx.fill();

  // Flag Body with waving shadow/gradient
  const flagX = -w / 2;
  const flagY = -poleHeight / 2 + 6;

  // Red top half
  ctx.fillStyle = "#dc2626";
  ctx.beginPath();
  ctx.roundRect(flagX, flagY, w, h / 2, [3, 3, 0, 0]);
  ctx.fill();

  // White bottom half
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.roundRect(flagX, flagY + h / 2, w, h / 2, [0, 0, 3, 3]);
  ctx.fill();

  // Flag Border
  ctx.strokeStyle = "rgba(0, 0, 0, 0.15)";
  ctx.lineWidth = 1;
  ctx.strokeRect(flagX, flagY, w, h);

  // Subtle wave sheen
  const waveGrad = ctx.createLinearGradient(flagX, flagY, flagX + w, flagY);
  waveGrad.addColorStop(0, "rgba(255, 255, 255, 0.2)");
  waveGrad.addColorStop(0.3, "rgba(0, 0, 0, 0.08)");
  waveGrad.addColorStop(0.7, "rgba(255, 255, 255, 0.25)");
  waveGrad.addColorStop(1, "rgba(0, 0, 0, 0.12)");
  ctx.fillStyle = waveGrad;
  ctx.fillRect(flagX, flagY, w, h);

  ctx.restore();
}

/**
 * Pristine 5-Petal Melati Flower (National Flower of Indonesia)
 */
function drawMelatiFlower(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number = 18) {
  ctx.save();
  ctx.translate(cx, cy);

  // 5 pristine white petals
  ctx.fillStyle = "#ffffff";
  ctx.strokeStyle = "#fecdd3";
  ctx.lineWidth = 1;

  for (let i = 0; i < 5; i++) {
    const angle = (i * Math.PI * 2) / 5 - Math.PI / 2;
    const px = Math.cos(angle) * (size * 0.55);
    const py = Math.sin(angle) * (size * 0.55);

    ctx.beginPath();
    ctx.ellipse(px, py, size * 0.45, size * 0.32, angle, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }

  // Golden Yellow Blossom Core
  ctx.fillStyle = "#f59e0b";
  ctx.beginPath();
  ctx.arc(0, 0, size * 0.22, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

/**
 * Pleated Merah-Putih Rosette Medal with Hanging Tails & Gold 81 Center
 */
function drawMerahPutihRosette(ctx: CanvasRenderingContext2D, cx: number, cy: number, radius: number = 24) {
  ctx.save();
  ctx.translate(cx, cy);

  // Hanging Red & White Ribbon Tails
  ctx.fillStyle = "#dc2626";
  ctx.beginPath();
  ctx.moveTo(-10, radius * 0.6);
  ctx.lineTo(-16, radius * 1.6);
  ctx.lineTo(-8, radius * 1.4);
  ctx.lineTo(0, radius * 1.6);
  ctx.lineTo(0, radius * 0.6);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "#ffffff";
  ctx.strokeStyle = "rgba(0,0,0,0.15)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, radius * 0.6);
  ctx.lineTo(0, radius * 1.6);
  ctx.lineTo(8, radius * 1.4);
  ctx.lineTo(16, radius * 1.6);
  ctx.lineTo(10, radius * 0.6);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Pleated outer rosette (16 segments alternating red & white)
  const numPetals = 16;
  for (let i = 0; i < numPetals; i++) {
    const a1 = (i * Math.PI * 2) / numPetals;
    const a2 = ((i + 1) * Math.PI * 2) / numPetals;
    ctx.fillStyle = i % 2 === 0 ? "#dc2626" : "#ffffff";

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, radius, a1, a2);
    ctx.closePath();
    ctx.fill();
  }

  // Inner Gold Medal
  const goldGrad = ctx.createRadialGradient(-3, -3, 2, 0, 0, radius * 0.55);
  goldGrad.addColorStop(0, "#fef08a");
  goldGrad.addColorStop(0.5, "#f59e0b");
  goldGrad.addColorStop(1, "#b45309");

  ctx.fillStyle = goldGrad;
  ctx.beginPath();
  ctx.arc(0, 0, radius * 0.55, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "#78350f";
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // "81" in center
  ctx.fillStyle = "#ffffff";
  ctx.font = `900 ${Math.round(radius * 0.52)}px sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("81", 0, 0.5);

  ctx.restore();
}

/**
 * Emblazoned 3D Gold "81th" Emblem with Red-White Ribbon Sash
 */
function drawHutRi81Emblem(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  size: number = 70,
  style: "gold" | "red_white" = "gold"
) {
  ctx.save();
  ctx.translate(cx, cy);

  // Outer glowing aura
  ctx.shadowColor = "rgba(251, 191, 36, 0.6)";
  ctx.shadowBlur = 16;

  // Red & White decorative ribbon sash behind 81
  ctx.fillStyle = "#dc2626";
  ctx.beginPath();
  ctx.ellipse(0, 0, size * 0.9, size * 0.45, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#fbbf24";
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // White inner ellipse
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.ellipse(0, 0, size * 0.78, size * 0.36, 0, 0, Math.PI * 2);
  ctx.fill();

  // 3D Metallic Gold "81th" Text
  const goldGrad = ctx.createLinearGradient(0, -size * 0.35, 0, size * 0.35);
  goldGrad.addColorStop(0, "#fef08a");
  goldGrad.addColorStop(0.3, "#f59e0b");
  goldGrad.addColorStop(0.7, "#d97706");
  goldGrad.addColorStop(1, "#78350f");

  ctx.fillStyle = goldGrad;
  ctx.font = `900 ${Math.round(size * 0.62)}px 'Plus Jakarta Sans', Impact, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("81th", 0, 2);

  ctx.strokeStyle = "#78350f";
  ctx.lineWidth = 1.5;
  ctx.strokeText("81th", 0, 2);

  ctx.restore();
}

/**
 * Hanging Red & White Bunting Garland Across Top
 */
function drawMerahPutihGarland(ctx: CanvasRenderingContext2D, width: number, y: number) {
  ctx.save();
  ctx.strokeStyle = "#fbbf24";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(30, y);
  ctx.quadraticCurveTo(width / 2, y + 16, width - 30, y);
  ctx.stroke();

  const numFlags = 9;
  const step = (width - 80) / (numFlags - 1);
  for (let i = 0; i < numFlags; i++) {
    const fx = 40 + i * step;
    const progress = i / (numFlags - 1) - 0.5;
    const fy = y + (1 - Math.abs(progress) * 2) * 8;

    ctx.save();
    ctx.translate(fx, fy);
    ctx.fillStyle = i % 2 === 0 ? "#dc2626" : "#ffffff";
    ctx.strokeStyle = "#b91c1c";
    ctx.lineWidth = 1;

    ctx.beginPath();
    ctx.moveTo(-10, 0);
    ctx.lineTo(10, 0);
    ctx.lineTo(0, 18);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }
  ctx.restore();
}

/**
 * Load all photo images asynchronously using Promise.all to guarantee 100% complete loading
 */
export const loadCanvasImages = (shots: { dataUrl: string }[]): Promise<HTMLImageElement[]> => {
  return Promise.all(
    shots.slice(0, 4).map((shot) => {
      return new Promise<HTMLImageElement>((resolve) => {
        if (!shot || !shot.dataUrl) {
          const empty = new Image();
          resolve(empty);
          return;
        }
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => resolve(img);
        img.onerror = () => resolve(img);
        img.src = shot.dataUrl;
      });
    })
  );
};

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

  // Fixed special layout presets:
  if (preset === "hut_ri_81_3strip") {
    photoCount = 3;
    targetW = 600;
    targetH = 1500;
  } else if (preset === "hut_ri_81_4strip") {
    photoCount = 4;
    targetW = 600;
    targetH = 1800;
  } else if (preset === "valorant_id") {
    photoCount = 2;
    targetW = 1080;
    targetH = 1920;
  } else if (preset === "supermarket_crate" || preset === "school_4cut") {
    photoCount = preset === "supermarket_crate" ? 3 : 4;
    targetW = 600;
    targetH = 1800;
  } else if (preset === "student_id") {
    photoCount = 1;
    targetW = 1200;
    targetH = 750;
  } else if (preset === "passport" || preset === "cupids_letter") {
    photoCount = preset === "passport" ? 4 : 2;
    targetW = 1200;
    targetH = 1800;
  }

  // Set dimensions only when changed to avoid canvas clear flicker
  if (canvas.width !== targetW) canvas.width = targetW;
  if (canvas.height !== targetH) canvas.height = targetH;

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const filterString = `brightness(${filter.brightness}%) contrast(${filter.contrast}%) saturate(${filter.saturation}%) grayscale(${filter.grayscale}%)`;
  const padding = preset === "film" || preset === "receipt" || preset === "struk_jaksel" || preset === "polaroid_vintage" ? 60 : 36;
  const bottomFooterHeight = isNewspaper ? 0 : preset === "concert_ticket" || preset === "pestapora_pass" ? 240 : 220;
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

  } else if (preset === "hut_ri_81_3strip") {
    // 🇮🇩 DIRGAHAYU 81 NUSANTARA MERAH PUTIH (3-STRIP FESTIVE)
    const bgGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    bgGrad.addColorStop(0, "#991b1b");
    bgGrad.addColorStop(0.3, "#b91c1c");
    bgGrad.addColorStop(0.7, "#be123c");
    bgGrad.addColorStop(1, "#881337");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Subtle traditional songket / diamond geometric watermark
    ctx.save();
    ctx.strokeStyle = "rgba(255, 255, 255, 0.06)";
    ctx.lineWidth = 1.5;
    const stepBatik = 45;
    for (let bx = 0; bx < canvas.width + stepBatik; bx += stepBatik) {
      for (let by = 0; by < canvas.height + stepBatik; by += stepBatik) {
        ctx.beginPath();
        ctx.moveTo(bx, by - 12);
        ctx.lineTo(bx + 12, by);
        ctx.lineTo(bx, by + 12);
        ctx.lineTo(bx - 12, by);
        ctx.closePath();
        ctx.stroke();
      }
    }
    ctx.restore();

    // Gold Double Border
    ctx.strokeStyle = "#fbbf24";
    ctx.lineWidth = 3;
    ctx.strokeRect(16, 16, canvas.width - 32, canvas.height - 32);
    ctx.strokeStyle = "rgba(254, 240, 138, 0.6)";
    ctx.lineWidth = 1;
    ctx.strokeRect(22, 22, canvas.width - 44, canvas.height - 44);

  } else if (preset === "hut_ri_81_4strip") {
    // 🇮🇩 DIRGAHAYU 81 PATRIOTIC RETRO (4-STRIP CLEAN MERAH PUTIH)
    ctx.fillStyle = "#fffdfa";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Side Red-White Accent Bands
    ctx.save();
    ctx.fillStyle = "#dc2626";
    ctx.fillRect(0, 0, 18, canvas.height);
    ctx.fillRect(canvas.width - 18, 0, 18, canvas.height);

    ctx.fillStyle = "#b91c1c";
    ctx.fillRect(18, 0, 4, canvas.height);
    ctx.fillRect(canvas.width - 22, 0, 4, canvas.height);

    // Gold pinstripe
    ctx.fillStyle = "#fbbf24";
    ctx.fillRect(22, 0, 2, canvas.height);
    ctx.fillRect(canvas.width - 24, 0, 2, canvas.height);
    ctx.restore();

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
  } else if (preset === "coquette" || preset === "skena_coquette") {
    ctx.fillStyle = frameColor || "#fce7f3";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = preset === "skena_coquette" ? "#18181b" : "#f472b6";
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
  } else if (preset === "cyber_y2k_pink") {
    const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    grad.addColorStop(0, "#fce7f3");
    grad.addColorStop(0.5, "#f472b6");
    grad.addColorStop(1, "#ec4899");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "rgba(255, 255, 255, 0.35)";
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += 36) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
  } else if (preset === "vintage_newspaper_dark") {
    ctx.fillStyle = "#18181b";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "#e4e4e7";
    ctx.lineWidth = 3;
    ctx.strokeRect(30, 30, canvas.width - 60, canvas.height - 60);
    ctx.lineWidth = 1;
    ctx.strokeRect(36, 36, canvas.width - 72, canvas.height - 72);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 16px 'Georgia', serif";
    ctx.textAlign = "center";
    ctx.fillText("★ RIELLLYBOOTH DARK EDITION ★   •   VOL. IV NO. 104", canvas.width / 2, 60);
  } else if (preset === "retro_cassette") {
    const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    grad.addColorStop(0, "#fff7ed");
    grad.addColorStop(0.5, "#ffedd5");
    grad.addColorStop(1, "#fed7aa");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#ea580c";
    ctx.fillRect(0, 0, canvas.width, 160);

    drawCassetteSpool(ctx, 80, 80, 24);
    drawCassetteSpool(ctx, canvas.width - 80, 80, 24);

    ctx.fillStyle = "#ffffff";
    ctx.font = "900 24px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("📼 STEREO CASSETTE • HIGH BIAS 90", canvas.width / 2, 80);
  } else if (preset === "kawaii_boba") {
    ctx.fillStyle = frameColor || "#fef3c7";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  } else if (preset === "heart_washi_tape") {
    ctx.fillStyle = frameColor || "#fff1f2";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  } else if (preset === "galau_club") {
    const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    grad.addColorStop(0, "#cbd5e1");
    grad.addColorStop(0.5, "#f472b6");
    grad.addColorStop(1, "#fda4af");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  } else if (preset === "concert_ticket") {
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Top Header Banner
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(0, 0, canvas.width, 160);

    // Gold Accent Outer Border
    ctx.strokeStyle = "#f59e0b";
    ctx.lineWidth = 3;
    ctx.strokeRect(16, 16, canvas.width - 32, canvas.height - 32);

    // Header Text (Y = 95px)
    ctx.fillStyle = "#f59e0b";
    ctx.font = "bold 26px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("🎟️ CONCERT TICKET • VIP ADMIT ONE", canvas.width / 2, 95);

    // Gold Star Accents
    drawY2kStar(ctx, 50, 95, 14, "#fbbf24");
    drawY2kStar(ctx, canvas.width - 50, 95, 14, "#fbbf24");

    // Perforated Stub Line at Bottom
    ctx.strokeStyle = "#f59e0b";
    ctx.lineWidth = 3;
    ctx.setLineDash([12, 10]);
    ctx.beginPath();
    ctx.moveTo(0, canvas.height - 180);
    ctx.lineTo(canvas.width, canvas.height - 180);
    ctx.stroke();
    ctx.setLineDash([]);

    // Barcode Container & Barcode Lines at Bottom
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(40, canvas.height - 160, canvas.width - 80, 55);

    ctx.fillStyle = "#0f172a";
    for (let bx = 60; bx < canvas.width - 60; bx += Math.floor(Math.random() * 10 + 6)) {
      ctx.fillRect(bx, canvas.height - 150, Math.random() > 0.5 ? 4 : 2, 36);
    }
  } else if (preset === "pestapora_pass") {
    // Vibrant Indie Festival Lanyard Pass (Neon Yellow / Magenta Theme)
    const passBg = frameColor || "#fff000";
    ctx.fillStyle = passBg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Top Lanyard Hole Punch Vector (Slot at top center)
    ctx.save();
    ctx.fillStyle = "#18181b";
    ctx.strokeStyle = "#94a3b8";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.ellipse(canvas.width / 2, 32, 36, 12, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    // Top Header Banner
    ctx.fillStyle = "#ff5588";
    ctx.fillRect(0, 60, canvas.width, 105);

    // Header Text (Y = 110px)
    ctx.fillStyle = "#ffffff";
    ctx.font = "900 28px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("⚡ PESTAPORA 2026 • ALL ACCESS ⚡", canvas.width / 2, 112);

    // Side Ticket Notches (Perforated Semicircle Cutouts on Left & Right)
    ctx.fillStyle = "#09090b";
    ctx.beginPath();
    ctx.arc(0, canvas.height - 180, 20, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(canvas.width, canvas.height - 180, 20, 0, Math.PI * 2);
    ctx.fill();

    // Stage Stamps & Badges (Main Stage / VIP / Stage 01)
    ctx.save();
    // Left Holographic Stage Stamp
    ctx.fillStyle = "#18181b";
    ctx.fillRect(20, 168, 140, 22);
    ctx.fillStyle = "#fff000";
    ctx.font = "900 11px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("MAIN STAGE 01", 90, 183);

    // Right VIP Holographic Badge
    ctx.fillStyle = "#ff5588";
    ctx.fillRect(canvas.width - 100, 168, 80, 22);
    ctx.fillStyle = "#ffffff";
    ctx.font = "900 12px sans-serif";
    ctx.fillText("★ VIP PASS", canvas.width - 60, 183);
    ctx.restore();

    // Bottom Perforated Line
    ctx.strokeStyle = "#18181b";
    ctx.lineWidth = 3;
    ctx.setLineDash([10, 8]);
    ctx.beginPath();
    ctx.moveTo(0, canvas.height - 180);
    ctx.lineTo(canvas.width, canvas.height - 180);
    ctx.stroke();
    ctx.setLineDash([]);

    // Bottom Festival Barcode Stub
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(40, canvas.height - 160, canvas.width - 80, 55);

    ctx.fillStyle = "#18181b";
    for (let bx = 60; bx < canvas.width - 60; bx += Math.floor(Math.random() * 10 + 6)) {
      ctx.fillRect(bx, canvas.height - 150, Math.random() > 0.5 ? 4 : 2, 36);
    }
  } else if (preset === "struk_jaksel") {
    ctx.fillStyle = "#fafaf9";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#e7e5e4";
    drawSerratedZigzag(ctx, canvas.width, 0, 16, 28);
    ctx.fill();
    drawSerratedZigzag(ctx, canvas.width, canvas.height - 16, 16, 28);
    ctx.fill();

    ctx.fillStyle = "#1c1917";
    ctx.font = "900 28px monospace";
    ctx.textAlign = "center";
    ctx.fillText("CAFE JAKSEL #9901 • RIELLLYBOOTH", canvas.width / 2, 50);
  } else if (preset === "photocard_bias") {
    const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    grad.addColorStop(0, "#fce7f3");
    grad.addColorStop(0.33, "#e0e7ff");
    grad.addColorStop(0.66, "#fbcfe8");
    grad.addColorStop(1, "#c084fc");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  } else if (preset === "toy_story") {
    // Andy's Room Blue Cloud Wallpaper
    ctx.fillStyle = "#3b82f6";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Clouds scattered across wallpaper background
    drawCloudShape(ctx, 40, 50, 0.9);
    drawCloudShape(ctx, canvas.width - 120, 90, 0.8);
    drawCloudShape(ctx, 60, canvas.height - 140, 1.0);
    drawCloudShape(ctx, canvas.width - 140, canvas.height - 70, 0.9);

    // Top Header Banner Box
    ctx.fillStyle = "#2563eb";
    ctx.fillRect(0, 0, canvas.width, 170);

    // Gold Sheriff Badge Vector in Top Header
    drawSheriffBadge(ctx, 65, 85, 26);
    drawSheriffBadge(ctx, canvas.width - 65, 85, 26);

    // Header Text
    ctx.fillStyle = "#ffffff";
    ctx.font = "900 24px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("🤠 YOU'VE GOT A FRIEND IN ME", canvas.width / 2, 70);
    ctx.font = "bold 16px sans-serif";
    ctx.fillStyle = "#fde047";
    ctx.fillText("TOY STORY EDITION • RIELLLYBOOTH", canvas.width / 2, 105);
  } else if (preset === "spongebob") {
    // Iconic SpongeBob Yellow Background
    ctx.fillStyle = frameColor || "#fee12b";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Top Bikini Bottom Ocean Header Banner
    ctx.fillStyle = "#0284c7";
    ctx.fillRect(0, 0, canvas.width, 170);

    // Bikini Bottom Flower Clouds around header
    drawBikiniBottomFlower(ctx, 55, 85, 16, "#ff007f");
    drawBikiniBottomFlower(ctx, canvas.width - 55, 85, 16, "#9d4edd");

    // Header Text
    ctx.fillStyle = "#ffffff";
    ctx.font = "900 26px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("🧽 BIKINI BOTTOM • BEST DAY EVER 🍍", canvas.width / 2, 85);

    // Signature SpongeBob Clothing Pattern Footer
    drawSpongeBobClothingFooter(ctx, canvas.width, canvas.height);
  } else if (preset === "among_us") {
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#ffffff";
    for (let sx = 20; sx < canvas.width; sx += 45) {
      for (let sy = 20; sy < canvas.height; sy += 45) {
        if ((sx + sy) % 3 === 0) {
          ctx.beginPath();
          ctx.arc(sx, sy, Math.random() > 0.5 ? 2 : 1, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
  } else if (preset === "happy_birthday") {
    ctx.fillStyle = frameColor || "#fff1f2";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const confettiColors = ["#f472b6", "#fbbf24", "#38bdf8", "#c084fc", "#4ade80"];
    for (let i = 0; i < 40; i++) {
      const cx = (i * 37) % canvas.width;
      const cy = (i * 53) % canvas.height;
      ctx.fillStyle = confettiColors[i % confettiColors.length];
      ctx.beginPath();
      ctx.arc(cx, cy, i % 2 === 0 ? 5 : 3, 0, Math.PI * 2);
      ctx.fill();
    }
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
  } else if (preset === "cupids_letter") {
    // 💌 CUPID'S LETTER
    // Card Background: Clean off-white card with a bold red outer border frame (#C8102E)
    ctx.fillStyle = "#fffdfa";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Bold red outer border frame
    ctx.strokeStyle = "#C8102E";
    ctx.lineWidth = 24;
    ctx.strokeRect(12, 12, canvas.width - 24, canvas.height - 24);
    ctx.lineWidth = 4;
    ctx.strokeRect(32, 32, canvas.width - 64, canvas.height - 64);

    // Header: Cursive red script "Cupid's Letter" + Cupid angel silhouette vector 🏹
    ctx.fillStyle = "#C8102E";
    ctx.font = "italic bold 52px 'Georgia', serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("💌  Cupid's Letter  🏹", canvas.width / 2, 90);

    ctx.font = "bold 16px monospace";
    ctx.fillText("SPECIAL DELIVERY • OFFICIAL LOVE MAIL", canvas.width / 2, 140);

    // Left Column (Fill-in Love Letter Fields)
    const fieldX = 70;
    ctx.textAlign = "left";
    ctx.fillStyle = "#C8102E";
    ctx.font = "bold 20px 'Georgia', serif";

    // Fields with dotted underline guides
    const drawDottedLine = (x1: number, y1: number, x2: number, y2: number) => {
      ctx.save();
      ctx.strokeStyle = "#C8102E";
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      ctx.restore();
    };

    // To:
    ctx.fillText("To:", fieldX, 220);
    drawDottedLine(110, 224, 560, 224);

    // Name:
    ctx.fillText("Name:", fieldX, 280);
    drawDottedLine(145, 284, 560, 284);

    // Zodiac:
    ctx.fillText("Zodiac:", fieldX, 340);
    drawDottedLine(155, 344, 560, 344);

    // Love Language:
    ctx.fillText("Love Language:", fieldX, 400);
    drawDottedLine(230, 404, 560, 404);

    // Personality Type: Introvert / Extrovert / Ambivert
    ctx.fillText("Personality Type:", fieldX, 460);
    ctx.font = "bold 16px sans-serif";
    ctx.fillText("☐ Introvert   ☐ Extrovert   ☐ Ambivert", fieldX + 10, 500);

    // Say hi on my IG @ _________
    ctx.font = "bold 20px 'Georgia', serif";
    ctx.fillText("Say hi on my IG @", fieldX, 560);
    drawDottedLine(260, 564, 560, 564);

    // Notes: with dotted lines
    ctx.fillText("Notes / Secret Message:", fieldX, 630);
    drawDottedLine(fieldX, 690, 560, 690);
    drawDottedLine(fieldX, 740, 560, 740);
    drawDottedLine(fieldX, 790, 560, 790);
    drawDottedLine(fieldX, 840, 560, 840);

    // Additional Love Mail Decorative Badges on Left Bottom
    ctx.save();
    ctx.strokeStyle = "#C8102E";
    ctx.lineWidth = 3;
    ctx.strokeRect(fieldX, 900, 490, 740);

    ctx.fillStyle = "#C8102E";
    ctx.font = "italic bold 22px 'Georgia', serif";
    ctx.fillText("♡ Cupid's Official Seal of True Love ♡", fieldX + 40, 940);

    ctx.font = "bold 15px monospace";
    drawWrappedCanvasText(
      ctx,
      "This official letter certifies that the photos attached on the right carry 100% pure affection. Handle with tender care and deliver to your special someone.",
      fieldX + 20,
      980,
      450,
      24
    );

    // Cupid Angel Silhouette Vector
    ctx.translate(fieldX + 245, 1260);
    ctx.strokeStyle = "#C8102E";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(0, -30, 20, 0, Math.PI * 2); // head
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, -10);
    ctx.lineTo(0, 50); // body
    ctx.lineTo(-30, 90); // left leg
    ctx.moveTo(0, 50);
    ctx.lineTo(30, 90); // right leg
    ctx.moveTo(-40, 10);
    ctx.lineTo(40, 10); // arms
    ctx.stroke();

    // Wings
    ctx.beginPath();
    ctx.ellipse(-30, 0, 35, 15, -Math.PI / 4, 0, Math.PI * 2);
    ctx.ellipse(30, 0, 35, 15, Math.PI / 4, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  } else if (preset === "passport") {
    // ✈️ SUMMER MEMORIES PASSPORT — fixed 1200x1800 scrapbook coordinate system
    const PASSPORT_RED = "#8B1E1E";
    const PASSPORT_OFFWHITE = "#F6F3EB";
    const PASSPORT_KHAKI = "#EBDCB9";

    // TOP PASSPORT PAGE: Y = 0..880
    ctx.fillStyle = PASSPORT_OFFWHITE;
    ctx.fillRect(0, 0, canvas.width, 880);

    // Header — Y = 70
    ctx.fillStyle = "#8B1E1E";
    ctx.font = "bold 44px serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("SUMMER MEMORIES PASSPORT", 600, 70);

    // Stars — Y = 115
    ctx.font = "bold 24px sans-serif";
    ctx.fillText("★   ★   ★", 600, 115);

    // Double divider — Y = 145
    ctx.strokeStyle = PASSPORT_RED;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(60, 143);
    ctx.lineTo(1140, 143);
    ctx.stroke();
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(60, 149);
    ctx.lineTo(1140, 149);
    ctx.stroke();

    // Form fields — X = 490..1130
    const fieldX = 490;
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
    ctx.fillStyle = "#8B1E1E";
    ctx.font = "bold 20px monospace";
    ctx.fillText("LAST NAME    :  THE FAVORITE", fieldX, 200);
    ctx.fillText("FIRST NAME   :  XO XO XO", fieldX, 245);

    // Five checkbox squares centered around Y = 290
    ctx.strokeStyle = PASSPORT_RED;
    ctx.lineWidth = 2;
    for (let c = 0; c < 5; c++) {
      ctx.strokeRect(fieldX + c * 42, 279, 22, 22);
    }

    ctx.fillStyle = "#8B1E1E";
    ctx.fillText("NATIONALITY  :  INDONESIAN", fieldX, 335);
    ctx.fillText("BIRTHDAY     :  12.12.2000", fieldX, 380);
    ctx.fillText("PLACE OF BIRTH: YOGYAKARTA", fieldX, 425);
    ctx.fillText("VALID UNTIL  :  12.09.26", fieldX, 470);

    // Slanted blue rubber stamp — center X = 680, Y = 460
    ctx.save();
    ctx.translate(680, 460);
    ctx.rotate((-12 * Math.PI) / 180);
    ctx.strokeStyle = "#2563EB";
    ctx.lineWidth = 4;
    ctx.strokeRect(-75, -24, 150, 48);
    ctx.fillStyle = "#2563EB";
    ctx.font = "900 22px monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("12.09.26", 0, 0);
    ctx.restore();

    // Description — Y = 530, 14px monospace, max width 620
    ctx.fillStyle = "#8B1E1E";
    ctx.font = "14px monospace";
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
    drawWrappedCanvasText(
      ctx,
      "Like flipping through an old passport, each photo captures who you were in that moment. Freeze today's chapter and add it to the memoir you'll look back on tomorrow.",
      fieldX,
      530,
      620,
      20
    );

    // Bottom rule — Y = 820
    ctx.strokeStyle = PASSPORT_RED;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(60, 820);
    ctx.lineTo(520, 820);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(680, 820);
    ctx.lineTo(1140, 820);
    ctx.stroke();
    ctx.fillStyle = "#8B1E1E";
    ctx.font = "bold 18px monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("VICTION", 600, 820);

    // BOTTOM SCRAPBOOK PAGE: Y = 880..1800
    ctx.fillStyle = PASSPORT_KHAKI;
    ctx.fillRect(0, 880, 1200, 920);

    // Cute scrapbook grid — subtle graph-paper lines behind every photo.
    // Kept intentionally low-contrast so the photos remain the visual focus.
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 950, 1200, 850);
    ctx.clip();
    ctx.strokeStyle = "rgba(139, 30, 30, 0.16)";
    ctx.lineWidth = 1.5;
    const grid = 85;
    for (let gx = 30; gx <= 1170; gx += grid) {
      ctx.beginPath();
      ctx.moveTo(gx, 950);
      ctx.lineTo(gx, 1800);
      ctx.stroke();
    }
    for (let gy = 950; gy <= 1800; gy += grid) {
      ctx.beginPath();
      ctx.moveTo(0, gy);
      ctx.lineTo(1200, gy);
      ctx.stroke();
    }

    // Tiny scrapbook doodles for the playful Gen-Z look.
    ctx.fillStyle = "rgba(139, 30, 30, 0.42)";
    const dots = [
      [52, 1000], [1150, 1015], [55, 1325], [1140, 1340],
      [390, 1510], [820, 1080], [1090, 1660], [300, 1730]
    ];
    for (const [dx, dy] of dots) {
      ctx.beginPath();
      ctx.arc(dx, dy, 5, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.font = "24px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("♡", 45, 1180);
    ctx.fillText("✦", 1145, 1250);
    ctx.fillText("♡", 805, 1730);
    ctx.fillText("✦", 375, 1100);
    ctx.restore();

    // Full-width dark-red banner — Y = 900
    ctx.fillStyle = "#8B1E1E";
    ctx.fillRect(0, 900, 1200, 50);
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 26px serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("IDENTIFICATIONS AS OF LATE", 600, 925);
  } else if (preset === "valorant_id") {
    // 🎯 AUTHENTIC VALORANT PLAYER IDENTIFICATION FRAME ENGINE ($1080x1920px CANVAS)
    // 1. Dark tactical desk background
    ctx.fillStyle = "#111216";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Tactical Desk Grid & Horizontal Wood grain lines
    ctx.strokeStyle = "rgba(255, 255, 255, 0.02)";
    ctx.lineWidth = 1.5;
    for (let gy = 20; gy < canvas.height; gy += 28) {
      ctx.beginPath();
      ctx.moveTo(0, gy);
      ctx.lineTo(canvas.width, gy);
      ctx.stroke();
    }

    // Warm Ambient Desk Lamp Spotlight (Centered near upper-middle)
    const deskSpotlight = ctx.createRadialGradient(540, 360, 60, 540, 420, 820);
    deskSpotlight.addColorStop(0, "rgba(245, 158, 11, 0.30)");
    deskSpotlight.addColorStop(0.35, "rgba(180, 83, 9, 0.15)");
    deskSpotlight.addColorStop(0.7, "rgba(15, 17, 23, 0.55)");
    deskSpotlight.addColorStop(1, "rgba(8, 9, 13, 0.96)");

    ctx.fillStyle = deskSpotlight;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. Top-Left: Lanyard Strap (Tilted ~ -22°)
    drawLanyardStrap(ctx, 190, 80, -22);

    // 3. Top-Right: Protocol Agent Keycard (Tilted ~ +22°)
    drawTacticalKeycard(ctx, 890, 130, 22);

    // 4. Main VALORANT PLAYER IDENTIFICATION Badge Card (Tilted ~ -6°)
    ctx.save();
    ctx.translate(540, 670);
    ctx.rotate((-6 * Math.PI) / 180);

    const cardW = 980;
    const cardH = 820;
    const cardX = -cardW / 2;
    const cardY = -cardH / 2;

    // Realistic Multi-Layer Card Drop Shadow
    ctx.shadowColor = "rgba(0, 0, 0, 0.8)";
    ctx.shadowBlur = 36;
    ctx.shadowOffsetX = -6;
    ctx.shadowOffsetY = 24;

    // Card Base with Tactical Chamfered Corners
    ctx.beginPath();
    ctx.moveTo(cardX + 28, cardY);
    ctx.lineTo(cardX + cardW - 8, cardY);
    ctx.lineTo(cardX + cardW, cardY + 8);
    ctx.lineTo(cardX + cardW, cardY + cardH - 8);
    ctx.lineTo(cardX + cardW - 8, cardY + cardH);
    ctx.lineTo(cardX + 8, cardY + cardH);
    ctx.lineTo(cardX, cardY + cardH - 8);
    ctx.lineTo(cardX, cardY + 28);
    ctx.closePath();

    ctx.fillStyle = "#dedbd3";
    ctx.fill();

    // Dark Tactical Outer Card Border
    ctx.strokeStyle = "#23262f";
    ctx.lineWidth = 3.5;
    ctx.stroke();

    ctx.shadowColor = "transparent";

    // Top Header Banner Polygon (#0f1923 Valorant Dark Navy)
    const headerH = 118;
    ctx.fillStyle = "#0f1923";
    ctx.beginPath();
    ctx.moveTo(cardX + 16, cardY + 16);
    ctx.lineTo(cardX + cardW - 65, cardY + 16);
    ctx.lineTo(cardX + cardW - 35, cardY + 16 + headerH);
    ctx.lineTo(cardX + 16, cardY + 16 + headerH);
    ctx.closePath();
    ctx.fill();

    // Red Accent Slash / Tab on Header Top-Left
    ctx.fillStyle = "#ff4655";
    ctx.fillRect(cardX + 16, cardY + 16, 12, headerH);

    // Official Red Valorant Logo on Header Left
    drawValorantLogo(ctx, cardX + 72, cardY + 16 + headerH / 2, 44, "#ff4655");

    // Center Red VALORANT Title & White PLAYER IDENTIFICATION Subtitle
    ctx.fillStyle = "#ff4655";
    ctx.font = "900 48px 'Plus Jakarta Sans', system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("VALORANT", 0, cardY + 62);

    ctx.fillStyle = "#94a3b8";
    ctx.font = "bold 13px monospace";
    ctx.letterSpacing = "4px";
    ctx.fillText("PLAYER IDENTIFICATION", 0, cardY + 98);
    ctx.letterSpacing = "0px";

    // Sub-header Barcode Strip
    const barX = cardX + 16;
    const barY = cardY + 146;
    const barW = cardW - 75;
    const barH = 34;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(barX, barY, barW, barH);
    ctx.strokeStyle = "#1e293b";
    ctx.lineWidth = 2.5;
    ctx.strokeRect(barX, barY, barW, barH);

    ctx.fillStyle = "#111827";
    ctx.font = "900 18px 'Consolas', 'Courier New', monospace";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText(">>>>>>>>>>> 0018-01988052", barX + 16, barY + barH / 2);

    // Left Photo Frame Container (Base frame background)
    const photoFrameX = cardX + 16;
    const photoFrameY = cardY + 192;
    const photoFrameW = 380;
    const photoFrameH = 415;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(photoFrameX, photoFrameY, photoFrameW, photoFrameH);
    ctx.strokeStyle = "#1e293b";
    ctx.lineWidth = 3;
    ctx.strokeRect(photoFrameX, photoFrameY, photoFrameW, photoFrameH);

    // Right Player Bio Table Container
    const infoX = cardX + 410;
    const infoY = cardY + 192;
    const infoW = cardW - 468;
    const infoH = 415;

    ctx.fillStyle = "#f6f5ee";
    ctx.fillRect(infoX, infoY, infoW, infoH);
    ctx.strokeStyle = "#1e293b";
    ctx.lineWidth = 3;
    ctx.strokeRect(infoX, infoY, infoW, infoH);

    // IGN Top Cell Header Row in Bio Container
    const ignRowH = 50;
    ctx.fillStyle = "#edebe0";
    ctx.fillRect(infoX, infoY, infoW, ignRowH);
    ctx.strokeStyle = "#1e293b";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(infoX, infoY + ignRowH);
    ctx.lineTo(infoX + infoW, infoY + ignRowH);
    ctx.stroke();

    // Parse player details from customText & subtitleText
    let valoIgn = "riellybooth";
    let valoRole = "Smoker";
    let valoAgent = "Clove";
    let valoRank = "Ascendant";
    let valoLine = "Kaget anjg, game sialan";

    if (customText && customText !== "rielllybooth ♡") {
      if (customText.includes("|")) {
        const parts = customText.split("|");
        if (parts[0]) valoIgn = parts[0];
        if (parts[1]) valoRole = parts[1];
        if (parts[2]) valoAgent = parts[2];
        if (parts[3]) valoRank = parts[3];
        if (parts[4]) valoLine = parts[4];
      } else {
        valoIgn = customText;
      }
    }
    if (subtitleText && subtitleText.trim() && !subtitleText.includes("✨")) {
      valoLine = subtitleText.trim();
    }

    // IGN Text
    ctx.fillStyle = "#0f172a";
    ctx.font = "900 24px 'Consolas', 'Courier New', monospace";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText(`IGN:${valoIgn}`, infoX + 16, infoY + ignRowH / 2);

    // Bio Rows (Role, Agent, Rank, Most Said Line)
    ctx.font = "bold 20px 'Consolas', 'Courier New', monospace";
    ctx.fillStyle = "#1e293b";

    ctx.fillText(`Role: ${valoRole}`, infoX + 16, infoY + 95);
    ctx.fillText(`Favorite Agent: ${valoAgent}`, infoX + 16, infoY + 155);
    ctx.fillText(`Peak Rank: ${valoRank}`, infoX + 16, infoY + 215);

    ctx.fillText("Most Said Line:", infoX + 16, infoY + 275);
    ctx.font = "18px 'Consolas', 'Courier New', monospace";
    ctx.textBaseline = "top";
    drawWrappedCanvasText(ctx, `"${valoLine}"`, infoX + 16, infoY + 305, infoW - 32, 24);

    // Right Vertical PROTOCOL Band
    const protoX = cardX + cardW - 46;
    const protoY = cardY + 16;
    const protoW = 34;
    const protoH = cardH - 32;

    ctx.fillStyle = "#1e293b";
    ctx.fillRect(protoX, protoY, protoW, protoH);

    ctx.save();
    ctx.translate(protoX + protoW / 2, protoY + protoH / 2);
    ctx.rotate(Math.PI / 2);
    ctx.fillStyle = "#94a3b8";
    ctx.font = "bold 14px monospace";
    ctx.letterSpacing = "4px";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("PROTOCOL  |||||||||  00", 0, 0);
    ctx.restore();

    // Bottom Barcode Section (Angled navy block on left)
    const botBarY = cardY + 625;
    const botBarH = 100;
    const botBarW = 430;

    ctx.fillStyle = "#0f172a";
    ctx.beginPath();
    ctx.moveTo(cardX + 16, botBarY);
    ctx.lineTo(cardX + 16 + botBarW, botBarY);
    ctx.lineTo(cardX + 16 + botBarW - 40, botBarY + botBarH);
    ctx.lineTo(cardX + 16, botBarY + botBarH);
    ctx.closePath();
    ctx.fill();

    // High Density Vertical Barcode Lines
    ctx.fillStyle = "#ffffff";
    for (let bx = cardX + 32; bx < cardX + botBarW - 35; bx += Math.floor(Math.random() * 7 + 4)) {
      ctx.fillRect(bx, botBarY + 14, Math.random() > 0.5 ? 4 : 2, botBarH - 28);
    }

    // 3 Cyan Diagonal Slash Cuts
    ctx.strokeStyle = "#38bdf8";
    ctx.lineWidth = 4;
    for (let sx = 0; sx < 3; sx++) {
      ctx.beginPath();
      ctx.moveTo(cardX + botBarW + 2 + sx * 16, botBarY + 6);
      ctx.lineTo(cardX + botBarW - 34 + sx * 16, botBarY + botBarH - 6);
      ctx.stroke();
    }

    // Bold Red Italic Slogan: "TARA, VALO?"
    ctx.fillStyle = "#ff4655";
    ctx.font = "italic 900 48px 'Plus Jakarta Sans', sans-serif";
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    ctx.fillText("TARA, VALO?", cardX + cardW - 75, botBarY + botBarH / 2 + 8);

    ctx.restore();
  } else if (preset === "supermarket_crate") {
    // 🥦 SUPERMARKET FRUIT CRATES (PHOTOMATICS RETRO MARKET)
    // 1. Off-white clean retro tile grid background
    ctx.fillStyle = "#faf9f5";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Ceramic tile grid lines (35px spacing)
    ctx.strokeStyle = "rgba(226, 232, 240, 0.85)";
    ctx.lineWidth = 1.5;
    for (let gx = 0; gx <= canvas.width; gx += 35) {
      ctx.beginPath();
      ctx.moveTo(gx, 0);
      ctx.lineTo(gx, canvas.height);
      ctx.stroke();
    }
    for (let gy = 0; gy <= canvas.height; gy += 35) {
      ctx.beginPath();
      ctx.moveTo(0, gy);
      ctx.lineTo(canvas.width, gy);
      ctx.stroke();
    }

    // Top Header: Red Cursive Title
    ctx.fillStyle = "#e11d48";
    ctx.font = "italic bold 22px 'Georgia', cursive, serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("✦ rielllybooth market ✦", canvas.width / 2 + 10, 52);

    // 2. Three Dynamic Zigzag Plastic Grocery Crates
    const crateConfigs = [
      { cx: 300, cy: 305, angle: -3.2, w: 520, h: 425, baseColor: "#f59e0b", darkColor: "#d97706", lightColor: "#fde68a" },
      { cx: 302, cy: 765, angle: 3.0, w: 520, h: 425, baseColor: "#2563eb", darkColor: "#1d4ed8", lightColor: "#93c5fd" },
      { cx: 298, cy: 1225, angle: -2.6, w: 520, h: 425, baseColor: "#dc2626", darkColor: "#b91c1c", lightColor: "#fca5a5" },
    ];

    crateConfigs.forEach((cfg) => {
      ctx.save();
      ctx.translate(cfg.cx, cfg.cy);
      ctx.rotate((cfg.angle * Math.PI) / 180);
      drawPlasticCrateFrame(ctx, -cfg.w / 2, -cfg.h / 2, cfg.w, cfg.h, cfg.baseColor, cfg.darkColor, cfg.lightColor);
      ctx.restore();
    });

    // 3. Footer Branding
    const footerTitle = customText && customText !== "rielllybooth ♡" ? customText.toUpperCase() : "RIELLLY";
    const footerSubtitle = subtitleText && subtitleText.trim() && !subtitleText.includes("✨") ? subtitleText.trim() : "Market";

    // Big Bold Red Collegiate Typography
    ctx.fillStyle = "#dc2626";
    ctx.font = "900 52px 'Plus Jakarta Sans', sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(footerTitle, canvas.width / 2, 1585);

    // Script Cursive Subtitle
    ctx.fillStyle = "#475569";
    ctx.font = "italic bold 28px 'Georgia', cursive, serif";
    ctx.fillText(footerSubtitle, canvas.width / 2, 1640);
  } else if (preset === "student_id") {
    // 🪪 STUDENT IDENTIFICATION CARD ENGINE (1200x750px CANVAS)
    // 1. Light Card Background with rounded corners & shadow
    ctx.fillStyle = "#fdfcf7";
    ctx.beginPath();
    ctx.roundRect(25, 25, canvas.width - 50, canvas.height - 50, 24);
    ctx.fill();

    // Subtle Outer Card Border
    ctx.strokeStyle = "#cbd5e1";
    ctx.lineWidth = 3;
    ctx.stroke();

    // 2. Guilloche Security Wave Lines (Anti-counterfeit pattern)
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(25, 25, canvas.width - 50, canvas.height - 50, 24);
    ctx.clip();

    ctx.strokeStyle = "rgba(30, 58, 138, 0.045)";
    ctx.lineWidth = 1.2;
    for (let gy = 35; gy < canvas.height - 35; gy += 14) {
      ctx.beginPath();
      ctx.moveTo(25, gy);
      for (let gx = 25; gx <= canvas.width - 25; gx += 16) {
        ctx.lineTo(gx, gy + Math.sin(gx * 0.035) * 6);
      }
      ctx.stroke();
    }
    ctx.restore();

    // 3. Top Header Tricolor Banner (Red, White, Navy)
    const cardTop = 25;
    const cardLeft = 25;
    const cardW = canvas.width - 50;

    ctx.save();
    ctx.beginPath();
    ctx.roundRect(cardLeft, cardTop, cardW, 40, [24, 24, 0, 0]);
    ctx.clip();

    // Top Red bar
    ctx.fillStyle = "#dc2626";
    ctx.fillRect(cardLeft, cardTop, cardW, 14);

    // Middle White line
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(cardLeft, cardTop + 14, cardW, 4);

    // Bottom Navy bar
    ctx.fillStyle = "#1e3a8a";
    ctx.fillRect(cardLeft, cardTop + 18, cardW, 14);
    ctx.restore();

    // 4. Header Academy Text & Top ID Badge
    ctx.fillStyle = "#0f172a";
    ctx.font = "900 34px 'Plus Jakarta Sans', serif";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText("MANNER HIGH ACADEMY", 65, 105);

    ctx.fillStyle = "#64748b";
    ctx.font = "bold 13px monospace";
    ctx.letterSpacing = "3px";
    ctx.fillText("STUDENT IDENTIFICATION CARD  •  2024-2025", 65, 135);
    ctx.letterSpacing = "0px";

    // Top Right ID Badge Tag
    ctx.fillStyle = "#1e3a8a";
    ctx.beginPath();
    ctx.roundRect(canvas.width - 240, 85, 175, 42, 8);
    ctx.fill();

    ctx.fillStyle = "#ffffff";
    ctx.font = "900 15px monospace";
    ctx.textAlign = "center";
    ctx.fillText("ID: #2024-08912134", canvas.width - 152, 106);

    // 5. Left Photo Container Box
    const photoX = 65;
    const photoY = 165;
    const photoW = 380;
    const photoH = 490;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(photoX, photoY, photoW, photoH);
    ctx.strokeStyle = "#cbd5e1";
    ctx.lineWidth = 3;
    ctx.strokeRect(photoX, photoY, photoW, photoH);

    // 6. Right Student Info Fields Container
    const infoX = 485;
    const infoY = 165;

    let studentName = "RIELLY BOOTH";
    let studentId = "2024-08912134";
    let studentClass = "CLASS 3-A";
    let studentMajor = "VISUAL ARTS & MUSIC";
    let studentDob = "16 AUG 2006";

    if (customText && customText !== "rielllybooth ♡") {
      if (customText.includes("|")) {
        const parts = customText.split("|");
        if (parts[0]) studentName = parts[0];
        if (parts[1]) studentId = parts[1];
        if (parts[2]) studentClass = parts[2];
        if (parts[3]) studentMajor = parts[3];
        if (parts[4]) studentDob = parts[4];
      } else {
        studentName = customText;
      }
    }
    if (subtitleText && subtitleText.trim() && !subtitleText.includes("✨")) {
      studentClass = subtitleText.trim();
    }

    const fields = [
      { label: "NAME", value: studentName },
      { label: "STUDENT ID", value: studentId },
      { label: "GRADE / CLASS", value: studentClass },
      { label: "MAJOR / CLUB", value: studentMajor },
      { label: "DATE OF BIRTH", value: studentDob },
    ];

    let currentFieldY = infoY + 28;
    fields.forEach((f) => {
      ctx.fillStyle = "#64748b";
      ctx.font = "bold 14px 'Courier New', monospace";
      ctx.textAlign = "left";
      ctx.fillText(f.label + ":", infoX, currentFieldY);

      ctx.fillStyle = "#0f172a";
      ctx.font = "900 23px 'Plus Jakarta Sans', sans-serif";
      ctx.fillText(f.value, infoX + 175, currentFieldY);

      // Light underline
      ctx.strokeStyle = "rgba(203, 213, 225, 0.8)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(infoX + 170, currentFieldY + 8);
      ctx.lineTo(infoX + 620, currentFieldY + 8);
      ctx.stroke();

      currentFieldY += 56;
    });

    // Student Signature Line
    ctx.fillStyle = "#64748b";
    ctx.font = "bold 13px 'Courier New', monospace";
    ctx.fillText("SIGNATURE:", infoX, currentFieldY + 8);

    ctx.strokeStyle = "#475569";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(infoX + 130, currentFieldY + 14);
    ctx.lineTo(infoX + 380, currentFieldY + 14);
    ctx.stroke();

    // Handwritten cursive signature
    ctx.fillStyle = "#1e3a8a";
    ctx.font = "italic bold 28px 'Georgia', cursive, serif";
    ctx.fillText(studentName.split(" ")[0] || "Stefany", infoX + 150, currentFieldY + 6);

    // Bottom Barcode Box
    const barX = infoX;
    const barY = currentFieldY + 36;
    const barW = 400;
    const barH = 58;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(barX, barY, barW, barH);
    ctx.strokeStyle = "#cbd5e1";
    ctx.lineWidth = 2;
    ctx.strokeRect(barX, barY, barW, barH);

    ctx.fillStyle = "#0f172a";
    for (let bx = barX + 16; bx < barX + barW - 16; bx += Math.floor(Math.random() * 8 + 4)) {
      ctx.fillRect(bx, barY + 8, Math.random() > 0.5 ? 3.5 : 2, 34);
    }
    ctx.font = "bold 10px monospace";
    ctx.textAlign = "center";
    ctx.fillText(`|||  ${studentId}  |||`, barX + barW / 2, barY + barH - 4);

    // Right Official School Shield Crest
    drawSchoolCrest(ctx, canvas.width - 130, currentFieldY + 58, 62);
  } else if (preset === "school_4cut") {
    // 🏫 MANNER HIGH 4-CUT RETRO YEARBOOK STRIP (600x1800px CANVAS)
    // 1. Vintage Yearbook Cream Paper Background
    ctx.fillStyle = "#fbf8ee";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Subtle school notebook horizontal ruled lines
    ctx.strokeStyle = "rgba(30, 58, 138, 0.04)";
    ctx.lineWidth = 1.5;
    for (let ny = 25; ny < canvas.height; ny += 36) {
      ctx.beginPath();
      ctx.moveTo(0, ny);
      ctx.lineTo(canvas.width, ny);
      ctx.stroke();
    }

    // 2. Header School Doodles & Academy Banner
    drawSchoolClockDoodle(ctx, 60, 48, 20);
    drawPencilDoodle(ctx, 540, 48, 30, 35);
    drawSchoolStarBadge(ctx, 125, 48, 15, "★");
    drawSchoolStarBadge(ctx, 475, 48, 15, "★");

    ctx.fillStyle = "#1e3a8a";
    ctx.font = "italic 900 24px 'Georgia', serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("✦ MANNER HIGH ✦", canvas.width / 2, 38);

    ctx.fillStyle = "#b91c1c";
    ctx.font = "bold 11px monospace";
    ctx.letterSpacing = "3px";
    ctx.fillText("* SCHOOL MEMORIES & DIARY *", canvas.width / 2, 68);
    ctx.letterSpacing = "0px";

    // 3. Four Photo Slot Frame Bases with Double Uniform Borders
    const slotW = 520;
    const slotH = 345;
    const slotX = 40;
    const slotYOffsets = [95, 460, 825, 1190];

    slotYOffsets.forEach((sy) => {
      // White Base
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(slotX, sy, slotW, slotH);

      // Outer Navy Rim
      ctx.strokeStyle = "#1e3a8a";
      ctx.lineWidth = 4;
      ctx.strokeRect(slotX, sy, slotW, slotH);

      // Inner Burgundy Rim
      ctx.strokeStyle = "#b91c1c";
      ctx.lineWidth = 1.5;
      ctx.strokeRect(slotX + 5, sy + 5, slotW - 10, slotH - 10);
    });

    // 4. Emblems & Badges Between Photo Slots
    // Between Slot 1 & 2
    drawSchoolTie(ctx, 46, 442, 32);
    drawSchoolStarBadge(ctx, 540, 442, 16, "1st");

    // Between Slot 2 & 3
    drawSchoolPennant(ctx, 525, 808, 42);
    drawOfficialSchoolStamp(ctx, 60, 808, 24);

    // Between Slot 3 & 4
    drawHonorMedal(ctx, 540, 1172, 32);
    drawSchoolStarBadge(ctx, 55, 1172, 16, "★");

    // 5. Footer School Crest, Clean Title & Academic Accents
    let footerTitle = "MANNER HIGH";
    if (customText && customText !== "rielllybooth ♡") {
      if (customText.includes("|")) {
        const first = customText.split("|")[0].trim();
        footerTitle = first ? first.toUpperCase() : "MANNER HIGH";
      } else {
        footerTitle = customText.toUpperCase();
      }
    }
    if (footerTitle.length > 20) {
      footerTitle = footerTitle.substring(0, 18) + "...";
    }

    const footerSubtitle = subtitleText && subtitleText.trim() && !subtitleText.includes("✨") ? subtitleText.trim() : "★ CLASS OF 2024-2025 ★";

    // Center Crest
    drawSchoolCrest(ctx, canvas.width / 2, 1610, 54);

    // Left & Right Footer Emblems
    drawOfficialSchoolStamp(ctx, 115, 1640, 36);
    drawHonorMedal(ctx, 485, 1640, 36);

    // School Title Text (Neat & Clean)
    ctx.fillStyle = "#1e3a8a";
    ctx.font = "900 28px 'Plus Jakarta Sans', serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(footerTitle, canvas.width / 2, 1675);

    // Subtitle Text
    ctx.fillStyle = "#b91c1c";
    ctx.font = "bold 13px monospace";
    ctx.fillText(footerSubtitle, canvas.width / 2, 1708);

    // Barcode Strip at the very bottom
    ctx.fillStyle = "#0f172a";
    for (let bx = 160; bx < 440; bx += Math.floor(Math.random() * 8 + 4)) {
      ctx.fillRect(bx, 1735, Math.random() > 0.5 ? 3 : 1.5, 18);
    }
    ctx.font = "bold 9px monospace";
    ctx.fillStyle = "#64748b";
    ctx.fillText("||| 2024-MANNER-HIGH |||", canvas.width / 2, 1765);
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
  if (preset === "valorant_id") {
    // 🎯 VALORANT ID PHOTO SLOTS (ID Portrait + Vinyl Record)
    // Photo #1 inside the tilted ID Card
    ctx.save();
    ctx.translate(540, 670);
    ctx.rotate((-6 * Math.PI) / 180);

    const cardW = 980;
    const cardH = 820;
    const cardX = -cardW / 2;
    const cardY = -cardH / 2;

    const photoSlotX = cardX + 16;
    const photoSlotY = cardY + 192;
    const photoSlotW = 380;
    const photoSlotH = 415;

    if (images[0]) {
      ctx.save();
      ctx.beginPath();
      ctx.rect(photoSlotX, photoSlotY, photoSlotW, photoSlotH);
      ctx.clip();
      ctx.filter = filterString;
      drawImageCover(ctx, images[0], photoSlotX, photoSlotY, photoSlotW, photoSlotH, 0, isFlipped);
      applyCuteFilterOverlay(ctx, photoSlotX, photoSlotY, photoSlotW, photoSlotH, cuteFilter, filter.beautyGlow, 0, filterIntensity);
      ctx.restore();

      // Tactical Reticle Corner Brackets
      ctx.strokeStyle = "#ff4655";
      ctx.lineWidth = 3.5;
      const bracketLen = 18;
      // Top-Left
      ctx.beginPath();
      ctx.moveTo(photoSlotX + bracketLen, photoSlotY);
      ctx.lineTo(photoSlotX, photoSlotY);
      ctx.lineTo(photoSlotX, photoSlotY + bracketLen);
      ctx.stroke();
      // Top-Right
      ctx.beginPath();
      ctx.moveTo(photoSlotX + photoSlotW - bracketLen, photoSlotY);
      ctx.lineTo(photoSlotX + photoSlotW, photoSlotY);
      ctx.lineTo(photoSlotX + photoSlotW, photoSlotY + bracketLen);
      ctx.stroke();
      // Bottom-Left
      ctx.beginPath();
      ctx.moveTo(photoSlotX, photoSlotY + photoSlotH - bracketLen);
      ctx.lineTo(photoSlotX, photoSlotY + photoSlotH);
      ctx.lineTo(photoSlotX + bracketLen, photoSlotY + photoSlotH);
      ctx.stroke();
      // Bottom-Right
      ctx.beginPath();
      ctx.moveTo(photoSlotX + photoSlotW - bracketLen, photoSlotY + photoSlotH);
      ctx.lineTo(photoSlotX + photoSlotW, photoSlotY + photoSlotH);
      ctx.lineTo(photoSlotX + photoSlotW, photoSlotY + photoSlotH - bracketLen);
      ctx.stroke();
    }
    ctx.restore();

    // Bottom-Left: Metallic Keychain & Song Label
    drawMetallicKeychain(ctx, 160, 1480, 62);

    ctx.save();
    ctx.fillStyle = "#ffffff";
    ctx.font = "900 24px 'Plus Jakarta Sans', sans-serif";
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
    ctx.fillText("FAVORITE", 250, 1475);
    ctx.fillText("VALORANT SONG:", 250, 1510);
    ctx.restore();

    // Bottom-Right: Realistic Grooved Vinyl Record
    drawVinylRecord(ctx, 770, 1530, 310, images[1], filterString, isFlipped, cuteFilter, filter.beautyGlow, filterIntensity);
  } else if (preset === "supermarket_crate") {
    // 🥦 SUPERMARKET DYNAMIC ZIGZAG FRUIT CRATE PHOTO SLOTS & ABUNDANT FRUITS
    const crateConfigs = [
      { cx: 300, cy: 305, angle: -3.2, w: 520, h: 425 },
      { cx: 302, cy: 765, angle: 3.0, w: 520, h: 425 },
      { cx: 298, cy: 1225, angle: -2.6, w: 520, h: 425 },
    ];

    for (let i = 0; i < 3; i++) {
      const cfg = crateConfigs[i];
      const img = images[i];
      const innerW = cfg.w - 68;
      const innerH = cfg.h - 68;
      const innerX = -innerW / 2;
      const innerY = -innerH / 2;

      if (img) {
        ctx.save();
        ctx.translate(cfg.cx, cfg.cy);
        ctx.rotate((cfg.angle * Math.PI) / 180);
        ctx.beginPath();
        ctx.roundRect(innerX, innerY, innerW, innerH, 12);
        ctx.clip();
        ctx.filter = filterString;
        drawImageCover(ctx, img, innerX, innerY, innerW, innerH, 0, isFlipped);
        applyCuteFilterOverlay(ctx, innerX, innerY, innerW, innerH, cuteFilter, filter.beautyGlow, 0, filterIntensity);
        ctx.restore();
      }
    }

    // Abundant Overlapping Vector Fruits & Veggies across the whole strip
    // 1. Top Header Area
    drawBroccoli(ctx, 60, 68, 54);
    drawBroccoli(ctx, 96, 44, 36);
    drawLemonSlice(ctx, 532, 54, 22);
    drawStrawberry(ctx, 485, 48, 22);

    // 2. Crate 1 (Yellow) Area
    drawKiwiSlice(ctx, 536, 138, 25);
    drawTwinCherries(ctx, 72, 142, 34);
    drawStrawberry(ctx, 58, 480, 28);
    drawBanana(ctx, 530, 520, 38, -25);

    // 3. Crate 2 (Blue) Area
    drawGrapeCluster(ctx, 62, 570, 36);
    drawStrawberry(ctx, 78, 625, 30);
    drawMango(ctx, 536, 945, 42);
    drawCarrot(ctx, 58, 965, 34, 30);

    // 4. Crate 3 (Red) Area
    drawTomato(ctx, 535, 1045, 32);
    drawOrangeSlice(ctx, 65, 1055, 26);
    drawTwinCherries(ctx, 535, 1260, 28);
    drawAvocado(ctx, 82, 1425, 48);
    drawOrangeSlice(ctx, 530, 1410, 28);
    drawMushroom(ctx, 130, 1495, 28);
    drawKiwiSlice(ctx, 535, 1485, 22);

    // 5. Footer Area
    drawStrawberry(ctx, 100, 1615, 24);
    drawLemonSlice(ctx, 500, 1615, 20);
    drawBanana(ctx, 485, 1670, 32, 35);
    drawGrapeCluster(ctx, 115, 1680, 26);
  } else if (preset === "student_id") {
    // 🪪 STUDENT ID PHOTO SLOT
    const photoX = 65;
    const photoY = 165;
    const photoW = 380;
    const photoH = 490;

    if (images[0]) {
      ctx.save();
      ctx.beginPath();
      ctx.rect(photoX, photoY, photoW, photoH);
      ctx.clip();
      ctx.filter = filterString;
      drawImageCover(ctx, images[0], photoX, photoY, photoW, photoH, 0, isFlipped);
      applyCuteFilterOverlay(ctx, photoX, photoY, photoW, photoH, cuteFilter, filter.beautyGlow, 0, filterIntensity);
      ctx.restore();

      // Corner Crosshair Brackets
      ctx.strokeStyle = "#1e3a8a";
      ctx.lineWidth = 3;
      const bLen = 16;
      // Top-Left
      ctx.beginPath();
      ctx.moveTo(photoX + bLen, photoY);
      ctx.lineTo(photoX, photoY);
      ctx.lineTo(photoX, photoY + bLen);
      ctx.stroke();
      // Top-Right
      ctx.beginPath();
      ctx.moveTo(photoX + photoW - bLen, photoY);
      ctx.lineTo(photoX + photoW, photoY);
      ctx.lineTo(photoX + photoW, photoY + bLen);
      ctx.stroke();
      // Bottom-Left
      ctx.beginPath();
      ctx.moveTo(photoX, photoY + photoH - bLen);
      ctx.lineTo(photoX, photoY + photoH);
      ctx.lineTo(photoX + bLen, photoY + photoH);
      ctx.stroke();
      // Bottom-Right
      ctx.beginPath();
      ctx.moveTo(photoX + photoW - bLen, photoY + photoH);
      ctx.lineTo(photoX + photoW, photoY + photoH);
      ctx.lineTo(photoX + photoW, photoY + photoH - bLen);
      ctx.stroke();
    }

    // Official Stamp Watermark Overlapping Photo Corner
    drawOfficialSchoolStamp(ctx, 420, 600, 56);
  } else if (preset === "school_4cut") {
    // 🏫 MANNER HIGH 4-CUT PHOTO SLOTS
    const slotW = 520;
    const slotH = 345;
    const slotX = 40;
    const slotYOffsets = [95, 460, 825, 1190];

    for (let i = 0; i < 4; i++) {
      const sy = slotYOffsets[i];
      const img = images[i];
      const innerX = slotX + 7;
      const innerY = sy + 7;
      const innerW = slotW - 14;
      const innerH = slotH - 14;

      if (img) {
        ctx.save();
        ctx.beginPath();
        ctx.rect(innerX, innerY, innerW, innerH);
        ctx.clip();
        ctx.filter = filterString;
        drawImageCover(ctx, img, innerX, innerY, innerW, innerH, 0, isFlipped);
        applyCuteFilterOverlay(ctx, innerX, innerY, innerW, innerH, cuteFilter, filter.beautyGlow, 0, filterIntensity);
        ctx.restore();
      }
    }
  } else if (preset === "cupids_letter") {
    // 💌 CUPID'S LETTER STAMP PHOTO SLOTS (2 STACKED STAMPS)
    const stampSlots = [
      { x: 630, y: 240, w: 480, h: 380 },
      { x: 630, y: 760, w: 480, h: 380 },
    ];

    for (let i = 0; i < 2; i++) {
      const slot = stampSlots[i];
      const img = images[i];

      // Draw scalloped stamp white background
      ctx.save();
      ctx.fillStyle = "#FFFFFF";
      drawScallopedStampFrame(ctx, slot.x - 12, slot.y - 12, slot.w + 24, slot.h + 24, 7);
      ctx.fill();
      ctx.restore();

      // Scalloped red outline
      ctx.save();
      ctx.strokeStyle = "#C8102E";
      ctx.lineWidth = 2;
      drawScallopedStampFrame(ctx, slot.x - 12, slot.y - 12, slot.w + 24, slot.h + 24, 7);
      ctx.stroke();
      ctx.restore();

      if (img) {
        ctx.save();
        ctx.beginPath();
        ctx.rect(slot.x, slot.y, slot.w, slot.h);
        ctx.clip();
        ctx.filter = filterString;
        drawImageCover(ctx, img, slot.x, slot.y, slot.w, slot.h, 0, isFlipped);
        applyCuteFilterOverlay(ctx, slot.x, slot.y, slot.w, slot.h, cuteFilter, filter.beautyGlow, 0, filterIntensity);
        ctx.restore();

        ctx.strokeStyle = "#C8102E";
        ctx.lineWidth = 2;
        ctx.strokeRect(slot.x, slot.y, slot.w, slot.h);
      }
    }

    // Footer: From: red text at bottom right & Left Column signature
    ctx.save();
    ctx.fillStyle = "#C8102E";
    ctx.font = "bold 22px 'Georgia', serif";
    ctx.textAlign = "left";
    ctx.fillText("From: ______________________", 70, 1720);

    ctx.font = "bold 16px monospace";
    ctx.textAlign = "right";
    ctx.fillText("CUPID'S SECRET MAIL SERVICE ♡", canvas.width - 70, 1720);
    ctx.restore();
  } else if (preset === "passport") {
    // ✈️ PASSPORT MEMORIES — precision photo/layer coordinates

    // Photo #1 — ID portrait: X=70, Y=180, W=380, H=520
    if (images[0]) {
      ctx.save();
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(58, 168, 404, 544);

      ctx.beginPath();
      ctx.rect(70, 180, 380, 520);
      ctx.clip();
      ctx.filter = filterString;
      drawImageCover(ctx, images[0], 70, 180, 380, 520, 0, isFlipped);
      applyCuteFilterOverlay(ctx, 70, 180, 380, 520, cuteFilter, filter.beautyGlow, 0, filterIntensity);
      ctx.restore();
    }

    // Layer 1 — center vintage $5 banknote vector
    ctx.save();
    ctx.translate(450, 990);
    ctx.fillStyle = "#F4EBD9";
    ctx.fillRect(0, 0, 300, 190);
    ctx.strokeStyle = "#8B1E1E";
    ctx.lineWidth = 3;
    ctx.strokeRect(6, 6, 288, 178);
    ctx.strokeRect(12, 12, 276, 166);
    ctx.fillStyle = "#8B1E1E";
    ctx.font = "bold 36px serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("$5", 150, 85);
    ctx.font = "bold 13px monospace";
    ctx.fillText("FIVE DOLLARS • VINTAGE NOTE", 150, 135);
    ctx.restore();

    // Helper for tilted polaroid photo slots
    const drawPassportPolaroid = (
      img: HTMLImageElement | HTMLVideoElement,
      x: number,
      y: number,
      w: number,
      h: number,
      angleDeg: number
    ) => {
      ctx.save();
      ctx.translate(x + w / 2, y + h / 2);
      ctx.rotate((angleDeg * Math.PI) / 180);

      // 10px white border around the exact photo slot
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(-(w / 2 + 10), -(h / 2 + 10), w + 20, h + 20);

      ctx.beginPath();
      ctx.rect(-w / 2, -h / 2, w, h);
      ctx.clip();
      ctx.filter = filterString;
      drawImageCover(ctx, img, -w / 2, -h / 2, w, h, 0, isFlipped);
      applyCuteFilterOverlay(ctx, -w / 2, -h / 2, w, h, cuteFilter, filter.beautyGlow, 0, filterIntensity);
      ctx.restore();
    };

    // Layer 2 — Photo #2 top-left, -6°
    if (images[1]) drawPassportPolaroid(images[1], 80, 960, 310, 340, -6);

    // Layer 2 — Photo #3 top-right, +5°
    if (images[2]) drawPassportPolaroid(images[2], 790, 960, 310, 340, 5);

    // Layer 2 — Photo #4 bottom-center, -2°
    if (images[3]) drawPassportPolaroid(images[3], 430, 1280, 320, 360, -2);

    // Layer 3 — blue postage stamp intentionally overlapping Photo #2.
    // This creates the clipped/stacked scrapbook feel from the reference.
    ctx.save();
    ctx.translate(250, 1215);
    ctx.rotate((-7 * Math.PI) / 180);
    ctx.fillStyle = "rgba(37, 99, 235, 0.90)";
    ctx.fillRect(0, 0, 165, 112);
    ctx.strokeStyle = "#FFFFFF";
    ctx.lineWidth = 3;
    ctx.setLineDash([7, 5]);
    ctx.strokeRect(8, 8, 149, 96);
    ctx.setLineDash([]);
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 13px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "alphabetic";
    ctx.fillText("AIR MAIL", 82, 36);
    ctx.font = "bold 25px serif";
    ctx.fillText("50¢", 82, 70);
    ctx.font = "10px monospace";
    ctx.fillText("MEMORIES", 82, 92);
    ctx.restore();

    // Signature sits under the postage stamp like a handwritten scrapbook note.
    ctx.save();
    ctx.translate(70, 1515);
    ctx.strokeStyle = "#2563EB";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 30);
    ctx.lineTo(335, 30);
    ctx.stroke();
    ctx.fillStyle = "#2563EB";
    ctx.font = "italic 20px serif";
    ctx.textAlign = "left";
    ctx.fillText("Signature of the Folder", 20, 18);
    ctx.restore();

    // Layer 3 — circular blue seal overlaps the lower-right edge of Photo #4.
    ctx.save();
    ctx.translate(760, 1430);
    ctx.rotate((-10 * Math.PI) / 180);
    ctx.globalAlpha = 0.88;
    ctx.strokeStyle = "#2563EB";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(0, 0, 82, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 0, 67, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = "#2563EB";
    ctx.font = "bold 14px monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("VALID STAMP", 0, -26);
    ctx.fillText("★ APPROVED ★", 0, 0);
    ctx.fillText("RIELLLYBOOTH", 0, 25);
    ctx.restore();

    // Extra tiny paper label partially tucked behind Photo #4.
    ctx.save();
    ctx.translate(925, 1335);
    ctx.rotate((4 * Math.PI) / 180);
    ctx.fillStyle = "rgba(255,255,255,0.72)";
    ctx.fillRect(0, 0, 170, 48);
    ctx.fillStyle = "#8B1E1E";
    ctx.font = "bold 12px monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("MEMORY / 09•26", 85, 24);
    ctx.restore();
  } else if (isNewspaper) {
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

    for (let i = 0; i < 3; i++) {
      const img = images[i + 1];
      if (!img) continue;
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
    }

    // 4. BOTTOM ARTICLE CAPTIONS & PARAGRAPHS (STRICT SPACING AT Y = 1280px)
    const columnTitles = [
      "FOTO DULU AJA BLAY",
      "OUR STORY",
      "AWAS GAGAL MOVE ON"
    ];
    const columnTexts = [
      "Tak perlu alasan khusus untuk merayakan hari ini. Setiap senyuman manis dan tawa yang terekam adalah cerita abadi.",
      "Di antara riuhnya kota Jakarta dan Surabaya, ada momen kecil yang layak disimpan selamanya di lembaran nostalgia.",
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

    for (let i = 0; i < 3; i++) {
      const img = images[i + 1];
      if (!img) continue;
      const bx = padding + i * (botW + padding);
      const by = padding * 2 + topH;
      ctx.save();
      ctx.filter = filterString;
      drawImageCover(ctx, img, bx, by, botW, botH, 12, isFlipped);
      ctx.restore();
      applyCuteFilterOverlay(ctx, bx, by, botW, botH, cuteFilter, filter.beautyGlow, 12, filterIntensity);
    }
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

    for (let i = 0; i < 3; i++) {
      const img = images[i + 1];
      if (!img) continue;
      const sx = padding * 2 + heroW;
      const sy = padding + i * (sideH + padding);
      ctx.save();
      ctx.filter = filterString;
      drawImageCover(ctx, img, sx, sy, sideW, sideH, 12, isFlipped);
      ctx.restore();
      applyCuteFilterOverlay(ctx, sx, sy, sideW, sideH, cuteFilter, filter.beautyGlow, 12, filterIntensity);
    }
  } else if (layout.startsWith("strip") || layout === "y2k_checker") {
    const topMargin =
      preset === "hut_ri_81_3strip" || preset === "hut_ri_81_4strip"
        ? 170
        : preset === "concert_ticket" || preset === "pestapora_pass" || preset === "retro_cassette" || preset === "toy_story" || preset === "spongebob"
          ? 220
          : padding;
    const photoW = canvas.width - padding * 2;
    const availableH = canvas.height - topMargin - bottomFooterHeight - padding * photoCount;
    const photoH = availableH / photoCount;

    for (let i = 0; i < photoCount; i++) {
      const img = images[i];
      if (!img) continue;
      const y = topMargin + i * (photoH + padding);
      const borderRadius =
        preset === "hut_ri_81_3strip"
          ? 16
          : preset === "hut_ri_81_4strip"
            ? 14
            : preset === "film"
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
      } else if (preset === "hut_ri_81_3strip") {
        // Crisp White & Gold Border for Dirgahayu 3-strip
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.roundRect(padding, y, photoW, photoH, borderRadius);
        ctx.stroke();

        ctx.strokeStyle = "#fbbf24";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(padding - 2, y - 2, photoW + 4, photoH + 4, borderRadius + 2);
        ctx.stroke();

        // Rosette between photos
        if (i < photoCount - 1) {
          drawMerahPutihRosette(ctx, canvas.width / 2, y + photoH + padding / 2, 16);
        }
      } else if (preset === "hut_ri_81_4strip") {
        // Red and Gold Border for Dirgahayu 4-strip
        ctx.strokeStyle = "#dc2626";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.roundRect(padding, y, photoW, photoH, borderRadius);
        ctx.stroke();

        ctx.strokeStyle = "#fbbf24";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(padding - 2, y - 2, photoW + 4, photoH + 4, borderRadius + 2);
        ctx.stroke();

        // Ticker divider between photos
        if (i < photoCount - 1) {
          const divY = y + photoH + padding / 2;
          ctx.save();
          ctx.fillStyle = "#dc2626";
          ctx.fillRect(padding + 20, divY - 7, photoW - 40, 14);
          ctx.fillStyle = "#ffffff";
          ctx.font = "bold 9px 'Plus Jakarta Sans', monospace";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText("★ 17 AGUSTUS 1945 • HUT RI 81 • INDONESIA MERDEKA ★", canvas.width / 2, divY);
          ctx.restore();
        }
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
    }
  } else {
    // grid_2x2, purikura_4cut, scrapbook
    const topMargin = preset === "concert_ticket" || preset === "pestapora_pass" || preset === "retro_cassette" || preset === "toy_story" || preset === "spongebob" ? 220 : padding;
    const photoW = (canvas.width - padding * 3) / 2;
    const availableH = canvas.height - topMargin - bottomFooterHeight - padding * 2;
    const photoH = availableH / 2;

    const positions = [
      { x: padding, y: topMargin },
      { x: padding * 2 + photoW, y: topMargin },
      { x: padding, y: topMargin + photoH + padding },
      { x: padding * 2 + photoW, y: topMargin + photoH + padding },
    ];

    for (let i = 0; i < 4; i++) {
      const img = images[i];
      if (!img) continue;
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
    }
  }

  // STEP 3: PRESET DECORATIVE VECTORS
  if (preset === "hut_ri_81_3strip") {
    // 🇮🇩 TOP CELEBRATION BANNER (3-STRIP FESTIVE)
    drawIndonesianFlag(ctx, 68, 75, 52, 34, -10, 68);
    drawIndonesianFlag(ctx, canvas.width - 68, 75, 52, 34, 10, 68);
    drawMerahPutihGarland(ctx, canvas.width, 22);

    ctx.save();
    ctx.fillStyle = "#fef08a";
    ctx.font = "bold 20px 'Georgia', serif";
    ctx.textAlign = "center";
    ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
    ctx.shadowBlur = 6;
    ctx.fillText("DIRGAHAYU", canvas.width / 2, 68);

    ctx.fillStyle = "#ffffff";
    ctx.font = "900 26px 'Plus Jakarta Sans', serif";
    ctx.fillText("REPUBLIK INDONESIA", canvas.width / 2, 100);

    ctx.fillStyle = "#fde047";
    ctx.font = "bold 12px 'Plus Jakarta Sans', monospace";
    ctx.fillText("★ 17 AGUSTUS 1945 - 2026 ★", canvas.width / 2, 126);
    ctx.restore();

    drawY2kStar(ctx, 150, 45, 12, "#fde047");
    drawY2kStar(ctx, canvas.width - 150, 45, 12, "#fde047");
  } else if (preset === "hut_ri_81_4strip") {
    // 🇮🇩 TOP CELEBRATION BANNER (4-STRIP PATRIOTIC)
    drawIndonesianFlag(ctx, 65, 75, 48, 30, -8, 62);
    drawIndonesianFlag(ctx, canvas.width - 65, 75, 48, 30, 8, 62);

    ctx.save();
    ctx.fillStyle = "#dc2626";
    ctx.beginPath();
    ctx.roundRect(canvas.width / 2 - 130, 40, 260, 44, 10);
    ctx.fill();
    ctx.strokeStyle = "#fbbf24";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = "#ffffff";
    ctx.font = "900 22px 'Plus Jakarta Sans', sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("HUT RI KE-81 🇮🇩", canvas.width / 2, 62);

    ctx.fillStyle = "#dc2626";
    ctx.font = "bold 13px 'Plus Jakarta Sans', monospace";
    ctx.fillText("★ 17 AGUSTUS 1945 - 2026 ★", canvas.width / 2, 110);

    drawY2kStar(ctx, 140, 60, 10, "#fbbf24");
    drawY2kStar(ctx, canvas.width - 140, 60, 10, "#fbbf24");
    ctx.restore();
  } else if (preset === "coquette") {
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
  } else if (preset === "cyber_y2k_pink") {
    drawY2kStar(ctx, padding + 20, 40, 18, "#ffffff");
    drawY2kStar(ctx, canvas.width - padding - 20, 40, 18, "#38bdf8");
    drawY2kStar(ctx, canvas.width / 2, canvas.height - bottomFooterHeight + 20, 22, "#ffffff");
  } else if (preset === "vintage_newspaper_dark") {
    drawY2kStar(ctx, padding + 20, 40, 12, "#e4e4e7");
    drawY2kStar(ctx, canvas.width - padding - 20, 40, 12, "#e4e4e7");
  } else if (preset === "retro_cassette") {
    drawCassetteSpool(ctx, 80, canvas.height - bottomFooterHeight + 40, 22);
    drawCassetteSpool(ctx, canvas.width - 80, canvas.height - bottomFooterHeight + 40, 22);
  } else if (preset === "kawaii_boba") {
    drawBobaPearl(ctx, 60, canvas.height - bottomFooterHeight + 20, 14);
    drawBobaPearl(ctx, 110, canvas.height - bottomFooterHeight + 35, 16);
    drawBobaPearl(ctx, canvas.width - 60, canvas.height - bottomFooterHeight + 20, 14);
    drawBobaPearl(ctx, canvas.width - 110, canvas.height - bottomFooterHeight + 35, 16);
    drawBobaPearl(ctx, canvas.width / 2, canvas.height - bottomFooterHeight + 40, 18);
  } else if (preset === "heart_washi_tape") {
    drawWashiTape(ctx, padding + 30, 35, 75, 22, -12);
    drawWashiTape(ctx, canvas.width - padding - 30, 35, 75, 22, 12);
    drawWashiTape(ctx, canvas.width / 2, canvas.height - bottomFooterHeight + 25, 85, 24, 3);
  } else if (preset === "skena_coquette") {
    drawRibbonBow(ctx, padding + 20, 40, 0.9, "#18181b", "#000000", "#3f3f46");
    drawRibbonBow(ctx, canvas.width - padding - 20, 40, 0.9, "#18181b", "#000000", "#3f3f46");
    drawRibbonBow(ctx, canvas.width / 2, canvas.height - bottomFooterHeight + 10, 1.1, "#18181b", "#000000", "#3f3f46");
  } else if (preset === "galau_club" || preset === "galau_quote") {
    ctx.save();
    ctx.fillStyle = textColor || "#1c1917";
    ctx.font = "italic bold 18px 'Georgia', serif";
    ctx.textAlign = "center";
    const quoteText =
      customText && customText !== "rielllybooth ♡"
        ? `"${customText}"`
        : '"Karna yang benar benar menginginkan mu, akan mencari beribu cara agar kamu tidak pergi dalam hidupnya"';
    drawWrappedCanvasText(ctx, quoteText, canvas.width / 2, canvas.height - bottomFooterHeight + 25, canvas.width - padding * 2, 24);
    ctx.restore();
  } else if (preset === "pestapora_pass") {
    drawY2kStar(ctx, padding + 15, 45, 14, "#ffffff");
    drawY2kStar(ctx, canvas.width - padding - 15, 45, 14, "#ffffff");
  } else if (preset === "struk_jaksel") {
    // Handled in STEP 6
  } else if (preset === "photocard_bias") {
    drawRibbonBow(ctx, padding + 20, 40, 0.8, "#ffffff", "#c084fc", "#e0e7ff");
    drawY2kStar(ctx, canvas.width - padding - 20, 40, 18, "#ffffff");
    drawY2kStar(ctx, padding + 25, canvas.height - bottomFooterHeight + 20, 20, "#38bdf8");
    drawY2kStar(ctx, canvas.width - 25, canvas.height - bottomFooterHeight + 20, 20, "#ec4899");
  } else if (preset === "toy_story") {
    ctx.save();
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 18px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("🤠 YOU'VE GOT A FRIEND IN ME • TOY STORY", canvas.width / 2, canvas.height - bottomFooterHeight + 25);
    ctx.restore();
  } else if (preset === "spongebob") {
    drawBikiniBottomFlower(ctx, 45, 45, 14, "#ec4899");
    drawBikiniBottomFlower(ctx, canvas.width - 45, 45, 14, "#a855f7");
    drawBikiniBottomFlower(ctx, 50, canvas.height - bottomFooterHeight + 25, 16, "#ec4899");
    drawBikiniBottomFlower(ctx, canvas.width - 50, canvas.height - bottomFooterHeight + 25, 16, "#a855f7");
  } else if (preset === "among_us") {
    drawCrewmate(ctx, padding + 25, 45, 0.8, "#ef4444");
    drawCrewmate(ctx, canvas.width - padding - 25, 45, 0.8, "#06b6d4");
    drawCrewmate(ctx, padding + 30, canvas.height - bottomFooterHeight + 25, 0.9, "#eab308");
    drawCrewmate(ctx, canvas.width - padding - 30, canvas.height - bottomFooterHeight + 25, 0.9, "#22c55e");
  } else if (preset === "happy_birthday") {
    drawBirthdayCake(ctx, padding + 30, 45, 0.85);
    drawBirthdayCake(ctx, canvas.width - padding - 30, 45, 0.85);
    drawBirthdayCake(ctx, canvas.width / 2, canvas.height - bottomFooterHeight + 20, 1.0);
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

  // STEP 6: CUSTOM BRAND/EVENT LOGO & TYPOGRAPHY FOOTER (Non-newspaper & non-custom-story presets)
  if (
    !isNewspaper &&
    preset !== "passport" &&
    preset !== "cupids_letter" &&
    preset !== "valorant_id" &&
    preset !== "supermarket_crate" &&
    preset !== "student_id" &&
    preset !== "school_4cut"
  ) {
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
      if (preset === "receipt" || preset === "struk_jaksel") {
        ctx.fillStyle = textColor || "#1c1917";
        ctx.font = "14px monospace";
        ctx.textAlign = "left";

        const leftX = padding + 10;
        const rightX = canvas.width - padding - 10;
        let curY = canvas.height - 175;

        const line1Text = preset === "struk_jaksel" ? "1x Iced Oat Milk Latte" : "1x Cute Pose Snapshot";
        const line1Price = preset === "struk_jaksel" ? "Rp 55.000" : "Rp 0";
        const line2Text = preset === "struk_jaksel" ? "1x Matcha Espresso" : "1x Good Vibes Only";
        const line2Price = preset === "struk_jaksel" ? "Rp 52.000" : "Rp 0";

        ctx.fillText(line1Text, leftX, curY);
        ctx.textAlign = "right";
        ctx.fillText(line1Price, rightX, curY);

        curY += 24;
        ctx.textAlign = "left";
        ctx.fillText(line2Text, leftX, curY);
        ctx.textAlign = "right";
        ctx.fillText(line2Price, rightX, curY);

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
      } else if (preset === "concert_ticket" || preset === "pestapora_pass") {
        ctx.fillStyle = textColor || "#ffffff";
        ctx.font = `bold 24px ${fontCss}`;
        ctx.textAlign = "center";
        ctx.fillText(customText || "rielllybooth ♡", canvas.width / 2, canvas.height - 85);
        ctx.font = `500 16px ${fontCss}`;
        ctx.fillText(displaySubtitle, canvas.width / 2, canvas.height - 45);
      } else if (preset === "hut_ri_81_3strip") {
        // 🇮🇩 BOTTOM FOOTER FOR DIRGAHAYU 3-STRIP
        const footerCenterY = canvas.height - 115;

        // 3D Metallic Gold 81th Emblem
        drawHutRi81Emblem(ctx, canvas.width / 2, footerCenterY - 26, 68, "gold");

        // Primary Title
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 24px 'Georgia', serif";
        ctx.textAlign = "center";
        ctx.shadowColor = "rgba(0, 0, 0, 0.6)";
        ctx.shadowBlur = 8;
        ctx.shadowOffsetY = 2;
        const mainText = customText && customText !== "rielllybooth ♡" ? customText : "DIRGAHAYU REPUBLIK INDONESIA";
        ctx.fillText(mainText, canvas.width / 2, footerCenterY + 34);
        ctx.shadowColor = "transparent";

        // Subtitle / Slogan
        ctx.fillStyle = "#fde047";
        ctx.font = "bold 14px 'Plus Jakarta Sans', sans-serif";
        ctx.fillText(
          displaySubtitle.includes("✨") ? "★ NUSANTARA BARU • INDONESIA MAJU ★" : displaySubtitle,
          canvas.width / 2,
          footerCenterY + 62
        );

        // Melati flowers flanking left & right
        drawMelatiFlower(ctx, 65, footerCenterY + 22, 22);
        drawMelatiFlower(ctx, canvas.width - 65, footerCenterY + 22, 22);
      } else if (preset === "hut_ri_81_4strip") {
        // 🇮🇩 BOTTOM FOOTER FOR DIRGAHAYU 4-STRIP
        const footerCenterY = canvas.height - 110;

        // Merah-Putih Rosette Medal in center
        drawMerahPutihRosette(ctx, canvas.width / 2, footerCenterY - 28, 26);

        // Primary Title
        ctx.fillStyle = "#dc2626";
        ctx.font = "900 24px 'Plus Jakarta Sans', sans-serif";
        ctx.textAlign = "center";
        const mainText = customText && customText !== "rielllybooth ♡" ? customText : "81 TAHUN INDONESIA MERDEKA";
        ctx.fillText(mainText, canvas.width / 2, footerCenterY + 32);

        // Subtitle / Slogan
        ctx.fillStyle = "#1e293b";
        ctx.font = "bold 13px 'Plus Jakarta Sans', sans-serif";
        ctx.fillText(
          displaySubtitle.includes("✨") ? "✨ 17 AGUSTUS 1945 - 2026 • NUSANTARA BERDAULAT ✨" : displaySubtitle,
          canvas.width / 2,
          footerCenterY + 58
        );

        // Fluttering Flags on left & right
        drawIndonesianFlag(ctx, 60, footerCenterY + 18, 42, 28, -6, 52);
        drawIndonesianFlag(ctx, canvas.width - 60, footerCenterY + 18, 42, 28, 6, 52);
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
