import { Group, Text } from "@mantine/core";
import { Link } from "react-router-dom";

export default function SignInOrSignUp(props: {
  router: string;
  text: string;
  signInOrSignOut: string;
}) {
  const { router, text, signInOrSignOut } = props;
  return (
    <Group position="center">
      <Text fs="italic">{text} have on account?</Text>
      <Link to={router}>
        <Text fs="italic">{signInOrSignOut}</Text>
      </Link>
    </Group>
  );
}
