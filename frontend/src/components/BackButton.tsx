import { Space } from "@mantine/core";
import { IconArrowBigLeft } from "@tabler/icons";
import { Link } from "react-router-dom";

export default function BackButton(props: {
  path?: string;
  onClick?: Function;
}) {
  return (
    <div>
      <Space h="md" />
      <Link to={props.path || "/"} style={{ margin: "20px" }}>
        <IconArrowBigLeft />
      </Link>
      <Space h="md" />
    </div>
  );
}
