/* eslint-disable import/no-extraneous-dependencies */
import ReactDom from 'react-dom';
import React, { useState } from 'react';
import { fitGradient } from '../../src/lib';
import src from './image.jpg';
import './index.css';

interface FramedImageProps {
  src: string;
}

function useFittingGradient(defaultColor: string = '#333'): [string, (image:CanvasImageSource)=>void] {
  const [background, setBackground] = useState(defaultColor);
  return [
    background,
    (image) => setBackground(fitGradient(image)),
  ];
}

function FramedImage(props: FramedImageProps) {
  const [background, setImage] = useFittingGradient();
  return <div className="frame" style={{ background }}>
    <img src={props.src} onLoad={(e) => setImage(e.currentTarget)} />
  </div>;
}

const root = document.createElement('div');
document.body.appendChild(root);

ReactDom.render(
      <FramedImage src={src} />,
      root,
);
