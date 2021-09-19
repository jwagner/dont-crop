/* eslint-disable import/no-extraneous-dependencies */
import sharp from 'sharp';
import { readdirSync } from 'fs';
import { join } from 'path';
import Benchmark from 'benchmark';
import { fitGradientToImageData, getPaletteFromImageData } from '../src/lib';

const srcDir = join(__dirname, '../examples/testsuite/unsplash/small/');

async function loadImageData(size: number): Promise<ImageData> {
  const path = join(
    srcDir,
    readdirSync(srcDir)
      .filter((name) => name.match(/\.jpg$/))
      .sort()[0],
  );

  const image = sharp(path).resize(size, size, { fit: 'inside' });
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
  const imageData32 = await loadImageData(32);
  const imageData128 = await loadImageData(128);
  const imageData64 = await loadImageData(64);
  // const colors = imageDatas.map((imageData) => dontCropImageData(imageData));
  const suite = new Benchmark.Suite('Name', { minTime: 600, maxTime: 60000, minSamples: 10000000 });

  // add tests
  suite
    .add('fitGradientToImageData', () => fitGradientToImageData(imageData32))
    .add('getPaletteFromImageData(fast=false)', () => getPaletteFromImageData(imageData128))
    .add('getPaletteFromImageData(fast=true)', () => getPaletteFromImageData(imageData64))
    .on('cycle', (event: { target: any; }) => {
      console.log(String(event.target));
    })
    .on('complete', function complete(this: any) {
      console.log(`Fastest is ${this.filter('fastest').map('name')}`);
    })
  // run async
    .run();
}());
