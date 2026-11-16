// Storm Eagle — AI Excited entry runner (ai-excited-01, v2).
//
// Copies the finished artwork (entry.png, sitting next to this file)
// into the output directory the platform provides, after checking that
// the artwork is a real PNG inside the competition limits.
//
// Usage:
//   MAKEFUN_OUTPUT_DIR=/path/to/out node main.ts
//
// When MAKEFUN_OUTPUT_DIR is not set, /output is used.

import { copyFileSync, existsSync, mkdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const MAX_FILE_BYTES = 1_048_576;
const MAX_DIMENSION = 1024;
const ARTWORK_NAME = "entry.png";

const here = dirname(fileURLToPath(import.meta.url));
const sourcePath = join(here, ARTWORK_NAME);

function fail(message) {
  throw new Error(`Storm Eagle: ${message}`);
}

function readPngDimensions(bytes) {
  // A PNG starts with an 8-byte signature, then a 25-byte IHDR chunk:
  // 4 bytes length, 4 bytes "IHDR", 4 bytes width, 4 bytes height.
  if (bytes.length < 33) {
    fail(`file is only ${bytes.length} bytes, too short to hold a PNG header`);
  }
  if (!bytes.subarray(0, 8).equals(PNG_SIGNATURE)) {
    fail("magic bytes do not match the PNG signature 89 50 4E 47 0D 0A 1A 0A");
  }
  if (bytes.toString("ascii", 12, 16) !== "IHDR") {
    fail("first chunk is not IHDR, so this is not a well-formed PNG");
  }
  const width = bytes.readUInt32BE(16);
  const height = bytes.readUInt32BE(20);
  if (width === 0 || height === 0) {
    fail(`IHDR reports a zero dimension (${width}x${height}), not a usable image`);
  }
  return { width, height };
}

function main() {
  if (!existsSync(sourcePath)) {
    fail(`could not find ${ARTWORK_NAME} next to main.ts (${sourcePath})`);
  }

  const bytes = readFileSync(sourcePath);
  const { width, height } = readPngDimensions(bytes);

  if (bytes.length > MAX_FILE_BYTES) {
    fail(
      `${ARTWORK_NAME} is ${bytes.length} bytes, over the ${MAX_FILE_BYTES} byte limit`,
    );
  }
  if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
    fail(
      `${ARTWORK_NAME} is ${width}x${height}, larger than the ${MAX_DIMENSION}x${MAX_DIMENSION} limit`,
    );
  }

  const outDir = resolve(process.env.MAKEFUN_OUTPUT_DIR ?? "/output");
  mkdirSync(outDir, { recursive: true });
  const targetPath = join(outDir, ARTWORK_NAME);
  copyFileSync(sourcePath, targetPath);

  const copied = statSync(targetPath);
  if (copied.size !== bytes.length) {
    fail(`copied file is ${copied.size} bytes, expected ${bytes.length}`);
  }

  console.log(`Storm Eagle: copied ${ARTWORK_NAME} (${width}x${height}, ${bytes.length} bytes) to ${targetPath}`);
}

main();
