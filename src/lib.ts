import { kmeans } from './kmeans';
import { fitGradient as fitGradientImplementation } from './fitGradient';
import { Color } from './color';
import { getImageData } from './getImageData';
import { hexColorString, linearGradient } from './format';

export { getImageData } from './getImageData';

/**
 * Extract representative colors from an image.
 * @remarks because of it's dependency on `<canvas>`
 * this function only works in the browser.
 *  * In nodejs use `getPaletteFromImageData` directly instead.
 * @param image the image to extract the palette from.
 *  Will be scaled down to at most 32x32.
 *  Must be loaded/complete.
 * @param numberOfColors upper limit on the number of colors to be returned
 * @returns representative colors of the image ordered by importance (size of the cluster)
 */
// integration tested only
export function getPalette(image: CanvasImageSource, numberOfColors: number = 4): string[] {
  const imageData = getImageData(image, 32);
  return getPaletteFromImageData(imageData, numberOfColors);
}

/**
 * Extract representative colors from image data.
 * @param imageData image data to extract the colors from
 * @param numberOfColors upper limit on the number of colors to be returned
 * @returns representative colors of the image ordered by importance (size of the cluster)
 *
 */
export function getPaletteFromImageData(imageData: ImageData, numberOfColors: number = 4) {
  const colors = kmeans(imageData, numberOfColors, 16)
    .filter((c) => c.count > 0)
    .sort((a, b) => b.count - a.count)
    .map<Color>((c) => [c.x, c.y, c.z]);
  return colors.map(hexColorString);
}

/**
 * Fits a linear gradient to an image
 * @remarks because of it's dependency on `<canvas>`
 * this function only works in the browser.
 * In nodejs use `fitGradientToImageData` directly instead.
 * @param image the image to fit the gradient to
 *  Will be scaled down to at most 32x32.
 *  Must be loaded/complete.
 * @returns a string that can be used as a css gradient
 */
// integration tested only
export function fitGradient(image: CanvasImageSource) {
  const imageData = getImageData(image, 32);
  return fitGradientToImageData(imageData);
}

/**
 * Fits a linear gradient to image data
 * @param imageData the image data to fit the gradient to.
 * @returns a string that can be used as a css gradient.
 */
export function fitGradientToImageData(imageData: ImageData) {
  const colors = fitGradientImplementation(imageData)
    .map(hexColorString);
  return linearGradient(colors);
}
