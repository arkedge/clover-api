import {
  Breadcrumbs,
  Card,
  CardList,
  Section,
  SectionCard,
} from "@blueprintjs/core";
import { ChevronRight } from "@blueprintjs/icons";
import { json, Link, useLoaderData } from "@remix-run/react";
import { CloverClient } from "~/.server/CloverClient";

export const loader = async () => {
  const client = new CloverClient();
  const satellites = await client.listSatellites();
  return json({ satellites });
};

export default function Index() {
  const { satellites } = useLoaderData<typeof loader>();

  return (
    <main className="container mx-auto space-y-6 py-8">
      <Breadcrumbs items={[{ icon: "home", text: "Home" }]} />

      <Section title="Satellites">
        <SectionCard padded={false}>
          <CardList>
            {satellites.map((satellite) => (
              <Card key={satellite.id} interactive={true} className="relative">
                <Link
                  to={`/satellites/${satellite.id}`}
                  className="absolute inset-0"
                />
                <div className="flex w-full justify-between">
                  <span>{satellite.name}</span>
                  <ChevronRight />
                </div>
              </Card>
            ))}
          </CardList>
        </SectionCard>
      </Section>
    </main>
  );
}
