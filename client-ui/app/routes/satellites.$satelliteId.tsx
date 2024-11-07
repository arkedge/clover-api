import { H1 } from "@blueprintjs/core";
import { json, LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { CloverClient } from "~/.server/CloverClient";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  invariant(params.satelliteId, "Missing satelliteId param");

  const client = new CloverClient();
  const satellite = await client.getSatellite(params.satelliteId);

  if (!satellite) {
    throw new Response(null, { status: 404, statusText: "Not Found" });
  }

  return json({ satellite });
};

export const meta: MetaFunction<typeof loader> = ({ data }) => [
  { title: data?.satellite.name },
];

export default function SatelliteDetailPage() {
  const { satellite } = useLoaderData<typeof loader>();

  return (
    <main className="container mx-auto space-y-6 py-8">
      <H1>{satellite.name}</H1>
    </main>
  );
}
