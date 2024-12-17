import {
  Breadcrumbs,
  Button,
  Card,
  CardList,
  EntityTitle,
  H4,
  Intent,
  NonIdealState,
  NonIdealStateIconSize,
  Section,
  SectionCard,
  Tag,
  UL,
} from "@blueprintjs/core";
import { Add, Document, Updated } from "@blueprintjs/icons";
import { Code, ConnectError } from "@connectrpc/connect";
import { json, LoaderFunctionArgs } from "@remix-run/node";
import {
  Form,
  Link,
  MetaFunction,
  useLoaderData,
  useNavigation,
} from "@remix-run/react";
import assert from "node:assert";
import invariant from "tiny-invariant";
import { CloverClient } from "~/.server/CloverClient";
import { ContactStatusTag } from "~/components/ContactStatusTag";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  invariant(params.contactId, "Missing contactId param");
  let contactId: bigint;
  try {
    contactId = BigInt(params.contactId);
  } catch {
    throw new Response(null, { status: 404, statusText: "Not Found" });
  }

  const client = new CloverClient();
  const contact = await client.getContact(contactId);
  if (!contact) {
    throw new Response(null, { status: 404, statusText: "Not Found" });
  }

  const satellite = await client.getSatellite(BigInt(contact.satelliteId!));
  assert(satellite);
  const groundStation = await client.getGroundStation(
    BigInt(contact.groundStationId!),
  );

  let blobFiles = null;
  if (["STATUS_COMPLETED", "STATUS_FAILED"].includes(contact.status!)) {
    blobFiles = await client.listContactBlobFiles(contactId);
  }

  return json({ contact, satellite, groundStation, blobFiles });
};

export const meta: MetaFunction<typeof loader> = ({ data }) => [
  { title: `Contact ${data?.contact.id}` },
];

export const action = async ({ params }: LoaderFunctionArgs) => {
  invariant(params.contactId, "Missing contactId param");
  let contactId: bigint;
  try {
    contactId = BigInt(params.contactId);
  } catch {
    throw new Response(null, { status: 404, statusText: "Not Found" });
  }

  const client = new CloverClient();
  try {
    await client.cancelContact(contactId);
  } catch (err) {
    if (err instanceof ConnectError) {
      switch (err.code) {
        case Code.NotFound:
          throw new Response(null, { status: 404, statusText: "Not Found" });
        case Code.FailedPrecondition:
          throw new Response(err.message, {
            status: 400,
            statusText: "Failed Precondition",
          });
      }
    } else {
      throw err;
    }
  }

  return null;
};

export default function ContactDetailPage() {
  const { contact, satellite, groundStation, blobFiles } =
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
          { text: `Contact ${contact.id}` },
        ]}
      />

      <Section>
        <SectionCard className="space-y-3">
          <EntityTitle
            icon="calendar"
            heading={H4}
            title={`${contact.startTime}/${contact.endTime}`}
            tags={<ContactStatusTag status={contact.status!} />}
          />
          <ul className="flex gap-2">
            <li>
              <Tag icon="satellite" large={true} minimal={true}>
                {satellite.name}
              </Tag>
            </li>
            <li>
              <Tag icon="antenna" large={true} minimal={true}>
                {groundStation.name}
              </Tag>
            </li>
          </ul>
          <ul className="bp5-text-muted">
            <li>
              <Add title="Create Time" /> {contact.createTime}
            </li>
            <li>
              <Updated title="Update Time" /> {contact.updateTime}
            </li>
          </ul>
          {["STATUS_PENDING", "STATUS_SCHEDULED"].includes(contact.status!) ? (
            <CancelButton />
          ) : null}
        </SectionCard>
      </Section>

      {contact.pass ? (
        <Section title="Pass Info">
          <SectionCard padded={false}>
            <CardList bordered={false}>
              <Card className="!grid grid-cols-6">
                <div className="font-semibold">AOS</div>
                <div className="col-span-5">{contact.pass.aos}</div>
              </Card>
              <Card className="!grid grid-cols-6">
                <div className="font-semibold">LOS</div>
                <div className="col-span-5">{contact.pass.los}</div>
              </Card>
              <Card className="!grid grid-cols-6">
                <div className="font-semibold">Max Elevation</div>
                <div className="col-span-5">
                  {typeof contact.pass.maxElevation === "number"
                    ? contact.pass.maxElevation.toFixed(2)
                    : contact.pass.maxElevation}
                  °
                </div>
              </Card>
            </CardList>
          </SectionCard>
        </Section>
      ) : null}

      {blobFiles ? (
        <Section title="Blob Files">
          {blobFiles.length > 0 ? (
            <SectionCard>
              <UL>
                {blobFiles.map((blobFile, i) => (
                  <li key={i}>
                    <Link to={blobFile.url!}>
                      <Document />
                      {blobFile.filename} (
                      {formatBytes(parseInt(blobFile.size!))})
                    </Link>
                  </li>
                ))}
              </UL>
            </SectionCard>
          ) : (
            <NonIdealState
              layout="horizontal"
              icon="issue"
              iconSize={NonIdealStateIconSize.SMALL}
              title="No blob files."
              className="my-3"
            />
          )}
        </Section>
      ) : null}
    </main>
  );
}

// https://stackoverflow.com/a/18650828
function formatBytes(bytes: number) {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KiB", "MiB", "GiB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
}

function CancelButton() {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <Form method="post">
      <Button
        type="submit"
        text="Cancel"
        intent={Intent.DANGER}
        disabled={isSubmitting}
      />
    </Form>
  );
}
