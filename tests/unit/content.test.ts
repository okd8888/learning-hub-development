import { describe, expect, it } from 'vitest';
import { getReadingMinutes } from '../../src/lib/reading-time';

describe('getReadingMinutes', () => {
  it('returns at least one minute', () => expect(getReadingMinutes('')).toBe(1));
  it('counts CJK characters and Latin words with separate rates', () => {
    const text='資料'.repeat(175)+' word '.repeat(200);
    expect(getReadingMinutes(text)).toBe(2);
  });
});
