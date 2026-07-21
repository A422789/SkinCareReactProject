import { describe, it, expect, beforeEach } from 'vitest';
import { formatPrice } from '../lib/utils';

describe('formatPrice utility function', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should format price as EGP when language is set to English', () => {
    localStorage.setItem('site_lang', 'en');
    const result = formatPrice(38);
    expect(result).toBe('38.00 EGP');
  });

  it('should format price as EGP when language is not set (default to English)', () => {
    const result = formatPrice(62);
    expect(result).toBe('62.00 EGP');
  });

  it('should format price with Arabic suffix when language is set to Arabic', () => {
    localStorage.setItem('site_lang', 'ar');
    const result = formatPrice(38);
    expect(result).toBe('38 ج');
  });
});
