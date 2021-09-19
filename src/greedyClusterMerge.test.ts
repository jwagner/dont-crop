import { greedyClusterMerge } from './greedyClusterMerge';
import { Cluster } from './kmeans';

describe('greedyClusterMerge', () => {
  test('handles fewer than keep clusters', () => {
    expect(greedyClusterMerge([], -1)).toHaveLength(0);
    expect(greedyClusterMerge([], 1)).toHaveLength(0);
    const clusters = [{
      x: 0,
      y: 0,
      z: 0,
      count: 0,
    } as const];
    expect(greedyClusterMerge(clusters, 2)).toEqual(clusters);
  });
  test('it reduces down to keep clusters based on proximity', () => {
    const clusters: Readonly<Cluster>[] = [{
      x: 0,
      y: 0,
      z: 0,
      count: 1,
    },
    {
      x: 0.01,
      y: 0.01,
      z: 0.01,
      count: 1,
    },
    {
      x: 99.99,
      y: 0,
      z: 0,
      count: 1,
    },
    {
      x: 100,
      y: 0,
      z: 0,
      count: 1,
    },
    ];
    const expected = [
      {
        x: 100,
        y: 0,
        z: 0,
        count: 2,
      },
      {
        x: 0.01,
        y: 0.01,
        z: 0.01,
        count: 2,
      },
    ];
    expect(greedyClusterMerge(clusters, 2)).toEqual(expected);
  });
});
