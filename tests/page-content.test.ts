import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

function readContent(filename: string): string {
  return readFileSync(resolve('src/content/page-content', filename), 'utf-8');
}

describe('page-content/about.md', () => {
  it('exists and contains all required IT fields', () => {
    const content = readContent('about.md');
    expect(content).toContain('firmHeadingIt:');
    expect(content).toContain('firmBodyIt:');
    expect(content).toContain('missionHeadingIt:');
    expect(content).toContain('missionBodyIt:');
  });

  it('contains all required EN fields', () => {
    const content = readContent('about.md');
    expect(content).toContain('firmHeadingEn:');
    expect(content).toContain('firmBodyEn:');
    expect(content).toContain('missionHeadingEn:');
    expect(content).toContain('missionBodyEn:');
  });
});

describe('page-content/pricing.md', () => {
  it('exists and contains all required fields', () => {
    const content = readContent('pricing.md');
    expect(content).toContain('introParagraphIt:');
    expect(content).toContain('introParagraphEn:');
    expect(content).toContain('complianceParagraphIt:');
    expect(content).toContain('complianceParagraphEn:');
  });
});

describe('page-content/homepage.md', () => {
  it('exists and contains all four stat values', () => {
    const content = readContent('homepage.md');
    expect(content).toContain('stat1Value:');
    expect(content).toContain('stat2Value:');
    expect(content).toContain('stat3Value:');
    expect(content).toContain('stat4Value:');
  });

  it('contains all IT and EN stat labels', () => {
    const content = readContent('homepage.md');
    ['stat1LabelIt','stat1LabelEn','stat2LabelIt','stat2LabelEn',
     'stat3LabelIt','stat3LabelEn','stat4LabelIt','stat4LabelEn'].forEach(field => {
      expect(content).toContain(`${field}:`);
    });
  });
});
