export interface PreparedImage {
  file: File;
  originalSize: number;
  compressedSize: number;
  width?: number;
  height?: number;
}

const MAX_DIMENSION = 1800;
const JPEG_QUALITY = 0.82;
const WEBP_QUALITY = 0.82;

export async function prepareListingImage(file: File): Promise<PreparedImage> {
  if (!file.type.startsWith('image/') || file.type === 'image/gif') {
    return { file, originalSize: file.size, compressedSize: file.size };
  }

  try {
    const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
    const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height));
    const width = Math.max(1, Math.round(bitmap.width * scale));
    const height = Math.max(1, Math.round(bitmap.height * scale));
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      bitmap.close();
      return { file, originalSize: file.size, compressedSize: file.size };
    }

    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();

    const webp = await canvasToBlob(canvas, 'image/webp', WEBP_QUALITY);
    const jpeg = webp ?? (await canvasToBlob(canvas, 'image/jpeg', JPEG_QUALITY));
    if (!jpeg || jpeg.size >= file.size) {
      return { file, originalSize: file.size, compressedSize: file.size, width, height };
    }

    const ext = jpeg.type === 'image/webp' ? 'webp' : 'jpg';
    const name = replaceExtension(file.name, ext);
    const compressed = new File([jpeg], name, {
      type: jpeg.type,
      lastModified: Date.now(),
    });

    return {
      file: compressed,
      originalSize: file.size,
      compressedSize: compressed.size,
      width,
      height,
    };
  } catch {
    return { file, originalSize: file.size, compressedSize: file.size };
  }
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality: number): Promise<Blob | null> {
  return new Promise((resolve) => {
    canvas.toBlob(resolve, type, quality);
  });
}

function replaceExtension(name: string, ext: string): string {
  const clean = name.replace(/\.[a-z0-9]+$/i, '');
  return `${clean || 'listing-image'}.${ext}`;
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
