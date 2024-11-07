import { Client, createClient } from "@connectrpc/connect";
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
}
