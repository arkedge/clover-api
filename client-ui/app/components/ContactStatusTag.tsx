import { Intent, Tag, TagProps } from "@blueprintjs/core";
import { Contact_StatusJson } from "~/gen/aegs/clover/v1/models_pb";

interface Props extends TagProps {
  status: Contact_StatusJson;
}

export const ContactStatusTag = ({ status, ...rest }: Props) => {
  const intent = getIntent(status);
  const label = status.replace("STATUS_", "");
  return (
    <Tag intent={intent} {...rest}>
      {label}
    </Tag>
  );
};

function getIntent(status: Contact_StatusJson) {
  switch (status) {
    case "STATUS_SCHEDULED":
      return Intent.SUCCESS;
    case "STATUS_REJECTED":
      return Intent.DANGER;
    case "STATUS_RUNNING":
      return Intent.WARNING;
    case "STATUS_COMPLETED":
      return Intent.PRIMARY;
    case "STATUS_FAILED":
      return Intent.DANGER;
    default:
      return Intent.NONE;
  }
}
