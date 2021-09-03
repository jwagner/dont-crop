import { histogramColors } from './histogramColors';
import { mergeSimilarColors } from './mergeSimilarColors';
// import mcgRandom from './mcgRandom';

interface Cluster {
  x: number;
  y: number;
  z: number;
  count: number;
}

const channels = 4;

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
export function kmeans(image: ImageData, k: number, iterations: number): Cluster[] {
  // const random = mcgRandom();
  if (k < 1) throw new Error('k must be greater than 0');
  const { data } = image;
  const clusters: Cluster[] = [];
  const nextClusters: Cluster[] = [];
  mergeSimilarColors(histogramColors(image, k * 2), k).forEach(([x, y, z]) => {
    clusters.push({
      x, y, z, count: 0,
    });
    nextClusters.push({
      x: 0, y: 0, z: 0, count: 0,
    });
  });
  for (let i = 0; i < iterations; i++) {
    clusters.forEach((cluster, j) => {
      // move next clusters to current clusters
      const nextCluster = nextClusters[j];
      if (nextCluster.count > 0) {
        cluster.x = nextCluster.x / nextCluster.count;
        cluster.y = nextCluster.y / nextCluster.count;
        cluster.z = nextCluster.z / nextCluster.count;
      } else {
        // Object.assign(cluster, selectClusterAtRandom(image, random));
      }
      cluster.count = nextCluster.count;

      // reset next clusters
      nextCluster.x = 0;
      nextCluster.y = 0;
      nextCluster.z = 0;
      nextCluster.count = 0;
    });

    for (let p = 0; p < data.length; p += channels) {
      const x = data[p];
      const y = data[p + 1];
      const z = data[p + 2];
      let closestClusterDistance = (x - clusters[0].x) ** 2
        + (y - clusters[0].y) ** 2
        + (z - clusters[0].z) ** 2;
      let closestCluster = nextClusters[0];
      // find the closest cluster
      for (let ci = 1; ci < clusters.length; ci++) {
        const distance = (x - clusters[ci].x) ** 2
          + (y - clusters[ci].y) ** 2
          + (z - clusters[ci].z) ** 2;

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
