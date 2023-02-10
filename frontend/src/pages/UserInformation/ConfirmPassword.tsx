import {
  Container,
  Group,
  PasswordInput,
  Skeleton,
  Space,
} from "@mantine/core";
import { useEffect, useState } from "react";
import BackButton from "../../components/BackButton";
import Title from "../../components/Title";
import { useFetch } from "../../hooks/Fetch";
import Avatar from "boring-avatars";
import { IconLock } from "@tabler/icons";
import { useNavigate } from "react-router-dom";
import { useForm } from "@mantine/form";
import IconButton from "../../components/IconButton";
import {
  errorNotifications,
  successNotifications,
} from "../../hooks/Notification";

export default function ConfirmPassword() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [skeleton, setSkeleton] = useState<boolean>(false);
  const fetch = useFetch();
  const navigate = useNavigate();
  async function getUserName() {
    let res = await fetch.get("/user/getUsernameInProfile");
    setSkeleton(!skeleton);
    return setUsername(res[0].first_name);
  }

  async function sendConfirmPassword() {
    console.log("HELLO");

    let res = await fetch.post("/user/sendConfirmPassword", {
      password: password,
    });
    if (res.message) {
      return errorNotifications(res.message);
    }
    successNotifications(res.success);
    return navigate("/ChangePasswordWithProfile");
  }

  useEffect(() => {
    getUserName();
  }, []);

  return (
    <div>
      <Container>
        <Group>
          <BackButton path="/UserInformation" />
          <Title>Confirm Password</Title>
        </Group>
        {skeleton ? (
          <>
            <Space h="xl" />
            <Group position="center">
              <Avatar
                size={100}
                name={username}
                variant="beam"
                colors={["#92A1C6", "#146A7C", "#F0AB3D", "#C271B4", "#C20D90"]}
              />
            </Group>
            <Space h="xl" />
            <Group position="center">
              <Title>{username}</Title>
            </Group>
            <Space h="xl" />
            <PasswordInput
              withAsterisk
              placeholder="Input password in here"
              radius="md"
              icon={<IconLock />}
              onChange={(e) => setPassword(e.target.value)}
            ></PasswordInput>
            <Space h="xl" />
            <IconButton type="next" onClick={() => sendConfirmPassword()}>
              CONFIRM
            </IconButton>
          </>
        ) : (
          <>
            <Space h="sm" />
            <Group position="center">
              <Skeleton height={105} circle mb="xl" />
            </Group>
            <Group position="center">
              <Skeleton height={30} mb="md" width="25%" />
            </Group>
            <Skeleton height={30} radius="md" />
            <Space h="xl" />
            <Group position="center">
              <Skeleton height={45} mt={6} radius="md" width="40%" />
            </Group>
          </>
        )}
      </Container>
    </div>
  );
}
