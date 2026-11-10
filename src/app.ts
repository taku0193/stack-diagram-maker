import { loadManifest, type Diagram } from './manifest';
import { selectDiagram } from './selection';

const stackIcon = `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5M3 16l9 5 9-5"/></svg>`;
const diagramIcon = `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="8" y="3" width="8" height="6" rx="1.5"/><rect x="2" y="16" width="7" height="5" rx="1.5"/><rect x="15" y="16" width="7" height="5" rx="1.5"/><path d="M12 9v4H5.5v3M12 13h6.5v3"/></svg>`;
const openIcon = `<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M7 4H4v12h12v-3M10 3h7v7M9 11l8-8"/></svg>`;

function renderLibrary(workspace: HTMLElement, diagrams: Diagram[]) {
  workspace.innerHTML = `
    <aside class="library-panel" aria-label="構成図の一覧">
      <div class="panel-heading"><h2>すべての構成図</h2><span class="panel-count"></span></div>
      <ul class="diagram-list"></ul>
      <div class="library-note"><span class="small-dot"></span>このライブラリの図はローカルに保存されています。</div>
    </aside>
    <section class="preview-panel" aria-labelledby="preview-title">
      <div class="preview-toolbar">
        <div class="preview-heading"><span class="eyebrow">PREVIEW</span><h2 id="preview-title" data-preview-title></h2></div>
        <a class="open-link" data-open target="_blank" rel="noopener noreferrer">別タブで開く ${openIcon}</a>
      </div>
      <div class="preview-stage"><p class="preview-scroll-note">図の枠内を左右にスクロールしてご覧ください。</p><iframe sandbox="" referrerpolicy="no-referrer"></iframe></div>
      <div class="preview-footer"><span class="document-name"></span><span class="document-type">HTML構成図</span></div>
    </section>`;

  const list = workspace.querySelector<HTMLUListElement>('.diagram-list')!;
  const buttons: HTMLButtonElement[] = [];
  const frame = workspace.querySelector<HTMLIFrameElement>('iframe')!;
  const link = workspace.querySelector<HTMLAnchorElement>('[data-open]')!;
  const heading = workspace.querySelector<HTMLElement>('[data-preview-title]')!;
  const filename = workspace.querySelector<HTMLElement>('.document-name')!;
  workspace.querySelector('.panel-count')!.textContent = String(diagrams.length);

  function choose(id: string) {
    const selected = selectDiagram(diagrams, id);
    if (!selected) return;
    const { diagram, url } = selected;
    heading.textContent = diagram.title;
    filename.textContent = diagram.filename;
    frame.title = `${diagram.title} のプレビュー`;
    frame.src = url;
    link.href = url;
    link.setAttribute('aria-label', `${diagram.title} を別タブで開く`);
    buttons.forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.id === id)));
  }

  diagrams.forEach((diagram, index) => {
    const item = document.createElement('li');
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'diagram-button';
    button.dataset.id = diagram.id;
    button.setAttribute('aria-pressed', 'false');
    button.innerHTML = `<span class="diagram-symbol">${diagramIcon}</span><span class="diagram-info"><span class="diagram-number"></span><span class="diagram-title"></span><span class="diagram-format">HTML · 構成図</span></span><span class="selected-dot" aria-hidden="true"></span>`;
    button.querySelector('.diagram-title')!.textContent = diagram.title;
    button.querySelector('.diagram-number')!.textContent = String(index + 1).padStart(2, '0');
    button.addEventListener('click', () => choose(diagram.id));
    item.append(button);
    list.append(item);
    buttons.push(button);
  });

  choose(diagrams[0].id);
}

export async function mountApp(root: HTMLElement, fetcher: typeof fetch = fetch): Promise<void> {
  root.setAttribute('aria-busy', 'true');
  root.innerHTML = `
    <a class="skip-link" href="#library">構成図ライブラリへ移動</a>
    <header class="site-header">
      <a class="brand" href="./"><span class="brand-mark">${stackIcon}</span><span>Stack Diagram Maker</span></a>
      <span class="local-badge"><span class="small-dot"></span>ローカルライブラリ</span>
    </header>
    <main id="library">
      <div class="page-heading">
        <div><p class="eyebrow">YOUR ARCHITECTURE, AT A GLANCE</p><h1>構成図ライブラリ<span class="title-dot">.</span></h1><p class="page-description">システムのつながりを、ひとつの場所に。</p></div>
        <p class="diagram-total"><strong data-count>—</strong><span>件の構成図</span></p>
      </div>
      <div class="workspace"><div class="state-panel" role="status"><span class="state-symbol">${stackIcon}</span><p>一覧を読み込んでいます…</p></div></div>
      <footer class="site-footer"><span>STACK DIAGRAM MAKER</span><span>Codexで作成した構成図を、ここから閲覧できます。</span></footer>
    </main>`;

  const workspace = root.querySelector<HTMLElement>('.workspace')!;
  try {
    const diagrams = await loadManifest(fetcher);
    root.querySelector('[data-count]')!.textContent = String(diagrams.length);
    if (diagrams.length === 0) {
      workspace.innerHTML = `<section class="state-panel"><span class="state-symbol">${diagramIcon}</span><h2>まだ構成図がありません</h2><p>Codexで構成図を作成して、このライブラリに追加してください。</p></section>`;
      return;
    }
    renderLibrary(workspace, diagrams);
  } catch {
    root.querySelector('[data-count]')!.textContent = '—';
    workspace.innerHTML = `<section class="state-panel error-panel" role="alert"><span class="state-symbol">${diagramIcon}</span><h2>構成図を読み込めませんでした</h2><p>一覧を取得できないか、データ形式が正しくありません。再読み込みしてください。</p><button type="button" class="retry-button" data-retry>もう一度読み込む</button></section>`;
    workspace.querySelector('[data-retry]')!.addEventListener('click', () => { void mountApp(root, fetcher); });
  } finally {
    root.setAttribute('aria-busy', 'false');
  }
}
