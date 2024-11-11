import { PixelCrop } from "react-image-crop";

const TO_RADIANS = Math.PI / 180;

export function canvasPreview(
  image: HTMLImageElement,
  canvas: HTMLCanvasElement,
  crop: PixelCrop,
  scale = 1,
  rotate = 0
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("No 2d context");
  }

  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;

  // devicePixelRatio slightly increases sharpness on retina devices
  const pixelRatio = window.devicePixelRatio || 1;

  // Adjust canvas size to match crop dimensions with pixel ratio
  canvas.width = Math.floor(crop.width * scaleX * pixelRatio);
  canvas.height = Math.floor(crop.height * scaleY * pixelRatio);

  ctx.scale(pixelRatio, pixelRatio);
  ctx.imageSmoothingQuality = "high";

  // Calculate crop positions
  const cropX = crop.x * scaleX;
  const cropY = crop.y * scaleY;

  // Convert rotation from degrees to radians
  const rotateRads = rotate * TO_RADIANS;
  const centerX = image.naturalWidth / 2;
  const centerY = image.naturalHeight / 2;

  ctx.save();

  // Move the crop origin to the canvas origin (0,0)
  ctx.translate(-cropX, -cropY);
  // Move the origin to the center of the original position
  ctx.translate(centerX, centerY);
  // Apply rotation
  ctx.rotate(rotateRads);
  // Apply scale
  ctx.scale(scale, scale);
  // Move the center of the image to the origin (0,0)
  ctx.translate(-centerX, -centerY);

  // Draw the image to the canvas
  ctx.drawImage(
    image,
    0,
    0,
    image.naturalWidth,
    image.naturalHeight,
    0,
    0,
    image.naturalWidth,
    image.naturalHeight
  );

  ctx.restore();
}
