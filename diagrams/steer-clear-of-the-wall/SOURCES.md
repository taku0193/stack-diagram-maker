# STEER CLEAR OF THE WALL — 構成図の根拠

対象: https://github.com/taku0193/steer-clear-of-the-wall

調査日: 2026-11-10。`main` のコミット `384c70dd2a5b110ac4a206a83879f8e4dca3aa20` を参照した。対象リポジトリは読み取りのみで、ゲームのコードは変更していない。

| 図に表す内容 | 確認したソース |
| --- | --- |
| Next.js 16、React 19、TypeScript 6、MediaPipe Tasks Vision、better-sqlite3 | [package.json](https://github.com/taku0193/steer-clear-of-the-wall/blob/384c70dd2a5b110ac4a206a83879f8e4dca3aa20/package.json) |
| カメラはgetUserMediaで映像だけを取得 | [camera.ts](https://github.com/taku0193/steer-clear-of-the-wall/blob/384c70dd2a5b110ac4a206a83879f8e4dca3aa20/src/camera/camera.ts) |
| WASMはcdn.jsdelivr.net、Poseモデルはstorage.googleapis.comから取得。ブラウザ内で姿勢を検出しPoseFrameへ変換 | [poseDetector.ts](https://github.com/taku0193/steer-clear-of-the-wall/blob/384c70dd2a5b110ac4a206a83879f8e4dca3aa20/src/pose/poseDetector.ts) |
| 姿勢をゲーム座標・当たり判定領域へ変換し、ゲーム状態へ反映。結果に心拍セッションを渡す | [App.tsx](https://github.com/taku0193/steer-clear-of-the-wall/blob/384c70dd2a5b110ac4a206a83879f8e4dca3aa20/src/App.tsx) |
| 壁の進行、当たり判定、スコア、速度と結果フェーズ | [gameLoop.ts](https://github.com/taku0193/steer-clear-of-the-wall/blob/384c70dd2a5b110ac4a206a83879f8e4dca3aa20/src/game/gameLoop.ts) |
| React画面・HUDとCanvas 2Dによるアバター/壁の描画 | [GameScreen.tsx](https://github.com/taku0193/steer-clear-of-the-wall/blob/384c70dd2a5b110ac4a206a83879f8e4dca3aa20/src/components/GameScreen.tsx) |
| Web Audioの合成音。音量設定だけをlocalStorageへ保存 | [audioPreferences.ts](https://github.com/taku0193/steer-clear-of-the-wall/blob/384c70dd2a5b110ac4a206a83879f8e4dca3aa20/src/audio/audioPreferences.ts)、[README](https://github.com/taku0193/steer-clear-of-the-wall/blob/384c70dd2a5b110ac4a206a83879f8e4dca3aa20/README.md) |
| Fitbit Airの標準BLE心拍サービスへWeb Bluetoothで接続 | [webBluetoothHeartRate.ts](https://github.com/taku0193/steer-clear-of-the-wall/blob/384c70dd2a5b110ac4a206a83879f8e4dca3aa20/src/heart-rate/webBluetoothHeartRate.ts) |
| 心拍の測定値・統計・グラフはブラウザのメモリに保持し、タイトル復帰時に破棄 | [useHeartRateMonitor.ts](https://github.com/taku0193/steer-clear-of-the-wall/blob/384c70dd2a5b110ac4a206a83879f8e4dca3aa20/src/heart-rate/useHeartRateMonitor.ts)、[heartRateSession.ts](https://github.com/taku0193/steer-clear-of-the-wall/blob/384c70dd2a5b110ac4a206a83879f8e4dca3aa20/src/heart-rate/heartRateSession.ts) |
| GET/POST /api/rankings。ランキングの送信項目に映像・姿勢・心拍は含まれない | [rankingClient.ts](https://github.com/taku0193/steer-clear-of-the-wall/blob/384c70dd2a5b110ac4a206a83879f8e4dca3aa20/src/ranking/rankingClient.ts)、[rankingTypes.ts](https://github.com/taku0193/steer-clear-of-the-wall/blob/384c70dd2a5b110ac4a206a83879f8e4dca3aa20/src/ranking/rankingTypes.ts) |
| Node.jsのRoute Handlerで検証し、better-sqlite3経由で保存・Top 100を取得 | [route.ts](https://github.com/taku0193/steer-clear-of-the-wall/blob/384c70dd2a5b110ac4a206a83879f8e4dca3aa20/app/api/rankings/route.ts)、[rankingService.ts](https://github.com/taku0193/steer-clear-of-the-wall/blob/384c70dd2a5b110ac4a206a83879f8e4dca3aa20/src/ranking/rankingService.ts)、[rankingRepository.ts](https://github.com/taku0193/steer-clear-of-the-wall/blob/384c70dd2a5b110ac4a206a83879f8e4dca3aa20/src/ranking/rankingRepository.ts) |
| 同じPC、またはSSHポート転送先でNext.js/SQLiteを動かせる | [READMEのLocal Production / SSH Development](https://github.com/taku0193/steer-clear-of-the-wall/blob/384c70dd2a5b110ac4a206a83879f8e4dca3aa20/README.md) |

## 表現の範囲

実装を機能単位にまとめた概略図。モック姿勢はカメラ/推論の代替入口として注記し、全コンポーネント、テスト、バックアップ処理、health APIは省略する。TypeScriptの姿勢変換・判定処理を独立したサービスとしてデプロイする意味ではない。

Next.js・React・TypeScript・SQLiteには取得したブランドロゴを使用する。MediaPipeはSkillのロゴ取得元で見つからず、公式画像ディレクトリも404だったため、「姿勢検出」という機能ノードをLucideの人物ピクトグラムで表す。MediaPipeのロゴの代替品や再描画ではない。その他のブラウザAPI・機能もLucideの汎用ピクトグラムを使う。

各アイコンの取得元は `icons/manifest.json` を参照。外部ギャラリーへの投稿は行わない。

SQLiteはタイルに収まるマークを使うため、Skillの明示URL指定でDeviconの `sqlite-original.svg` を取得した。manifestの `source: explicit` は取得方法を表し、実際の配布元は記載URLのDevicon。
