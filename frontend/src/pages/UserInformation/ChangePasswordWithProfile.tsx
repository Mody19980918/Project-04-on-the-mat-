import { Container, Group, PasswordInput, Space } from "@mantine/core";
import React, { useEffect, useState } from "react";
import BackButton from "../../components/BackButton";
import Title from "../../components/Title";
import Avatar from "boring-avatars";
import { useFetch } from "../../hooks/Fetch";
import IconButton from "../../components/IconButton";
import { IconLock } from "@tabler/icons";
import { useForm } from "@mantine/form";
import { genValidator } from "../../hooks/getValidator";
import {
  errorNotifications,
  successNotifications,
} from "../../hooks/Notification";
import { useNavigate } from "react-router-dom";

export default function ChangePasswordWithProfile() {
  const [username, setUsername] = useState<string>("");
  const navigate = useNavigate();
  const form = useForm({
    initialValues: {
      password: "",
    },
    validateInputOnChange: true,
    validate: {
      password: genValidator([
        {
          reason: "the password must be at least 8 characters",
          match: (value) => value.length < 8,
        },
        {
          reason: "the password must consist of a lowercase letter",
          match: (value) => !value.match(/[a-z]/),
        },
        {
          reason: "the password must consist of a upper letter",
          match: (value) => !value.match(/[A-Z]/),
        },
        {
          reason: "the password must consist of a symbol",
          match: (value) =>
            !`\`~!@#$%^&*()_+-=[]{};':",./<>?\\|`
              .split("")
              .some((c) => value.includes(c)),
        },
      ]),
    },
  });

  const fetch = useFetch();

  useEffect(() => {
    getUsernameInProfile();
  }, []);

  useEffect(() => {
    console.log(username);
  }, [username]);

  async function getUsernameInProfile() {
    let res = await fetch.get("/user/getUsernameInProfile");
    return setUsername(res[0].first_name);
  }

  async function sendChangedPasswordInProfile(value: string) {
    let res = await fetch.post("/user/sendChangedPasswordInProfile", value);
    if (res.message) {
      return errorNotifications(res.message);
    }
    successNotifications(res.success);
    return navigate("/UserInformation");
  }

  return (
    <div>
      <form
        onSubmit={form.onSubmit((value: any) =>
          sendChangedPasswordInProfile(value)
        )}
      >
        <Container>
          <Group>
            <BackButton path="/UserInformation"></BackButton>
            <Title>Change Password</Title>
          </Group>
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
            placeholder="You can change password in here"
            radius="md"
            icon={<IconLock />}
            {...form.getInputProps("password")}
          />
          <Space h="xl" />
          <IconButton type="next">SUBMIT</IconButton>
        </Container>
      </form>
    </div>
  );
}
