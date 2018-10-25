# binary-pixel-map

A library written in TypeScript for creating and editing a binary 2D pixel map, made for usage with small monochrome displays, for example on a Raspberry Pi or Arduino.

This library is based on [`oled-js`](https://github.com/noopkat/oled-js) and [`oled-font-5x7`](https://github.com/noopkat/oled-font-5x7) by noopkat.

## Installation

```
yarn add binary-pixel-map
```

## Usage

```typescript
import { PixelMap, Pixel } from 'binary-pixel-map';

// Create a new pixel map with a width of 54, height of 18.
const map = new PixelMap(54, 18);

// Draw "Hello, world!" on the map.
map.text(1, 1, 'Hello,');
map.text(1, 10, 'world!');

// Enable the top left and bottom right pixel.
map.set(0, 0, Pixel.ON);
map.set(53, 17, Pixel.ON);

console.log(map.toString());
```

The example above will output the following:

```
PixelMap { x - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
           - x - - - x - - - - - - - - - - - - x x - - - - - - x x - - - - - - - - - - - - - - - - - - - - - - - - - -
           - x - - - x - - - - - - - - - - - - - x - - - - - - - x - - - - - - - - - - - - - - - - - - - - - - - - - -
           - x - - - x - - - - x x x - - - - - - x - - - - - - - x - - - - - - x x x - - - - - - - - - - - - - - - - -
           - x x x x x - - - x - - - x - - - - - x - - - - - - - x - - - - - x - - - x - - - - - - - - - - - - - - - -
           - x - - - x - - - x x x x x - - - - - x - - - - - - - x - - - - - x - - - x - - - - x x - - - - - - - - - -
           - x - - - x - - - x - - - - - - - - - x - - - - - - - x - - - - - x - - - x - - - - - x - - - - - - - - - -
           - x - - - x - - - - x x x - - - - - x x x - - - - - x x x - - - - - x x x - - - - - x - - - - - - - - - - -
           - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
           - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
           - - - - - - - - - - - - - - - - - - - - - - - - - - x x - - - - - - - - - x - - - - - x - - - - - - - - - -
           - - - - - - - - - - - - - - - - - - - - - - - - - - - x - - - - - - - - - x - - - - - x - - - - - - - - - -
           - x - - - x - - - - x x x - - - - x - x x - - - - - - x - - - - - - x x - x - - - - - x - - - - - - - - - -
           - x - - - x - - - x - - - x - - - x x - - x - - - - - x - - - - - x - - x x - - - - - x - - - - - - - - - -
           - x - x - x - - - x - - - x - - - x - - - - - - - - - x - - - - - x - - - x - - - - - x - - - - - - - - - -
           - x - x - x - - - x - - - x - - - x - - - - - - - - - x - - - - - x - - - x - - - - - - - - - - - - - - - -
           - - x - x - - - - - x x x - - - - x - - - - - - - - x x x - - - - - x x x x - - - - - x - - - - - - - - - -
           - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - x }
```

## API

### PixelMap

```typescript
new PixelMap(width: number, height: number);
```

#### get

```typescript
get(x: number, y: number): PixelStatus;
```

Get the value of the pixel at [x, y].

#### set

```typescript
set(x: number, y: number, status: PixelStatus): void;
```

Set the value of the pixel at [x, y];

#### clear

```typescript
clear(): void;
```

Clear the whole map.

#### fill

```typescript
fill(status: PixelStatus): void;
```

Fill the map with enabled (ON) or disabled (OFF) pixels.

#### line

```typescript
line(x0: number, y0: number, x1: number, y1: number, status: PixelStatus = Pixel.ON): void;
```

Draw a line from [x0, y0] to [x1, y1] using Bresenham's line algorithm.

#### rectangle

```typescript
rectangle(x: number, y: number, width: number, height: number, outline: boolean = false, status: PixelStatus = Pixel.ON): void;
```

Draw a rectangle at [x, y] with the size [width, height]. If `outline` is set to true, only an outline will be drawn. Otherwise the rectangle will be filled.

#### text

```typescript
text(x: number, y: number, content: string, size: number = 1, spacing: number = 2, wrap: boolean = true): void;
```

Draw text at [x, y] with size `size`. The standard size (`size = 1`) for letters is 5 x 7.

#### toArray

```typescript
toArray(): PixelStatus[];
```

Get the map as sequence of all rows. Can be useful for displaying the map on a display.

#### toString

```typescript
toString(): string;
```

Get the map as string. Can be useful for debugging.

### Pixel

```typescript
import { Pixel } from 'binary-pixel-map';
```

#### PixelStatus

```typescript
type PixelStatus = boolean;
```

Used as alternative to booleans. You can still use regular booleans if you prefer.

#### Pixel.ON

Alternative way of writing `true`.

#### Pixel.OFF

Alternative way of writing `false`.
