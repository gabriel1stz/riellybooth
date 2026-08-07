const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const filtersDir = path.join(process.cwd(), 'public', 'filters');
if (!fs.existsSync(filtersDir)) {
  fs.mkdirSync(filtersDir, { recursive: true });
}

// Minimal 8-bit RGBA PNG Encoder in pure Node.js (no native dependencies)
function createRawPng(width, height, drawFn) {
  // Create RGBA buffer (width * height * 4)
  const buffer = Buffer.alloc(width * height * 4);

  const setPixel = (x, y, r, g, b, a = 255) => {
    if (x < 0 || x >= width || y < 0 || y >= height) return;
    const idx = (y * width + x) * 4;
    buffer[idx] = r;
    buffer[idx + 1] = g;
    buffer[idx + 2] = b;
    buffer[idx + 3] = a;
  };

  drawFn(setPixel, width, height);

  // Add PNG scanline filter byte (0 = None) before each row
  const scanlineLength = width * 4 + 1;
  const rawData = Buffer.alloc(height * scanlineLength);

  for (let y = 0; y < height; y++) {
    rawData[y * scanlineLength] = 0; // Filter: None
    buffer.copy(rawData, y * scanlineLength + 1, y * width * 4, (y + 1) * width * 4);
  }

  const compressed = zlib.deflateSync(rawData);

  // Build PNG chunks
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type: RGBA
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace
  const ihdrChunk = createChunk('IHDR', ihdr);

  // IDAT
  const idatChunk = createChunk('IDAT', compressed);

  // IEND
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function createChunk(type, data) {
  const len = data.length;
  const chunk = Buffer.alloc(4 + 4 + len + 4);
  chunk.writeUInt32BE(len, 0);
  chunk.write(type, 4, 4, 'ascii');
  data.copy(chunk, 8);
  const crc = crc32(chunk.slice(4, 8 + len));
  chunk.writeUInt32BE(crc, 8 + len);
  return chunk;
}

// CRC32 table & generator
const crcTable = [];
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  crcTable[n] = c;
}

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

// Generate the 8 filter PNG images
const filterDrawings = {
  'pixel-glasses': (setPixel, w, h) => {
    // Black frames
    for (let x = 20; x < 130; x++) for (let y = 30; y < 80; y++) setPixel(x, y, 9, 9, 11, 255);
    for (let x = 170; x < 280; x++) for (let y = 30; y < 80; y++) setPixel(x, y, 9, 9, 11, 255);
    // Bridge
    for (let x = 130; x < 170; x++) for (let y = 50; y < 65; y++) setPixel(x, y, 9, 9, 11, 255);
    // Lens shine
    for (let x = 40; x < 65; x++) for (let y = 40; y < 55; y++) setPixel(x, y, 255, 255, 255, 230);
    for (let x = 190; x < 215; x++) for (let y = 40; y < 55; y++) setPixel(x, y, 255, 255, 255, 230);
    for (let x = 50; x < 70; x++) for (let y = 60; y < 70; y++) setPixel(x, y, 244, 114, 182, 230);
    for (let x = 200; x < 220; x++) for (let y = 60; y < 70; y++) setPixel(x, y, 244, 114, 182, 230);
  },
  'cat-whiskers': (setPixel, w, h) => {
    // Cat ears
    for (let y = 10; y < 70; y++) {
      for (let x = 30 + Math.floor(y*0.5); x < 90 - Math.floor(y*0.5); x++) setPixel(x, y, 24, 24, 27, 255);
      for (let x = 210 + Math.floor(y*0.5); x < 270 - Math.floor(y*0.5); x++) setPixel(x, y, 24, 24, 27, 255);
    }
    // Inner ears
    for (let y = 25; y < 60; y++) {
      for (let x = 45 + Math.floor(y*0.5); x < 75 - Math.floor(y*0.5); x++) setPixel(x, y, 244, 114, 182, 255);
      for (let x = 225 + Math.floor(y*0.5); x < 255 - Math.floor(y*0.5); x++) setPixel(x, y, 244, 114, 182, 255);
    }
    // Nose
    for (let x = 135; x < 165; x++) for (let y = 95; y < 115; y++) setPixel(x, y, 244, 114, 182, 255);
    // Whiskers
    for (let i = 0; i < 3; i++) {
      for (let x = 10; x < 120; x++) {
        const wy = 100 + i * 15 + Math.floor((120 - x) * 0.1 * (i - 1));
        setPixel(x, wy, 24, 24, 27, 255);
        setPixel(x, wy + 1, 24, 24, 27, 255);
      }
      for (let x = 180; x < 290; x++) {
        const wy = 100 + i * 15 + Math.floor((x - 180) * 0.1 * (i - 1));
        setPixel(x, wy, 24, 24, 27, 255);
        setPixel(x, wy + 1, 24, 24, 27, 255);
      }
    }
  },
  'dog-classic': (setPixel, w, h) => {
    // Dog ears
    for (let y = 20; y < 130; y++) {
      for (let x = 30; x < 90; x++) setPixel(x, y, 120, 53, 15, 255);
      for (let x = 210; x < 270; x++) setPixel(x, y, 120, 53, 15, 255);
    }
    // Inner ears
    for (let y = 40; y < 110; y++) {
      for (let x = 45; x < 75; x++) setPixel(x, y, 251, 207, 232, 255);
      for (let x = 225; x < 255; x++) setPixel(x, y, 251, 207, 232, 255);
    }
    // Nose
    for (let x = 125; x < 175; x++) for (let y = 140; y < 175; y++) setPixel(x, y, 24, 24, 27, 255);
    // Tongue
    for (let x = 135; x < 165; x++) for (let y = 175; y < 215; y++) setPixel(x, y, 255, 71, 126, 255);
  },
  'chef-hat': (setPixel, w, h) => {
    // Chef hat top bulb
    for (let x = 60; x < 240; x++) for (let y = 20; y < 120; y++) setPixel(x, y, 255, 255, 255, 255);
    for (let x = 40; x < 260; x++) for (let y = 50; y < 110; y++) setPixel(x, y, 255, 255, 255, 255);
    // Band
    for (let x = 80; x < 220; x++) for (let y = 120; y < 180; y++) setPixel(x, y, 241, 245, 249, 255);
    // Outline border
    for (let x = 80; x < 220; x++) {
      setPixel(x, 120, 203, 213, 225, 255);
      setPixel(x, 180, 203, 213, 225, 255);
    }
  },
  'diving-mask': (setPixel, w, h) => {
    // Mask frame
    for (let x = 30; x < 270; x++) for (let y = 40; y < 120; y++) setPixel(x, y, 245, 158, 11, 255);
    // Blue lenses
    for (let x = 45; x < 135; x++) for (let y = 55; y < 105; y++) setPixel(x, y, 56, 189, 248, 220);
    for (let x = 165; x < 255; x++) for (let y = 55; y < 105; y++) setPixel(x, y, 56, 189, 248, 220);
    // Snorkel tube
    for (let x = 250; x < 270; x++) for (let y = 20; y < 170; y++) setPixel(x, y, 239, 68, 68, 255);
    for (let x = 240; x < 280; x++) for (let y = 10; y < 35; y++) setPixel(x, y, 253, 224, 71, 255);
  },
  'santa-beard': (setPixel, w, h) => {
    // Red hat
    for (let y = 10; y < 70; y++) {
      for (let x = 50 + Math.floor(y*1.2); x < 250 - Math.floor(y*1.2); x++) setPixel(x, y, 239, 68, 68, 255);
    }
    // White hat brim
    for (let x = 40; x < 260; x++) for (let y = 60; y < 85; y++) setPixel(x, y, 255, 255, 255, 255);
    // White beard
    for (let x = 50; x < 250; x++) for (let y = 130; y < 270; y++) setPixel(x, y, 248, 250, 252, 255);
    // Mouth cutout
    for (let x = 110; x < 190; x++) for (let y = 145; y < 175; y++) setPixel(x, y, 0, 0, 0, 0);
  },
  'dog-coquette': (setPixel, w, h) => {
    // Pink floppy ears
    for (let y = 20; y < 130; y++) {
      for (let x = 30; x < 90; x++) setPixel(x, y, 244, 114, 182, 255);
      for (let x = 210; x < 270; x++) setPixel(x, y, 244, 114, 182, 255);
    }
    // Pink heart nose
    for (let x = 130; x < 170; x++) for (let y = 140; y < 170; y++) setPixel(x, y, 255, 0, 127, 255);
    // Bows
    for (let x = 50; x < 80; x++) for (let y = 30; y < 50; y++) setPixel(x, y, 255, 85, 136, 255);
    for (let x = 220; x < 250; x++) for (let y = 30; y < 50; y++) setPixel(x, y, 255, 85, 136, 255);
  },
  'strawberry-hat': (setPixel, w, h) => {
    // Red strawberry body
    for (let x = 50; x < 250; x++) for (let y = 40; y < 160; y++) setPixel(x, y, 239, 68, 68, 255);
    // Green leaves
    for (let x = 110; x < 190; x++) for (let y = 10; y < 45; y++) setPixel(x, y, 34, 197, 94, 255);
    // Yellow seeds
    for (let i = 0; i < 6; i++) {
      const sx = 80 + (i % 3) * 60;
      const sy = 60 + Math.floor(i / 3) * 50;
      for (let dx = 0; dx < 10; dx++) for (let dy = 0; dy < 10; dy++) setPixel(sx + dx, sy + dy, 253, 224, 71, 255);
    }
  }
};

Object.entries(filterDrawings).forEach(([name, drawFn]) => {
  const pngBuffer = createRawPng(300, 300, drawFn);
  const filePath = path.join(filtersDir, `${name}.png`);
  fs.writeFileSync(filePath, pngBuffer);
  console.log(`Generated pure binary PNG asset: ${name}.png (${pngBuffer.length} bytes)`);
});
