/**
 * URL normalization utility for server responses
 * Ensures local upload paths and stored localhost URLs are dynamically transformed into
 * the actual reachable host (Render domain, Wi-Fi IP, etc.) based on incoming request headers.
 */

const normalizeAssetUrl = (url, req) => {
  if (!url || typeof url !== 'string' || url.trim() === '') {
    return '';
  }

  const cleanUrl = url.trim();

  // 1. Data URIs and Blob URLs are already self-contained and permanent
  if (cleanUrl.startsWith('data:') || cleanUrl.startsWith('blob:')) {
    return cleanUrl;
  }

  // Determine current host from process.env or incoming Express request
  const protocol = req?.headers?.['x-forwarded-proto'] || req?.protocol || 'http';
  const hostHeader = req?.headers?.['x-forwarded-host'] || req?.get?.('host');
  const port = process.env.PORT || 5000;
  const currentHost = process.env.BACKEND_URL || (hostHeader ? `${protocol}://${hostHeader}` : `http://localhost:${port}`);

  // 2. Replace deprecated Unsplash woman placeholder or stale local avatars with standard avatar
  if (
    cleanUrl.includes('photo-1534528741775-53994a69daeb') ||
    cleanUrl.includes('default-avatar') ||
    cleanUrl.includes('1hk7ux')
  ) {
    return '/profile.jpg';
  }

  // 2. Handle localhost:5000 / 127.0.0.1:5000 stored in database
  if (cleanUrl.includes('localhost:5000') || cleanUrl.includes('127.0.0.1:5000')) {
    if (currentHost) {
      return cleanUrl.replace(/https?:\/\/(localhost|127\.0\.0\.1):5000/g, currentHost);
    }
  }

  // 3. Handle relative /uploads/... paths
  if (cleanUrl.startsWith('/uploads/')) {
    return `${currentHost}${cleanUrl}`;
  }

  return cleanUrl;
};

module.exports = {
  normalizeAssetUrl,
};
