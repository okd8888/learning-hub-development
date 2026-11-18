export function createUrlHelper(base: string) {
  const normalized = base === '/' || base === '' ? '' : `/${base.replace(/^\/+|\/+$/g, '')}`;
  return function withBase(path: string): string {
    if (/^#/.test(path) || path.startsWith('//')) return path;
    if (/^[a-z][a-z\d+.-]*:/i.test(path)) {
      if (!/^(?:https?:|mailto:)/i.test(path)) throw new Error('僅允許 http、https 或 mailto 外部網址');
      return path;
    }
    const suffixIndex = path.search(/[?#]/u);
    const pathname = suffixIndex < 0 ? path : path.slice(0, suffixIndex);
    const suffix = suffixIndex < 0 ? '' : path.slice(suffixIndex);
    const clean = pathname.replace(/^\/+/, '');
    if (clean.split('/').includes('..') || clean.includes('\\') || clean.includes('\0')) throw new Error('站內路徑不可越界');
    const prefixed = normalized && (clean === normalized.slice(1) || clean.startsWith(`${normalized.slice(1)}/`))
      ? `/${clean}` : `${normalized}/${clean}`;
    return `${prefixed || '/'}${suffix}`;
  };
}

export const withBase = createUrlHelper(import.meta.env.BASE_URL);
