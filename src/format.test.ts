import { Color } from './color';
import { hexColorString, hexString, linearGradient } from './format';

describe('hexString', () => {
  test.each([
    [-1, '00'],
    [0, '00'],
    [0.4, '00'],
    [0.5, '01'],
    [254.4, 'fe'],
    [254.5, 'ff'],
    [255, 'ff'],
    [256, 'ff'],
  ])('%p  %p', (input, expected) => {
    const actual = hexString(input);
    expect(actual).toEqual(expected);
  });
});

describe('hexColorString', () => {
  test.each([
    [[0, 0, 0], '#000000'],
    [[-1, -100, -Infinity], '#000000'],
    [[1, 0, 255], '#0100ff'],
    [[255, 0, 255], '#ff00ff'],
    [[Infinity, 0, 256], '#ff00ff'],
    [[NaN, 0, 0], '#NaN0000'],
  ])('%p %p', (c, s) => {
    expect(hexColorString(c as Color)).toEqual(s);
  });
});

test('linear-gradient', () => {
  expect(linearGradient(['a', 'b'])).toEqual('linear-gradient(a,b)');
});
