// Client-side avatar compression.
// iPhone photos are routinely 3–5 MB, but a profile avatar is only ever shown
// in a small square. We center-crop to a square, downscale to `maxSize`px, and
// re-encode as JPEG so the uploaded file is ~40–90 KB regardless of the source.

interface CompressOptions {
  /** Output width/height in px (square). Default 512. */
  maxSize?: number;
  /** JPEG quality, 0–1. Default 0.85. */
  quality?: number;
}

function loadImageElement(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = (e) => {
      URL.revokeObjectURL(url);
      reject(e);
    };
    img.src = url;
  });
}

export async function compressImage(
  file: File,
  { maxSize = 512, quality = 0.85 }: CompressOptions = {}
): Promise<File> {
  // Leave non-images untouched (defensive — input has accept="image/*").
  if (!file.type.startsWith('image/')) return file;

  // createImageBitmap with `from-image` applies EXIF orientation (iPhone
  // photos are often rotated via metadata). Fall back to an <img> element
  // where it's unsupported.
  let source: CanvasImageSource;
  let srcWidth: number;
  let srcHeight: number;
  let bitmap: ImageBitmap | null = null;

  try {
    bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
    source = bitmap;
    srcWidth = bitmap.width;
    srcHeight = bitmap.height;
  } catch {
    const img = await loadImageElement(file);
    source = img;
    srcWidth = img.naturalWidth;
    srcHeight = img.naturalHeight;
  }

  // Center-crop to a square, then downscale to maxSize (never upscale).
  const side = Math.min(srcWidth, srcHeight);
  const sx = (srcWidth - side) / 2;
  const sy = (srcHeight - side) / 2;
  const target = Math.min(maxSize, side);

  const canvas = document.createElement('canvas');
  canvas.width = target;
  canvas.height = target;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    bitmap?.close();
    return file;
  }

  ctx.drawImage(source, sx, sy, side, side, 0, 0, target, target);
  bitmap?.close();

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, 'image/jpeg', quality)
  );

  // If encoding failed, or somehow produced a larger file, keep the original.
  if (!blob || blob.size >= file.size) return file;

  const name = file.name.replace(/\.[^.]+$/, '') + '.jpg';
  return new File([blob], name, { type: 'image/jpeg' });
}
