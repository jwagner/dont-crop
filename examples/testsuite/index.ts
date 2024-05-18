import { fitGradient, getPalette } from '../../src/lib';
import { fitGradient as fitGradientInternal } from '../../src/fitGradient';
import './index.css';

// nasty hardcoded index of images to make webpack happy
const index = {
  "images": [
    require("./unsplash/small/abed-ismail-fZXZ1-hbFrY-unsplash.jpg"),
    require("./unsplash/small/amit-pritam-xO4a2U9jf00-unsplash.jpg"),
    require("./unsplash/small/bob-brewer-s3dRFddp2lM-unsplash.jpg"),
    require("./unsplash/small/clement-remond-n5hr-myI-Zo-unsplash.jpg"),
    require("./unsplash/small/david-clode-zBORpP97apw-unsplash.jpg"),
    require("./unsplash/small/enguerran-urban-NNfGpEadinQ-unsplash.jpg"),
    require("./unsplash/small/jeremy-hynes-l_eSPV-eW8o-unsplash.jpg"),
    require("./unsplash/small/jezael-melgoza-5zEAESyVMzM-unsplash.jpg"),
    require("./unsplash/small/kevin-chinchilla-tqYpQothXHo-unsplash.jpg"),
    require("./unsplash/small/nathalia-arantes-WYrvPSf0rlI-unsplash.jpg"),
    require("./unsplash/small/parsa-mahmoudi-wTsaSE-U7qY-unsplash.jpg"),
    require("./unsplash/small/sam-ueJJlc4Mclk-unsplash.jpg"),
    require("./unsplash/small/shio-yang-WlEgMwnNlWY-unsplash.jpg"),
    require("./unsplash/small/sincerely-media-tpgd1EpaaOE-unsplash.jpg"),
    require("./unsplash/small/thomas-millot-2JSLLwtM8MU-unsplash.jpg")
  ]
};

function processImage(
  imageEl: HTMLImageElement,
  frameEl: HTMLElement,
  colorsEl: HTMLElement,
) {
  const gradient = fitGradient(imageEl);
  const palette = getPalette(imageEl, 5);
  frameEl.style.background = gradient;
  while (colorsEl.lastChild) colorsEl.removeChild(colorsEl.lastChild);
  palette.forEach((color) => {
    const colorEl = document.createElement('span');
    colorEl.className = 'color';
    colorEl.title = color;
    colorEl.style.backgroundColor = color;
    colorsEl.appendChild(colorEl);
  });
  const visualizationCanvas = visualizeLinearRegression(imageEl);
  visualizationCanvas.className = 'visualization';
  frameEl.appendChild(visualizationCanvas);
  return { gradient, palette };
}

function visualizeLinearRegression(imageEl: HTMLImageElement): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = imageEl.naturalWidth;
  canvas.height = imageEl.naturalHeight;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) throw new Error('could not get context');
  ctx.drawImage(imageEl, 0, 0);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const xScale = 0.5;
  canvas.width = 256 * xScale;
  const cw = canvas.width;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  const outputImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const { data: id, width: w, height: h } = imageData;
  const od = outputImageData.data;
  // rgb parade
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      for (let c = 0; c < 3; c++) {
        const value = id[(y * w + x) * 4 + c];
        od[((value * xScale) | 0 + y * cw) * 4 + c] += 8;
      }
    }
  }
  ctx.putImageData(outputImageData, 0, 0);

  const gradient = fitGradientInternal(imageData);
  ctx.shadowBlur = 4;
  ctx.shadowColor = '#000';
  ctx.shadowOffsetY = 1;
  ['#f33', '#3f3', '#33f'].forEach((color, c) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(gradient[0][c] * xScale, 0);
    ctx.lineTo(gradient[1][c] * xScale, h);
    ctx.stroke();
  });
  return canvas;
}

interface ImageMetaData {
  src: string,
  author: string,
  href: string
}

async function metaDataFromName(name: string) {
  const matches = name.match(/(.*)-(.{11})-unsplash.jpg$/);
  const author = (matches?.[1] || 'unkown')
    .split('-')
    .map((s) => s[0].toUpperCase() + s.slice(1))
    .join(' ');
  const href = `https://unsplash.com/photos/${matches?.[2] || ''}`;
  return {
    src: name,
    author,
    href,
  };
}

async function listImages(): Promise<ImageMetaData[]> {
  return Promise.all(Array.from<string>(index.images).map((name) => metaDataFromName(name)));
}

async function render() {
  const imgs = await listImages();
  const readyPromises = imgs.map((img) => {
    const container = document.createElement('div');
    container.className = 'image-container';
    const frameEl = document.createElement('div');
    frameEl.className = 'frame';
    const imageEl = document.createElement('img');
    const colorsEl = document.createElement('div');
    colorsEl.className = 'colors';
    const ready = new Promise((resolve, reject) => {
      imageEl.onload = () => {
        const { gradient, palette } = processImage(imageEl, frameEl, colorsEl);
        resolve({ gradient, palette });
      };
      imageEl.onerror = () => reject();
    });

    imageEl.src = img.src;
    const infoEl = document.createElement('div');
    infoEl.className = 'info';
    infoEl.appendChild(colorsEl);
    infoEl.appendChild(document.createTextNode('Photo by '));

    const attributionHrefEl = document.createElement('a');
    attributionHrefEl.setAttribute('href', img.href);

    attributionHrefEl.appendChild(document.createTextNode(img.author));

    infoEl.appendChild(attributionHrefEl);

    frameEl.appendChild(imageEl);
    container.appendChild(frameEl);
    container.appendChild(infoEl);
    document.body.appendChild(container);
    return ready;
  });

  await Promise.all(readyPromises);
  document.body.classList.add('ready');
}

function handleDrop(el: HTMLInputElement) {
  let url: string | undefined;
  let image: HTMLImageElement | undefined;
  const frame = el.parentElement;
  if (!(frame instanceof HTMLElement)) return;
  const colors = frame.parentElement?.querySelector('.colors');
  if (!(colors instanceof HTMLElement)) return;
  el.onchange = () => {
    const file = el.files?.[0];
    if (!file) return;
    if (url) URL.revokeObjectURL(url);
    url = URL.createObjectURL(file);
    if (!image) {
      image = document.createElement('img');
      el.parentElement?.appendChild(image);
    }
    const note = document.querySelector<HTMLSpanElement>('.note');
    if (note) note.style.display = 'none';
    image.src = url;
    image.onload = (e) => {
      if (e.target === image) processImage(image, frame, colors);
    };
  };
}

(async function main() {
  const prerendered = document.body.classList.contains('ready');
  if (!prerendered) {
    await render();
  }
  const dropzoneEl = document.querySelector<HTMLInputElement>('.dropzone');
  if (dropzoneEl) handleDrop(dropzoneEl);
}());
