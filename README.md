# Clover API

アークエッジ・スペースの地上局予約サービス「Clover」の API 定義とドキュメンテーション。

https://arkedge.github.io/clover-api/

## 開発者向け情報

### ディレクトリ構成

- [`docs`](docs)
  - mdBook で生成するドキュメントページの元となるマークダウンファイル群。
- [`proto`](proto)
  - Clover の Protocol Buffers ファイル。
- [`client-ui`](client-ui)
  - API クライアントの参考実装（Clover UI）のソースコード。

### ドキュメントページの生成

#### 依存ソフトウェア

- [mdBook](https://github.com/rust-lang/mdBook)
- [Protobuf Compiler (protoc)](https://github.com/protocolbuffers/protobuf)
- [protoc-gen-doc](https://github.com/pseudomuto/protoc-gen-doc)

#### Protocol Documentation の生成

Protocol Documentation (`docs/proto.md`) は `protoc-gen-doc` を用いて `proto` 以下を元に生成します:

```console
$ protoc -I proto --doc_out=./docs --doc_opt=markdown,proto.md $(find proto -name "*.proto")
```

#### mdBook によるドキュメントページの生成

`mdbook build` で `book` 以下にドキュメントページを生成します:

```console
$ mdbook build
```

`mdbook serve` でローカルサーバを立ち上げて確認できます:

```console
$ mdbook serve --open
```

### Clover UI

[client-ui/README.md](client-ui/README.md) を参照してください。
