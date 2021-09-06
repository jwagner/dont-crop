export function clusterHistogram(pixels: Float64Array, size: number, clusters: number) {
  const scaleAndClamp = (t: number) => (Math.max(0, Math.min(0.999, t)) * size) | 0;
  const cubeSize = size * size * size;
  const lcube = new Float64Array(cubeSize);
  const acube = new Float64Array(cubeSize);
  const bcube = new Float64Array(cubeSize);
  const ccube = new Float64Array(cubeSize);
  const lstep = 100 / size;
  for (let i = 0; i < pixels.length; i += 3) {
    const l = pixels[i];
    let a = pixels[i + 1];
    let b = pixels[i + 2];
    if (l < lstep || l > 100 - lstep) {
      a = 0;
      b = 0;
    }
    const x = scaleAndClamp(l / 100);
    const y = scaleAndClamp((a + 100) / 200);
    const z = scaleAndClamp((b + 100) / 200);
    const j = x + y * size + z * size * size;
    lcube[j] += l;
    acube[j] += a;
    bcube[j] += b;
    ccube[j]++;
  }
  return Array.from(lcube.keys())
    .filter((i) => ccube[i])
    .sort((i, j) => ccube[j] - ccube[i])
    .slice(0, clusters)
    .map((i) => ({
      x: lcube[i] / ccube[i],
      y: acube[i] / ccube[i],
      z: bcube[i] / ccube[i],
      count: ccube[i],
    }));
}
