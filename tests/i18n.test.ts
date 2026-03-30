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
  it('translates /it/progetti to /en/projects/', () => {
    expect(getAlternateUrl(new URL('http://x/it/progetti'), 'en')).toBe('/en/projects/');
  });

  it('translates /en/projects to /it/progetti/', () => {
    expect(getAlternateUrl(new URL('http://x/en/projects'), 'it')).toBe('/it/progetti/');
  });

  it('translates /it/soluzioni/progettazione-architettonica to /en/solutions/architectural-design/', () => {
    expect(
      getAlternateUrl(new URL('http://x/it/soluzioni/progettazione-architettonica'), 'en')
    ).toBe('/en/solutions/architectural-design/');
  });

  it('translates /en/solutions/architectural-design to /it/soluzioni/progettazione-architettonica/', () => {
    expect(
      getAlternateUrl(new URL('http://x/en/solutions/architectural-design'), 'it')
    ).toBe('/it/soluzioni/progettazione-architettonica/');
  });

  it('translates /it/chi-siamo to /en/about/', () => {
    expect(getAlternateUrl(new URL('http://x/it/chi-siamo'), 'en')).toBe('/en/about/');
  });

  it('returns lang root for path with no page slug', () => {
    expect(getAlternateUrl(new URL('http://x/it/'), 'en')).toBe('/en/');
  });

  it('passes through unknown page slugs unchanged', () => {
    expect(getAlternateUrl(new URL('http://x/it/unknown-page'), 'en')).toBe('/en/unknown-page/');
  });
});
