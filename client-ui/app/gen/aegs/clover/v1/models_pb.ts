// @generated by protoc-gen-es v2.2.2 with parameter "target=ts,json_types=true"
// @generated from file aegs/clover/v1/models.proto (package aegs.clover.v1, syntax proto3)
/* eslint-disable */

import type { GenEnum, GenFile, GenMessage } from "@bufbuild/protobuf/codegenv1";
import { enumDesc, fileDesc, messageDesc } from "@bufbuild/protobuf/codegenv1";
import type { Timestamp, TimestampJson } from "@bufbuild/protobuf/wkt";
import { file_google_protobuf_timestamp } from "@bufbuild/protobuf/wkt";
import type { Message } from "@bufbuild/protobuf";

/**
 * Describes the file aegs/clover/v1/models.proto.
 */
export const file_aegs_clover_v1_models: GenFile = /*@__PURE__*/
  fileDesc("ChthZWdzL2Nsb3Zlci92MS9tb2RlbHMucHJvdG8SDmFlZ3MuY2xvdmVyLnYxIiUKCVNhdGVsbGl0ZRIKCgJpZBgBIAEoAxIMCgRuYW1lGAIgASgJImwKCVRMRVJlY29yZBIKCgJpZBgBIAEoAxIgCgN0bGUYAiABKAsyEy5hZWdzLmNsb3Zlci52MS5UTEUSMQoNcmVnaXN0ZXJfdGltZRgDIAEoCzIaLmdvb2dsZS5wcm90b2J1Zi5UaW1lc3RhbXAiIwoDVExFEg0KBWxpbmUxGAEgASgJEg0KBWxpbmUyGAIgASgJIlYKDUdyb3VuZFN0YXRpb24SCgoCaWQYASABKAMSDAoEbmFtZRgCIAEoCRIrCghsb2NhdGlvbhgDIAEoCzIZLmFlZ3MuY2xvdmVyLnYxLkxhdExuZ0FsdCJCCglMYXRMbmdBbHQSEAoIbGF0aXR1ZGUYASABKAESEQoJbG9uZ2l0dWRlGAIgASgBEhAKCGFsdGl0dWRlGAMgASgBIq8BCgRQYXNzEiwKCXNhdGVsbGl0ZRgBIAEoCzIZLmFlZ3MuY2xvdmVyLnYxLlNhdGVsbGl0ZRI1Cg5ncm91bmRfc3RhdGlvbhgCIAEoCzIdLmFlZ3MuY2xvdmVyLnYxLkdyb3VuZFN0YXRpb24SLAoHZGV0YWlscxgDIAEoCzIbLmFlZ3MuY2xvdmVyLnYxLlBhc3NEZXRhaWxzEhQKDGlzX2F2YWlsYWJsZRgEIAEoCCJ2CgtQYXNzRGV0YWlscxInCgNhb3MYASABKAsyGi5nb29nbGUucHJvdG9idWYuVGltZXN0YW1wEicKA2xvcxgCIAEoCzIaLmdvb2dsZS5wcm90b2J1Zi5UaW1lc3RhbXASFQoNbWF4X2VsZXZhdGlvbhgDIAEoASKVBAoHQ29udGFjdBIKCgJpZBgBIAEoAxIUCgxzYXRlbGxpdGVfaWQYAiABKAMSGQoRZ3JvdW5kX3N0YXRpb25faWQYAyABKAMSLgoGc3RhdHVzGAQgASgOMh4uYWVncy5jbG92ZXIudjEuQ29udGFjdC5TdGF0dXMSLgoKc3RhcnRfdGltZRgFIAEoCzIaLmdvb2dsZS5wcm90b2J1Zi5UaW1lc3RhbXASLAoIZW5kX3RpbWUYBiABKAsyGi5nb29nbGUucHJvdG9idWYuVGltZXN0YW1wEi8KC2NyZWF0ZV90aW1lGAcgASgLMhouZ29vZ2xlLnByb3RvYnVmLlRpbWVzdGFtcBIvCgt1cGRhdGVfdGltZRgIIAEoCzIaLmdvb2dsZS5wcm90b2J1Zi5UaW1lc3RhbXASKQoEcGFzcxgJIAEoCzIbLmFlZ3MuY2xvdmVyLnYxLlBhc3NEZXRhaWxzIrEBCgZTdGF0dXMSFgoSU1RBVFVTX1VOU1BFQ0lGSUVEEAASEgoOU1RBVFVTX1BFTkRJTkcQARIUChBTVEFUVVNfU0NIRURVTEVEEAISEwoPU1RBVFVTX1JFSkVDVEVEEAMSEwoPU1RBVFVTX0NBTkNFTEVEEAQSEgoOU1RBVFVTX1JVTk5JTkcQBRIUChBTVEFUVVNfQ09NUExFVEVEEAYSEQoNU1RBVFVTX0ZBSUxFRBAHIjcKCEJsb2JGaWxlEgsKA3VybBgBIAEoCRIQCghmaWxlbmFtZRgCIAEoCRIMCgRzaXplGAMgASgDYgZwcm90bzM", [file_google_protobuf_timestamp]);

/**
 * 衛星。
 *
 * @generated from message aegs.clover.v1.Satellite
 */
export type Satellite = Message<"aegs.clover.v1.Satellite"> & {
  /**
   * 衛星の ID
   *
   * @generated from field: int64 id = 1;
   */
  id: bigint;

  /**
   * 衛星の名前
   *
   * @generated from field: string name = 2;
   */
  name: string;
};

/**
 * 衛星。
 *
 * @generated from message aegs.clover.v1.Satellite
 */
export type SatelliteJson = {
  /**
   * 衛星の ID
   *
   * @generated from field: int64 id = 1;
   */
  id?: string;

  /**
   * 衛星の名前
   *
   * @generated from field: string name = 2;
   */
  name?: string;
};

/**
 * Describes the message aegs.clover.v1.Satellite.
 * Use `create(SatelliteSchema)` to create a new message.
 */
export const SatelliteSchema: GenMessage<Satellite, SatelliteJson> = /*@__PURE__*/
  messageDesc(file_aegs_clover_v1_models, 0);

/**
 * 登録された TLE の情報。
 *
 * @generated from message aegs.clover.v1.TLERecord
 */
export type TLERecord = Message<"aegs.clover.v1.TLERecord"> & {
  /**
   * TLE の ID
   *
   * @generated from field: int64 id = 1;
   */
  id: bigint;

  /**
   * 登録された TLE
   *
   * @generated from field: aegs.clover.v1.TLE tle = 2;
   */
  tle?: TLE;

  /**
   * TLE の登録日時
   *
   * @generated from field: google.protobuf.Timestamp register_time = 3;
   */
  registerTime?: Timestamp;
};

/**
 * 登録された TLE の情報。
 *
 * @generated from message aegs.clover.v1.TLERecord
 */
export type TLERecordJson = {
  /**
   * TLE の ID
   *
   * @generated from field: int64 id = 1;
   */
  id?: string;

  /**
   * 登録された TLE
   *
   * @generated from field: aegs.clover.v1.TLE tle = 2;
   */
  tle?: TLEJson;

  /**
   * TLE の登録日時
   *
   * @generated from field: google.protobuf.Timestamp register_time = 3;
   */
  registerTime?: TimestampJson;
};

/**
 * Describes the message aegs.clover.v1.TLERecord.
 * Use `create(TLERecordSchema)` to create a new message.
 */
export const TLERecordSchema: GenMessage<TLERecord, TLERecordJson> = /*@__PURE__*/
  messageDesc(file_aegs_clover_v1_models, 1);

/**
 * TLE (Two-Line Elements)。
 *
 * @generated from message aegs.clover.v1.TLE
 */
export type TLE = Message<"aegs.clover.v1.TLE"> & {
  /**
   * TLE の1行目
   *
   * @generated from field: string line1 = 1;
   */
  line1: string;

  /**
   * TLE の2行目
   *
   * @generated from field: string line2 = 2;
   */
  line2: string;
};

/**
 * TLE (Two-Line Elements)。
 *
 * @generated from message aegs.clover.v1.TLE
 */
export type TLEJson = {
  /**
   * TLE の1行目
   *
   * @generated from field: string line1 = 1;
   */
  line1?: string;

  /**
   * TLE の2行目
   *
   * @generated from field: string line2 = 2;
   */
  line2?: string;
};

/**
 * Describes the message aegs.clover.v1.TLE.
 * Use `create(TLESchema)` to create a new message.
 */
export const TLESchema: GenMessage<TLE, TLEJson> = /*@__PURE__*/
  messageDesc(file_aegs_clover_v1_models, 2);

/**
 * 地上局。
 *
 * @generated from message aegs.clover.v1.GroundStation
 */
export type GroundStation = Message<"aegs.clover.v1.GroundStation"> & {
  /**
   * 地上局の ID
   *
   * @generated from field: int64 id = 1;
   */
  id: bigint;

  /**
   * 地上局の名前
   *
   * @generated from field: string name = 2;
   */
  name: string;

  /**
   * 地上局の位置
   *
   * @generated from field: aegs.clover.v1.LatLngAlt location = 3;
   */
  location?: LatLngAlt;
};

/**
 * 地上局。
 *
 * @generated from message aegs.clover.v1.GroundStation
 */
export type GroundStationJson = {
  /**
   * 地上局の ID
   *
   * @generated from field: int64 id = 1;
   */
  id?: string;

  /**
   * 地上局の名前
   *
   * @generated from field: string name = 2;
   */
  name?: string;

  /**
   * 地上局の位置
   *
   * @generated from field: aegs.clover.v1.LatLngAlt location = 3;
   */
  location?: LatLngAltJson;
};

/**
 * Describes the message aegs.clover.v1.GroundStation.
 * Use `create(GroundStationSchema)` to create a new message.
 */
export const GroundStationSchema: GenMessage<GroundStation, GroundStationJson> = /*@__PURE__*/
  messageDesc(file_aegs_clover_v1_models, 3);

/**
 * 緯度・経度・高度からなる位置情報。
 * パスの計算に使用される。
 *
 * @generated from message aegs.clover.v1.LatLngAlt
 */
export type LatLngAlt = Message<"aegs.clover.v1.LatLngAlt"> & {
  /**
   * 緯度 [deg]
   *
   * @generated from field: double latitude = 1;
   */
  latitude: number;

  /**
   * 経度 [deg]
   *
   * @generated from field: double longitude = 2;
   */
  longitude: number;

  /**
   * 楕円体高 [meter]
   *
   * @generated from field: double altitude = 3;
   */
  altitude: number;
};

/**
 * 緯度・経度・高度からなる位置情報。
 * パスの計算に使用される。
 *
 * @generated from message aegs.clover.v1.LatLngAlt
 */
export type LatLngAltJson = {
  /**
   * 緯度 [deg]
   *
   * @generated from field: double latitude = 1;
   */
  latitude?: number | "NaN" | "Infinity" | "-Infinity";

  /**
   * 経度 [deg]
   *
   * @generated from field: double longitude = 2;
   */
  longitude?: number | "NaN" | "Infinity" | "-Infinity";

  /**
   * 楕円体高 [meter]
   *
   * @generated from field: double altitude = 3;
   */
  altitude?: number | "NaN" | "Infinity" | "-Infinity";
};

/**
 * Describes the message aegs.clover.v1.LatLngAlt.
 * Use `create(LatLngAltSchema)` to create a new message.
 */
export const LatLngAltSchema: GenMessage<LatLngAlt, LatLngAltJson> = /*@__PURE__*/
  messageDesc(file_aegs_clover_v1_models, 4);

/**
 * 衛星パス。
 *
 * @generated from message aegs.clover.v1.Pass
 */
export type Pass = Message<"aegs.clover.v1.Pass"> & {
  /**
   * 当該パスの衛星
   *
   * @generated from field: aegs.clover.v1.Satellite satellite = 1;
   */
  satellite?: Satellite;

  /**
   * 当該パスの地上局
   *
   * @generated from field: aegs.clover.v1.GroundStation ground_station = 2;
   */
  groundStation?: GroundStation;

  /**
   * 当該パスの AOS/LOS と最大仰角
   *
   * @generated from field: aegs.clover.v1.PassDetails details = 3;
   */
  details?: PassDetails;

  /**
   * 当該パスがコンタクトとして予約可能かどうか
   *
   * @generated from field: bool is_available = 4;
   */
  isAvailable: boolean;
};

/**
 * 衛星パス。
 *
 * @generated from message aegs.clover.v1.Pass
 */
export type PassJson = {
  /**
   * 当該パスの衛星
   *
   * @generated from field: aegs.clover.v1.Satellite satellite = 1;
   */
  satellite?: SatelliteJson;

  /**
   * 当該パスの地上局
   *
   * @generated from field: aegs.clover.v1.GroundStation ground_station = 2;
   */
  groundStation?: GroundStationJson;

  /**
   * 当該パスの AOS/LOS と最大仰角
   *
   * @generated from field: aegs.clover.v1.PassDetails details = 3;
   */
  details?: PassDetailsJson;

  /**
   * 当該パスがコンタクトとして予約可能かどうか
   *
   * @generated from field: bool is_available = 4;
   */
  isAvailable?: boolean;
};

/**
 * Describes the message aegs.clover.v1.Pass.
 * Use `create(PassSchema)` to create a new message.
 */
export const PassSchema: GenMessage<Pass, PassJson> = /*@__PURE__*/
  messageDesc(file_aegs_clover_v1_models, 5);

/**
 * パスの AOS/LOS 時刻と最大仰角といった詳細情報。
 *
 * @generated from message aegs.clover.v1.PassDetails
 */
export type PassDetails = Message<"aegs.clover.v1.PassDetails"> & {
  /**
   * AOS (Acquisition of Signal) 時刻
   *
   * @generated from field: google.protobuf.Timestamp aos = 1;
   */
  aos?: Timestamp;

  /**
   * LOS (Loss of Signal) 時刻
   *
   * @generated from field: google.protobuf.Timestamp los = 2;
   */
  los?: Timestamp;

  /**
   * 最大仰角 [deg]
   *
   * @generated from field: double max_elevation = 3;
   */
  maxElevation: number;
};

/**
 * パスの AOS/LOS 時刻と最大仰角といった詳細情報。
 *
 * @generated from message aegs.clover.v1.PassDetails
 */
export type PassDetailsJson = {
  /**
   * AOS (Acquisition of Signal) 時刻
   *
   * @generated from field: google.protobuf.Timestamp aos = 1;
   */
  aos?: TimestampJson;

  /**
   * LOS (Loss of Signal) 時刻
   *
   * @generated from field: google.protobuf.Timestamp los = 2;
   */
  los?: TimestampJson;

  /**
   * 最大仰角 [deg]
   *
   * @generated from field: double max_elevation = 3;
   */
  maxElevation?: number | "NaN" | "Infinity" | "-Infinity";
};

/**
 * Describes the message aegs.clover.v1.PassDetails.
 * Use `create(PassDetailsSchema)` to create a new message.
 */
export const PassDetailsSchema: GenMessage<PassDetails, PassDetailsJson> = /*@__PURE__*/
  messageDesc(file_aegs_clover_v1_models, 6);

/**
 * コンタクト。
 * Clover においては、予約されたパスを表す。
 *
 * @generated from message aegs.clover.v1.Contact
 */
export type Contact = Message<"aegs.clover.v1.Contact"> & {
  /**
   * コンタクトの ID
   *
   * @generated from field: int64 id = 1;
   */
  id: bigint;

  /**
   * コンタクト対象の衛星の ID
   *
   * @generated from field: int64 satellite_id = 2;
   */
  satelliteId: bigint;

  /**
   * コンタクトで使用する地上局の ID
   *
   * @generated from field: int64 ground_station_id = 3;
   */
  groundStationId: bigint;

  /**
   * コンタクトのステータス
   *
   * @generated from field: aegs.clover.v1.Contact.Status status = 4;
   */
  status: Contact_Status;

  /**
   * コンタクトの開始時刻。
   * AOSに対してバッファを持たせた時刻が設定され、この時刻をもとに予約の排他制御が行われる
   *
   * @generated from field: google.protobuf.Timestamp start_time = 5;
   */
  startTime?: Timestamp;

  /**
   * コンタクトの終了時刻。
   * LOSに対してバッファを持たせた時刻が設定され、この時刻をもとに予約の排他制御が行われる
   *
   * @generated from field: google.protobuf.Timestamp end_time = 6;
   */
  endTime?: Timestamp;

  /**
   * コンタクトの作成日時
   *
   * @generated from field: google.protobuf.Timestamp create_time = 7;
   */
  createTime?: Timestamp;

  /**
   * コンタクトの更新日時。
   * 基本的にはステータスの変更時刻を表す
   *
   * @generated from field: google.protobuf.Timestamp update_time = 8;
   */
  updateTime?: Timestamp;

  /**
   * リクエスト時の TLE に基づいて計算されたパスの詳細。
   * GetContact の場合にのみ値が設定される。
   * コンタクト時刻の前後にパスが見つからなかった場合は値が設定されない
   *
   * @generated from field: aegs.clover.v1.PassDetails pass = 9;
   */
  pass?: PassDetails;
};

/**
 * コンタクト。
 * Clover においては、予約されたパスを表す。
 *
 * @generated from message aegs.clover.v1.Contact
 */
export type ContactJson = {
  /**
   * コンタクトの ID
   *
   * @generated from field: int64 id = 1;
   */
  id?: string;

  /**
   * コンタクト対象の衛星の ID
   *
   * @generated from field: int64 satellite_id = 2;
   */
  satelliteId?: string;

  /**
   * コンタクトで使用する地上局の ID
   *
   * @generated from field: int64 ground_station_id = 3;
   */
  groundStationId?: string;

  /**
   * コンタクトのステータス
   *
   * @generated from field: aegs.clover.v1.Contact.Status status = 4;
   */
  status?: Contact_StatusJson;

  /**
   * コンタクトの開始時刻。
   * AOSに対してバッファを持たせた時刻が設定され、この時刻をもとに予約の排他制御が行われる
   *
   * @generated from field: google.protobuf.Timestamp start_time = 5;
   */
  startTime?: TimestampJson;

  /**
   * コンタクトの終了時刻。
   * LOSに対してバッファを持たせた時刻が設定され、この時刻をもとに予約の排他制御が行われる
   *
   * @generated from field: google.protobuf.Timestamp end_time = 6;
   */
  endTime?: TimestampJson;

  /**
   * コンタクトの作成日時
   *
   * @generated from field: google.protobuf.Timestamp create_time = 7;
   */
  createTime?: TimestampJson;

  /**
   * コンタクトの更新日時。
   * 基本的にはステータスの変更時刻を表す
   *
   * @generated from field: google.protobuf.Timestamp update_time = 8;
   */
  updateTime?: TimestampJson;

  /**
   * リクエスト時の TLE に基づいて計算されたパスの詳細。
   * GetContact の場合にのみ値が設定される。
   * コンタクト時刻の前後にパスが見つからなかった場合は値が設定されない
   *
   * @generated from field: aegs.clover.v1.PassDetails pass = 9;
   */
  pass?: PassDetailsJson;
};

/**
 * Describes the message aegs.clover.v1.Contact.
 * Use `create(ContactSchema)` to create a new message.
 */
export const ContactSchema: GenMessage<Contact, ContactJson> = /*@__PURE__*/
  messageDesc(file_aegs_clover_v1_models, 7);

/**
 * コンタクトの状態。
 *
 * @generated from enum aegs.clover.v1.Contact.Status
 */
export enum Contact_Status {
  /**
   * ステータスの値が設定されていない場合の値。
   * この値が設定された場合は異常な状態であるため、アークエッジ・スペースの担当者に連絡すること
   *
   * @generated from enum value: STATUS_UNSPECIFIED = 0;
   */
  UNSPECIFIED = 0,

  /**
   * 局管理者の確認待ちの状態。
   * コンタクトを予約した直後の初期状態。
   * この状態から他の状態に遷移したあと、この状態に戻ることはない
   *
   * @generated from enum value: STATUS_PENDING = 1;
   */
  PENDING = 1,

  /**
   * 局管理者に承認され、コンタクトの予約が有効な状態
   *
   * @generated from enum value: STATUS_SCHEDULED = 2;
   */
  SCHEDULED = 2,

  /**
   * 局管理者に拒否され、コンタクトの予約が無効な状態
   * 他の状態に遷移しない終端状態
   *
   * @generated from enum value: STATUS_REJECTED = 3;
   */
  REJECTED = 3,

  /**
   * ユーザがコンタクトの予約をキャンセルした状態。
   * 他の状態に遷移しない終端状態
   *
   * @generated from enum value: STATUS_CANCELED = 4;
   */
  CANCELED = 4,

  /**
   * コンタクトが実行中の状態。
   * この状態になると、キャンセルできなくなる
   *
   * @generated from enum value: STATUS_RUNNING = 5;
   */
  RUNNING = 5,

  /**
   * コンタクトが完了した状態。
   * 他の状態に遷移しない終端状態
   *
   * @generated from enum value: STATUS_COMPLETED = 6;
   */
  COMPLETED = 6,

  /**
   * コンタクトが何らかの理由で失敗した状態。
   * 他の状態に遷移しない終端状態
   *
   * @generated from enum value: STATUS_FAILED = 7;
   */
  FAILED = 7,
}

/**
 * コンタクトの状態。
 *
 * @generated from enum aegs.clover.v1.Contact.Status
 */
export type Contact_StatusJson = "STATUS_UNSPECIFIED" | "STATUS_PENDING" | "STATUS_SCHEDULED" | "STATUS_REJECTED" | "STATUS_CANCELED" | "STATUS_RUNNING" | "STATUS_COMPLETED" | "STATUS_FAILED";

/**
 * Describes the enum aegs.clover.v1.Contact.Status.
 */
export const Contact_StatusSchema: GenEnum<Contact_Status, Contact_StatusJson> = /*@__PURE__*/
  enumDesc(file_aegs_clover_v1_models, 7, 0);

/**
 * URL からダウンロード可能なファイル。
 *
 * @generated from message aegs.clover.v1.BlobFile
 */
export type BlobFile = Message<"aegs.clover.v1.BlobFile"> & {
  /**
   * ファイルをダウンロードするための URL
   *
   * @generated from field: string url = 1;
   */
  url: string;

  /**
   * ファイル名
   *
   * @generated from field: string filename = 2;
   */
  filename: string;

  /**
   * ファイルのサイズ [byte]
   *
   * @generated from field: int64 size = 3;
   */
  size: bigint;
};

/**
 * URL からダウンロード可能なファイル。
 *
 * @generated from message aegs.clover.v1.BlobFile
 */
export type BlobFileJson = {
  /**
   * ファイルをダウンロードするための URL
   *
   * @generated from field: string url = 1;
   */
  url?: string;

  /**
   * ファイル名
   *
   * @generated from field: string filename = 2;
   */
  filename?: string;

  /**
   * ファイルのサイズ [byte]
   *
   * @generated from field: int64 size = 3;
   */
  size?: string;
};

/**
 * Describes the message aegs.clover.v1.BlobFile.
 * Use `create(BlobFileSchema)` to create a new message.
 */
export const BlobFileSchema: GenMessage<BlobFile, BlobFileJson> = /*@__PURE__*/
  messageDesc(file_aegs_clover_v1_models, 8);

