import { HTMLTable } from "@blueprintjs/core";
import { Link } from "@remix-run/react";
import { ContactJson, GroundStationJson } from "~/gen/aegs/clover/v1/models_pb";
import { ContactStatusTag } from "./ContactStatusTag";

interface Props {
  contacts: ContactJson[];
  groundStations: GroundStationJson[];
}

export const ContactTable = ({ contacts, groundStations }: Props) => {
  return (
    <HTMLTable striped={true} interactive={true} className="w-full">
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
          <tr key={contact.id} className="relative">
            <td>
              <Link
                to={`/contacts/${contact.id}`}
                className="absolute inset-0"
              />
              {contact.id}
            </td>
            <td>
              {
                groundStations.find((gs) => gs.id === contact.groundStationId)
                  ?.name
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
  );
};
