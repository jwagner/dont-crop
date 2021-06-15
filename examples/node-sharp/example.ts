/* eslint-disable import/no-extraneous-dependencies */
import sharp from 'sharp';
import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';
import { getPaletteFromImageData, fitGradientToImageData } from 'dont-crop';
import assert from 'assert';

const srcDir = join(__dirname, '../../examples/testsuite/unsplash/small/');

// work around top level await
(async function main() {
  const imageDatas = await loadImageDatas();

  test('getPaletteFromImageData', () => imageDatas.map(
    (imageData) => getPaletteFromImageData(imageData),
  ));

  test('fitGradientToImageData', () => imageDatas.map(
    (imageData) => fitGradientToImageData(imageData),
  ));
}()).catch(() => process.exit(1));

async function getImageData(path: string) {
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

function loadImageDatas(): Promise<ImageData[]> {
  const paths = readdirSync(srcDir)
    .filter((name) => name.match(/\.jpg$/))
    .map((name) => join(srcDir, name));

  const imageDatas: Promise<ImageData[]> = Promise.all(
    paths.map(async (path) => getImageData(path)),
  );

  return imageDatas;
}

function test(name: string, callback: () => any[]) {
  const snapshotPath = join(__dirname, 'snapshots', `${name}.json`);
  const expected = JSON.parse(readFileSync(snapshotPath, 'utf8'));
  // warm up the jit
  for (let i = 0; i < 100; i++) callback();
  const start = now();
  const actual = callback();
  const duration = now() - start;
  console.log(`${name} got ${actual.length} results in ${duration.toFixed()} ms, ${(duration / actual.length).toFixed(2)} ms/result`);

  try {
    assert.deepEqual(actual, expected, name);
  } catch (error) {
    console.error(error);
    console.log('expected', JSON.stringify(expected, undefined, ' '));
    console.log('actual', JSON.stringify(actual, undefined, ' '));
    process.exit(1);
  }
}

// node 12 doesn't expose performance
const now = () => (typeof performance !== 'undefined' ? performance.now() : 0);
