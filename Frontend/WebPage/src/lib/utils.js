/**
 * Format a numeric price based on the current site language.
 * @param {number} price
 * @returns {string}
 */
export function formatPrice(price) {
  const lang = localStorage.getItem('site_lang') || 'en';
  if (lang === 'ar') {
    return `${price} ج`;
  }
  return `${price.toFixed(2)} EGP`;
}
