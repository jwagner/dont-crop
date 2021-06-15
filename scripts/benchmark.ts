/* eslint-disable import/no-extraneous-dependencies */
import sharp from 'sharp';
import { readdirSync } from 'fs';
import { join } from 'path';
import Benchmark from 'benchmark';
import { fitGradientToImageData, getPaletteFromImageData } from '../src/lib';

const srcDir = join(__dirname, '../examples/testsuite/unsplash/small/');

async function loadImageData(): Promise<ImageData> {
  const path = join(
    srcDir,
    readdirSync(srcDir)
      .filter((name) => name.match(/\.jpg$/))
      .sort()[0],
  );

  const image = sharp(path).resize(32, 32, { fit: 'inside' });
  const { data, info } = await image
    .ensureAlpha()
    .toColorspace('srgb')
    .raw()
    .toBuffer({ resolveWithObject: true });
  if (data.length !== info.width * info.height * 4) {
    throw new Error(`Invalid image dimensions ${data.length} != ${info.width} * ${info.height} * 4`);
  }
  const imageData: ImageData = {
    width: info.width,
    height: info.height,
    data: new Uint8ClampedArray(data.buffer),
  };
  return imageData;
}

// work around top level await
(async function main() {
  const imageData = await loadImageData();
  // const colors = imageDatas.map((imageData) => dontCropImageData(imageData));
  const suite = new Benchmark.Suite('Name', { minTime: 600, maxTime: 6000, minSamples: 1000000 });

  // add tests
  suite
    .add('fitGradientToImageData', () => fitGradientToImageData(imageData))
    .add('getPaletteFromImageData', () => getPaletteFromImageData(imageData))
    .on('cycle', (event: { target: any; }) => {
      console.log(String(event.target));
    })
    .on('complete', function complete(this: any) {
      console.log(`Fastest is ${this.filter('fastest').map('name')}`);
    })
  // run async
    .run();
}());
