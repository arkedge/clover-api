import {
  Breadcrumbs,
  Button,
  ButtonVariant,
  Callout,
  Dialog,
  DialogBody,
  DialogFooter,
  FormGroup,
  HTMLTable,
  Icon,
  InputGroup,
  Intent,
  NonIdealState,
  NonIdealStateIconSize,
  Pre,
  Section,
  SectionCard,
  Tag,
} from "@blueprintjs/core";
import { Code, ConnectError } from "@connectrpc/connect";
import {
  Form,
  Link,
  LoaderFunctionArgs,
  MetaFunction,
  redirect,
  useActionData,
  useLoaderData,
  useNavigation,
} from "react-router";
import { useState } from "react";
import invariant from "tiny-invariant";
import { CloverClient } from "~/.server/CloverClient";
import { ContactTable } from "~/components/ContactTable";
import { PassJson } from "~/gen/aegs/clover/v1/models_pb";

function toDateInputValue(date: Date) {
  return date.toISOString().slice(0, 10);
}

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  invariant(params.satelliteId, "Missing satelliteId param");
  let satelliteId: bigint;
  try {
    satelliteId = BigInt(params.satelliteId);
  } catch {
    throw new Response(null, { status: 404, statusText: "Not Found" });
  }

  const searchParams = new URL(request.url).searchParams;
  const startAtParam = searchParams.get("start_at");
  const endAtParam = searchParams.get("end_at");
  const startAt = startAtParam ? new Date(startAtParam) : new Date(0);
  const endAt = endAtParam ? new Date(endAtParam) : new Date();

  const client = new CloverClient();

  const satellite = await client.getSatellite(satelliteId);
  if (!satellite) {
    throw new Response(null, { status: 404, statusText: "Not Found" });
  }

  const tleRecord = await client.getLatestTLE(satelliteId);
  const stats = await client.getSatelliteStats(satelliteId, startAt, endAt);
  const groundStations = await client.listAvailableGroundStations(satelliteId);
  const contacts = await client.listUpcomingContacts(satelliteId);

  let passes: PassJson[] | null = null;
  if (tleRecord) {
    passes = await client.listPasses(
      satelliteId,
      groundStations.map((gs) => BigInt(gs.id!)),
    );
  }

  return {
    satellite,
    tleRecord,
    stats,
    statsStartAt: toDateInputValue(startAt),
    statsEndAt: toDateInputValue(endAt),
    groundStations,
    contacts,
    passes,
  };
};

export const meta: MetaFunction<typeof loader> = ({ loaderData }) => [
  { title: loaderData?.satellite.name },
];

export const action = async ({ params, request }: LoaderFunctionArgs) => {
  invariant(params.satelliteId, "Missing satelliteId param");
  let satelliteId: bigint;
  try {
    satelliteId = BigInt(params.satelliteId);
  } catch {
    throw new Response(null, { status: 404, statusText: "Not Found" });
  }

  const formData = await request.formData();

  const groundStationIdStr = String(formData.get("groundStationId"));
  let groundStationId;
  try {
    groundStationId = BigInt(groundStationIdStr);
  } catch {
    throw new Response(null, { status: 400, statusText: "Bad Request" });
  }

  const aos = new Date(String(formData.get("aos")));
  const los = new Date(String(formData.get("los")));

  const client = new CloverClient();
  try {
    const contact = await client.createContact(
      satelliteId,
      groundStationId,
      aos,
      los,
    );
    return redirect(`/contacts/${contact.id}`);
  } catch (err) {
    if (
      err instanceof ConnectError &&
      [
        Code.InvalidArgument,
        Code.AlreadyExists,
        Code.FailedPrecondition,
      ].includes(err.code)
    ) {
      return { error: err.message };
    } else {
      throw err;
    }
  }
};

export default function SatelliteDetailPage() {
  const { satellite } = useLoaderData<typeof loader>();

  return (
    <main className="container mx-auto space-y-6 py-8">
      <Breadcrumbs
        items={[
          { href: "/", icon: "home", text: "Home" },
          { icon: "satellite", text: satellite.name },
        ]}
      />

      <TLESection />
      <StatsSection />
      <ContactsSection />
      <PassesSection />
    </main>
  );
}

function TLESection() {
  const { satellite, tleRecord } = useLoaderData<typeof loader>();

  return (
    <Section
      title="TLE"
      rightElement={
        <Link to={`/satellites/${satellite.id}/tle`}>
          <Button
            variant={ButtonVariant.MINIMAL}
            intent={Intent.PRIMARY}
            text="Update"
          />
        </Link>
      }
    >
      {tleRecord ? (
        <SectionCard>
          <Pre>
            {tleRecord.tle!.line1}
            <br />
            {tleRecord.tle!.line2}
          </Pre>
          <p className="bp6-text-muted mt-4">
            Registered: {tleRecord.registerTime}
          </p>
        </SectionCard>
      ) : (
        <Callout intent={Intent.WARNING}>No TLEs registered.</Callout>
      )}
    </Section>
  );
}

type GroundStationSortColumn = "groundStation" | "contacts" | "duration";

function StatsSection() {
  const { stats, statsStartAt, statsEndAt, groundStations } =
    useLoaderData<typeof loader>();

  const [sortColumn, setSortColumn] =
    useState<GroundStationSortColumn>("groundStation");
  const [sortAscending, setSortAscending] = useState(true);

  const toggleSort = (column: GroundStationSortColumn) => {
    if (column === sortColumn) {
      setSortAscending(!sortAscending);
    } else {
      setSortColumn(column);
      setSortAscending(true);
    }
  };

  const sortedGroundStationStats = [...(stats.groundStationStats ?? [])].sort(
    (a, b) => {
      let comparison = 0;
      if (sortColumn === "groundStation") {
        const aName =
          groundStations.find((gs) => gs.id === a.groundStationId)?.name ?? "";
        const bName =
          groundStations.find((gs) => gs.id === b.groundStationId)?.name ?? "";
        comparison = aName.localeCompare(bName);
      } else if (sortColumn === "contacts") {
        comparison =
          Number(a.stats?.contactCount ?? 0) -
          Number(b.stats?.contactCount ?? 0);
      } else {
        comparison =
          parseDurationSeconds(a.stats?.totalContactDuration) -
          parseDurationSeconds(b.stats?.totalContactDuration);
      }
      return sortAscending ? comparison : -comparison;
    },
  );

  const sortIcon = (column: GroundStationSortColumn) =>
    sortColumn === column ? (
      <Icon icon={sortAscending ? "caret-up" : "caret-down"} />
    ) : null;

  return (
    <Section
      title="Stats"
      rightElement={
        <Form method="get" className="flex items-end gap-3">
          <FormGroup
            label="From"
            labelFor="start_at"
            inline={true}
            className="mb-0"
          >
            <InputGroup
              type="date"
              name="start_at"
              id="start_at"
              defaultValue={statsStartAt}
            />
          </FormGroup>
          <FormGroup
            label="To"
            labelFor="end_at"
            inline={true}
            className="mb-0"
          >
            <InputGroup
              type="date"
              name="end_at"
              id="end_at"
              defaultValue={statsEndAt}
            />
          </FormGroup>
          <Button type="submit" text="Filter" />
        </Form>
      }
    >
      <SectionCard>
        <div className="flex gap-8">
          <div>
            <p className="bp6-text-muted">Contacts</p>
            <p className="text-2xl">{stats.total?.contactCount ?? "0"}</p>
          </div>
          <div>
            <p className="bp6-text-muted">Total Contact Time</p>
            <p className="text-2xl">
              {formatDuration(stats.total?.totalContactDuration)}
            </p>
          </div>
        </div>
      </SectionCard>

      {sortedGroundStationStats.length ? (
        <SectionCard>
          <HTMLTable striped={true} className="w-full table-fixed">
            <thead>
              <tr>
                <th
                  className="w-1/2 cursor-pointer"
                  onClick={() => toggleSort("groundStation")}
                >
                  Ground Station {sortIcon("groundStation")}
                </th>
                <th
                  className="w-1/4 cursor-pointer"
                  onClick={() => toggleSort("contacts")}
                >
                  Contacts {sortIcon("contacts")}
                </th>
                <th
                  className="w-1/4 cursor-pointer"
                  onClick={() => toggleSort("duration")}
                >
                  Total Contact Time {sortIcon("duration")}
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedGroundStationStats.map((gsStats) => (
                <tr key={gsStats.groundStationId}>
                  <td>
                    {
                      groundStations.find(
                        (gs) => gs.id === gsStats.groundStationId,
                      )?.name
                    }
                  </td>
                  <td>{gsStats.stats?.contactCount ?? "0"}</td>
                  <td>{formatDuration(gsStats.stats?.totalContactDuration)}</td>
                </tr>
              ))}
            </tbody>
          </HTMLTable>
        </SectionCard>
      ) : null}
    </Section>
  );
}

function parseDurationSeconds(duration: string | undefined) {
  return Math.floor(Number(duration?.replace("s", "") ?? "0"));
}

function formatDuration(duration: string | undefined) {
  const totalSeconds = parseDurationSeconds(duration);

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const parts = [];
  if (hours) parts.push(`${hours}h`);
  if (minutes) parts.push(`${minutes}m`);
  if (seconds || parts.length === 0) parts.push(`${seconds}s`);

  return parts.join(" ");
}

function ContactsSection() {
  const { satellite, groundStations, contacts } =
    useLoaderData<typeof loader>();

  return (
    <Section
      title="Upcoming Contacts"
      rightElement={
        <Link to={`/satellites/${satellite.id}/contacts`}>
          <Button
            variant={ButtonVariant.MINIMAL}
            intent={Intent.PRIMARY}
            text="Past Contacts"
          />
        </Link>
      }
    >
      {contacts.length ? (
        <ContactTable contacts={contacts} groundStations={groundStations} />
      ) : (
        <NonIdealState
          layout="horizontal"
          icon="issue"
          iconSize={NonIdealStateIconSize.SMALL}
          title="No upcoming contacts."
          className="my-3"
        />
      )}
    </Section>
  );
}

function PassesSection() {
  const { passes } = useLoaderData<typeof loader>();

  const [clickedPass, setClickedPass] = useState<PassJson | null>(null);

  return (
    <Section title="Passes">
      {passes ? (
        <HTMLTable striped={true} interactive={true} className="w-full">
          <thead>
            <tr>
              <th>Ground Station</th>
              <th>AOS</th>
              <th>LOS</th>
              <th>Max Elevation</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {passes.map((pass, i) => (
              <tr
                key={i}
                onClick={
                  pass.isAvailable ? () => setClickedPass(pass) : undefined
                }
                className={
                  pass.isAvailable
                    ? undefined
                    : "*:text-muted! *:cursor-not-allowed!"
                }
              >
                <td>{pass.groundStation!.name}</td>
                <td>{pass.details!.aos}</td>
                <td>{pass.details!.los}</td>
                <td>
                  {typeof pass.details!.maxElevation === "number"
                    ? pass.details!.maxElevation.toFixed(2)
                    : pass.details!.maxElevation}
                </td>
                <td>
                  {!pass.isAvailable ? (
                    <Tag intent={Intent.DANGER} minimal={true}>
                      Unavailable
                    </Tag>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </HTMLTable>
      ) : (
        <Callout intent={Intent.WARNING}>No TLEs registered.</Callout>
      )}

      {clickedPass ? (
        <NewContactFormDialog
          pass={clickedPass}
          onClose={() => setClickedPass(null)}
        />
      ) : null}
    </Section>
  );
}

function NewContactFormDialog({
  pass,
  onClose,
}: {
  pass: PassJson;
  onClose: () => void;
}) {
  const actionData = useActionData<typeof action>();

  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <Dialog isOpen={true} onClose={onClose} title="New Contact">
      <Form method="post">
        <DialogBody>
          {actionData?.error ? (
            <Callout className="mb-3" title="Error" intent={Intent.DANGER}>
              {actionData.error}
            </Callout>
          ) : null}

          <FormGroup label="Ground Station" labelFor="groundStation">
            <input
              type="hidden"
              name="groundStationId"
              value={pass.groundStation!.id}
            />
            <InputGroup
              readOnly={true}
              value={pass.groundStation!.name}
              id="groundStation"
            />
          </FormGroup>

          <FormGroup label="AOS" labelFor="aos">
            <InputGroup
              name="aos"
              id="aos"
              value={pass.details!.aos}
              readOnly={true}
            />
          </FormGroup>

          <FormGroup label="LOS" labelFor="los">
            <InputGroup
              name="los"
              id="los"
              value={pass.details!.los}
              readOnly={true}
            />
          </FormGroup>

          <FormGroup label="Max Elevation" labelFor="maxElevation">
            <InputGroup
              id="maxElevation"
              readOnly={true}
              value={
                typeof pass.details!.maxElevation === "number"
                  ? pass.details!.maxElevation.toFixed(2)
                  : pass.details!.maxElevation
              }
            />
          </FormGroup>
        </DialogBody>
        <DialogFooter
          actions={
            <Button
              type="submit"
              text="Create"
              intent={Intent.PRIMARY}
              disabled={isSubmitting}
            />
          }
        />
      </Form>
    </Dialog>
  );
}
