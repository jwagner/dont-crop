import { Color, distanceSquared } from './color';

export function keepUniqueColors(colors: Color[], keep: number): Color[] {
  const distancesSummed = colors.map((c) => ({
    sum: colors.reduce((a, b) => a + distanceSquared(b, c), 0),
    c,
  }));
  return distancesSummed.sort((a, b) => b.sum - a.sum).map((e) => e.c).slice(0, keep);
}
