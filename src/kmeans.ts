import mcgRandom from './mcgRandom';

interface Cluster {
  x: number;
  y: number;
  z: number;
  count: number;
}

// This function also operates without doing any gamma correction.
// I haven't evaluated the effect of this on the output.
// I could imagine that operating on the linear values would perform
// worse than the naive implementation here because the gamma encoding
// loosely correlates with the human perception.
// So the euclidian distance between the gamma encoded values might
// more closely match the perceived distance between the colors.
// Or it's just an excuse to save a few cycles. ¯\_(ツ)_/¯
export function kmeans(image: ImageData, k: number, iterations: number): Cluster[] {
  const random = mcgRandom();
  const random255 = () => random() * 255;
  if (k < 1) throw new Error('k must be greater than 0');
  const { data } = image;
  const clusters: Cluster[] = [];
  const nextClusters: Cluster[] = [];
  for (let i = 0; i < k; i++) {
    clusters.push({
      x: random255(), y: random255(), z: random255(), count: 0,
    });
    nextClusters.push({
      x: 0, y: 0, z: 0, count: 0,
    });
  }
  for (let i = 0; i < iterations; i++) {
    clusters.forEach((cluster, j) => {
      // move next clusters to current clusters
      const nextCluster = nextClusters[j];
      if (nextCluster.count > 0) {
        cluster.x = nextCluster.x / nextCluster.count;
        cluster.y = nextCluster.y / nextCluster.count;
        cluster.z = nextCluster.z / nextCluster.count;
      } else {
        // give empty clusters another chance
        cluster.x = random255();
        cluster.y = random255();
        cluster.z = random255();
      }
      cluster.count = nextCluster.count;

      // reset next clusters
      nextCluster.x = 0;
      nextCluster.y = 0;
      nextCluster.z = 0;
      nextCluster.count = 0;
    });

    for (let p = 0; p < data.length; p += 4) {
      let closestClusterDistance = (data[p] - clusters[0].x) ** 2
        + (data[p + 1] - clusters[0].y) ** 2
        + (data[p + 2] - clusters[0].z) ** 2;
      let closestCluster = nextClusters[0];
      // find the closest cluster
      for (let ci = 1; ci < clusters.length; ci++) {
        const distance = (data[p] - clusters[ci].x) ** 2
          + (data[p + 1] - clusters[ci].y) ** 2
          + (data[p + 2] - clusters[ci].z) ** 2;

        if (distance < closestClusterDistance) {
          closestClusterDistance = distance;
          closestCluster = nextClusters[ci];
        }
      }
      // add pixel to the closest cluster
      closestCluster.count += 1;
      closestCluster.x += data[p];
      closestCluster.y += data[p + 1];
      closestCluster.z += data[p + 2];
    }
  }
  return clusters;
}
