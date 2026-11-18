import { describe, expect, it } from 'vitest';
import { createUrlHelper } from '../../src/lib/urls';

describe('createUrlHelper', () => {
  it('handles root and project bases without duplicate prefixes', () => {
    expect(createUrlHelper('/')('/articles/a/')).toBe('/articles/a/');
    expect(createUrlHelper('/learning-hub/')('/articles/a/')).toBe('/learning-hub/articles/a/');
    expect(createUrlHelper('/learning-hub')('/learning-hub/articles/a/')).toBe('/learning-hub/articles/a/');
  });
  it('preserves query strings, fragments and allowed external URLs', () => {
    const withBase=createUrlHelper('/learning-hub/');
    expect(withBase('/search/?q=中文#result')).toBe('/learning-hub/search/?q=中文#result');
    expect(withBase('#toc')).toBe('#toc');
    expect(withBase('https://example.com/a')).toBe('https://example.com/a');
  });
  it('rejects unsafe schemes and path traversal', () => {
    const withBase=createUrlHelper('/learning-hub');
    expect(()=>withBase('javascript:alert(1)')).toThrow();
    expect(()=>withBase('/articles/../secret')).toThrow();
  });
});
