# Excalidraw — エディタと共同編集

公開リポジトリ `excalidraw/excalidraw` のWebアプリについて、主要な編集・描画・保存・共同編集の経路を図にした。参照コミット、ファイル、表現の範囲は [SOURCES.md](SOURCES.md) に記録している。

公式stack-diagram Skillのテンプレートとgeometry.mdから `draft.html` を作成した。画像とフォントは同梱しており、Python 3.9以降でネットワークなしに再生成できる。

```sh
npm run diagram:build:excalidraw
```

出力は `public/diagrams/excalidraw.html`。JavaScript不要・CSP付きの自己完結HTMLで、ライブラリのsandbox内プレビューと別タブで閲覧できる。

Excalidrawのロゴは公式リポジトリの `public/favicon.svg` を使用する。その他のロゴと汎用ピクトグラムを含む取得元は `icons/manifest.json` を参照。

目視確認用画像（PythonのPlaywrightとChromiumが必要）:

```sh
python3 .agents/skills/stack-diagram/scripts/render_png.py \
  public/diagrams/excalidraw.html output/playwright/excalidraw.png \
  --selector .canvas --scale 2
```

ライト・ダーク両方を出力する。確認画像はGit管理対象外。外部ギャラリーへは投稿しない。
