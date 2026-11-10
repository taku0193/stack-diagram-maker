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

## 2026-11-10 — STEER CLEAR OF THE WALLの構成図を追加

- Skillの公式テンプレートとgeometry.mdから `diagrams/steer-clear-of-the-wall/draft.html` を作成。入力・姿勢変換・ゲーム判定・React/Canvas・音声・心拍・ランキングAPI・SQLiteの境界と経路を図にした。
- 心拍のブラウザ内保持とランキング保存を分け、外部モデル取得先、任意のFitbit接続、同一PC/SSH先でのサーバー実行を注記した。描いたのは実装の機能単位であり、各ノードが独立したサービスという意味ではない。
- SQLiteは初回取得の文字入りロゴからDeviconのマークへ変更した。色・形は変更せず、配布元はmanifestに記録した。
- 公式build.pyで `public/diagrams/steer-clear-of-the-wall.html` を生成（約146KB）。画像・フォントを埋め込み、スクリプト不要/CSP付きの自己完結HTMLとした。
- 公式render_png.pyでライト・ダーク両方を描画して目視確認。姿勢変換ノードの役割表記を短くし、矢印と文字が重ならないよう再生成した。
- `public/diagrams/index.json` の先頭へ追加し、ライブラリを2件にした。既存のVueサンプルも選択できる。再生成コマンド `npm run diagram:build:steer` と調査/生成手順を追加した。
- 既存ロジックの変更はなく、回帰検証として `npm test` を実行。3ファイル・62テスト成功。`npm run build` も成功した。
- 追加後の2件を実際のparseManifestで検証し、生成HTMLの存在、distとの完全一致、未解決トークンなし、scriptなし、画像/フォントの外部参照なしを確認した。
- 開いていたアプリを再読み込みし、2件の一覧、新しい図の初期選択、iframeと別タブリンクの対象URLを確認した。
- 調査資料とアイコンを `6b12cf5` で先にcommit・push済み。構成図と一覧更新も区切りとしてcommit・pushする。対象ゲームのリポジトリは変更していない。

## 2026-11-10 — このアプリ自身の構成図を作成

- ユーザーの「なんか作って欲しい」という依頼を受け、現在のライブラリに合う題材として、このアプリ自身の「生成から閲覧まで」を作成した。
- コミット `7439da81b87c16aaaf5fc4ec93da54500f3d6b20` の実装と指示書を確認し、Codex/Skill/Pythonでの生成と、Vite/TypeScript/iframeでの閲覧を分けて表した。JSON登録は作成時の作業として別の矢印にした。
- 公式fetch_icons.pyでロゴ・Lucideピクトグラムを取得し、Browserには同梱generic SVGを使用。公式テンプレートから `diagrams/stack-diagram-maker/draft.html` を作り、公式build.pyで `public/diagrams/stack-diagram-maker.html` を生成した。
- ライブラリの先頭へ追加し、合計3件とした。`npm run diagram:build:self` と根拠・再生成手順を追加した。画面のロジックは変更していない。
- ライト・ダーク両方のPNGを公式render_png.pyで描画し、文字・矢印・ロゴを目視確認した。Browserの汎用アイコンは暗い背景でも見えるよう白いプレートを設定した。
- `npm test`: 3ファイル・62テスト成功。`npm run build`: 型検査・ビルド成功。
- マニフェスト3件を実際のparseManifestで検証し、全HTMLの存在とdistとの一致、CSPあり、script/未解決トークン/外部リソース参照なしを確認した。
- ブラウザ接続の古いハンドルで操作できなかったため、接続を再初期化して復旧。開いているアプリを再読み込みし、3件の一覧、新しい図の初期選択とiframeプレビュー、別タブリンクのURLを確認した。

## 2026-11-10 — 有名リポジトリ: Excalidrawの調査

- ユーザーから有名なリポジトリを題材にする依頼を受け、`excalidraw/excalidraw` を選んだ。
- `master` をコミット `701b901a0f1ba3d0b390d9cdf63d112e25abac4b` に固定し、README、依存関係、App、LocalData、renderer/export、暗号化、Collab/Portal、Firebaseの実装を確認した。上流コードは実行・変更していない。
- 通常の編集/ブラウザ保存と、共同編集時の暗号化/Socket.IO/Firebaseを分けて図にする。npm版エディタとWebアプリ側の機能を区別し、根拠と省略範囲を `diagrams/excalidraw/SOURCES.md` に記録した。

## 2026-11-10 — Excalidrawの構成図を生成

- 公式Skillのfetch_icons.pyでReact/TypeScript/Firebase/Socket.IOのロゴとLucideの機能アイコンを取得した。Excalidrawは取得元に見つからなかったため、確認済みの公式リポジトリ内 `public/favicon.svg` を明示URL指定で取得した。
- 公式テンプレートとgeometry.mdから `diagrams/excalidraw/draft.html` を作成し、公式build.pyで `public/diagrams/excalidraw.html` を生成（約142KB）。フォント・画像を埋め込み、CSPを付け、JavaScriptなしで表示できる。
- Reactエディタ、シーン状態、Canvas/Rough.js、自動保存、localStorage/IndexedDB、ファイル出力、AES-GCM、Socket.IO、Firestore/Firebase Storageを描いた。保存の矢印は送信側の主要経路、ルーム同期は双方向として区別した。
- 公式render_png.pyでライト・ダーク両方を描画し、実画像でロゴ・文字・矢印の表示と重なりがないことを確認した。
- 一覧の先頭に追加し、4件にした。`npm run diagram:build:excalidraw` と調査/再生成手順を追加した。画面ロジックは変更していない。
- `npm test`: 3ファイル・62テスト成功。`npm run build`: 型検査・ビルド成功。マニフェスト4件を実際のparseManifestで検証し、全HTMLの存在とdistとの一致、CSPあり、script/未解決トークン/外部リソース参照なしを確認した。
- 開いているライブラリを再読み込みし、4件の一覧、新しい図の初期選択、iframeプレビューと別タブリンクのURLを確認した。古いブラウザ接続でのエラーは、同じブラウザへの接続を再初期化して復旧した。
- 調査資料・取得済みアイコンは `7f56ee6` で先にcommit・push済み。生成図と一覧更新を次の区切りとしてcommit・pushする。

## 2026-11-11 — READMEのデザインを更新

- ユーザーの依頼に合わせ、READMEをバナー・実画面・ギャラリー・起動手順を中心とした構成に整理した。深緑とライム色のオリジナルSVGバナーを追加した。
- 4件の構成図を収録した実際のライブラリ画面を撮影し、`docs/images/library-preview.jpg` に保存。バナーのイラストとは別に、実画面として掲載した。
- 既存の公式Skillによるアプリ自身の構成図PNGをREADME用に追加し、ライト・ダークのテーマに応じて切り替わる `picture` で掲載した。図の再生成や画面ロジックの変更は行っていない。
- 4件の図を内容・再生成コマンド付きの表にまとめた。登録手順を3段階に整理し、データのルール・設定・ディレクトリ・ライセンスの詳細は折りたたみにした。
- ローカルリンクと画像14件の存在、SVGのXML、収録図4件、READMEのnpmスクリプト名を検証した。GitHubのMarkdown APIでGFMをレンダリングし、5件の折りたたみとテーマ別画像の要素が保持されることを確認した。
- GitHubのレンダリング結果にローカル確認用スタイルを付けてブラウザで目視確認。全画像の読み込み成功、1280px幅でページの横はみ出しなし、起動手順への移動と折りたたみの展開を確認した。確認用HTML・画像はGit管理対象外の `output/playwright/` に保存した。
- `npm test`: 3ファイル・62テスト成功。`npm run build`: TypeScript型検査・Viteビルド成功。
