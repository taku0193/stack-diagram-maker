# サンプル構成図の生成元

`vue-fastapi-postgres.draft.html` は公式Skillの `assets/template.html` を元に、`references/geometry.md` に沿ってノード・グループ・矢印を配置したソース。生成済みHTMLは `public/diagrams/vue-fastapi-postgres.html`。

## 再生成（ネットワーク不要）

```sh
npm run diagram:build
```

公式Skillの `build.py` が `icons/` の画像と同梱フォントをdata URIとして埋め込む。ロゴの取得元は `icons/manifest.json`、Skillの固定バージョンは `docs/SKILL_PROVENANCE.md` を参照。

ロゴ取得時に使用したコマンド:

```sh
python3 .agents/skills/stack-diagram/scripts/fetch_icons.py diagrams/icons \
  vue:vuejs fastapi postgres:postgresql
```

Browserの画像はSkillの `assets/generic/browser.svg` をコピーした。各ブランドのロゴは元の色・形を維持し、商標は各所有者に帰属する。テンプレートと埋め込みフォントのライセンスは生成HTML内のコメントにも含める。

HTMLはJavaScriptと外部リソースを使用しない。CSPで外部リソースとスクリプトを制限する。アプリ内では権限を追加しない `sandbox=""` でプレビューする。

## 目視確認用の画像

PythonのPlaywrightとChromiumがある環境で実行する。PNGは確認用で、アプリの機能には含めない。

```sh
mkdir -p output/playwright
python3 .agents/skills/stack-diagram/scripts/render_png.py \
  public/diagrams/vue-fastapi-postgres.html output/playwright/diagram-light.png \
  --selector .canvas --scale 2
```

ライト・ダーク両方の画像が作成される。`output/playwright/` はGit管理対象外。
