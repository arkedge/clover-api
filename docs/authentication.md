# 認証

Clover API の認証は、[相互 TLS 認証（mTLS）](https://www.cloudflare.com/ja-jp/learning/access-management/what-is-mutual-tls/)を使用します。
mTLS で Clover と通信するには、アークエッジ・スペースが発行するクライアント証明書と、対応する秘密鍵が必要になります。
この節では、クライアント証明書の発行申請と、grpcurl を使用した通信例を紹介します。

## クライアント証明書の発行を申請する

Clover のクライアント証明書の発行を申請するには、アークエッジ・スペースの担当者に証明書の署名要求（CSR: Certificate Signing Request）ファイルを送付してください。
テスト環境と本番環境で異なる秘密鍵を使用する場合は、それぞれの環境に対応する CSR が必要です。

以下は、[CFSSL](https://github.com/cloudflare/cfssl) というコマンドラインツールを使った CSR の作成例です。

まず、以下のような CSR のメタデータを記載した JSON ファイルを作成します。
Common Name (`CN`) が含まれていれば、その他のメタデータは任意です。
Common Name の値は、適切なものに変更してください。

```json
{
  "CN": "clover-client.arkedgespace.com",
  "key": {
    "algo": "ecdsa",
    "size": 256
  }
}
```

作成した JSON ファイルを `csr.json` とすると、以下のコマンドで CSR と秘密鍵を生成できます。

```console
$ cfssl genkey csr.json | cfssljson -bare clover-client
```

生成された CSR（上記のコマンドでは `clover-client.csr` という名前になります）をアークエッジ・スペースの担当者に送付してください。
また、同時に生成された秘密鍵（上記コマンドでは `clover-client-key.pem`）は、関係者以外に漏洩することのないよう厳重に管理してください。

CSR を受領後、設定が完了しだいアークエッジ・スペースの担当者より、テスト環境と本番環境のそれぞれについて以下をお送りします。

- Clover のホスト名
- クライアント証明書

クライアント証明書には、原則として発行から1年の有効期限が設定されています。
更新する場合は、有効期限が切れる1ヶ月前から1週間前のあいだに更新する旨を担当者にご連絡ください。

## 発行された認証情報を用いて Clover と通信する

ここでは、[grpcurl](https://github.com/fullstorydev/grpcurl) という gRPC サーバと通信するためのコマンドラインツールを用いて Clover と通信する例を示します。

- ホスト名: `clover.example.com`
- クライアント証明書のパス: `./cert.pem`
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
