import { createGrpcTransport } from "@connectrpc/connect-node";
import invariant from "tiny-invariant";
import { singleton } from "./singleton";

export const cloverTransport = singleton(
  "cloverTransport",
  createCloverTransport,
);

function createCloverTransport() {
  const { CLOVER_BASE_URL, CLOVER_CLIENT_CERT, CLOVER_CLIENT_KEY } =
    process.env;
  invariant(CLOVER_BASE_URL, "CLOVER_BASE_URL must be set");

  return createGrpcTransport({
    baseUrl: CLOVER_BASE_URL,
    httpVersion: "2",
    nodeOptions: {
      cert: CLOVER_CLIENT_CERT,
      key: CLOVER_CLIENT_KEY,
    },
  });
}
