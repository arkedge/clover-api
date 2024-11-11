# Clover UI

Clover API クライアントの GUI 参考実装。

## 技術スタック

- gRPC クライアント: [Protobuf-ES](https://github.com/bufbuild/protobuf-es) & [Connect-ES](https://github.com/connectrpc/connect-es)
- Web フレームワーク: [Remix](https://remix.run/docs)
- UI ライブラリ: [Blueprint](https://blueprintjs.com/docs/) & [Tailwind CSS](https://tailwindcss.com/docs/)

## 開発

### 依存パッケージのインストール

パッケージマネージャとして [pnpm](https://pnpm.io/) を利用しています。

```console
$ corepack enable pnpm
$ pnpm install
```

### `.env` ファイルの作成

```console
$ cp .env.sample .env
```

Clover のエンドポイントと認証情報を設定します。
詳細は[ドキュメントの「認証」の節](https://arkedge.github.io/clover-api/authentication.html)を参照してください。

### 開発サーバの起動

```console
$ pnpm run dev
```

### クライアントコードの生成

Protocol Buffers 定義から TypeScript のコードを [`app/gen`](app/gen) 以下に生成します。

```console
$ pnpm run gen:proto
```

## デプロイ

このディレクトリの [Dockerfile](Dockerfile) からビルドできるコンテナイメージは本番環境で使用できます。
GitHub Actions でビルドしたイメージを GitHub Container registry より配布しています。

https://github.com/arkedge/clover-api/pkgs/container/clover-ui
