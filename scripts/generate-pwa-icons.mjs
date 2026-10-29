import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

function crc32(buf) {
  let table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table[i] = c;
  }
  let crc = 0 ^ (-1);
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xff];
  }
  return (crc ^ (-1)) >>> 0;
}

function makeChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const body = Buffer.concat([typeBuf, data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body), 0);
  return Buffer.concat([len, body, crc]);
}

function createPng(width, height, isMaskable = false) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // 8-bit depth
  ihdrData[9] = 6; // color type 6: RGBA
  ihdrData[10] = 0; // compression
  ihdrData[11] = 0; // filter
  ihdrData[12] = 0; // interlace
  const ihdr = makeChunk('IHDR', ihdrData);

  // Raw scanlines with filter byte 0
  const scanlineSize = 1 + width * 4;
  const rawData = Buffer.alloc(scanlineSize * height);

  const cx = width / 2;
  const cy = height / 2;
  const rOuter = width * 0.45;
  const rInner = width * 0.35;

  for (let y = 0; y < height; y++) {
    const rowOffset = y * scanlineSize;
    rawData[rowOffset] = 0; // filter type None
    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 4;
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Navy background: #0a1422
      let r = 10, g = 20, b = 34, a = 255;

      if (!isMaskable && dist > rOuter) {
        // Transparent corner if not maskable
        if (x < width * 0.1 || x > width * 0.9 || y < height * 0.1 || y > height * 0.9) {
          // rounded square
          const cornerDist = Math.max(Math.abs(dx) - (width * 0.4), 0) ** 2 + Math.max(Math.abs(dy) - (height * 0.4), 0) ** 2;
          if (cornerDist > (width * 0.1) ** 2) {
            a = 0;
          }
        }
      }

      // Draw stylized hexagonal / circular ring in accent cyan/blue
      if (dist >= rInner - 8 && dist <= rInner + 8) {
        r = 79; g = 140; b = 255; a = 255; // #4F8CFF
      } else if (dist <= rInner - 8 && dist >= rInner * 0.5) {
        r = 22; g = 32; b = 47; a = 255; // card #16202f
      } else if (dist < rInner * 0.5) {
        // center node
        if (dist < width * 0.08) {
          r = 78; g = 222; b = 163; a = 255; // #4edea3
        } else {
          r = 0; g = 218; b = 243; a = 255; // #00daf3
        }
      }

      rawData[pxOffset] = r;
      rawData[pxOffset + 1] = g;
      rawData[pxOffset + 2] = b;
      rawData[pxOffset + 3] = a;
    }
  }

  const compressed = zlib.deflateSync(rawData);
  const idat = makeChunk('IDAT', compressed);
  const iend = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdr, idat, iend]);
}

const outDir = path.resolve('public');
fs.writeFileSync(path.join(outDir, 'pwa-192x192.png'), createPng(192, 192));
fs.writeFileSync(path.join(outDir, 'pwa-512x512.png'), createPng(512, 512));
fs.writeFileSync(path.join(outDir, 'apple-touch-icon.png'), createPng(180, 180));
fs.writeFileSync(path.join(outDir, 'pwa-maskable-512x512.png'), createPng(512, 512, true));

console.log('Successfully generated compliant PNG PWA icons in /public!');
