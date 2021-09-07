import { Color } from './color';

export function hexString(n: number) {
  return Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, '0');
}

export function hexColorString(color: Color) {
  return `#${color.map(hexString).join('')}`;
}

export function linearGradient(stops: string[]) {
  return `linear-gradient(${stops.join(',')})`;
}
