import { Color, saturation } from './color';

const scoreBias = 0.1 * 255;

interface ColorDistance {
  ai: number,
  bi: number,
  distance: number
}
export function mergeSimilarColors(colors: Color[], keep: number): Color[] {
  const intensities = colors.map(saturation);
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

function distanceSquared(a: Color, b: Color): number {
  return a.reduce((sum, ai, i) => sum + (ai - b[i]) ** 2, 0);
}
