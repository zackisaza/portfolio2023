import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs/promises';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const assetsDir = path.resolve(__dirname, '../src/assets');

const targets = [
  { name: 'wolfcavetext', input: 'wolfcavetext.png' },
  { name: 'wolfcave', input: 'wolfcave.png' },
];

async function ensureExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function convertToWebp(inputPath, outputPath) {
  await sharp(inputPath)
    .webp({ quality: 90, effort: 4 }) // high quality, reasonable effort
    .toFile(outputPath);
}

async function convertToAvif(inputPath, outputPath) {
  await sharp(inputPath)
    .avif({ quality: 85, effort: 4 })
    .toFile(outputPath);
}

async function main() {
  for (const t of targets) {
    const input = path.join(assetsDir, t.input);
    const webpOut = path.join(assetsDir, `${t.name}.webp`);
    const avifOut = path.join(assetsDir, `${t.name}.avif`);

    const exists = await ensureExists(input);
    if (!exists) {
      console.warn(`[skip] Missing input: ${input}`);
      continue;
    }

    // Create WebP if missing
    if (!(await ensureExists(webpOut))) {
      console.log(`[convert] ${t.input} -> ${path.basename(webpOut)}`);
      await convertToWebp(input, webpOut);
    } else {
      console.log(`[exists] ${path.basename(webpOut)}`);
    }

    // Create AVIF if missing (optional DOM usage)
    if (!(await ensureExists(avifOut))) {
      console.log(`[convert] ${t.input} -> ${path.basename(avifOut)}`);
      await convertToAvif(input, avifOut);
    } else {
      console.log(`[exists] ${path.basename(avifOut)}`);
    }
  }

  console.log('Done.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
