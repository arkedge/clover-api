import { Client, Code, ConnectError, createClient } from "@connectrpc/connect";
import { CloverService } from "~/gen/aegs/clover/v1/clover_service_connect";
import { cloverTransport } from "./grpc";

export class CloverClient {
  private client: Client<typeof CloverService>;

  constructor() {
    this.client = createClient(CloverService, cloverTransport);
  }

  async listSatellites() {
    const response = await this.client.listSatellites({});
    return response.satellites;
  }

  async getSatellite(satelliteId: bigint) {
    try {
      const response = await this.client.getSatellite({ satelliteId });
      return response.satellite!;
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
      return {
        tle: response.tleRecord!.tle!,
        registerTime: response.tleRecord!.registerTime!.toDate(),
      };
    } catch (err) {
      if (err instanceof ConnectError && err.code === Code.NotFound) {
        return null;
      } else {
        throw err;
      }
    }
  }
}
