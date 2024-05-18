import { fitGradient } from './fitGradient';

test('fitGradient', () => {
  const width = 32;
  const height = 15;
  const data = new Uint8ClampedArray(width * height * 4);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      data[i] = ((0.5 / height) * y) ** 2.2 * 255;
      data[i + 1] = (0.2 + (0.5 / height) * (height - y)) ** 2.2 * 255;
      data[i + 2] = 0.125 ** 2.2 * 255;
    }
  }
  const imageData = {
    width,
    height,
    data,
    colorSpace: 'srgb' as PredefinedColorSpace
  };
  const result = fitGradient(imageData).map((c) => c.map(Math.round));
  expect(result).toEqual([[0, 106, 3], [42, 0, 3]]);
});
