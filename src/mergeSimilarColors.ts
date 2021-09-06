import { Color, saturation } from './color';

const scoreBias = 0.1;

interface ColorDistance {
  ai: number,
  bi: number,
  distance: number
}
export function mergeSimilarColors(colors: Color[], keep: number): Color[] {
  const intensities = colors.map(intensity);
  const distances: ColorDistance[] = [];
  for (let ai = 0; ai < colors.length; ai++) {
    const a = colors[ai];
    for (let bi = ai + 1; bi < colors.length; bi++) {
      const b = colors[bi];
      distances.push({
        ai,
        bi,
        distance: distanceSquared(a, b),
      });
    }
  }
  distances.sort((a, b) => b.distance - a.distance);
  const remainingColors: (Color | undefined)[] = colors;
  for (let removed = 0; removed < (colors.length - keep);) {
    const next = distances.pop();
    if (!next) break; // should not be possible unless keep is negative
    const { ai, bi } = next;
    if (!remainingColors[ai] || !remainingColors[bi]) continue;
    const remove = intensities[ai] + scoreBias > intensities[bi] ? bi : ai;
    remainingColors[remove] = undefined;
    removed++;
  }
  return remainingColors.filter((c) => !!c) as Color[];
}

function intensity(color: Color) {
  const brightness = (color[0] + color[1] + color[2]) / 255 / 3;
  const distanceFromGray = Math.abs(brightness - 0.21);
  return (
    saturation(color) / 255) * Math.max(0.2, brightness) * 5 * 0.8 + (0.2 * distanceFromGray);
}

const squared = (x: number) => x * x;
function distanceSquared(a: Color, b: Color): number {
  return a.reduce((sum, ai, i) => sum + squared(ai - b[i]), 0);
}
