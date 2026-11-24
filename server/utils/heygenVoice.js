const https = require('https');

// In-memory audio response cache to minimize duplicate API calls and stay within free limits
const audioCache = new Map();

// Default curated voice options (tested with HeyGen v3)
const DEFAULT_VOICES = [
  {
    id: '80b17a1be1594e578b92c0ddf4a37fc8',
    name: 'Lewis - Imaginative & Expressive',
    gender: 'male',
    locale: 'en-GB',
    description: 'Natural, warm male developer persona (Praveen Default)',
    tags: ['Young', 'Warm', 'Breathy', 'Rich'],
  },
  {
    id: '330290724a1b470fb63153f34d4c0183',
    name: 'Annie - Lifelike',
    gender: 'female',
    locale: 'en-US',
    description: 'Clear, modern, and engaging female voice',
    tags: ['Young', 'Clear', 'Soft', 'Natural'],
  },
  {
    id: 'c30ecab014cb4a8d816d07f6b2b625c8',
    name: 'Brodie - Breezy & Genuine',
    gender: 'male',
    locale: 'en-GB',
    description: 'Brisk, approachable tech presenter voice',
    tags: ['Young', 'Soft', 'Crisp'],
  },
  {
    id: '4270665fc47f44aa989c093bb3dc2b99',
    name: 'Janet - Warm & Approachable',
    gender: 'female',
    locale: 'en-US',
    description: 'Smooth, polished executive guide',
    tags: ['Mature', 'Warm', 'Smooth'],
  },
  {
    id: 'b5c5b28db1ea408abc7d851202983bdb',
    name: 'Roderic - Authoritative & Refined',
    gender: 'male',
    locale: 'en-GB',
    description: 'Deep, structured, authoritative voice',
    tags: ['Old', 'Deep', 'Rich'],
  },
];

/**
 * Clean text for natural speech synthesis
 * Strips Markdown, emojis, and symbols that sound awkward when spoken aloud
 */
const cleanTextForSpeech = (text = '') => {
  if (!text) return '';
  return text
    .replace(/[*_#`~>\[\]()]/g, ' ')
    .replace(/https?:\/\/\S+/g, 'link')
    .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 800); // Keep voice clips punchy & fast
};

/**
 * Perform HTTPS JSON request to HeyGen API
 */
const makeHeyGenRequest = (endpoint, method = 'GET', data = null) => {
  return new Promise((resolve, reject) => {
    const apiKey = process.env.HEYGEN_API_KEY;
    if (!apiKey) {
      return reject(new Error('HEYGEN_API_KEY is not configured in server environment'));
    }

    const payload = data ? JSON.stringify(data) : null;
    const options = {
      hostname: 'api.heygen.com',
      path: endpoint,
      method: method,
      headers: {
        'x-api-key': apiKey,
        'Content-Type': 'application/json',
      },
      timeout: 25000,
    };

    if (payload) {
      options.headers['Content-Length'] = Buffer.byteLength(payload);
    }

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });

      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(parsed);
          } else {
            const errMsg =
              parsed.error?.message ||
              parsed.message ||
              `HeyGen API Error: HTTP ${res.statusCode}`;
            const err = new Error(errMsg);
            err.code = parsed.error?.code || 'HEYGEN_ERROR';
            err.status = res.statusCode;
            reject(err);
          }
        } catch (parseErr) {
          reject(new Error(`Failed to parse HeyGen response: ${body.slice(0, 150)}`));
        }
      });
    });

    req.on('error', (e) => {
      reject(new Error(`HeyGen Network Error: ${e.message}`));
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('HeyGen API request timed out after 25s'));
    });

    if (payload) {
      req.write(payload);
    }
    req.end();
  });
};

/**
 * Get account connection status
 */
const getHeyGenStatus = async () => {
  try {
    const res = await makeHeyGenRequest('/v3/users/me', 'GET');
    return {
      connected: true,
      email: res.data?.email || '',
      billingType: res.data?.billing_type || 'wallet',
      remainingBalance: res.data?.wallet?.remaining_balance || 0,
      currency: res.data?.wallet?.currency || 'usd',
    };
  } catch (err) {
    return {
      connected: false,
      error: err.message,
    };
  }
};

/**
 * Get list of available voices
 */
const getHeyGenVoices = async () => {
  try {
    const res = await makeHeyGenRequest('/v3/models/audio/voices?type=public', 'GET');
    if (res.data && Array.isArray(res.data) && res.data.length > 0) {
      // Map to clean format and return top options
      const remoteVoices = res.data.slice(0, 15).map((v) => ({
        id: v.voice_id,
        name: v.name,
        gender: v.gender,
        locale: v.locale || 'en-US',
        previewAudio: v.preview_audio_url || '',
        tags: v.tags || [],
      }));
      return remoteVoices;
    }
    return DEFAULT_VOICES;
  } catch (err) {
    console.warn('[HeyGen Voice] Voice fetch fallback to curated defaults:', err.message);
    return DEFAULT_VOICES;
  }
};

/**
 * Synthesize speech from text using HeyGen Voice 1 Turbo Free
 * @param {Object} params - { text, voiceId }
 */
const synthesizeSpeech = async ({ text, voiceId }) => {
  const clean = cleanTextForSpeech(text);
  if (!clean) {
    throw new Error('Text to synthesize cannot be empty');
  }

  const selectedVoiceId =
    voiceId ||
    process.env.HEYGEN_DEFAULT_VOICE_ID ||
    DEFAULT_VOICES[0].id;

  // Check cache first
  const cacheKey = `${selectedVoiceId}_${clean}`;
  if (audioCache.has(cacheKey)) {
    return {
      ...audioCache.get(cacheKey),
      cached: true,
    };
  }

  const requestBody = {
    voice_id: selectedVoiceId,
    text: clean,
    model: 'heygen-voice-1-turbo-free',
  };

  const response = await makeHeyGenRequest('/v3/models/audio/tts', 'POST', requestBody);

  const result = {
    audioUrl: response.data?.audio_url,
    duration: response.data?.duration || 0,
    text: clean,
    voiceId: selectedVoiceId,
    timestamp: new Date().toISOString(),
  };

  // Cache up to 100 recent synthesized voice clips
  if (audioCache.size > 100) {
    const firstKey = audioCache.keys().next().value;
    audioCache.delete(firstKey);
  }
  audioCache.set(cacheKey, result);

  return result;
};

module.exports = {
  cleanTextForSpeech,
  getHeyGenStatus,
  getHeyGenVoices,
  synthesizeSpeech,
  DEFAULT_VOICES,
};
