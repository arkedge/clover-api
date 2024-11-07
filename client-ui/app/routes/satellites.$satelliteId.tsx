import {
  Callout,
  H1,
  Intent,
  Pre,
  Section,
  SectionCard,
} from "@blueprintjs/core";
import { json, LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { CloverClient } from "~/.server/CloverClient";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  invariant(params.satelliteId, "Missing satelliteId param");
  let satelliteId: bigint;
  try {
    satelliteId = BigInt(params.satelliteId);
  } catch {
    throw new Response(null, { status: 404, statusText: "Not Found" });
  }

  const client = new CloverClient();

  const satellite = await client.getSatellite(satelliteId);
  if (!satellite) {
    throw new Response(null, { status: 404, statusText: "Not Found" });
  }

  const tleRecord = await client.getLatestTLE(satelliteId);

  return json({ satellite, tleRecord });
};

export const meta: MetaFunction<typeof loader> = ({ data }) => [
  { title: data?.satellite.name },
];

export default function SatelliteDetailPage() {
  const { satellite, tleRecord } = useLoaderData<typeof loader>();

  return (
    <main className="container mx-auto space-y-6 py-8">
      <H1>{satellite.name}</H1>

      <Section title="TLE">
        {tleRecord ? (
          <SectionCard>
            <Pre>
              {tleRecord.tle!.line1}
              <br />
              {tleRecord.tle!.line2}
            </Pre>
            <p className="bp5-text-muted mt-4">
              Registered: {tleRecord.registerTime}
            </p>
          </SectionCard>
        ) : (
          <Callout intent={Intent.WARNING}>No TLEs registered.</Callout>
        )}
      </Section>
    </main>
  );
}
