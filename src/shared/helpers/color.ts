/* eslint-disable no-bitwise */
import { red, pink, purple, indigo, blue, cyan, teal, green, lime, yellow, amber, orange, brown, grey, blueGrey } from '@mui/material/colors'
import { norm } from './math';

const baseHues = [red, blue, green, yellow, grey, pink, cyan, lime, amber, blueGrey, purple, teal, indigo, orange, brown];

const colors = [
  ...baseHues.map(hue => hue[500]),
  ...baseHues.map(hue => hue[900]),
  ...baseHues.map(hue => hue[50])
];

export function colorByIndex(i) {
  return colors[(i % colors.length + colors.length) % colors.length];
};

export function colorGradient(fadeFraction: number, rgbColor1: { red: number; green: number; blue: number; }, rgbColor2: { red: number; green: number; blue: number; }, rgbColor3?: { red: number; green: number; blue: number; }) {
  let color1 = rgbColor1;
  let color2 = rgbColor2;
  let fade = fadeFraction;

  // Do we have 3 colors for the gradient? Need to adjust the params.
  if (rgbColor3) {
    fade *= 2;

    // Find which interval to use and adjust the fade percentage
    if (fade >= 1) {
      fade -= 1;
      color1 = rgbColor2;
      color2 = rgbColor3;
    }
  }

  const diffRed = color2.red - color1.red;
  const diffGreen = color2.green - color1.green;
  const diffBlue = color2.blue - color1.blue;

  const gradient = {
    red: parseInt(Math.floor(color1.red + (diffRed * fade)).toString(), 10),
    green: parseInt(Math.floor(color1.green + (diffGreen * fade)).toString(), 10),
    blue: parseInt(Math.floor(color1.blue + (diffBlue * fade)).toString(), 10),
  };

  return gradient;
}

export function rgbToString(rgb) {
  return `rgb(${rgb.red},${rgb.green},${rgb.blue})`;
}

export function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return {
    red: parseInt(result[1], 16),
    green: parseInt(result[2], 16),
    blue: parseInt(result[3], 16)
  };
}

export function rgbToHex(rgb) {
  return `#${((1 << 24) + (rgb.red << 16) + (rgb.green << 8) + rgb.blue).toString(16).slice(1)}`;
}

export const namedColor = {
  sucess: green[500],
  error: red[500]
};

export function colorByRange(value: number, min: number, max: number, leftColor, rightColor) {
  return rgbToString(colorGradient(norm(value, min, max), leftColor, rightColor))
}
