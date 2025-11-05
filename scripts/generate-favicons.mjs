import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import fs from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const publicDir = resolve(__dirname, '../public');
// Use Wolfcave brand mark from src/assets as the favicon source
const srcImage = resolve(__dirname, '../src/assets/wolfcave.webp');

const outputs = [
  { file: 'favicon-32.png', size: 32 },
  { file: 'favicon-48.png', size: 48 },
  { file: 'apple-touch-icon.png', size: 180 },
];

async function ensureSourceExists() {
  try {
    await fs.access(srcImage);
  } catch {
    throw new Error(`Source image not found at ${srcImage}`);
  }
}

async function generate() {
  await ensureSourceExists();
  for (const { file, size } of outputs) {
    const dest = resolve(publicDir, file);
    await sharp(srcImage)
      .resize(size, size, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
      .png({ compressionLevel: 9 })
      .toFile(dest);
    console.log(`Generated ${file} (${size}x${size})`);
  }
}

generate().catch((err) => {
  console.error(err);
  process.exit(1);
});
