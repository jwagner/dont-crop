import mcgRandom from './mcgRandom';

describe('mcgRandom', () => {
  it('returns random values between 0 and 1', () => {
    const values = [];
    const subject = mcgRandom();
    let sum = 0;
    for (let i = 0; i < 100; i++) {
      const x = subject();
      sum += x;
      expect(x).toBeLessThanOrEqual(1);
      expect(x).toBeGreaterThanOrEqual(0);
      values.push(x);
    }
    // mean should be close to 0.5
    expect(sum / values.length).toBeCloseTo(0.5, 1);
    // values should be aperiodic (within the small sample)
    expect(new Set(values).size).toEqual(values.length);
  });
});
