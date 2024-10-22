# 認証

Clover API の認証は、[相互 TLS 認証（mTLS）](https://www.cloudflare.com/ja-jp/learning/access-management/what-is-mutual-tls/)を使用します。
mTLS で Clover と通信するには、アークエッジ・スペースが発行するクライアント証明書と、対応する秘密鍵が必要になります。
この節では、クライアントの登録申請と、grpcurl を使用した通信例を紹介します。

## クライアントの登録を申請する

Clover のクライアント登録を申請するには、アークエッジ・スペースの担当者に使用する衛星について以下の項目をご連絡ください。

- 衛星の名前
- 使用する地上局
- TLS 証明書の Common Name に使用するクライアント名（例: `clover-client.arkedgespace.com`）

連絡を受領後、設定が完了しだいアークエッジ・スペースの担当者より以下をお送りします。

- Clover のテスト環境、本番環境それぞれのホスト名
- TLS 証明書
- 秘密鍵

特に、秘密鍵は関係者以外に漏れることのないよう注意して管理してください。

TLS 証明書には、原則として発行から1年の有効期限が設定されています。
更新する場合は、有効期限が切れる1ヶ月前から1週間前のあいだに更新する旨を担当者にご連絡ください。

## 発行された認証情報を用いて Clover と通信する

ここでは、[grpcurl](https://github.com/fullstorydev/grpcurl) という gRPC サーバと通信するためのコマンドラインツールを用いて Clover と通信する例を示します。

- ホスト名: `clover.example.com`
- TLS 証明書のパス: `./cert.pem`
- 秘密鍵のパス: `./secret.pem`

とすると、次のコマンドで登録されている衛星のリストを取得するリクエストを送ることができます。

```console
$ grpcurl -cert ./cert.pem -key ./secret.pem clover.example.com:443 aegs.clover.v1.CloverService/ListSatellites
```

コマンドの結果として、以下のような JSON が標準出力に表示されれば通信は成功です。

```json
{
  "satellites": [
    {
      "id": "42",
      "name": "ExampleSat"
    }
  ]
}
```

grpcurl コマンドの引数について、`aegs.clover.v1.CloverService/ListSatellites` は gRPC のサービスとメソッドを指します。
次の「[使い方](usage.md)」節でその他の API の使い方を説明します。
