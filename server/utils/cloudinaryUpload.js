const fs = require('fs');
const path = require('path');
const { Readable } = require('stream');
const cloudinary = require('../config/cloudinary');

// Ensure local uploads directory exists for fallback storage
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

/**
 * Upload buffer to Cloudinary with automatic local storage fallback on 403/network errors
 * @param {Buffer} buffer - File buffer from multer
 * @param {Object} options - Cloudinary upload options { folder, resource_type, public_id }
 * @param {Object} req - Optional Express request for determining current host dynamically
 */
const uploadToCloudinary = (buffer, options = {}, req = null) => {
  return new Promise((resolve) => {
    let handled = false;

    // Resilient local file & Base64 Data URI fallback
    const fallbackToLocal = (reason) => {
      if (handled) return;
      handled = true;
      try {
        const isPdf = options.resource_type === 'raw';

        // 1. Detect image mime type from buffer magic bytes for clean Base64 data URI
        let mimeType = 'image/jpeg';
        if (isPdf || (buffer.length > 4 && buffer.slice(0, 4).toString() === '%PDF')) {
          mimeType = 'application/pdf';
        } else if (buffer.length > 3 && buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47) {
          mimeType = 'image/png';
        } else if (buffer.length > 3 && buffer.slice(0, 4).toString() === 'RIFF' && buffer.slice(8, 12).toString() === 'WEBP') {
          mimeType = 'image/webp';
        } else if (buffer.length > 2 && buffer.slice(0, 3).toString() === 'GIF') {
          mimeType = 'image/gif';
        }

        const ext = isPdf ? '.pdf' : mimeType === 'image/png' ? '.png' : mimeType === 'image/webp' ? '.webp' : '.jpg';
        const filename = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}${ext}`;
        const filePath = path.join(uploadsDir, filename);

        // Also save to local uploads dir as secondary copy
        try {
          fs.writeFileSync(filePath, buffer);
        } catch (writeErr) {
          console.warn('[Storage Local Write Notice]:', writeErr.message);
        }

        const port = process.env.PORT || 5000;
        let host = process.env.BACKEND_URL;
        if (!host && req) {
          const protocol = req.headers?.['x-forwarded-proto'] || req.protocol || 'http';
          const hostHeader = req.headers?.['x-forwarded-host'] || req.get?.('host');
          if (hostHeader) {
            host = `${protocol}://${hostHeader}`;
          }
        }
        if (!host) {
          host = `http://localhost:${port}`;
        }

        // PERMANENT STORAGE FIX:
        // Render free-tier dynos have ephemeral disks that wipe /uploads/ on sleep/restart.
        // For images, we provide a Base64 Data URI directly in secure_url and url.
        // Stored in MongoDB Atlas, this data URI NEVER expires, NEVER 404s, and survives all restarts permanently!
        const isImage = !isPdf && mimeType !== 'application/pdf';
        const dataUri = isImage ? `data:${mimeType};base64,${buffer.toString('base64')}` : `${host}/uploads/${filename}`;

        console.warn(`[Storage Fallback Activated]: File stored permanently as ${isImage ? 'Base64 Data URI' : '/uploads/' + filename} (${reason})`);

        resolve({
          secure_url: dataUri,
          url: dataUri,
          relative_url: `/uploads/${filename}`,
          public_id: `b64_${Date.now()}_${filename}`,
        });
      } catch (err) {
        console.error('[Storage Fallback Error]:', err);
        resolve({
          secure_url: '',
          url: '',
          public_id: '',
        });
      }
    };

    try {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: options.folder || 'portfolio',
          resource_type: options.resource_type || 'auto',
          ...options,
        },
        (error, result) => {
          if (error) {
            return fallbackToLocal(`Cloudinary returned ${error.http_code || 403}: ${error.message}`);
          }
          if (!handled) {
            handled = true;
            resolve(result);
          }
        }
      );

      // Listen on stream error to prevent Unhandled Rejection
      uploadStream.on('error', (streamErr) => {
        fallbackToLocal(`Cloudinary stream error: ${streamErr.message}`);
      });

      const stream = Readable.from(buffer);
      stream.on('error', (streamErr) => {
        fallbackToLocal(`Read stream error: ${streamErr.message}`);
      });

      stream.pipe(uploadStream);
    } catch (err) {
      fallbackToLocal(`Upload exception: ${err.message}`);
    }
  });
};

/**
 * Delete asset from Cloudinary or local storage
 * @param {String} publicId - Cloudinary public_id or local identifier
 * @param {String} resourceType - 'image' or 'raw'
 */
const deleteFromCloudinary = async (publicId, resourceType = 'image') => {
  if (!publicId) return null;
  try {
    if (publicId.startsWith('b64_')) {
      return { result: 'ok' };
    }
    if (publicId.startsWith('local_')) {
      const filename = publicId.replace('local_', '');
      const filePath = path.join(uploadsDir, filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      return { result: 'ok' };
    }
    return await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
  } catch (error) {
    console.error(`[Delete Asset Notice]: ${error.message}`);
    return null;
  }
};

module.exports = {
  uploadToCloudinary,
  deleteFromCloudinary,
};
