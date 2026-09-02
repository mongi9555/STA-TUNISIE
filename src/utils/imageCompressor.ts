/**
 * Compresses an uploaded File directly into an optimized square avatar Data URL.
 */
export function fileToCompressedAvatarDataUrl(
  file: File,
  size = 320,
  quality = 0.85
): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('Le fichier sélectionné n\'est pas une image valide.'));
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (!result) {
        reject(new Error('Impossible de lire le fichier image.'));
        return;
      }

      const img = new Image();
      img.onload = () => {
        // Calculate square center crop
        const minDim = Math.min(img.width, img.height);
        const startX = (img.width - minDim) / 2;
        const startY = (img.height - minDim) / 2;

        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        if (ctx) {
          // Smooth image scaling
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, startX, startY, minDim, minDim, 0, 0, size, size);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(compressedDataUrl);
        } else {
          resolve(result);
        }
      };
      img.onerror = () => reject(new Error('Impossible de charger l\'image.'));
      img.src = result;
    };
    reader.onerror = () => reject(new Error('Erreur lors de la lecture du fichier.'));
    reader.readAsDataURL(file);
  });
}

/**
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

/**
 * Compresses an uploaded car photo File into an optimized high-resolution Data URL.
 * Produces crisp, lightweight JPEG data URLs (~35-60KB) that are completely self-contained,
 * persistent across page reloads and cloud containers, and safe for Firestore & LocalStorage.
 */
export function fileToCompressedCarImageDataUrl(
  file: File,
  maxWidth = 1280,
  maxHeight = 960,
  quality = 0.8
): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('Le fichier sélectionné n\'est pas une image valide.'));
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (!result) {
        reject(new Error('Impossible de lire le fichier image.'));
        return;
      }

      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          if (width / maxWidth > height / maxHeight) {
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
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL('image/jpeg', quality);
          resolve(compressed);
        } else {
          resolve(result);
        }
      };
      img.onerror = () => reject(new Error('Impossible de charger l\'image.'));
      img.src = result;
    };
    reader.onerror = () => reject(new Error('Erreur lors de la lecture du fichier.'));
    reader.readAsDataURL(file);
  });
}

/**
 * Uploads a car image file: compresses it into a high-efficiency Data URL (~40-60KB)
 * that is persistent across reloads, and simultaneously writes a server copy.
 */
export async function uploadCarImageFile(file: File): Promise<string> {
  const compressedDataUrl = await fileToCompressedCarImageDataUrl(file);

  // Background server upload for filesystem backup
  try {
    fetch('/api/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fileName: file.name || 'car_photo.jpg',
        fileData: compressedDataUrl,
      }),
    }).catch(() => {});
  } catch (err) {
    // Non-blocking
  }

  // Return the compressed Data URL directly: it works 100% reliably in any iframe,
  // survives page refreshes, and does not depend on ephemeral container disks.
  return compressedDataUrl;
}

/**
 * Uploads multiple car images in batch and returns an array of image URLs.
 */
export async function uploadMultipleCarImages(files: FileList | File[]): Promise<string[]> {
  const fileArray = Array.from(files);
  const results: string[] = [];

  for (const file of fileArray) {
    if (file.type.startsWith('image/')) {
      try {
        const url = await uploadCarImageFile(file);
        results.push(url);
      } catch (err) {
        console.error('[Upload] Error uploading car image:', file.name, err);
      }
    }
  }

  return results;
}
