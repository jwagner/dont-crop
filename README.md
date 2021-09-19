<img src="docs/logo.png" width="400" />

[API Documentation](https://29a.ch/sandbox/2021/dont-crop/docs/modules.html) | [Demo](https://29a.ch/sandbox/2021/dont-crop/) 

[![Tests](https://github.com/jwagner/dont-crop/actions/workflows/tests.yml/badge.svg)](https://github.com/jwagner/dont-crop/actions/workflows/tests.yml) [![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)

Dont-crop is a [small](#performance), dependency free javascript library to fit a gradient to an image or extract it's primary colors.

It can be used to pad images instead of cropping them, for a very compact [blur up](https://engineering.fb.com/2015/08/06/android/the-technology-behind-preview-photos/) and what ever else you can come up with.

## Examples

### fitGradient()
![fitGradient](docs/fitGradient.webp)
Photo by [Abed Ismail](https://unsplash.com/photos/fZXZ1-hbFrY)

### getPalette()
![getPalette](docs/getPalette.webp)

### More Examples

View the [demo page](https://29a.ch/sandbox/2021/dont-crop/)  to see more examples and experiment with your own images.

## Installation
```
npm install -S dont-crop
```

## Usage

### ES Modules
```javascript
import {getPalette, fitGradient} from 'dont-crop';

const image = new Image();
// the image needs to be loaded before you can pass it to dont-crop
image.onload = () => {
  console.log(getPalette(image));
  // ['#000000', ...]
  console.log(fitGradient(image));
  // 'linear-gradient(#000000, #ffffff)`
}
image.src = 'example.jpg';
```

### CommonJS

```javascript
const getPalette = require('dont-crop').getPalette;
const fitGradient = require('dont-crop').fitGradient;
// ...
```

### React
See [examples/react/index.tsx](examples/react/index.tsx) for a simple example.

### NodeJS
Usage with node depends on the image processing library being used.
In general an image data object needs to be constructed and passed to
`getPaletteFromImageData` or `fitGradientToImageData`.

The base functions `getPalette` and `fitGradient` will not work using NodeJS.
At least not without bending over backwards.

See `getImageData` in [examples/node-sharp/example.ts](examples/node-sharp/example.ts) for an example using sharp.

## Compatibility

The code should run in all common modern browsers and node from version 12 on.
It has been tested in:
* Chrome
* Firefox
* Safari
* Edge

## Performance

The code is reasonably compact and built with tree shaking in mind.
So your bundles will only include the features you actually use.

When using `fitGradient` only and bundling your code using webpack 5 dont-crop will add about **1.2 kb** (0.7 gzipped) to your bundle size.
`getPalette` will cost you a bit more than **3.2 kb** (1.7 gzipped).
You can use both for about **4 kb** (2 gzipped).

```
3925 dist/both.js
1911 dist/both.js.gz
1264 dist/fitGradient.js
710  dist/fitGradient.js.gz
3261 dist/getPalette.js
1656 dist/getPalette.js.gz
```

Runtime performance is also fast enough not to worry about.

```
# on a AMD Ryzen 9 5950X
fitGradientToImageData x 19,813 ops/sec ±0.96% (97 runs sampled)
getPaletteFromImageData(fast=false) x 156 ops/sec ±0.66% (83 runs sampled)
getPaletteFromImageData(fast=true) x 645 ops/sec ±0.17% (97 runs sampled)
```

The versions of the functions operating on images rather than the already downscaled image data are slower.
Their performance depends on the exact browser and device in question as well but it should generally be in the ballpark of a few milliseconds for reasonably sized images.

## Test Coverage

The code is well covered in tests. The examples are used as end to end tests in both node and a browser (chrome via puppeteer).


## Algorithms

Glad you asked. `fitGradient()` is using simple [linear regression](https://en.wikipedia.org/wiki/Linear_regression).

`getPalete()` is based on [k-means](https://en.wikipedia.org/wiki/K-means_clustering).
The initial clusters are chosen using a histogram.
Similar clusters in the result are merged in a post processing step.
This is necessary because k-means tends to return equally sized clusters
whereas getPalette is supposed to return distinct clusters.
The merging is tuned to preserve different hues and colors rather than returning the most prominent shades of color (which might all share a similar hue).
The processing happens in the CIE Lab color space using CIE76 ΔE*.


## Alternatives

### [Just blur the image](https://developer.mozilla.org/en-US/docs/Web/CSS/filter-function/blur())

using a blurred version of the image as background is a very simple alternative.
I think it looks a bit more busy but it requires less plumbing (just a bit of css) and will generally be faster.

If the gradient fitting is performed on the backend and cached or server side rendered this reverses and it becomes a very efficient approximation of the image.

### [colorthief](https://github.com/lokesh/color-thief)

Provides similar functionality to getPalette.
It weighs in at about 6.4k (version 2.3.2).
It's been widely used since 2019 so it is definitely more battle proofen.
From a quick looks it seems to be using median-cut which will likely yield a bit better results than the simplistic k-means used here.

### [fast-average-color](https://github.com/fast-average-color/fast-average-color)

Returns a single average or dominant color color.

  
### [smartcrop.js](https://github.com/jwagner/smartcrop.js)

Smartcrop.js is another project of mine. As the name suggests it tries
to find smarter crops.

## Roadmap

There are plenty of interesting ways to improve this library further.

* Grouping of colors (saturated, muted, light, dark, warm, cold)
* Tuning of the variables involved in palette extraction potentially allowing some degree of tweaking by the user of the library
* Weighting the linear-regression and k-means to focus on the center or edges
* Using a more robust regression variation like Theil-Senn
* Gamma corrected linear gradients by manually interpolating the stops

## License

MIT