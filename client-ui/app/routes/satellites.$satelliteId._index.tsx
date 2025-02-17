import {
  Breadcrumbs,
  Button,
  Callout,
  Dialog,
  DialogBody,
  DialogFooter,
  FormGroup,
  HTMLTable,
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
import { json, LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import {
  Form,
  Link,
  redirect,
  useActionData,
  useLoaderData,
  useNavigation,
} from "@remix-run/react";
import { useState } from "react";
import invariant from "tiny-invariant";
import { CloverClient } from "~/.server/CloverClient";
import { ContactTable } from "~/components/ContactTable";
import { PassJson } from "~/gen/aegs/clover/v1/models_pb";

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

  let passes: PassJson[] | null = null;
  if (tleRecord) {
    passes = await client.listPasses(
      satelliteId,
      groundStations.map((gs) => BigInt(gs.id!)),
    );
  }

  return json({ satellite, tleRecord, groundStations, contacts, passes });
};

export const meta: MetaFunction<typeof loader> = ({ data }) => [
  { title: data?.satellite.name },
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
      return json({ error: err.message });
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
          <Button minimal={true} intent={Intent.PRIMARY} text="Update" />
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
  const { satellite, groundStations, contacts } =
    useLoaderData<typeof loader>();

  return (
    <Section
      title="Upcoming Contacts"
      rightElement={
        <Link to={`/satellites/${satellite.id}/contacts`}>
          <Button minimal={true} intent={Intent.PRIMARY} text="Past Contacts" />
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
