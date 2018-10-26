import * as sharp from 'sharp';
import { PixelMap } from './pixel-map';

/**
 * Read a raw image buffer (RGB) and convert it to a binary pixel map array.
 * @param buffer
 * @param width
 * @param height
 */
const readBuffer = (buffer: Buffer, width: number, height: number): number[][] => {
  const array: number[][] = [];

  for (let y = 0; y < height; y++) {
    const row: number[] = [];
    const yPos = y * width * 3;
    for (let x = 0; x < width; x++) {
      const position = yPos + x * 3;

      // Checks if the pixel is not white (0xff)
      row.push(
        +(buffer[position] < 0xff || buffer[position + 1] < 0xff || buffer[position + 2] < 0xff)
      );
    }
    array.push(row);
  }

  return array;
};

/**
 * Load an image from the specified path or buffer and parse it to a pixel map.
 * @param path
 * @param maxWidth
 * @param maxHeight
 */
export const loadImage = async (
  path: string | Buffer,
  maxWidth: number,
  maxHeight: number
): Promise<PixelMap> => {
  const image = sharp(path);
  const metadata = await image.metadata();

  const width = metadata.width && metadata.width > maxWidth ? maxWidth : metadata.width || maxWidth;
  const height =
    metadata.height && metadata.height > maxHeight ? maxHeight : metadata.height || maxHeight;

  // Process image
  await image.resize(width, height);
  await image.removeAlpha();
  await image.raw();

  // Parse the image to a RGB buffer and map to pixel array
  const buffer = await image.toBuffer();
  const pixels: number[][] = readBuffer(buffer, width, height);

  // Copy the pixel array onto a new map
  const map = new PixelMap(width, height);
  pixels.forEach((row, x) => {
    row.forEach((pixel, y) => {
      map.set(x, y, !!pixel);
    });
  });

  return map;
};
