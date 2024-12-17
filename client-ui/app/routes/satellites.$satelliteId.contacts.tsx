import { Breadcrumbs, Section } from "@blueprintjs/core";
import { json, LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { CloverClient } from "~/.server/CloverClient";
import { ContactTable } from "~/components/ContactTable";

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
  const groundStations = await client.listAvailableGroundStations(satelliteId);
  const contacts = await client.listPastContacts(satelliteId);

  return json({ satellite, groundStations, contacts });
};

export const meta: MetaFunction<typeof loader> = ({ data }) => [
  { title: `${data?.satellite.name} Past Contacts` },
];

export default function SatelliteTLEPage() {
  const { satellite, groundStations, contacts } =
    useLoaderData<typeof loader>();

  return (
    <main className="container mx-auto space-y-6 py-8">
      <Breadcrumbs
        items={[
          { href: "/", icon: "home", text: "Home" },
          {
            href: `/satellites/${satellite.id}`,
            icon: "satellite",
            text: satellite.name,
          },
          { text: "Past Contacts" },
        ]}
      />

      <Section title="Past Contacts">
        <ContactTable contacts={contacts} groundStations={groundStations} />
      </Section>
    </main>
  );
}
