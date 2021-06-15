import { fitGradient, getPalette } from '../../src/lib';
import './index.css';
import * as index from './unsplash/small/index.json';

function processImage(
  imageEl: HTMLImageElement,
  frameEl: HTMLElement,
  colorsEl: HTMLElement,
) {
  const gradient = fitGradient(imageEl);
  const palette = getPalette(imageEl, 4);
  frameEl.style.background = gradient;
  while (colorsEl.lastChild) colorsEl.removeChild(colorsEl.lastChild);
  palette.forEach((color) => {
    const colorEl = document.createElement('span');
    colorEl.className = 'color';
    colorEl.style.backgroundColor = color;
    colorsEl.appendChild(colorEl);
  });
  return { gradient, palette };
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
    src: (await import(`./unsplash/small/${name}`)).default as string,
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
    const infoEl = document.createElement('p');
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
