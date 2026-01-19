/**
 * Image Optimization Script for Cigna Dumpsters Website
 *
 * This script:
 * 1. Converts PNG images to WebP format
 * 2. Compresses JPG images
 * 3. Creates optimized versions for web use
 *
 * Run with: node scripts/optimize-images.mjs
 */

import sharp from 'sharp';
import { readdir, mkdir, stat } from 'fs/promises';
import { join, parse, extname } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT_DIR = join(__dirname, '..');
const PUBLIC_DIR = join(ROOT_DIR, 'public');
const IMAGES_DIR = join(PUBLIC_DIR, 'images');

// Configuration
const CONFIG = {
  // WebP quality (0-100)
  webpQuality: 80,
  // JPEG quality (0-100)
  jpegQuality: 80,
  // PNG compression level (0-9)
  pngCompressionLevel: 9,
  // Max width for gallery images
  galleryMaxWidth: 800,
  // Max width for dumpster images
  dumpsterMaxWidth: 600,
  // Max width for hero images
  heroMaxWidth: 1920,
  // Max width for logo
  logoMaxWidth: 400,
};

async function getFileSizeKB(filePath) {
  const stats = await stat(filePath);
  return Math.round(stats.size / 1024);
}

async function optimizeImage(inputPath, outputDir) {
  const parsed = parse(inputPath);
  const ext = extname(inputPath).toLowerCase();
  const baseName = parsed.name;

  // Determine max width based on folder
  let maxWidth = 1200;
  if (inputPath.includes('gallery')) maxWidth = CONFIG.galleryMaxWidth;
  if (inputPath.includes('dumpster')) maxWidth = CONFIG.dumpsterMaxWidth;
  if (inputPath.includes('hero')) maxWidth = CONFIG.heroMaxWidth;
  if (inputPath.includes('logo')) maxWidth = CONFIG.logoMaxWidth;

  const originalSize = await getFileSizeKB(inputPath);

  try {
    const image = sharp(inputPath);
    const metadata = await image.metadata();

    // Resize if larger than max width
    const resizeOptions = metadata.width > maxWidth
      ? { width: maxWidth, withoutEnlargement: true }
      : {};

    if (ext === '.png') {
      // Convert PNG to WebP
      const webpPath = join(outputDir, `${baseName}.webp`);
      await image
        .resize(resizeOptions)
        .webp({ quality: CONFIG.webpQuality })
        .toFile(webpPath);

      const newSize = await getFileSizeKB(webpPath);
      console.log(`✓ ${baseName}.png → ${baseName}.webp (${originalSize}KB → ${newSize}KB, -${Math.round((1 - newSize/originalSize) * 100)}%)`);

      // Also create optimized PNG as fallback
      const pngPath = join(outputDir, `${baseName}.png`);
      await sharp(inputPath)
        .resize(resizeOptions)
        .png({ compressionLevel: CONFIG.pngCompressionLevel })
        .toFile(pngPath);

    } else if (ext === '.jpg' || ext === '.jpeg') {
      // Optimize JPEG
      const jpgPath = join(outputDir, `${baseName}.jpg`);
      await image
        .resize(resizeOptions)
        .jpeg({ quality: CONFIG.jpegQuality, mozjpeg: true })
        .toFile(jpgPath);

      const newSize = await getFileSizeKB(jpgPath);
      console.log(`✓ ${baseName}${ext} (${originalSize}KB → ${newSize}KB, -${Math.round((1 - newSize/originalSize) * 100)}%)`);

      // Also create WebP version
      const webpPath = join(outputDir, `${baseName}.webp`);
      await sharp(inputPath)
        .resize(resizeOptions)
        .webp({ quality: CONFIG.webpQuality })
        .toFile(webpPath);
    }
  } catch (error) {
    console.error(`✗ Error processing ${inputPath}:`, error.message);
  }
}

async function processDirectory(dirPath, outputDir) {
  try {
    await mkdir(outputDir, { recursive: true });

    const items = await readdir(dirPath, { withFileTypes: true });

    for (const item of items) {
      const itemPath = join(dirPath, item.name);
      const itemOutputDir = join(outputDir, item.name);

      if (item.isDirectory()) {
        await processDirectory(itemPath, itemOutputDir);
      } else if (item.isFile()) {
        const ext = extname(item.name).toLowerCase();
        if (['.png', '.jpg', '.jpeg'].includes(ext)) {
          await optimizeImage(itemPath, outputDir);
        }
      }
    }
  } catch (error) {
    console.error(`Error processing directory ${dirPath}:`, error.message);
  }
}

async function main() {
  console.log('🖼️  Starting image optimization...\n');

  const outputDir = join(PUBLIC_DIR, 'images-optimized');

  console.log(`Input: ${IMAGES_DIR}`);
  console.log(`Output: ${outputDir}\n`);

  await processDirectory(IMAGES_DIR, outputDir);

  console.log('\n✅ Image optimization complete!');
  console.log('\nNext steps:');
  console.log('1. Review the optimized images in public/images-optimized/');
  console.log('2. If satisfied, backup original images and replace with optimized versions');
  console.log('3. Update image references in code to use .webp where supported');
}

main().catch(console.error);
