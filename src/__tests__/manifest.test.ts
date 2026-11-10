import { describe, expect, it, vi } from 'vitest';
import { loadManifest, parseManifest } from '../manifest';

const diagram = {
  id: 'vue-fastapi-postgres',
  title: 'Vue + FastAPI + PostgreSQL',
  filename: 'vue-fastapi-postgres.html',
};

describe('parseManifest', () => {
  it('reads valid entries and accepts an empty library', () => {
    expect(parseManifest([diagram])).toEqual([diagram]);
    expect(parseManifest([])).toEqual([]);
  });

  it('returns trimmed titles and only supported fields', () => {
    expect(parseManifest([{ ...diagram, title: '  構成図  ', url: 'https://example.com' }]))
      .toEqual([{ ...diagram, title: '構成図' }]);
  });

  it.each([null, undefined, {}, '[]', 42, [null], [false]])('rejects malformed data: %j', (value) => {
    expect(() => parseManifest(value)).toThrow();
  });

  it.each(['id', 'title', 'filename'])('rejects a missing %s', (field) => {
    const entry: Record<string, unknown> = { ...diagram };
    delete entry[field];
    expect(() => parseManifest([entry])).toThrow();
  });

  it.each(['', '   ', 123, null])('rejects an invalid title: %j', (title) => {
    expect(() => parseManifest([{ ...diagram, title }])).toThrow();
  });

  it.each(['', ' ', '../diagram', '<script>', 123])('rejects an invalid id: %j', (id) => {
    expect(() => parseManifest([{ ...diagram, id }])).toThrow();
  });

  it('rejects duplicate IDs', () => {
    expect(() => parseManifest([diagram, { ...diagram, filename: 'other.html' }])).toThrow();
  });

  it.each([
    'https://example.com/a.html', '//example.com/a.html', '/a.html',
    '../a.html', 'folder/a.html', 'folder\\a.html', 'a.html?x=1', 'a.html#section',
    '%2e%2e%2fa.html', 'a%2f.html', 'a%5c.html', 'a.html%00', 'a\u0000.html',
    'javascript:alert(1)', 'data:text/html,hello', '.html', 'a.htm', 'a.svg',
    ' a.html', 'a.html ', '..html', 'a..html', 'a.html\n', '', 123,
  ])('rejects an unsafe filename: %j', (filename) => {
    expect(() => parseManifest([{ ...diagram, filename }])).toThrow();
  });
});

describe('loadManifest', () => {
  it('fetches and validates the local manifest', async () => {
    const fetcher = vi.fn().mockResolvedValue(new Response(JSON.stringify([diagram])));
    await expect(loadManifest(fetcher)).resolves.toEqual([diagram]);
    expect(fetcher).toHaveBeenCalledWith('/diagrams/index.json');
  });

  it('rejects an HTTP error even if its body is a valid manifest', async () => {
    const fetcher = vi.fn().mockResolvedValue(new Response('[]', { status: 404 }));
    await expect(loadManifest(fetcher)).rejects.toThrow();
  });

  it('rejects network failures, invalid JSON, and invalid entries', async () => {
    await expect(loadManifest(vi.fn().mockRejectedValue(new Error('offline')))).rejects.toThrow();
    await expect(loadManifest(vi.fn().mockResolvedValue(new Response('{')))).rejects.toThrow();
    await expect(loadManifest(vi.fn().mockResolvedValue(new Response('[{}]')))).rejects.toThrow();
  });
});
