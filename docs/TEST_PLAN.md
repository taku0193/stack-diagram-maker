# TDDテスト計画 — Stack Diagram Maker

**各段階は Red → Green → Refactor。** 先にテストを失敗させる。

1. `manifest.test.ts`: 配列形式の正しいマニフェストを読み取れる。空配列も有効。
2. `manifest.test.ts`: フィールド欠損・重複ID・絶対URL・`../`・`?`・`#`・スラッシュを含むfilenameを拒否する。
3. `selection.test.ts`: 図選択時にホワイトリストの `/diagrams/<filename>` のみ生成する。
4. 取得失敗時のエラー表示、0件の空状態の表示。
5. 手動: Skillで生成したHTMLが描画されている。プレビューは意図しない外部サイトを開かない。

Skillで構成図を生成したことはテストでは代替できない。実物のHTMLを保存し、手動表示を確認する。
