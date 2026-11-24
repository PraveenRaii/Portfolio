import api from './api';

export const voiceService = {
  /**
   * Fetch available HeyGen voices and the configured default
   */
  async getVoices() {
    return await api.get('/voice/voices');
  },

  /**
   * Fetch service connection status
   */
  async getStatus() {
    return await api.get('/voice/status');
  },

  /**
   * Synthesize raw text to speech
   * @param {string} text - text to speak
   * @param {string} voiceId - optional voice ID
   */
  async speak(text, voiceId) {
    return await api.post('/voice/speak', { text, voiceId });
  },

  /**
   * Ask the portfolio AI assistant a question and receive speech audio
   * @param {string} query - user question or predefined prompt
   * @param {string} voiceId - optional voice ID
   */
  async ask(query, voiceId) {
    return await api.post('/voice/ask', { query, voiceId });
  },
};
