export type Color = [number, number, number];

export function saturation(color: Color): number {
  return Math.max(...color) - Math.min(...color);
}

export function distanceSquared(a: Color, b: Color): number {
  return (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2;
}

export interface HSVColorConstraint {
  // minSaturation would be nonsensical for grayscale images
  maxSaturation?: number;
  minValue?: number;
  maxValue?: number;
}

const gamma = 2.2;

export const scalarToGamma = (x: number) => Math.max(0, x) ** (1 / gamma) * 255;
export const scalarToLinear = (x: number) => (Math.max(0, x / 255) ** gamma);

export function colorToLinear(color: Color): Color {
  return color.map(scalarToLinear) as Color;
}

export function colorToGamma(color: Color): Color {
  return color.map(scalarToGamma) as Color;
}

export function constrainColor(constraint: HSVColorConstraint, color: Color): Color {
  const linear = colorToLinear(color);
  const hsv = RGBToHSV(linear);
  hsv[SATURATION] = Math.min(hsv[SATURATION], constraint.maxSaturation ?? 1.0);
  hsv[VALUE] = Math.min(constraint.maxValue ?? 1, Math.max(constraint.minValue ?? 0, hsv[VALUE]));
  return colorToGamma(HSVToRGB(hsv));
}

// via https://en.wikipedia.org/wiki/HSL_and_HSV#Color_conversion_formulae
const epsilon = 1e-6;
const RED = 0;
const GREEN = 1;
const BLUE = 2;
// const HUE = 0;
const SATURATION = 1;
const VALUE = 2;

export function RGBToHSV(color: Color): Color {
  const max = Math.max(...color);
  const min = Math.min(...color);
  const delta = max - min;
  // achromatic
  if (delta < epsilon || max < epsilon) {
    return [0, 0, max];
  }
  const hue0 = (
    max === color[RED] ? (color[GREEN] - color[BLUE]) / delta
      : max === color[GREEN] ? (color[BLUE] - color[RED]) / delta + 2
        : (color[RED] - color[GREEN]) / delta + 4
  ) * 60;

  const hue = hue0 < 0 ? hue0 + 360 : hue0;

  const value = max;

  const saturation = delta / value;

  return [hue, saturation, value];
}

export function HSVToRGB(color: Color): Color {
  const [hue, saturation, value] = color;
  const chroma = value * saturation;
  const h = (hue / 60) % 6;
  const x = chroma * (1 - Math.abs((h % 2) - 1));
  const m = value - chroma;
  switch (true) {
    case h <= 1:
      return [chroma + m, x + m, m];
    case h <= 2:
      return [x + m, chroma + m, m];
    case h <= 3:
      return [m, chroma + m, x + m];
    case h <= 4:
      return [m, x + m, chroma + m];
    case h <= 5:
      return [x + m, m, chroma + m];
    case h <= 6:
      return [chroma + m, m, x + m];
    default: // make typescript and eslint happy
      return [0, 0, 0];
  }
}