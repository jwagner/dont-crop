import { clusterHistogram } from './clusterHistogram';
import { getLabTestData } from './test-helpers';

describe('clusterHistogram', () => {
  test('handles an empty input', () => {
    const actual = clusterHistogram(new Float64Array(0), 6, 1);
    expect(actual).toHaveLength(0);
  });
  test('handles a single input', () => {
    const expected = {
      x: 32,
      y: -16,
      z: 64,
      count: 1,
    };
    const pixels = new Float64Array([expected.x, expected.y, expected.z]);
    const actual = clusterHistogram(pixels, 6, 1);
    expect(actual).toEqual([expected]);
  });
  test('matches snapshot', async () => {
    const pixels = await getLabTestData();
    const actual = clusterHistogram(pixels, 6, 4);
    expect(actual).toMatchSnapshot();
  });
});
