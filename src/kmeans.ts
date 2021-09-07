// import mcgRandom from './mcgRandom';

type Point = {
  x: number;
  y: number;
  z: number;
};

export interface Cluster extends Point {
  count: number;
}

const channels = 3;
// sadly this is about twice as fast as x ** 2.
const squared = (x: number) => x * x;

// function selectClusterAtRandom(image: ImageData, random: () => number): Cluster {
//   const i = ((random() * image.width * image.height) | 0) * channels;
//   const { data } = image;
//   return {
//     x: data[i],
//     y: data[i + 1],
//     z: data[i + 2],
//     count: 0,
//   };
// }

// This function also operates without doing any gamma correction.
// I haven't evaluated the effect of this on the output.
// I could imagine that operating on the linear values would perform
// worse than the naive implementation here because the gamma encoding
// loosely correlates with the human perception.
// So the euclidian distance between the gamma encoded values might
// more closely match the perceived distance between the colors.
// Or it's just an excuse to save a few cycles. ¯\_(ツ)_/¯

export function kmeans(
  data: Float64Array,
  initialClusters: Point[],
  iterations: number,
): Cluster[] {
  // const { data } = image;
  const clusters: Cluster[] = [];
  const nextClusters: Cluster[] = [];
  // (histogramColors(image, k)).forEach(([r, g, b]) => {
  //   const { l: x, a: y, b: z } = srgbToLab({ r: r / 255, g: g / 255, b: b / 255 });
  //   clusters.push({
  //     x, y, z, count: 0,
  //   });
  //   nextClusters.push({
  //     x: 0, y: 0, z: 0, count: 0,
  //   });
  // });
  initialClusters.forEach((point) => {
    nextClusters.push({ ...point, count: 1 });
    clusters.push({
      x: 0, y: 0, z: 0, count: 0,
    });
  });
  for (let i = 0; i < iterations; i++) {
    clusters.forEach((cluster, j) => {
      // move next clusters to current clusters
      const nextCluster = nextClusters[j];
      const count = Math.max(nextCluster.count, 1);
      cluster.x = nextCluster.x / count;
      cluster.y = nextCluster.y / count;
      cluster.z = nextCluster.z / count;
      cluster.count = nextCluster.count;

      // reset next clusters
      nextCluster.x = 0;
      nextCluster.y = 0;
      nextCluster.z = 0;
      nextCluster.count = 0;
    });

    for (let p = 0; p < data.length; p += 3) {
      const x = data[p];
      const y = data[p + 1];
      const z = data[p + 2];
      let closestClusterDistance = Infinity;
      let closestCluster: Cluster = clusters[0];
      // find the closest cluster
      for (let ci = 0; ci < clusters.length; ci++) {
        // since this is just used in a comparison the sqrt is not needed
        const cluster = clusters[ci];
        const distance = squared(x - cluster.x)
          + squared(y - cluster.y)
          + squared(z - cluster.z);

        if (distance < closestClusterDistance) {
          closestClusterDistance = distance;
          closestCluster = nextClusters[ci];
        }
      }
      // add pixel to the closest cluster
      closestCluster.count += 1;
      closestCluster.x += x;
      closestCluster.y += y;
      closestCluster.z += z;
    }
  }
  return clusters;
}
