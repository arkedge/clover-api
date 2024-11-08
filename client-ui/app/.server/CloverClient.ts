import { toJson } from "@bufbuild/protobuf";
import { timestampFromDate } from "@bufbuild/protobuf/wkt";
import { Client, Code, ConnectError, createClient } from "@connectrpc/connect";
import { CloverService } from "~/gen/aegs/clover/v1/clover_service_pb";
import {
  ContactSchema,
  GroundStationSchema,
  PassSchema,
  SatelliteSchema,
  TLERecordSchema,
} from "~/gen/aegs/clover/v1/models_pb";
import { cloverTransport } from "./grpc";

export class CloverClient {
  private client: Client<typeof CloverService>;

  constructor() {
    this.client = createClient(CloverService, cloverTransport);
  }

  async listSatellites() {
    const response = await this.client.listSatellites({});
    return response.satellites.map((satellite) =>
      toJson(SatelliteSchema, satellite),
    );
  }

  async getSatellite(satelliteId: bigint) {
    try {
      const response = await this.client.getSatellite({ satelliteId });
      return toJson(SatelliteSchema, response.satellite!);
    } catch (err) {
      if (err instanceof ConnectError && err.code === Code.NotFound) {
        return null;
      } else {
        throw err;
      }
    }
  }

  async getLatestTLE(satelliteId: bigint) {
    try {
      const response = await this.client.getLatestTLE({ satelliteId });
      return toJson(TLERecordSchema, response.tleRecord!);
    } catch (err) {
      if (err instanceof ConnectError && err.code === Code.NotFound) {
        return null;
      } else {
        throw err;
      }
    }
  }

  async registerTLE(satelliteId: bigint, line1: string, line2: string) {
    const response = await this.client.registerTLE({
      satelliteId,
      tle: { line1, line2 },
    });
    return toJson(TLERecordSchema, response.tleRecord!);
  }

  async listAvailableGroundStations(satelliteId: bigint) {
    const response = await this.client.listAvailableGroundStations({
      satelliteId,
    });
    return response.groundStations.map((groundStation) =>
      toJson(GroundStationSchema, groundStation),
    );
  }

  async getGroundStation(groundStationId: bigint) {
    const response = await this.client.getGroundStation({ groundStationId });
    return toJson(GroundStationSchema, response.groundStation!);
  }

  async listUpcomingContacts(satelliteId: bigint) {
    const response = await this.client.listUpcomingContacts({ satelliteId });
    return response.contacts.map((contact) => toJson(ContactSchema, contact));
  }

  async getContact(contactId: bigint) {
    try {
      const response = await this.client.getContact({ contactId });
      return toJson(ContactSchema, response.contact!);
    } catch (err) {
      if (err instanceof ConnectError && err.code === Code.NotFound) {
        return null;
      } else {
        throw err;
      }
    }
  }

  async createContact(
    satelliteId: bigint,
    groundStationId: bigint,
    aos: Date,
    los: Date,
  ) {
    const response = await this.client.createContact({
      satelliteId,
      groundStationId,
      aos: timestampFromDate(aos),
      los: timestampFromDate(los),
    });
    return toJson(ContactSchema, response.contact!);
  }

  async listPasses(satelliteId: bigint, groundStationIds: bigint[]) {
    const response = await this.client.listPasses({
      satelliteId,
      groundStationIds,
    });
    return response.passes.map((pass) => toJson(PassSchema, pass));
  }
}
