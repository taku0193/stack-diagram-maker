# Codexデスクトップへの最初の指示 — Stack Diagram Maker

このプロジェクトの `AGENTS.md`、`docs/MVP_SPEC.md`、`docs/TEST_PLAN.md`、`README.md` を読んでから以下を実装してください。

## 今回の到達目標

OSS `caru-ini/stack-diagram` のCodex向けSkillを**このプロジェクトだけ**に導入し、`Browser → Vue 3 → FastAPI → PostgreSQL` の構成図HTMLを1枚生成する。そのファイルを一覧・プレビュー・別タブ表示できるローカルWebアプリを作る。

## 作業順序

1. 環境（Node.js/npm、Python 3.9+）と既存ファイルを確認し、`npm install` を実行する。
2. 公式 `https://github.com/caru-ini/stack-diagram` を確認。Skillの `SKILL.md` と同梱スクリプトを確認してから、**プロジェクトローカルの `.agents/skills/stack-diagram/`** にインストールする。必要ならCodexセッションの再読込を案内する。
3. Skillの手順を使用して、サンプルの構成図HTMLを `public/diagrams/vue-fastapi-postgres.html` として生成する。内容はBrowser → Vue 3 → FastAPI → PostgreSQL。外部ギャラリー投稿はしない。実際の生成結果を目視確認する。
4. TDDで `public/diagrams/index.json` の読み取りと検証ロジックを実装。`id`, `title`, `filename` などのシンプルな構造とし、パスを安全に扱う。
5. 図の一覧、選択時のプレビュー（`iframe sandbox="allow-scripts"` 等）、別タブでHTMLを開くリンクを作る。生成HTMLがスクリプト不要ならより厳しいsandbox設定を選択する。
6. `npm test`、`npm run build`、可能ならブラウザ確認。README/WORK_LOGを更新する。

## 制約

- Vite + vanilla TypeScript + Vitest。フロントエンドからLLM APIを呼ばない。
- ブラウザUIで自然言語を入力して構成図を新規生成する機能は**今回のMVP対象外**。新規図の生成はCodexとSkillで行う。
- HTMLは原則Skillが生成した自己完結ファイルのみを表示。外部からアップロードされた任意HTMLは実行しない。
- ネットワークやスキル取得が制限された場合は、ダミーの成果物をSkill生成結果と誤認させず、ブロッカーとして報告する。

作業終了時は「Skillの配置場所、生成した図、実装機能、テスト実行結果、起動方法、未完事項」を日本語で報告してください。
