export type Color = [number, number, number];

export function saturation(color: Color): number {
  return Math.max(...color) - Math.min(...color);
}

export function distanceSquared(a: Color, b: Color): number {
  return (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2;
}
