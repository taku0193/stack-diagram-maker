// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { mountApp } from '../app';

const diagrams = [
  { id: 'vue-stack', title: 'Vue 3 + FastAPI + PostgreSQL', filename: 'vue-stack.html' },
  { id: 'another', title: 'もうひとつの構成図', filename: 'another.html' },
];

let root: HTMLDivElement;
const respond = (value: unknown) => vi.fn().mockResolvedValue(new Response(JSON.stringify(value)));

beforeEach(() => {
  document.body.innerHTML = '<div id="app"></div>';
  root = document.querySelector<HTMLDivElement>('#app')!;
});

describe('diagram library', () => {
  it('lists diagrams and previews the first in a sandbox with no permissions', async () => {
    await mountApp(root, respond(diagrams));
    expect(root.querySelectorAll('.diagram-button')).toHaveLength(2);
    expect(root.querySelector('[data-count]')?.textContent).toBe('2');
    const frame = root.querySelector('iframe')!;
    expect(frame.getAttribute('src')).toBe('/diagrams/vue-stack.html');
    expect(frame.getAttribute('sandbox')).toBe('');
    expect(frame.title).toContain(diagrams[0].title);
    expect(frame.getAttribute('referrerpolicy')).toBe('no-referrer');
    const link = root.querySelector<HTMLAnchorElement>('[data-open]')!;
    expect(link.getAttribute('href')).toBe('/diagrams/vue-stack.html');
    expect(link.target).toBe('_blank');
    expect(link.rel).toBe('noopener noreferrer');
  });

  it('updates the preview, link, title and pressed state when another diagram is selected', async () => {
    await mountApp(root, respond(diagrams));
    const buttons = root.querySelectorAll<HTMLButtonElement>('.diagram-button');
    buttons[1].click();
    expect(buttons[0].getAttribute('aria-pressed')).toBe('false');
    expect(buttons[1].getAttribute('aria-pressed')).toBe('true');
    expect(root.querySelector('[data-preview-title]')?.textContent).toBe(diagrams[1].title);
    expect(root.querySelector('iframe')?.getAttribute('src')).toBe('/diagrams/another.html');
    expect(root.querySelector('[data-open]')?.getAttribute('href')).toBe('/diagrams/another.html');
  });

  it('renders manifest titles as text', async () => {
    const title = '<img src=x onerror=alert(1)>';
    await mountApp(root, respond([{ ...diagrams[0], title }]));
    expect(root.querySelector('.diagram-button')?.textContent).toContain(title);
    expect(root.querySelector('[data-preview-title]')?.textContent).toBe(title);
    expect(root.querySelector('img[src="x"]')).toBeNull();
  });

  it('shows an empty state without a preview or document link', async () => {
    await mountApp(root, respond([]));
    expect(root.textContent).toContain('まだ構成図がありません');
    expect(root.querySelector('[data-count]')?.textContent).toBe('0');
    expect(root.querySelector('iframe')).toBeNull();
    expect(root.querySelector('[data-open]')).toBeNull();
  });

  it('shows a loading state until the manifest arrives', async () => {
    let resolve!: (value: Response) => void;
    const pending = new Promise<Response>((done) => { resolve = done; });
    const mounted = mountApp(root, vi.fn().mockReturnValue(pending));
    expect(root.getAttribute('aria-busy')).toBe('true');
    expect(root.querySelector('[role="status"]')?.textContent).toContain('読み込んでいます');
    resolve(new Response('[]'));
    await mounted;
    expect(root.getAttribute('aria-busy')).toBe('false');
  });

  it.each([
    () => Promise.reject(new Error('offline')),
    () => Promise.resolve(new Response('[]', { status: 500 })),
    () => Promise.resolve(new Response('{')),
    () => Promise.resolve(new Response('[{"id":"bad","title":"Bad","filename":"../bad.html"}]')),
  ])('shows an error for failed or invalid manifests and permits retry', async (failure) => {
    const fetcher = vi.fn().mockImplementationOnce(failure).mockImplementation(() =>
      Promise.resolve(new Response(JSON.stringify(diagrams))));
    await mountApp(root, fetcher);
    expect(root.querySelector('[role="alert"]')?.textContent).toContain('読み込めませんでした');
    expect(root.querySelector('iframe')).toBeNull();
    expect(root.querySelector('[data-open]')).toBeNull();
    root.querySelector<HTMLButtonElement>('[data-retry]')!.click();
    await vi.waitFor(() => expect(root.querySelector('iframe')).not.toBeNull());
    expect(fetcher).toHaveBeenCalledTimes(2);
  });
});
