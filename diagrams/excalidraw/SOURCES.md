# Excalidraw — 構成図の根拠

対象: https://github.com/excalidraw/excalidraw

調査日: 2026-11-10。`master` のコミット `701b901a0f1ba3d0b390d9cdf63d112e25abac4b` を参照した。上流は読み取りのみで、コードの実行・変更はしていない。

この図はOSSのWebアプリ `excalidraw-app` の編集・保存・共同編集を扱う。Reactコンポーネントとして配布される `@excalidraw/excalidraw` と、Webアプリ側に実装された共同編集を区別する。

| 図に表す内容 | 確認したソース |
| --- | --- |
| npm版エディタとWebアプリの機能の違い、local-first、共同編集 | [README](https://github.com/excalidraw/excalidraw/blob/701b901a0f1ba3d0b390d9cdf63d112e25abac4b/README.md) |
| React 19、Firebase、Socket.IO client、idb-keyval | [excalidraw-app/package.json](https://github.com/excalidraw/excalidraw/blob/701b901a0f1ba3d0b390d9cdf63d112e25abac4b/excalidraw-app/package.json) |
| TypeScript、Rough.js、Reactコンポーネントとしてのエディタ | [packages/excalidraw/package.json](https://github.com/excalidraw/excalidraw/blob/701b901a0f1ba3d0b390d9cdf63d112e25abac4b/packages/excalidraw/package.json) |
| elements/appState/filesの変更通知、通常時のLocalData保存と共同編集中の同期 | [App.tsx](https://github.com/excalidraw/excalidraw/blob/701b901a0f1ba3d0b390d9cdf63d112e25abac4b/excalidraw-app/App.tsx#L715) |
| 図形・状態をlocalStorage、画像・ライブラリをIndexedDBへ保存 | [LocalData.ts](https://github.com/excalidraw/excalidraw/blob/701b901a0f1ba3d0b390d9cdf63d112e25abac4b/excalidraw-app/data/LocalData.ts) |
| Canvasで要素を描画 | [renderer/staticScene.ts](https://github.com/excalidraw/excalidraw/blob/701b901a0f1ba3d0b390d9cdf63d112e25abac4b/packages/excalidraw/renderer/staticScene.ts) |
| Rough.jsを使うCanvas出力と、SVG/PNG等のエクスポート | [scene/export.ts](https://github.com/excalidraw/excalidraw/blob/701b901a0f1ba3d0b390d9cdf63d112e25abac4b/packages/excalidraw/scene/export.ts#L838)、[README](https://github.com/excalidraw/excalidraw/blob/701b901a0f1ba3d0b390d9cdf63d112e25abac4b/README.md) |
| Web Crypto APIのAES-GCMによる暗号化・復号 | [encryption.ts](https://github.com/excalidraw/excalidraw/blob/701b901a0f1ba3d0b390d9cdf63d112e25abac4b/packages/excalidraw/data/encryption.ts) |
| 共同編集開始時に通常のローカル保存を停止し、Socket.IOを設定された外部サーバーへ接続 | [Collab.tsx](https://github.com/excalidraw/excalidraw/blob/701b901a0f1ba3d0b390d9cdf63d112e25abac4b/excalidraw-app/collab/Collab.tsx#L526) |
| シーン等を暗号化して送信し、roomを通じて交換 | [Portal.tsx](https://github.com/excalidraw/excalidraw/blob/701b901a0f1ba3d0b390d9cdf63d112e25abac4b/excalidraw-app/collab/Portal.tsx) |
| 暗号化したシーンをFirestore、符号化・暗号化済みの画像ファイルをFirebase Storageに保存 | [firebase.ts](https://github.com/excalidraw/excalidraw/blob/701b901a0f1ba3d0b390d9cdf63d112e25abac4b/excalidraw-app/data/firebase.ts)、[Collab.tsx](https://github.com/excalidraw/excalidraw/blob/701b901a0f1ba3d0b390d9cdf63d112e25abac4b/excalidraw-app/collab/Collab.tsx#L178) |

## 図の読み方

- Scene state、LocalData、Web Crypto、Collab clientは論理的な処理のまとまりで、独立したバックエンドサービスを表すものではない。
- 保存の矢印は主な送信方向を示す。読み込み・復号・他参加者の細かい処理は省略する。Room relayとの双方向矢印は、Socket.IOで更新を交換することを示す。
- Firebaseへの暗号化対象は共同編集シーンとファイル。すべてのメタデータや通信まで暗号化対象だと主張する図ではない。
- ルームサーバーは別サービスとして表す。本リポジトリから確認できるのはクライアントと接続設定で、サーバーの内部構成は推測しない。
- 有料のExcalidraw+、AI、監視、ホスティング、開発ツール、全エクスポート形式は図の対象外。

ロゴと汎用ピクトグラムの取得元は `icons/manifest.json` を参照。外部ギャラリーへは投稿しない。
