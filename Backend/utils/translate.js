const logger = require('./logger');

/**
 * Translates English text to Arabic using Google's free translation service
 * @param {string} text - The English text to translate
 * @returns {Promise<string>} The translated Arabic text
 */
const translateToArabic = async (text) => {
  if (!text || typeof text !== 'string' || !text.trim()) {
    return '';
  }

  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=ar&dt=t&q=${encodeURIComponent(text)}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    if (data && data[0]) {
      // Google splits translation into segments for each sentence; map and join them.
      return data[0].map(x => x[0]).join('');
    }
    return '';
  } catch (error) {
    logger.error(`Translation failed: ${error.message}`);
    return ''; // Return empty string as a fallback so it doesn't crash the server
  }
};

module.exports = translateToArabic;
