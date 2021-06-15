import { linearRegression, mean } from './linearRegression';

describe('mean', () => {
  it('returns the mean', () => {
    const a = [2, 4, 6, 8];
    expect(mean(a)).toEqual(5);
  });
});

describe('linearRegression', () => {
  it('returns slope and intercept', () => {
    const a = 0.1;
    const b = 0.33;
    const x = [];
    const y = [];
    for (let i = 0; i < 10; i++) {
      x.push(i);
      y.push(a + b * i);
    }
    const result = linearRegression(x, y);
    expect(result.intercept).toBeCloseTo(a);
    expect(result.slope).toBeCloseTo(b);
    expect(result.rSquared).toBeCloseTo(1);
  });
});
