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

    // Resilient local file fallback
    const fallbackToLocal = (reason) => {
      if (handled) return;
      handled = true;
      try {
        const isPdf = options.resource_type === 'raw';
        const ext = isPdf ? '.pdf' : '.jpg';
        const filename = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}${ext}`;
        const filePath = path.join(uploadsDir, filename);

        fs.writeFileSync(filePath, buffer);
        console.warn(`[Storage Fallback Activated]: File saved locally to /uploads/${filename} (${reason})`);

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

        resolve({
          secure_url: `${host}/uploads/${filename}`,
          url: `${host}/uploads/${filename}`,
          relative_url: `/uploads/${filename}`,
          public_id: `local_${filename}`,
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
