# Stack Diagram Maker

Codexの `stack-diagram` Skillで生成した構成図HTMLを、一覧・プレビュー・別タブ表示できるローカルWebアプリです。Vite + vanilla TypeScriptで動作します。

リポジトリ: https://github.com/taku0193/stack-diagram-maker （非公開）

## 起動する

Node.js 22.12以降の22系、24系、または26以降を使用してください。検証環境はNode.js 26.13.0 / npm 11.20.0です。

```sh
git clone https://github.com/taku0193/stack-diagram-maker.git
cd stack-diagram-maker
npm ci
npm run dev
```

`http://localhost:5174/` を開きます。ポートが使用中なら明示的に変更できます。

```sh
npm run dev -- --host 127.0.0.1 --port 5175
```

今回の確認では5174番が既存のSSH接続で使用中だったため、`http://127.0.0.1:5175/` を使用しました。ポートの競合時に既存プロセスを終了する必要はありません。

## できること

- 構成図の一覧表示、選択とプレビュー
- HTMLを別タブで開く
- ロード中・空のライブラリ・取得失敗・不正な一覧データの表示と再読み込み
- デスクトップとスマートフォン幅での表示（狭い画面では図の枠内を横スクロール）

サンプルは `Browser → Vue 3 → FastAPI → PostgreSQL`。`public/diagrams/vue-fastapi-postgres.html` は公式Skillのテンプレート・ロゴ取得・ビルド手順で生成しました。ロゴとフォントを埋め込んだ、JavaScript不要の自己完結HTMLです。

`STEER CLEAR OF THE WALL` の実装に基づくシステム構成図も収録しています。カメラ・MediaPipe・ゲーム処理・Canvas/Web Audio・Fitbit心拍・ランキングAPI/SQLiteをまとめています。確認したソースとコミットは [構成図の根拠](diagrams/steer-clear-of-the-wall/SOURCES.md)、再生成は `npm run diagram:build:steer` を参照してください。

このアプリ自身の「生成から閲覧まで」も収録しています。Codex/SkillによるHTML生成、一覧JSONへの登録、Vite配信、TypeScript画面での選択と表示を1枚にまとめています。再生成は `npm run diagram:build:self`、根拠と手順は [図のREADME](diagrams/stack-diagram-maker/README.md) を参照してください。

有名なOSSの例として `excalidraw/excalidraw` のエディタと共同編集の図も収録しています。React/Canvas、ブラウザ保存、Web Crypto、Socket.IO、Firebaseを公開コードから整理しています。再生成は `npm run diagram:build:excalidraw`、調査の根拠は [SOURCES.md](diagrams/excalidraw/SOURCES.md) を参照してください。

## Skillと図の生成

Skillは `.agents/skills/stack-diagram/` にプロジェクトローカルで同梱しています。グローバルへの導入は不要です。公式リポジトリ、固定コミット、ライセンスは [docs/SKILL_PROVENANCE.md](docs/SKILL_PROVENANCE.md) を参照してください。CodexのSkill一覧には次のターン以降に反映されます。表示されない場合は、このプロジェクトを開き直してください。

同梱サンプルはPython 3.9以降があれば、ネットワークなしで再生成できます。

```sh
npm run diagram:build
```

生成元と手順は [diagrams/README.md](diagrams/README.md) にあります。新しい図はCodexにSkillを使って生成させ、`public/diagrams/` に置き、`public/diagrams/index.json` へ追加します。

```json
[
  {
    "id": "vue-fastapi-postgres",
    "title": "Vue 3 + FastAPI + PostgreSQL",
    "filename": "vue-fastapi-postgres.html"
  }
]
```

`id` は先頭が英数字、その後は英数字・`-`・`_` の一意な文字列です。`title` は空でない文字列、`filename` は同じ文字種からなる単一の `.html` ファイル名に限定します。外部URL、絶対パス、ディレクトリ、`../`、エンコードされたパス、クエリ、フラグメントは拒否します。追加後はページを再読み込みしてください。

ブラウザからのAI生成、図の編集・アップロード、バックエンド、認証、データベース、PNG/PDF出力はMVPの対象外です。図中のFastAPI/PostgreSQLは構成図のノードで、アプリ自体の依存サービスではありません。

## プレビューの扱い

表示対象は、このプロジェクトで管理する生成済みHTMLだけです。iframeは `sandbox=""` と `referrerpolicy="no-referrer"` を使い、スクリプト・同一オリジンアクセスなどの権限を追加しません。別タブリンクは `noopener noreferrer` を設定しています。

同梱の図には外部リソースとスクリプトを制限するCSPを含めています。別タブ表示はHTMLを直接開くため、今後追加する図も信頼できる自己完結ファイルに限定してください。

## 検証

```sh
npm test
npm run build
npm audit
```

- Vitest: 3ファイル・62テスト成功（一覧検証、選択、DOMの表示・切り替え・安全なリンク・空状態・エラー・再試行）。
- TypeScriptの型検査とViteの本番ビルド成功。
- `npm audit`: 既知の脆弱性0件。
- 公式Skillでライト・ダークのPNGを描画して目視確認。Chromeでデスクトップ・モバイル、別タブ、空状態、エラーと再読み込みを確認。

本番ビルドをローカルで確認する場合は `npm run preview` を実行し、`http://localhost:4174/` を開いてください。

作業・エラー・検証の記録は [docs/WORK_LOG.md](docs/WORK_LOG.md) にあります。
