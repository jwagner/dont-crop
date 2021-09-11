/**
 * @jest-environment jsdom
 */

import { loadImage } from 'canvas';
import { join } from 'path';
import { fitGradient, getPalette } from './lib';

const src = join(__dirname, '..', 'tests', 'image.jpg');

test('fitGradient', async () => {
  const image = (await loadImage(src)) as unknown as CanvasImageSource;
  const actual = fitGradient(image);
  expect(actual).toEqual('linear-gradient(#956f6b,#b1673a)');
});

test('getPalette', async () => {
  const image = (await loadImage(src)) as unknown as CanvasImageSource;
  const actual = getPalette(image);
  expect(actual).toEqual(['#f52327', '#ef8f38', '#31b09c', '#e29f80']);
});
