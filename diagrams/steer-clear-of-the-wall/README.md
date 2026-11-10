# STEER CLEAR OF THE WALL 構成図

`draft.html` は公式stack-diagram Skillのテンプレートとgeometry.mdから作成した構成図ソース。確認したコミットと各データ経路の根拠は [SOURCES.md](SOURCES.md) を参照。

```sh
npm run diagram:build:steer
```

Python 3.9以降で `public/diagrams/steer-clear-of-the-wall.html` を再生成する。画像とフォントは同梱済みで、再生成・閲覧時のネットワークは不要。

ライト・ダーク両方の目視確認用画像:

```sh
python3 .agents/skills/stack-diagram/scripts/render_png.py \
  public/diagrams/steer-clear-of-the-wall.html \
  output/playwright/steer-clear-of-the-wall.png --selector .canvas --scale 2
```

PythonのPlaywrightとChromiumが必要。確認画像はGit管理対象外。アプリのプレビューはiframe内の上下・左右スクロールで閲覧でき、別タブではHTML全体を直接開ける。
