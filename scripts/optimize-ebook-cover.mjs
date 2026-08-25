// Builds the GPU-friendly copy of the ebook cover used as the 3D texture.
// Run with: node scripts/optimize-ebook-cover.mjs
import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const SOURCE = path.join(process.cwd(), 'public/lead-magnet/portada-ebook.png')
const TARGET = path.join(process.cwd(), 'public/lead-magnet/portada-ebook-texture.webp')
const MAX_WIDTH = 1024

const input = await readFile(SOURCE)
const meta = await sharp(input).metadata()

const output = await sharp(input)
  .resize({ width: Math.min(MAX_WIDTH, meta.width), withoutEnlargement: true })
  .webp({ quality: 90, effort: 6 })
  .toBuffer()

await writeFile(TARGET, output)

const resized = await sharp(output).metadata()
console.log(
  `${meta.width}x${meta.height} ${(input.length / 1024).toFixed(0)}KB -> ` +
    `${resized.width}x${resized.height} ${(output.length / 1024).toFixed(0)}KB`,
)
