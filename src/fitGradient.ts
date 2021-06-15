import { Color /* scalarToGamma, scalarToLinear */ } from './color';
import { linearRegression, Regression } from './linearRegression';
import { clamp } from './util';

// this function operates on the color values without gamma correction
// the reason for this is that css linear gradients interpolate
// the values without gamma correction as well so for now we'll just match it.
// In the future it might be worth interpolating the linear values and outputting
// a few more stops to approximate linear interpolation.
export function fitGradient(image: ImageData): [Color, Color] {
  const w = image.width;
  const h = image.height;
  const d = image.data;
  const colors: [number[], number[], number[]] = [[], [], []];
  const y: number[] = [];
  for (let iy = 0; iy < h; iy++) {
    for (let ix = 0; ix < w; ix++) {
      const i = (iy * w + ix) * 4;
      // sadly this is a reasonable bit quicker in it's unrolled form
      colors[0].push((d[i]));
      colors[1].push((d[i + 1]));
      colors[2].push((d[i + 2]));
      y.push(iy / h);
    }
  }
  const regression: ColorRegression = [
    linearRegression(y, colors[0]),
    linearRegression(y, colors[1]),
    linearRegression(y, colors[2]),
  ];
  const start = sampleColor(regression, 0);
  const end = sampleColor(regression, 1);
  return [start, end];
}

function sampleColor(regression: ColorRegression, t: number): Color {
  return regression
    .map((r) => (clamp(r.intercept + r.slope * t, 0, 255)) | 0) as Color;
}

type ColorRegression = [Regression, Regression, Regression];
