import {
  HSVToRGB,
  Color,
  RGBToHSV,
  colorToLinear,
  colorToGamma,
  HSVColorConstraint,
  constrainColor,
  scalarToLinear,
  scalarToGamma,
} from './color';

const casesRgbHsv: [Color, Color][] = [
  [[0, 0, 0], [0, 0, 0]],
  [[0.5, 0.5, 0.5], [0, 0, 0.5]],
  [[1, 1, 1], [0, 0, 1]],
  [[1, 0, 0], [0, 1, 1]],
  [[0.5, 0, 0], [0, 1, 0.5]],
  [[1, 0.5, 0.5], [0, 0.5, 1]],
  [[1, 1, 0], [60, 1, 1]],
  [[0.5, 0.5, 0], [60, 1, 0.5]],
  [[1, 1, 0.5], [60, 0.5, 1]],
  [[0, 1, 0], [120, 1, 1]],
  [[0, 0.5, 0], [120, 1, 0.5]],
  [[0.5, 1, 0.5], [120, 0.5, 1]],
  [[0, 1, 1], [180, 1, 1]],
  [[0, 0.5, 0.5], [180, 1, 0.5]],
  [[0.5, 1, 1], [180, 0.5, 1]],
  [[0, 0, 1], [240, 1, 1]],
  [[0, 0, 0.5], [240, 1, 0.5]],
  [[0.5, 0.5, 1], [240, 0.5, 1]],
  [[1, 0, 1], [300, 1, 1]],
  [[0.5, 0, 0.5], [300, 1, 0.5]],
  [[1, 0.5, 1], [300, 0.5, 1]],
];

describe('HSVtoRGB', () => {
  test.each(casesRgbHsv)('(%p, %p)', (rgb, hsv) => {
    const actual = HSVToRGB(hsv);
    expect(actual).toEqual(rgb);
  });
});

describe('RGBtoHSV', () => {
  test.each(casesRgbHsv)('(%p, %p)', (rgb, hsv) => {
    expect(RGBToHSV(rgb)).toEqual(hsv);
  });
});

const casesLinearGamma: [number, number][] = [
  [0, 0],
  [1, 255],
  [0.215764399609395, 127],
];

describe('scalarToLinear', () => {
  test.each(casesLinearGamma)('%p, %p', (linear, gamma) => {
    expect(scalarToLinear(gamma)).toEqual(linear);
  });
});

describe('scalarToGamma', () => {
  test.each(casesLinearGamma)('%p, %p', (linear, gamma) => {
    expect(scalarToGamma(linear)).toEqual(gamma);
  });
});

describe('colorToLinear', () => {
  test.each(casesLinearGamma)('%p, %p', (linear, gamma) => {
    expect(colorToLinear([gamma, gamma, gamma])).toEqual([linear, linear, linear]);
  });
});

describe('colorToGamma', () => {
  test.each(casesLinearGamma)('%p, %p', (linear, gamma) => {
    expect(colorToGamma([linear, linear, linear])).toEqual([gamma, gamma, gamma]);
  });
});

describe('constrainColor', () => {
  test.each<[Color, HSVColorConstraint, Color]>([
    [[255, 0, 0], {}, [255, 0, 0]],
    [[255, 0, 0], { maxSaturation: 0.5 }, [255, 186, 186]],
    [[255, 0, 0], { maxSaturation: 0.5, maxValue: 0.5 }, [186, 136, 136]],
    [[100, 0, 0], { minValue: 0.5 }, [186, 0, 0]],
  ])('%p', (input, constraint, output) => {
    const actual = constrainColor(constraint, input).map(Math.round);
    expect(actual).toEqual(output);
  });
});