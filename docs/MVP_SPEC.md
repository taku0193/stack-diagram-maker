# MVP仕様書 — Stack Diagram Maker

## 目的

`caru-ini/stack-diagram` のAgent Skillで生成した、自己完結HTMLのシステム構成図を、ローカルWebアプリで閲覧・管理する。自然言語からの図生成はCodexに任せ、ブラウザからLLMを呼び出す複雑さを避ける。

## ユーザーストーリーと受け入れ条件

### S1. Skillで構成図を1枚生成
- プロジェクトローカル `.agents/skills/stack-diagram/` にSkillを導入する。README/SKILL.mdの確認と実行ログを残す。
- `Browser → Vue 3 → FastAPI → PostgreSQL` の構成図をSkillの公式ワークフローで生成する。
- 生成した自己完結HTMLを `public/diagrams/vue-fastapi-postgres.html` へ保存する。
- インターネットはアイコン取得のみに使用。公開ギャラリーへのアップロードをしない。

### S2. 構成図の一覧表示
- `public/diagrams/index.json` という静的なマニフェストに、表示タイトルとファイル名を格納する。
- UIで図の一覧が表示され、1件以上選択できる。
- indexが空なら案内、JSONが不正・取得失敗ならエラーを表示する。

### S3. 安全なプレビューとHTMLを開く
- クリックで選択された図をiframeで表示する。HTMLはローカルの `/diagrams/` 配下に限定する。
- 原則iframe sandboxを使用し、任意の外部URLやディレクトリトラバーサルを拒否する。
- 別タブでHTMLを開くリンクを設ける。`rel="noopener noreferrer"` を利用する。

## データ形式例

```json
[
  {
    "id": "vue-fastapi-postgres",
    "title": "Vue + FastAPI + PostgreSQL",
    "filename": "vue-fastapi-postgres.html"
  }
]
```

## MVP対象外

Web UIからのAI生成、構成図編集、ドラッグアンドドロップ、ユーザーアップロード、データベース、ログイン、外部公開、PNG/PDF変換、複数エージェント連携。

## 技術構成

- Node.js 22.12+、Vite、vanilla TypeScript、Vitest
- Codex Desktop + `stack-diagram`（プロジェクトローカルのAgent Skill）
- Python 3.9+、ロゴ取得時のインターネット
- 画面URL：`http://localhost:5174/`

## 実装候補構成

```
.agents/skills/stack-diagram/  # Codexが導入（ZIPには含めない）
public/diagrams/
  index.json
  vue-fastapi-postgres.html   # CodexがSkillで生成
src/
  main.ts
  manifest.ts
  style.css
src/__tests__/
  manifest.test.ts
  selection.test.ts
```

## 完了の定義

- Skillを実際に使った、生成された構成図HTMLが1枚存在する。
- Web画面に一覧が表示され、そのHTMLをプレビューできる。
- HTMLを別タブで開ける。
- `npm test` と `npm run build` の結果、マニフェストの不正入力テスト、READMEへの起動手順を確認できる。
