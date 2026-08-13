/**
 * Compresses a Data URL image to a maximum dimension and quality.
 * If the input is a PDF or non-image, or if it is already small, returns as is.
 */
export function compressImageDataUrl(
  dataUrl: string,
  maxWidth = 1200,
  maxHeight = 1200,
  quality = 0.8
): Promise<string> {
  return new Promise((resolve) => {
    if (!dataUrl || !dataUrl.startsWith('data:image/')) {
      resolve(dataUrl);
      return;
    }

    // Skip compression if already very small (< 100KB)
    if (dataUrl.length < 100000) {
      resolve(dataUrl);
      return;
    }

    const img = new Image();
    img.src = dataUrl;
    img.onload = () => {
      let width = img.width;
      let height = img.height;

      if (width > maxWidth || height > maxHeight) {
        if (width > height) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        } else {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      if (ctx) {
        // Draw image onto canvas
        ctx.drawImage(img, 0, 0, width, height);
        // Convert to optimized JPEG data URL
        const compressed = canvas.toDataURL('image/jpeg', quality);
        resolve(compressed);
      } else {
        resolve(dataUrl);
      }
    };

    img.onerror = () => resolve(dataUrl);
  });
}
