const logger = require('./logger');

/**
 * Internal: calls Google's free translation API
 * @param {string} text - Input text
 * @param {string} sl   - Source language ('en', 'ar', ...)
 * @param {string} tl   - Target language ('en', 'ar', ...)
 * @returns {Promise<string>}
 */
const _translate = async (text, sl, tl) => {
  if (!text || typeof text !== 'string' || !text.trim()) return '';
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sl}&tl=${tl}&dt=t&q=${encodeURIComponent(text)}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    if (data && data[0]) return data[0].map(x => x[0]).join('');
    return '';
  } catch (error) {
    logger.error(`Translation (${sl}→${tl}) failed: ${error.message}`);
    return ''; // Fallback — never crash the server
  }
};

/**
 * Bidirectional bilingual field helper.
 * Accepts a { en?, ar? } object and returns a complete { en, ar } object
 * by auto-translating whichever language is missing.
 *
 * - Only EN provided  → auto-translate EN → AR
 * - Only AR provided  → auto-translate AR → EN
 * - Both provided     → use as-is
 * - Neither provided  → { en: '', ar: '' }
 *
 * @param {{ en?: string, ar?: string } | undefined} field
 * @returns {Promise<{ en: string, ar: string }>}
 */
const translateBilingual = async (field) => {
  if (!field) return { en: '', ar: '' };

  const en = (field.en && typeof field.en === 'string') ? field.en.trim() : '';
  const ar = (field.ar && typeof field.ar === 'string') ? field.ar.trim() : '';

  if (en && !ar) return { en, ar: await _translate(en, 'en', 'ar') };
  if (ar && !en) return { en: await _translate(ar, 'ar', 'en'), ar };
  return { en, ar };
};

module.exports = { translateBilingual };
