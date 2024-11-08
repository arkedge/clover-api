import {
  Callout,
  H1,
  HTMLTable,
  Intent,
  Pre,
  Section,
  SectionCard,
} from "@blueprintjs/core";
import { json, LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { CloverClient } from "~/.server/CloverClient";
import { ContactStatusTag } from "~/components/ContactStatusTag";

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

  const groundStations = await client.listAvailableGroundStations(satelliteId);
  const contacts = await client.listUpcomingContacts(satelliteId);

  return json({ satellite, tleRecord, groundStations, contacts });
};

export const meta: MetaFunction<typeof loader> = ({ data }) => [
  { title: data?.satellite.name },
];

export default function SatelliteDetailPage() {
  const { satellite } = useLoaderData<typeof loader>();

  return (
    <main className="container mx-auto space-y-6 py-8">
      <H1>{satellite.name}</H1>

      <TLESection />

      <ContactsSection />
    </main>
  );
}

function TLESection() {
  const { tleRecord } = useLoaderData<typeof loader>();

  return (
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
  );
}

function ContactsSection() {
  const { groundStations, contacts } = useLoaderData<typeof loader>();

  return (
    <Section title="Upcoming Contacts">
      {contacts.length ? (
        <HTMLTable striped={true} className="w-full">
          <thead>
            <tr>
              <th>ID</th>
              <th>Ground Station</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((contact) => (
              <tr key={contact.id}>
                <td>{contact.id}</td>
                <td>
                  {
                    groundStations.find(
                      (gs) => gs.id === contact.groundStationId,
                    )?.name
                  }
                </td>
                <td>{contact.startTime}</td>
                <td>{contact.endTime}</td>
                <td>
                  <ContactStatusTag status={contact.status!} />
                </td>
              </tr>
            ))}
          </tbody>
        </HTMLTable>
      ) : (
        <Callout intent={Intent.WARNING}>No upcoming contacts.</Callout>
      )}
    </Section>
  );
}
