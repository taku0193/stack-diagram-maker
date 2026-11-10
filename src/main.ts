import './style.css';

const app = document.querySelector<HTMLDivElement>('#app');
if (!app) throw new Error('App root not found');
app.innerHTML = `
  <main>
    <h1>Stack Diagram Maker</h1>
    <section class="card">
      <p>Codex の stack-diagram Skill で生成したHTML構成図を表示するためのスターターです。</p>
      <p>最初の目標: <strong>構成図を1枚生成 → 一覧 → プレビュー・HTMLを開く</strong></p>
      <small>README.md と CODEX_START.md を参照してください。</small>
    </section>
  </main>
`;
