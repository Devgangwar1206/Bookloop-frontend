/**
 * Utility to process, resize and convert image files from user's device
 * into clean, lightweight Base64 Data URLs (JPEG).
 *
 * This ensures that uploaded photos:
 * 1. Are persistent across browser sessions and page reloads.
 * 2. Are visible across other accounts and devices (unlike blob: URLs).
 * 3. Fit easily into PostgreSQL TEXT columns without bloating payloads.
 */

export function processImageFile(file, maxWidth = 900, maxHeight = 900, quality = 0.78) {
  return new Promise((resolve, reject) => {
    if (!file) {
      return reject(new Error('No file provided'));
    }

    if (!file.type || !file.type.startsWith('image/')) {
      return reject(new Error('Selected file must be an image (JPEG, PNG, WEBP)'));
    }

    const reader = new FileReader();

    reader.onerror = () => {
      reject(new Error('Failed to read image file from device'));
    };

    reader.onload = () => {
      const img = new Image();

      img.onerror = () => {
        reject(new Error('Failed to parse image data'));
      };

      img.onload = () => {
        try {
          let width = img.width;
          let height = img.height;

          // Scale down proportionally if larger than maximum bounds
          if (width > maxWidth || height > maxHeight) {
            if (width / height > maxWidth / maxHeight) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            } else {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = Math.max(width, 1);
          canvas.height = Math.max(height, 1);

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            // Fallback to raw base64 if canvas is unavailable
            return resolve(reader.result);
          }

          // Draw white background in case of transparent PNGs
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          // Convert to compressed JPEG data URL
          const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(compressedDataUrl);
        } catch (err) {
          // Fallback to standard reader result if canvas operations fail
          resolve(reader.result);
        }
      };

      img.src = reader.result;
    };

    reader.readAsDataURL(file);
  });
}
