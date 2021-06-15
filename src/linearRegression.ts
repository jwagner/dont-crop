export interface Regression {
  slope: number;
  intercept: number;
  rSquared: number;
}

export function linearRegression(x: number[], y: number[]): Regression {
  const xMean = mean(x);
  const yMean = mean(y);
  const covarianceXY = x.reduce(
    (sum, xi, i) => sum + (xi - xMean) * (y[i] - yMean),
    0,
  );
  const varianceX = x.reduce((sum, xi) => sum + (xi - xMean) * (xi - xMean), 0);
  const varianceY = y.reduce((sum, yi) => sum + (yi - yMean) * (yi - yMean), 0);
  const slope = covarianceXY / varianceX;
  const intercept = yMean - slope * xMean;
  const rSquared = covarianceXY ** 2 / (varianceX * varianceY);
  return {
    slope,
    intercept,
    rSquared,
  };
}

export function mean(x: number[]): number {
  return x.reduce((a, b) => a + b, 0) / x.length;
}
