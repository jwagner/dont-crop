import { Cluster } from './kmeans';

const distanceHueScale = 1.5;
const countImportance = 8;
const chromaImportance = 2;
const distanceThreshold = 1500;

interface ClusterDistance {
  ai: number,
  bi: number,
  distance: number
}

export function greedyClusterMerge(clusters: Readonly<Cluster>[], keep: number): Cluster[] {
  const distances: ClusterDistance[] = [];
  for (let ai = 0; ai < clusters.length; ai++) {
    const a = clusters[ai];
    for (let bi = ai + 1; bi < clusters.length; bi++) {
      const b = clusters[bi];
      distances.push({
        ai,
        bi,
        distance: distance(a, b),
      });
    }
  }
  distances.sort((a, b) => b.distance - a.distance);
  const remainingClusters: (Cluster | undefined)[] = clusters;
  for (let removed = 0; removed < (clusters.length - keep);) {
    const next = distances.pop();
    if (!next) break; // should not be possible unless keep is negative
    // eslint-disable-next-line prefer-const
    let { ai, bi } = next;
    if (next.distance > distanceThreshold) break;
    let a = remainingClusters[ai];
    let b = remainingClusters[bi];
    if (!a || !b) continue;
    if (importance(b) > importance(a)) {
      [a, b] = [b, a];
      bi = ai;
    }
    a.count += b.count;
    remainingClusters[bi] = undefined;
    removed++;
  }
  const clustersLeft = remainingClusters.filter((c) => !!c) as Cluster[];
  return clustersLeft
    .sort((a, b) => importance(b) - importance(a))
    .slice(0, keep);
}

function importance(cluster: Cluster) {
  const chroma = Math.sqrt(squared(cluster.y) + squared(cluster.z));
  // the larger the cluster the more important it is
  return (Math.log(cluster.count) * countImportance
  // the more saturated the color the more important it is
   + chroma * chromaImportance
   // also make brighter colors a bit more important
   + cluster.x);
}

const squared = (x: number) => x * x;
function distance(a: Cluster, b: Cluster) {
  const aScale = Math.min(a.x, 0.25) / 0.25;
  const bScale = Math.min(b.x, 0.25) / 0.25;
  const hue = (squared(a.y * aScale - b.y * bScale) + squared(a.z * aScale - b.z * bScale));
  return squared(a.x - b.x)
    + hue * distanceHueScale;
}
