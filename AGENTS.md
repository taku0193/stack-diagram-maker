# Codex開発ルール — Stack Diagram Maker

- このプロジェクトフォルダ内だけを編集する。Pixel FX Studioを編集しない。
- `CODEX_START.md` と `docs/MVP_SPEC.md` を先に読む。
- `stack-diagram` は**Codex Agent Skill**。ブラウザJSから直接実行するAPIと誤解しない。
- スキルはプロジェクト内の `.agents/skills/stack-diagram` へ導入する。グローバルなホーム配下を汚染しない。実行前にSKILL.mdを確認する。
- 既存サンプルHTMLを偽装して「Skillで生成した」と報告しない。実際にSkillを使用して生成されたファイルを残す。
- ロゴ取得等のネットワークは許容。ただしギャラリーへの投稿・外部共有・ログイン連携はしない。
- UIのMVPは生成HTMLの一覧表示、選択、サンドボックス付きiframeでのプレビュー、HTMLへのリンクのみ。
- ブラウザ側からAIを呼び出さない。バックエンド、認証、データベースは作らない。
- `public/diagrams/index.json` に安全な相対パスだけを載せ、任意URLや `../` を通さない。
- TDD Red → Green → Refactorを守る。`npm test`、`npm run build` を実行し、結果を記録する。
- 段階ごとに `docs/WORK_LOG.md` に実施した操作・エラー・検証結果を記録する。
- `main` に小刻みコミットで十分。不要なブランチや機能を増やさない。
