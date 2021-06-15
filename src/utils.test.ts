import { clamp } from './util';

describe('clamp', () => {
  test.each([
    [NaN, NaN],
    [-Infinity, 0],
    [Infinity, 1],
    [-1, 0],
    [-0.5, 0],
    [0, 0],
    [0.5, 0.5],
    [1.0, 1.0],
    [1.5, 1.0],
  ])('clamp(%p) = %p', (input, expected) => {
    expect(clamp(input, 0, 1)).toEqual(expected);
  });
});
