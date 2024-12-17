import {
  Breadcrumbs,
  Button,
  Callout,
  FormGroup,
  Intent,
  Section,
  SectionCard,
  TextArea,
} from "@blueprintjs/core";
import { Code, ConnectError } from "@connectrpc/connect";
import { json, LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import {
  Form,
  redirect,
  useActionData,
  useLoaderData,
  useNavigation,
} from "@remix-run/react";
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

  return json({ satellite });
};

export const meta: MetaFunction<typeof loader> = ({ data }) => [
  { title: `${data?.satellite.name} TLE` },
];

export const action = async ({ params, request }: LoaderFunctionArgs) => {
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

  const formData = await request.formData();
  const tle = String(formData.get("tle"));
  const [line1, line2] = tle.split("\n");

  try {
    await client.registerTLE(satelliteId, line1, line2);
    return redirect(`/satellites/${satellite.id}`);
  } catch (err) {
    if (
      err instanceof ConnectError &&
      [Code.InvalidArgument, Code.AlreadyExists].includes(err.code)
    ) {
      return json({ error: err.message });
    } else {
      throw err;
    }
  }
};

export default function SatelliteTLEPage() {
  const { satellite } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

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
          { text: "TLE" },
        ]}
      />

      <Section title="Register TLE">
        {actionData?.error ? (
          <Callout intent={Intent.DANGER} title="Error">
            {actionData.error}
          </Callout>
        ) : null}
        <SectionCard>
          <Form method="post">
            <FormGroup label="TLE" labelFor="tle">
              <TextArea name="tle" id="tle" fill={true}></TextArea>
            </FormGroup>

            <Button
              type="submit"
              text="Register"
              intent={Intent.PRIMARY}
              disabled={isSubmitting}
            />
          </Form>
        </SectionCard>
      </Section>
    </main>
  );
}
