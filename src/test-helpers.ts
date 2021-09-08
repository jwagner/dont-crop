import { join } from 'path';
import sharp from 'sharp';
import { srgbToLabArray } from './lab';

export async function getTestImageData(): Promise<ImageData> {
  const src = join(__dirname, '../tests/image.jpg');
  const { data, info } = await sharp(src).ensureAlpha()
    .toColorspace('srgb')
    .raw()
    .toBuffer({ resolveWithObject: true });
  const imageData: ImageData = {
    width: info.width,
    height: info.height,
    data: new Uint8ClampedArray(data.buffer),
  };
  return imageData;
}

export async function getLabTestData() {
  const imageData = await getTestImageData();
  return srgbToLabArray(imageData.data);
}
