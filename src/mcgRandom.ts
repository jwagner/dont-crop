// via https://en.wikipedia.org/wiki/Lehmer_random_number_generator
export default function mcgRandom(seed: number = 442918754): () => number {
  const m = 2 ** 31 - 1;
  const a = 48271;
  let x = seed | 0;
  return () => {
    x = (x * a) & m;
    return x / m;
  };
}
