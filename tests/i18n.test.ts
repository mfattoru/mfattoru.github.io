import { describe, it, expect } from 'vitest';
import { t, getLangFromUrl, getAlternateUrl } from '../src/i18n/utils';

describe('t()', () => {
  it('returns Italian translation for known key', () => {
    expect(t('it', 'nav.home')).toBe('Home');
  });

  it('returns English translation for known key', () => {
    expect(t('en', 'nav.about')).toBe('About');
  });

  it('returns the key itself for unknown keys', () => {
    expect(t('it', 'no.such.key')).toBe('no.such.key');
  });
});

describe('getLangFromUrl()', () => {
  it('returns it for /it/ path', () => {
    expect(getLangFromUrl(new URL('https://mfattoru.github.io/it/'))).toBe('it');
  });

  it('returns en for /en/about path', () => {
    expect(getLangFromUrl(new URL('https://mfattoru.github.io/en/about'))).toBe('en');
  });

  it('defaults to it for root or unknown prefix', () => {
    expect(getLangFromUrl(new URL('https://mfattoru.github.io/'))).toBe('it');
  });
});

describe('getAlternateUrl()', () => {
  it('swaps /it/ to /en/ in path', () => {
    expect(getAlternateUrl(new URL('https://mfattoru.github.io/it/chi-siamo'), 'en')).toBe('/en/chi-siamo');
  });

  it('swaps /en/ to /it/ in path', () => {
    expect(getAlternateUrl(new URL('https://mfattoru.github.io/en/about'), 'it')).toBe('/it/about');
  });
});
