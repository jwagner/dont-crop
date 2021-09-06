import { clusterHistogram } from './clusterHistogram';
import { Color } from './color';
import { greedyClusterMerge } from './greedyClusterMerge';
import { kmeans } from './kmeans';
import { labToSrgb, srgbToLabComposed } from './lab';

export function getPalette(imageData: ImageData, numberOfColors: number): Color[] {
  const labData = srgbToLabComposed(imageData.data);
  const k = Math.max(32, numberOfColors);
  const initialClusters = clusterHistogram(labData, 6, k);
  const clusters = kmeans(labData, initialClusters, k, 8);
  return greedyClusterMerge(clusters, numberOfColors)
  // .sort((a, b) => b.count - a.count)
  // return clusterHistogram(labData, 6, 32)
  // return nonTinyClusters
    .map(
      (cluster) => {
        const srgb = labToSrgb({ l: cluster.x, a: cluster.y, b: cluster.z });
        return [
          srgb.r * 255,
          srgb.g * 255,
          srgb.b * 255,
        ];
      },
    );
  // .sort((a, b) => saturation(b) - saturation(a))
}
