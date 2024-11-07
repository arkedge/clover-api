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

  async getSatellite(satelliteId: bigint | string) {
    try {
      satelliteId = BigInt(satelliteId);
    } catch {
      return null;
    }

    try {
      const response = await this.client.getSatellite({ satelliteId });
      return response.satellite || null;
    } catch (err) {
      if (err instanceof ConnectError && err.code === Code.NotFound) {
        return null;
      } else {
        throw err;
      }
    }
  }
}
