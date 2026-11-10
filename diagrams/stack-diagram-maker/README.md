# Stack Diagram Maker — 生成から閲覧まで

このアプリ自身の構成と作成ワークフローを図にした。参照元は、追加前のコミット `7439da81b87c16aaaf5fc4ec93da54500f3d6b20` にある以下のファイル。

| 表した内容 | 根拠 |
| --- | --- |
| Codexとプロジェクト内Skillで生成 | `CODEX_START.md`、`docs/SKILL_PROVENANCE.md` |
| Pythonで画像・フォントをHTMLに埋め込む | `.agents/skills/stack-diagram/scripts/build.py` |
| index.jsonを更新して一覧へ登録 | `public/diagrams/index.json`、`README.md` |
| Viteでアプリと静的ファイルを配信 | `package.json`、`index.html`、`public/` |
| 一覧の取得と検証 | `src/manifest.ts` |
| 選択した図の安全なURLを組み立てる | `src/selection.ts` |
| sandbox付きプレビューと別タブリンク | `src/app.ts` |

JSONへの登録はCodexによる作成作業で、Pythonのbuild.pyが一覧JSONを生成する意味ではない。Viteは `npm run dev` によるローカル配信の例。ブラウザからLLM APIを呼ぶ構成ではない。

## 再生成

```sh
npm run diagram:build:self
```

公式Skillのテンプレートとgeometry.mdから作成した `draft.html` と、取得元を記録した `icons/manifest.json` を同梱する。Python 3.9以降で再生成でき、生成・閲覧にネットワークは不要。

目視確認用画像はPythonのPlaywrightとChromiumを使用する。

```sh
python3 .agents/skills/stack-diagram/scripts/render_png.py \
  public/diagrams/stack-diagram-maker.html \
  output/playwright/stack-diagram-maker.png --selector .canvas --scale 2
```

ライト・ダーク両方を出力する。確認画像はGit管理対象外。外部ギャラリーへは投稿しない。
