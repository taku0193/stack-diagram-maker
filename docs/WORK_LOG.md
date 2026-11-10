# 開発ログ

Codexは段階ごとに日付、Skill導入、生成ファイル、テストコマンド、結果、未解決事項を追記する。

- 初期状態：Viteスターター、空のマニフェストと引き継ぎドキュメントのみ。Skill未導入、図の生成・実装未実施。

## 2026-11-10 — リポジトリの準備

- 提供されたスターターと指示書一式を確認し、作業フォルダ `/Users/takumayamane/stack-diagram-maker` へ配置した。
- Node.js v26.13.0、npm 11.20.0、Python 3.11.11 を確認した。
- `main` ブランチでGitリポジトリを初期化した。
- ユーザーの指示により、GitHubへ非公開リポジトリを新規作成し、段階ごとにcommit・pushする方針とした。
- 制限された環境ではGitHub CLIの接続確認が失敗したが、ネットワーク利用を許可した確認で `taku0193` の認証が有効であることを確認した。
- 依存関係のインストールを開始。初回コミット時点ではテスト・ビルド未実施。Skill導入、構成図生成、MVP実装は未着手。

## 2026-11-10 — 初回pushとスターターの検証

- `https://github.com/taku0193/stack-diagram-maker` を新規作成し、非公開・既定ブランチ `main` であることをGitHub APIで確認した。
- 初回コミット `92cb61e`（`chore: initialize Stack Diagram Maker starter`）を `origin/main` へpushした。
- 制限された環境で開始した `npm install` は接続待ちのため中断し、ネットワーク利用を許可して再実行。51パッケージの導入が成功した。
- `package-lock.json` を作成し、READMEにGitHubからの取得と `npm ci` による起動手順を追加した。
- `npm run build`: 成功（TypeScriptの型検査とViteの本番ビルド）。
- `npm test`: 終了コード1。スターターにテストファイルがなく、`No test files found` と表示された。
- `npm audit --json`: 依存パッケージ3件に既知の脆弱性（moderate 1件、critical 2件）を検出。対象はVitest、`@vitest/mocker`、`tinypool`。auditが提示する修正はVitest 5.1.0へのメジャー更新で、今回は提供されたスターターのバージョン指定を維持した。
- 未完事項: 依存パッケージの脆弱性対応、Skill導入、構成図生成、MVP機能とテストの実装。今回はリポジトリ作成とスターターの保存まで実施した。

## 2026-11-10 — MVP実装の準備

- ユーザーからMVP実装の開始指示を受け、AGENTS/仕様/テスト計画を再確認した。
- 公式README、SKILL.mdと同梱スクリプトを確認し、公式コミット `5af3b095fff7109c905c5284dc510dc06588bade` のSkillを `.agents/skills/stack-diagram/` へ導入した。取得元とライセンスを `docs/SKILL_PROVENANCE.md` に記録した。
- `npm install --save-dev vitest@^5.1.0 jsdom@latest` を実行し、Vitest 5.1.0へ更新、DOMテスト用jsdomを導入。インストール時のauditは脆弱性0件。
- Skillの `fetch_icons.py` でVue/FastAPI/PostgreSQLのロゴ取得を開始。公式テンプレートとgeometry.mdに沿ってHTMLを生成する。

## 2026-11-10 — 一覧・選択ロジックのTDD

- Red: `manifest.test.ts` / `selection.test.ts` を先に作成し、未実装モジュールのため2スイートが失敗することを確認した。
- Green: `manifest.ts` / `selection.ts` を実装。53テストが成功した。
- 配列、必須項目、重複IDを検証し、filenameを英数字・ハイフン・アンダースコアからなる単一の `.html` ファイル名に限定した。外部URL、絶対パス、スラッシュ、逆スラッシュ、エンコードされたパス、クエリ、フラグメント、制御文字を拒否する。
- 選択はマニフェストに存在するIDだけを許可し、URLは `/diagrams/<filename>` に限定。選択時にもファイル名を再検証する。
- `npm run build`: 型検査・本番ビルド成功。
- 同梱フォントライセンスに元から存在する末尾空白は、公式Skillの原文を保持するため変更しなかった。
