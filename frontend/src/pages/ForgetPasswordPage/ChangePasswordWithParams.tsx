import {
  Container,
  Group,
  Modal,
  PasswordInput,
  Space,
  Text,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconLock } from "@tabler/icons";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BackButton from "../../components/BackButton";
import IconButton from "../../components/IconButton";
import Title from "../../components/Title";
import { useFetch } from "../../hooks/Fetch";
import { genValidator } from "../../hooks/getValidator";
import {
  errorNotifications,
  successNotifications,
} from "../../hooks/Notification";

const COUNT_NUM = 3000;

type password = {
  password: string;
};

export default function ChangePasswordWithParams() {
  const [username, setUsername] = useState("");
  const [count, setCount] = useState(COUNT_NUM);
  const [backToHome, setBackToHome] = useState(false);
  const fetch = useFetch();
  const { token } = useParams();
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

  useEffect(() => {
    getInformation();
  }, []);

  useEffect(() => {
    console.log(username);
  }, [username]);

  useEffect(() => {
    let counterRun = setInterval(() => FiveMinute, 1000);
    return () => {
      clearInterval(counterRun);
    };
  }, []);

  function navigateToLoginPage() {
    setBackToHome(false);
    return navigate("/");
  }

  function FiveMinute() {
    if (count <= 0) {
      setBackToHome(true);
    }
    setCount((prev) => prev - 1);
  }

  async function getInformation() {
    let res = await fetch.get(`/user/getUsername/${token}`);
    setUsername(res.username);
  }

  async function changePassword(value: password) {
    let res = await fetch.post("/user/ChangePassword", { value, token });
    if (res.messages) {
      return errorNotifications(res.messages);
    }
    successNotifications(res.success);
    return navigate("/");
  }

  return (
    <div>
      <form onSubmit={form.onSubmit((value) => changePassword(value))}>
        <Container>
          <BackButton path="/"></BackButton>
          <Title>Change Password</Title>
          <Space h="xl" />
          <Text>HI {username} , you can change your password in here!</Text>
          <Space h="xl" />
          <PasswordInput
            withAsterisk
            radius="md"
            placeholder="Your password"
            icon={<IconLock />}
            {...form.getInputProps("password")}
          />
          <Space h="xl" />
          <IconButton type="next">SUBMIT</IconButton>
        </Container>
        <Modal
          opened={backToHome}
          onClose={() => navigateToLoginPage()}
          title="Approve"
        >
          <Container>
            <Title size="xl">Approve this client?</Title>
            <Space h="xl" />
            <Group position="center">
              <IconButton type="back" color="red">
                OK
              </IconButton>
            </Group>
          </Container>
        </Modal>
      </form>
    </div>
  );
}
