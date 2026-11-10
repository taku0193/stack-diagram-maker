# stack-diagram Skillの取得元

- 取得日: 2026-11-10
- 公式リポジトリ: https://github.com/caru-ini/stack-diagram
- 固定コミット: `5af3b095fff7109c905c5284dc510dc06588bade`
- 元のパス: `skills/stack-diagram/`
- 配置先: `.agents/skills/stack-diagram/`（このプロジェクトだけ）
- ライセンス: 同梱の `LICENSE`（MIT）、`assets/fonts/OFL-*.txt`（SIL OFL 1.1）

公式README、SKILL.md、geometry.mdと同梱スクリプトを確認して導入した。`fetch_icons.py` はロゴ取得、`build.py` は画像・フォントの埋め込み、`render_png.py` はローカル描画確認に使用する。外部ギャラリー用 `share.py` は実行しない。

## 導入に使用したコマンド

```sh
python3 /Users/takumayamane/.codex/skills/.system/skill-installer/scripts/install-skill-from-github.py \
  --repo caru-ini/stack-diagram \
  --path skills/stack-diagram \
  --ref 5af3b095fff7109c905c5284dc510dc06588bade \
  --dest /Users/takumayamane/stack-diagram-maker/.agents/skills
```

Skill本体とライセンスはGitで管理するため、clone後の再ダウンロードは不要。CodexのSkill一覧には次のターン以降に反映される。表示されない場合は、このプロジェクトを開き直す。
