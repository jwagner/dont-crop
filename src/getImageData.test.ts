/**
 * @jest-environment jsdom
 */

import { loadImage } from 'canvas';
import { join } from 'path';
import { getImageData } from './getImageData';

test('getImageData', async () => {
  const src = join(__dirname, '..', 'tests', 'image.jpg');
  const image = (await loadImage(src)) as unknown as CanvasImageSource;
  const imageData = getImageData(image, 32);
  expect(imageData.width).toEqual(32);
  expect(imageData.height).toEqual(21);
  expect(imageData.data).toMatchSnapshot();
  // ensure canvas reuse works
  const otherImageData = getImageData(image, 32);
  expect(otherImageData.width).toEqual(imageData.width);
  expect(otherImageData.height).toEqual(imageData.height);
  expect(otherImageData.data).toEqual(imageData.data);
});
