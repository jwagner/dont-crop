import { clusterHistogram } from './clusterHistogram';
import { Color } from './color';
import { greedyClusterMerge } from './greedyClusterMerge';
import { kmeans } from './kmeans';
import { labToSrgb, srgbToLabArray } from './lab';

export function getPalette(imageData: ImageData, numberOfColors: number): Color[] {
  const labData = srgbToLabArray(imageData.data);
  const k = Math.max(32, numberOfColors);
  const initialClusters = clusterHistogram(labData, 6, k);
  const clusters = kmeans(labData, initialClusters, 8).filter((c) => c.count > 0);
  return greedyClusterMerge(clusters, numberOfColors)
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
}
