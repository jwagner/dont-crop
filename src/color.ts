export type Color = [number, number, number];

export function saturation(color: Color): number {
  return Math.max(...color) - Math.min(...color);
}
