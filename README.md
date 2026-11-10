# Stack Diagram Maker — Codex Desktop 用スターター

**これは未実装の出発点です。** `caru-ini/stack-diagram` はブラウザにimportする描画ライブラリではなく **Codex向けAgent Skill** です。Codexで構成図HTMLを1枚生成して、独立したWeb画面で一覧・プレビューします。

## GitHubから取得して起動する

リポジトリ: https://github.com/taku0193/stack-diagram-maker （非公開）

```sh
git clone https://github.com/taku0193/stack-diagram-maker.git
cd stack-diagram-maker
npm ci
npm run dev
```

`http://localhost:5174/` を開いてください。現時点ではスターター画面を表示します。

## Codexデスクトップでの開始方法

1. このフォルダ（`stack-diagram-maker-codex`）をMacの任意の場所に保存する。
2. Codexデスクトップアプリでこのフォルダを**Pixel FXとは別プロジェクト・別セッション**として開く。
3. 次のメッセージを送る。
   **「このフォルダの `CODEX_START.md` を読み、`AGENTS.md` と `docs/MVP_SPEC.md` に従ってTDDで実装を開始してください。」**
4. CodexにSkillの**プロジェクトローカルインストール**と構成図生成をさせる。
5. `npm install` → `npm run dev` → `http://localhost:5174/` で結果を閲覧する。

### Skill導入の注意

- 参照元: https://github.com/caru-ini/stack-diagram
- 公式の簡易導入例: `npx skills add caru-ini/stack-diagram`
- ただし他プロジェクトへ影響させないため、Codexには `.agents/skills/stack-diagram/` の**プロジェクト内だけ**へ配置するよう指定しています。
- Python 3.9+ が必要。ロゴ取得にはインターネット接続が必要。
- PNG書き出しはMVP対象外（実施する場合はPlaywright+Chromiumが必要）。
- 外部ギャラリーへの投稿は禁止。自動公開しない。

### 初期状態の動作

初期ファイルはViteで起動できる画面のみ。Skill・生成された構成図・Node/npmパッケージはZIPに同梱していません。まずCodexに実物のSkillを導入させてください。
