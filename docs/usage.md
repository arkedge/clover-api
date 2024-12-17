# 使い方

この節では、Clover API を用いて以下の操作を行う方法を説明します。

1. TLE の登録
2. 予約可能なパスの取得
3. コンタクトの作成

Clover API は [Protocol Buffers](https://protobuf.dev/) で定義されているため、これをもとに各種プログラミング言語のクライアントコードを生成できます。
しかし、ここでは特定のプログラミング言語を用いるのではなく、前節に引き続き [grpcurl](https://github.com/fullstorydev/grpcurl) を用いて説明します。
grpcurl は、コマンドラインツールとしてシンプルなインタフェースを備えており、特定のプログラミング言語の文法やエコシステムの前提知識なしに利用できるからです。
ユーザインタフェースの作成や自動化など、より高度な形で利用する場合は、使用する言語に応じた gRPC クライアントの開発方法を調べてみてください。
[クライアント実装例](client-example.md)の節では、Clover UI という参考実装を紹介しています。

使用した grpcurl のバージョンは以下のとおりです。

```console
$ grpcurl -version
grpcurl 1.9.1
```

また、通信・認証のための情報は、前節と同様に以下を仮定します。

- ホスト名: `clover.example.com`
- TLS 証明書のパス: `./cert.pem`
- 秘密鍵のパス: `./secret.pem`

本説の説明は、Clover API の最低限の使い方を説明することを目的としているため、より詳しいインタフェースについては API リファレンスに相当する [Protocol Documentation](proto.md) を参照してください。

## TLE の登録

はじめに、衛星の TLE を Clover に登録します。
メソッド `RegisterTLE` にパラメータとして、対象の衛星の ID `satellite_id` と、TLE の各行を `line1`、`line2` のフィールドに分けて渡します。
ここで、`satellite_id` は仮に 42 とし、TLE には執筆時点の国際宇宙ステーション（ISS）のものを用いることにします。

```console
$ grpcurl -cert ./cert.pem -key ./secret.pem \
  -d '{"satellite_id":42,"tle":{"line1":"1 25544U 98067A   24291.20635394  .00024836  00000+0  44173-3 0  9994","line2":"2 25544  51.6384  71.0223 0009135  77.3827 282.8183 15.49966283477470"}}' \
  clover.example.com:443 aegs.clover.v1.CloverService/RegisterTLE
```

登録した最新の TLE はメソッド `GetLatestTLE` で確認できます。

```console
$ grpcurl -cert ./cert.pem -key ./secret.pem \
  -d '{"satellite_id":42}' \
  clover.example.com:443 aegs.clover.v1.CloverService/GetLatestTLE
```

TLE が登録できていれば、以下のように登録した TLE が返るはずです。

```json
{
  "tleRecord": {
    "id": "100",
    "tle": {
      "line1": "1 25544U 98067A   24291.20635394  .00024836  00000+0  44173-3 0  9994",
      "line2": "2 25544  51.6384  71.0223 0009135  77.3827 282.8183 15.49966283477470"
    },
    "registerTime": "2024-10-17T08:15:01.874Z"
  }
}
```

## 予約可能なパスの取得

TLE を登録すれば、各地上局でのパスを取得できるようになります。

パスの算出には衛星 ID に加えて地上局 ID も必要なため、まず `ListAvailableGroundStations` で利用可能な地上局の ID を調べます:

```console
$ grpcurl -cert ./cert.pem -key ./secret.pem \
  -d '{"satellite_id":42}' \
  clover.example.com:443 aegs.clover.v1.CloverService/ListAvailableGroundStations
```

```json
{
  "groundStations": [
    {
      "id": "1",
      "name": "アークエッジ・スペース局",
      "location": {
        "latitude": 35.637313872,
        "longitude": 139.78881425,
        "altitude": 12.34
      }
    }
  ]
}
```

上記で得た地上局 ID を使って、`ListPasses` でパスを取得します。
地上局 ID は複数指定することもできます。

```console
$ grpcurl -cert ./cert.pem -key ./secret.pem \
  -d '{"satellite_id":42,"ground_station_ids":[1]}' \
  clover.example.com:443 aegs.clover.v1.CloverService/ListPasses
```

```json
{
  "passes": [
    {
      "satellite": {
        "id": "42",
        "name": "ExampleSat"
      },
      "groundStation": {
        "id": "1",
        "name": "牧之原局",
        "location": {
          "latitude": 34.734444,
          "longitude": 138.194444,
          "altitude": 92.6129
        }
      },
      "details": {
        "aos": "2024-10-17T18:58:01Z",
        "los": "2024-10-17T19:08:18Z",
        "maxElevation": 28.136736561211773
      }
    },
    // ...
```

直近 2 週間分のパスを取得することができました。

## コンタクトの作成

取得したパスをもとに、地上局の予約「コンタクト」を作成します。

`CreateContact` に取得したパスの AOS/LOS を渡してください。
なお、`ListPasses` で得られるパスの AOS/LOS 以外を指定した場合はエラーが返ります。

```console
$ grpcurl -cert ./cert.pem -key ./secret.pem \
  -d '{"satellite_id":42,"ground_station_id":1,"aos":"2024-10-17T18:58:01Z","los":"2024-10-17T19:08:18Z"}' \
  clover.example.com:443 aegs.clover.v1.CloverService/ListPasses
```

コンタクトの作成に成功すると、作成されたコンタクトの情報が返ります。

```json
{
  "contact": {
    "id": "200",
    "satelliteId": "42",
    "groundStationId": "1",
    "status": "STATUS_PENDING",
    "startTime": "2024-10-17T18:53:01Z",
    "endTime": "2024-10-17T19:13:18Z",
    "createTime": "2024-10-17T10:15:14.297Z",
    "updateTime": "2024-10-17T10:15:14.297Z"
  }
}
```

コンタクトの `startTime` と `endTime` が引数で渡した AOS/LOS 時刻と異なっていますが、これはコンタクト前後のバッファが加えられたためです。
上記では 5 分となっていますが、この値は場合によって変わる可能性があります。
この `startTime` と `endTime` をもとに、地上局の排他予約が行われます。
また、コンタクトの予約後に TLE を更新して AOS/LOS 時刻が変化した場合も、コンタクトの開始・終了時刻内で多少の余裕があれば、基本的には問題なく運用できるはずです。

ただし、`status` が `PENDING` の状態では予約は確定していません。
コンタクト作成時の初期状態は `PENDING` で、地上局管理者が承認した場合に `SCHEDULED` に遷移し、そこで予約が確定します。
また、`SCHEDULED` に遷移したあとでも、当該時間に地上局利用ができない場合は `REJECTED` になります。
一度 `REJECTED` になったあと、他の状態に遷移することはありません。

コンタクトの状態は `GetContact` で定期的に確認してください。
TLE を更新した場合は、最新の AOS/LOS 時刻も確認できます。

```console
$ grpcurl -cert ./cert.pem -key ./secret.pem \
  -d '{"contact_id":200}' \
  clover.example.com:443 aegs.clover.v1.CloverService/GetContact
```

```json
{
  "contact": {
    "id": "200",
    "satelliteId": "2",
    "groundStationId": "1",
    "status": "STATUS_SCHEDULED",
    "startTime": "2024-10-17T18:53:01Z",
    "endTime": "2024-10-17T19:13:18Z",
    "createTime": "2024-10-17T10:15:14.297Z",
    "updateTime": "2024-10-17T11:40:01.864Z",
    "pass": {
      "aos": "2024-10-17T18:58:01Z",
      "los": "2024-10-17T19:08:18Z",
      "maxElevation": 28.128380846399544
    }
  }
}
```

コンタクトの開始時刻以前であれば、`CancelContact` でコンタクトをキャンセルできます。
一度キャンセルしたコンタクトはもとに戻せないので、誤ってキャンセルした等の場合は再度コンタクトを作成してください。

```console
$ grpcurl -cert ./cert.pem -key ./secret.pem \
  -d '{"contact_id":200}' \
  clover.example.com:443 aegs.clover.v1.CloverService/CancelContact
```

```json
{
  "contact": {
    "id": "200",
    "satelliteId": "42",
    "groundStationId": "1",
    "status": "STATUS_CANCELED",
    "startTime": "2024-10-17T18:53:01Z",
    "endTime": "2024-10-17T19:13:18Z",
    "createTime": "2024-10-17T10:15:14.297Z",
    "updateTime": "2024-10-17T12:21:59.976Z"
  }
}
```

## コンタクト中のデータの取得

Xバンドなど、コンタクト中に取得した Blob ファイルは `ListContactBlobFiles` で有効期限付きのダウンロード用 URL を取得できます。

```console
$ grpcurl -cert ./cert.pem -key ./secret.pem \
  -d '{"contact_id":200}' \
  clover.example.com:443 aegs.clover.v1.CloverService/ListContactBlobFiles
```

```json
{
  "blobFiles": [
    {
      "url": "https://blob.clover.example.com/ExampleSat/200/20241017190000",
      "filename": "20241017190000",
      "size": "123456789"
    }
  ]
}
```

なお、反映はコンタクト終了からしばらく時間が経ってからになります。
データを取得したはずなのに空のレスポンスが返る場合は、時間を空けてから再度リクエストしてみてください。

また、grpcurl では JSON における文字列値の `&` といった文字が `\u0026` に置き換えられるとのことなので注意してください（[fullstorydev/grpcurl#184](https://github.com/fullstorydev/grpcurl/issues/184)）。

---

以上が、Clover API の基本的な使い方です。
その他のメソッドや、各パラメータの詳細は [Protocol Documentation](proto.md) を参照してください。
