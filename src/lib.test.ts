import { fitGradientToImageData, getPaletteFromImageData } from './lib';

const testImage = {
  width: 1,
  height: 2,
  data: new Uint8ClampedArray([0, 0, 0, 0, 255, 0, 0, 255]),
};

test('getPaletteFromImageData', () => {
  expect(getPaletteFromImageData(testImage).sort()).toEqual(['#000000', '#ff0000']);
  expect(getPaletteFromImageData(testImage, 1)).toEqual(['#ff0000']);
});

test('fitGradientToImageData', () => {
  expect(fitGradientToImageData(testImage)).toEqual('linear-gradient(#000000,#ff0000)');
});
