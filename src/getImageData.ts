// this file is only covered by the end to end browser tests
let canvasEl: HTMLCanvasElement | undefined;

function getCanvas(): HTMLCanvasElement {
  if (!canvasEl) canvasEl = document.createElement('canvas');
  return canvasEl;
}

export function getImageData(image: CanvasImageSource, maxDimension: number | undefined) {
  const canvas = getCanvas();
  const Img = HTMLImageElement;
  const width = image instanceof Img ? image.naturalWidth : +image.width;
  const height = image instanceof Img ? image.naturalHeight : +image.height;
  const scale = maxDimension
    ? Math.min(maxDimension / Math.max(width, height), 1.0)
    : 1;
  const outputWidth = (width * scale) | 0;
  const outputHeight = (height * scale) | 0;
  canvas.width = outputWidth;
  canvas.height = outputHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('getContext failed');
  ctx.imageSmoothingQuality = 'low';
  ctx.drawImage(image, 0, 0, outputWidth, outputHeight);
  return ctx.getImageData(0, 0, outputWidth, outputHeight);
}
