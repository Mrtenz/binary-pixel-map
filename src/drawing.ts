import { PixelMap } from './pixel-map';
import * as font from './font';
import { Pixel, PixelStatus } from './pixel';

/**
 * Get character bytes from the font.
 * @param bytes
 */
const readBytes = (bytes: number[]): number[][] => {
  const bits: number[][] = [];

  for (const byte of bytes) {
    const array: number[] = [];

    for (let j = 0; j < 8; j++) {
      const bit = (byte >> j) & 1;
      array.push(bit);
    }
    bits.push(array);
  }

  return bits;
};

/**
 * Draw a character on the map.
 * @param map
 * @param x
 * @param y
 * @param bytes
 * @param size
 */
const drawCharacter = (map: PixelMap, x: number, y: number, bytes: number[][], size: number) => {
  let c: number = 0;

  for (let i = 0; i < bytes.length; i++) {
    for (let j = 0; j < 8; j++) {
      const status = (bytes[i][j] === 1 && Pixel.ON) || Pixel.OFF;
      if (size === 1) {
        const position = Math.floor(i / font.width) * 8;
        const targetX = x + c;
        const targetY = y + j + position;

        map.set(targetX, targetY, status);
      } else {
        const targetX = x + i * size;
        const targetY = y + j * size;
        rectangle(map, targetX, targetY, size, size, false, status);
      }
    }

    c = c < font.width - 1 ? (c += 1) : 0;
  }
};

/**
 * Draw a line using Bresenham's line algorithm.
 * @param map
 * @param x0
 * @param y0
 * @param x1
 * @param y1
 * @param status
 */
export const line = (
  map: PixelMap,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  status: PixelStatus = Pixel.ON
) => {
  const dx = Math.abs(x1 - x0);
  const sx = x0 < x1 ? 1 : -1;
  const dy = Math.abs(y1 - y0);
  const sy = y0 < y1 ? 1 : -1;
  let error = (dx > dy ? dx : -dy) / 2;

  while (true) {
    map.set(x0, y0, status);

    if (x0 === x1 && y0 === y1) {
      break;
    }

    const error2 = error;
    if (error2 > -dx) {
      error -= dy;
      x0 += sx;
    }

    if (error2 < dy) {
      error += dx;
      y0 += sy;
    }
  }
};

/**
 * Draw a rectangle.
 * @param map
 * @param x
 * @param y
 * @param width
 * @param height
 * @param outline
 * @param status
 */
export const rectangle = (
  map: PixelMap,
  x: number,
  y: number,
  width: number,
  height: number,
  outline: boolean = false,
  status: PixelStatus = Pixel.ON
) => {
  if (outline) {
    // Top
    line(map, x, y, x + width, y, status);
    // Left
    line(map, x, y + 1, x, y + height - 1, status);
    // Right
    line(map, x + width, y + 1, x + width, y + height - 1, status);
    // Bottom
    line(map, x, y + height - 1, x + width, y + height - 1, status);
  } else {
    for (let i = x; i < x + width; i++) {
      line(map, i, y, i, y + height - 1, status);
    }
  }
};

/**
 * Draw text.
 * @param map
 * @param x
 * @param y
 * @param content
 * @param size
 * @param spacing
 * @param wrap
 */
export const text = (
  map: PixelMap,
  x: number,
  y: number,
  content: string,
  size: number = 1,
  spacing: number = 2,
  wrap = true
) => {
  const words = content.split(' ');
  let offset = x;
  let cursorX = x;
  let cursorY = y;

  for (let wordIndex = 0; wordIndex < words.length; wordIndex++) {
    if (wordIndex + 1 > words.length) {
      words[wordIndex] += ' ';
    }

    const word = words[wordIndex].split('');
    const compare = font.width * size * word.length + size * (words.length - 1);

    if (wrap && words.length > 1 && offset >= map.width - compare) {
      offset = 1;

      cursorX = offset;
      cursorY += font.height * size + size + spacing;
    }

    for (const character of word) {
      const characterBytes = font.lookup(character);
      if (characterBytes) {
        const bytes = readBytes(characterBytes);
        drawCharacter(map, cursorX, cursorY, bytes, size);

        const padding = character === ' ' ? 0 : size + spacing;
        offset += font.width * size + padding;

        if (wrap && words.length > 1 && offset >= map.width - compare) {
          offset = 1;
          cursorY += font.height * size + size + spacing;
        }

        cursorX = offset;
      }
    }
  }
};
