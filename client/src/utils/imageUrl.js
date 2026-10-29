/**
 * Image and Asset URL helper
 * Ensures images and assets load properly across all devices (Desktop, Mobile/Phone),
 * local development (localhost, local Wi-Fi IP), and cloud deployment (Render, Vercel, Netlify).
 */

export const DEFAULT_AVATAR = '/profile.jpg';
export const DEFAULT_RESUME = '/uploads/Praveen_Rai_Resume.pdf';

/**
 * Bulletproof inline SVG Data URI fallback
 * Renders an instant high-resolution glowing monogram avatar if static files or network fail.
 */
export const FALLBACK_AVATAR_DATA_URI =
  'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNjAiIGhlaWdodD0iMTYwIiB2aWV3Qm94PSIwIDAgMTYwIDE2MCI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJnIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj48c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjNGY0NmU1Ii8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjMDZiNmQ0Ii8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PHJlY3Qgd2lkdGg9IjE2MCIgaGVpZ2h0PSIxNjAiIHJ4PSIzNiIgZmlsbD0idXJsKCNnKSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTQlIiBmb250LWZhbWlseT0ic3lzdGVtLXVpLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjUyIiBmb250LXdlaWdodD0iOTAwIiBmaWxsPSIjZmZmZmZmIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5QUjwvdGV4dD48L3N2Zz4=';

/**
 * Resolves an asset URL so it works seamlessly on phone links, localhost, and production.
 * @param {string} url - Image or asset URL from database or state
 * @returns {string} Fully resolved, reachable URL
 */
export const getAssetUrl = (url) => {
  if (!url || typeof url !== 'string' || url.trim() === '') {
    return DEFAULT_AVATAR;
  }

  const cleanUrl = url.trim();

  // 1. If it's the old Unsplash stock placeholder, replace with Praveen's real bundled photo
  if (
    cleanUrl.includes('photo-1534528741775-53994a69daeb') ||
    cleanUrl.includes('default-avatar')
  ) {
    return DEFAULT_AVATAR;
  }

  // 2. Blob or Data URLs (e.g. from local file selection preview or SVG data URI)
  if (cleanUrl.startsWith('blob:') || cleanUrl.startsWith('data:')) {
    return cleanUrl;
  }

  const isHttps = typeof window !== 'undefined' && window.location.protocol === 'https:';

  // 3. Determine backend base origin from VITE_API_URL or current host
  const apiUrl = import.meta.env.VITE_API_URL || '';
  let backendOrigin = '';
  if (apiUrl) {
    try {
      const parsed = new URL(apiUrl, window.location.origin);
      // Strip trailing '/api' or '/api/' to get base origin
      backendOrigin = `${parsed.protocol}//${parsed.host}`;
    } catch {
      backendOrigin = '';
    }
  }

  // 4. Handle localhost:5000 or 127.0.0.1:5000 saved URLs
  if (cleanUrl.includes('localhost:5000') || cleanUrl.includes('127.0.0.1:5000')) {
    // If deployed on cloud and backendOrigin is available
    if (backendOrigin && !backendOrigin.includes('localhost')) {
      return cleanUrl.replace(/https?:\/\/(localhost|127\.0\.0\.1):5000/g, backendOrigin);
    }

    // On HTTPS cloud site without backend origin, never output http://localhost:5000 (blocks Mixed Content)
    if (isHttps) {
      if (cleanUrl.includes('1hk7ux') || cleanUrl.includes('avatar') || cleanUrl.includes('profile')) {
        return DEFAULT_AVATAR;
      }
      if (cleanUrl.includes('/uploads/')) {
        return cleanUrl.substring(cleanUrl.indexOf('/uploads/'));
      }
      return DEFAULT_AVATAR;
    }

    // If accessing via local network Wi-Fi on phone (e.g. http://192.168.1.5:5173)
    if (
      typeof window !== 'undefined' &&
      window.location.hostname !== 'localhost' &&
      window.location.hostname !== '127.0.0.1'
    ) {
      return cleanUrl.replace(/localhost|127\.0\.0\.1/g, window.location.hostname);
    }
  }

  // 5. Handle relative /uploads/... paths
  if (cleanUrl.startsWith('/uploads/')) {
    if (backendOrigin) {
      return `${backendOrigin}${cleanUrl}`;
    }
    if (isHttps) {
      if (cleanUrl.includes('1hk7ux') || cleanUrl.includes('avatar')) {
        return DEFAULT_AVATAR;
      }
      return cleanUrl;
    }
    if (
      typeof window !== 'undefined' &&
      window.location.hostname !== 'localhost' &&
      window.location.hostname !== '127.0.0.1'
    ) {
      return `http://${window.location.hostname}:5000${cleanUrl}`;
    }
    return cleanUrl;
  }

  // 6. Upgrading HTTP images to HTTPS when the site is running on HTTPS (prevents Mixed Content)
  if (isHttps && cleanUrl.startsWith('http://') && !cleanUrl.includes('localhost') && !cleanUrl.includes('127.0.0.1')) {
    return cleanUrl.replace(/^http:\/\//i, 'https://');
  }

  return cleanUrl;
};

/**
 * Compresses an image client-side to ensure fast, reliable mobile uploads without hitting file limits.
 * Handles high-resolution camera photos from smartphones (often 8MB - 20MB) by resizing to max 1200x1200px
 * and compressing to ~200-400KB JPEG.
 * @param {File} file - Raw File object from <input type="file">
 * @param {number} maxWidth - Max pixel width (default 1200)
 * @param {number} maxHeight - Max pixel height (default 1200)
 * @param {number} quality - JPEG compression quality (0.0 to 1.0, default 0.85)
 * @returns {Promise<File>} Compressed File object
 */
export const compressImageFile = (
  file,
  maxWidth = 1200,
  maxHeight = 1200,
  quality = 0.85
) => {
  return new Promise((resolve) => {
    // Only process images (skip SVGs and non-images)
    if (!file || !file.type.startsWith('image/') || file.type === 'image/svg+xml') {
      return resolve(file);
    }

    // If file is already very small (< 400KB), return as is
    if (file.size <= 400 * 1024) {
      return resolve(file);
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              return resolve(file);
            }
            const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, '.jpg'), {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          },
          'image/jpeg',
          quality
        );
      };
      img.onerror = () => resolve(file);
      img.src = e.target.result;
    };
    reader.onerror = () => resolve(file);
    reader.readAsDataURL(file);
  });
};
