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

## 2026-11-10 — Skillで構成図を生成

- `fetch_icons.py diagrams/icons vue:vuejs fastapi postgres:postgresql` でsvglからロゴ3件を取得し、BrowserにはSkillのgeneric SVGを使用した。取得元は `diagrams/icons/manifest.json` に記録した。
- 公式テンプレートを元に `diagrams/vue-fastapi-postgres.draft.html` を作成。geometry.mdに従い、4ノードを横方向の主経路で接続した。
- 公式 `build.py` で `public/diagrams/vue-fastapi-postgres.html` を生成（約108KB）。全フォント・画像を埋め込み、JavaScriptなし、外部リソースを制限するCSPを追加した。再生成用 `npm run diagram:build` を追加した。
- 一時フォルダーのPython仮想環境にPlaywright 1.58.0を導入し、公式 `render_png.py` でライト・ダーク両方のPNGを出力。実際に2画像を開き、4ノード・矢印・文字・ロゴの表示と重なりがないことを目視確認した。
- Playwright CLIではfileプロトコルの表示が拒否されたため、アプリ画面の確認にはローカルHTTPを使用する。
- ギャラリー投稿・外部公開・ログイン連携は行っていない。

## 2026-11-10 — ライブラリ画面のTDDと表示確認

- Red: DOMテスト `app.test.ts` を先に作成し、appモジュール未実装で失敗することを確認した。
- Green: 一覧、初期選択、選択切り替え、プレビュー、別タブリンク、ロード中、空状態、エラーと再試行を実装し、合計62テストが成功した。タイトルにHTMLを含めてもテキストとして表示するテストも含む。
- プレビューは `sandbox=""` で権限を付与せず、別タブリンクに `noopener noreferrer` を設定した。
- ライブラリ画面をデスクトップ・モバイル対応にし、faviconの404を解消した。狭い画面では図の横スクロール案内を表示する。
- jsdom最新版のNode.js要件が仕様より高かったため、22.12以降に対応する27.4.0系へ調整した。変更後のインストール時auditも0件。Node.jsの対応範囲をpackage.jsonに明示した。
- `npm run build`: 成功。
- 5174番は既存のSSHプロセスが使用中だったため、その接続には手を加えず、`npm run dev -- --host 127.0.0.1 --port 5175` で検証用サーバーを起動した。
- Chromeで1440px幅の画面とiframeの実際の描画を確認した。390px幅でもページ幅は390pxで、画面全体の横はみ出しがないことを確認した。図は枠内を横スクロールする。
- 別タブリンクをクリックし、生成済みHTMLのURLが開くこと、`window.opener === null`、全画像の読込成功、script数0、図の外部リソース通信0件を確認した。

## 2026-11-10 — 最終検証・完了

- ブラウザの通信モックで空配列とHTTP 500を再現し、空状態とエラー表示を確認した。モック解除後に「もう一度読み込む」を実際にクリックし、プレビューが復旧してエラー表示が消えることを確認した。
- 最終画面を再読み込みしたChromeのコンソールはエラー0・警告0件。確認用画像は `output/playwright/` に保存した（Git管理対象外）。
- 最終の `npm test`: 3ファイル・62テスト成功。
- 最終の `npm run build`: TypeScript型検査・Viteビルド成功。
- 最終の `npm audit --json`: 既知の脆弱性0件。
- `npm run diagram:build` を再実行し、コミット済みHTMLと差分がないことを確認した。`dist/diagrams/` のマニフェスト・HTMLもpublic内のファイルと完全一致することを確認した。
- READMEを完成後の機能、起動方法、Skillと図の生成・追加手順、検証結果に更新した。
- 各段階を `main` にcommit・push: `40c40c3`（Skill/テスト環境）、`001d9e9`（一覧・選択検証）、`b02b1ae`（構成図生成）、`6651f5b`（ライブラリ画面）。
- MVPの受け入れ条件はすべて完了。既存SSH接続のため5174番は使用せず、確認用アプリは `http://127.0.0.1:5175/` で起動中。既存プロセスに変更は加えていない。

## 2026-11-10 — STEER CLEAR OF THE WALLの構成調査

- ユーザー指定の `taku0193/steer-clear-of-the-wall` を読み取り、構成図を追加する作業を開始した。
- GitHubの `main` をコミット `384c70dd2a5b110ac4a206a83879f8e4dca3aa20` に固定して、README、package.json、カメラ、姿勢検出、ゲーム状態、描画、心拍、ランキングの実装を確認した。
- ブラウザ内の映像/姿勢処理と心拍メモリ、外部WASM/モデル取得、Node.js側のランキングAPI/SQLiteを区別する。調査根拠を `diagrams/steer-clear-of-the-wall/SOURCES.md` に記録した。
- 公式Skillのfetch_icons.pyでブランドロゴとLucideのピクトグラムを取得。MediaPipeロゴは取得元に存在せず、公式の画像ディレクトリも404だったため、姿勢検出は汎用の機能アイコンで表す。取得エラーを隠してロゴ生成を偽装しない。
