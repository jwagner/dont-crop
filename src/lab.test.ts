import {
  ColorLab, ColorRGB, labToSrgb, srgbToLab,
} from './lab';

// generated with https://colormine.org/color-converter
const casesLabSrgb: [ColorRGB, ColorLab][] = [
  [{ r: 0, g: 0, b: 0 }, { l: 0, a: 0, b: 0 }],
  [{ r: 1, g: 1, b: 1 }, { l: 100, a: -0.001, b: -0.009 }],
  [{ r: 1, g: 0, b: 0 }, { l: 53.232, a: 80.109, b: 67.220 }],
  [{ r: 0, g: 1, b: 0 }, { l: 87.737, a: -86.184, b: 83.181 }],
  [{ r: 0, g: 0, b: 1 }, { l: 32.302, a: 79.196, b: -107.863 }],
  [{ r: 0.25, g: 0.25, b: 0.25 }, { l: 26.982, a: 0.002, b: -0.004 }],
  [{ r: 0.25, g: 0.5, b: 0.125 }, { l: 47.615, a: -38.074, b: 43.121 }],
];

describe('srgbToLab', () => {
  test.each(casesLabSrgb)('(%p, %p)', (srgb, lab) => {
    const actual = srgbToLab(srgb);
    expect(actual.l).toBeCloseTo(lab.l);
    expect(actual.a).toBeCloseTo(lab.a);
    expect(actual.b).toBeCloseTo(lab.b);
  });
});

describe('labToSrgb', () => {
  test.each(casesLabSrgb)('(%p, %p)', (srgb, lab) => {
    const actual = labToSrgb(lab);
    expect(actual.r).toBeCloseTo(srgb.r);
    expect(actual.g).toBeCloseTo(srgb.g);
    expect(actual.b).toBeCloseTo(srgb.b);
  });
});
