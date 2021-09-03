import { Color } from './color';

const resolution = 8; // needs to be power of two <= colorBits
const indexShiftG = Math.log2(resolution);
const indexShiftB = indexShiftG * 2;
const colorBits = 8;
const coloShift = colorBits - indexShiftG;
const cubeLength = resolution ** 3;
const cube = () => new Uint32Array(cubeLength);
const countCube = cube();
const rCube = cube();
const gCube = cube();
const bCube = cube();

export function histogramColors(image: ImageData, numberOfColors: number): Color[] {
  const { data } = image;
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const j = (r >> coloShift)
    + ((g >> coloShift) << indexShiftG)
    + ((b >> coloShift) << indexShiftB);
    countCube[j]++;
    rCube[j] += r;
    gCube[j] += g;
    bCube[j] += b;
  }
  return Array
    .from(countCube.keys())
    .sort((i, j) => countCube[j] - countCube[i])
    .slice(0, numberOfColors)
    .map((i) => {
      const count = countCube[i];
      const r = rCube[i] / count;
      const g = gCube[i] / count;
      const b = bCube[i] / count;
      return [r, g, b] as Color;
    });
}
