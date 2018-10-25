export type PixelStatus = boolean;

export const Pixel: { [key in 'ON' | 'OFF']: PixelStatus } = {
  ON: true,
  OFF: false
};
