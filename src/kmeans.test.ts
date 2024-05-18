import { kmeans } from './kmeans';
import { getLabTestData } from './test-helpers';

describe('kmeans', () => {
  const colors = [
    { x: 50, y: -32, z: 0 },
    { x: 60, y: -25, z: 2 },
    { x: 0, y: 0, z: 0 },
    { x: 100, y: 0, z: 0 },
  ];
  const components = ['x', 'y', 'z'] as const;
  const perColor = 4;
  const nPixels = colors.length * perColor;
  const pixels = new Float64Array(nPixels * components.length).map((_, i) => {
    const color = colors[((i / nPixels / components.length) * colors.length) | 0];
    const component = components[i % (components.length)];
    return color[component];
  });
  test('perfect initial clusters', () => {
    const clusters = kmeans(pixels, colors, 8);
    colors.forEach((color, i) => {
      expect(clusters[i].count).toEqual(perColor);
      expect(clusters[i].x).toBeCloseTo(color.x);
      expect(clusters[i].y).toBeCloseTo(color.y);
      expect(clusters[i].z).toBeCloseTo(color.z);
    });
  });
  test('randomized initial clusters', () => {
    const random = 4; // chosen by fair dice roll.
    // guaranteed to be random.
    const inital = colors.map((c) => ({
      x: c.x + random,
      y: c.y + random,
      z: c.z + random,
    }));
    const clusters = kmeans(pixels, inital, 16);
    colors.forEach((color, i) => {
      expect(clusters[i].count).toEqual(perColor);
      expect(clusters[i].x).toBeCloseTo(color.x);
      expect(clusters[i].y).toBeCloseTo(color.y);
      expect(clusters[i].z).toBeCloseTo(color.z);
    });
  });
  test('fewer clusters than colors', () => {
    const random = 4; // chosen by fair dice roll.
    // guaranteed to be random.
    const inital = colors.map((c) => ({
      x: c.x + random,
      y: c.y + random,
      z: c.z + random,
    })).slice(0, 3);
    const clusters = kmeans(pixels, inital, 16);
    expect(clusters).toMatchInlineSnapshot(`
[
  {
    "count": 8,
    "x": 55,
    "y": -28.5,
    "z": 1,
  },
  {
    "count": 4,
    "x": 100,
    "y": 0,
    "z": 0,
  },
  {
    "count": 4,
    "x": 0,
    "y": 0,
    "z": 0,
  },
]
`);
  });
  test('1x1 image', () => {
    const result = kmeans(pixels.subarray(0, 3), colors, 4);
    const zeros = result.filter((c) => c.count === 0);
    const nonZero = result.filter((c) => c.count > 0);
    expect(zeros).toHaveLength(3);
    expect(nonZero).toEqual([{
      count: 1,
      x: 50,
      y: -32,
      z: 0,
    }]);
  });
  test('matches snapshot', async () => {
    const data = await getLabTestData();
    const initial = [
      { x: 0, y: 0, z: 0 },
      { x: 50, y: 0, z: 0 },
      { x: 100, y: 0, z: 0 },
    ];
    const actual = kmeans(data, initial, 4);
    expect(actual).toMatchSnapshot();
  });
});
