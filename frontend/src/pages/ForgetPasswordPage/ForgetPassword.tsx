import {
  Container,
  Group,
  Space,
  Stepper,
  Text,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconMail } from "@tabler/icons";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "../../components/BackButton";
import IconButton from "../../components/IconButton";
import Title from "../../components/Title";
import { useFetch } from "../../hooks/Fetch";
import { genValidator } from "../../hooks/getValidator";
import { errorNotifications } from "../../hooks/Notification";

type Email = {
  email: string;
};

export default function ForgetPassword() {
  const fetch = useFetch();
  const [active, setActive] = useState<number>(0);
  const navigate = useNavigate();
  const form = useForm({
    initialValues: { email: "" },
    validate: {
      email: genValidator([
        {
          reason: "Invalid email",
          match: (value) => !value.match(/^\S+@\S+$/),
        },
      ]),
    },
  });

  async function confirmEmail(value: Email) {
    let res = await fetch.post("/user/ConfirmEmail", value);
    if (res.messages) {
      return errorNotifications(res.messages);
    }
    console.log("HIHI");

    return navigate(`/VerificationEmail/${res.id}`);
  }

  return (
    <div>
      <form onSubmit={form.onSubmit((value) => confirmEmail(value))}>
        <Container>
          <BackButton path="/login" />
          <Title>Reset Password</Title>
          <Space h="xl" />
          <Stepper
            active={active}
            onStepClick={setActive}
            color="violet.4"
            iconSize={36}
            allowNextStepsSelect={false}
          >
            <Stepper.Step
              label="Step 1"
              description="Insert Email"
            ></Stepper.Step>
            <Stepper.Step
              label="Step 2"
              description="Insert Verification Code"
            ></Stepper.Step>
          </Stepper>
          <Space h="md" />
          <Text fs="italic">
            Please enter your email address to request a password reset
          </Text>
          <Space h="md" />
          <TextInput
            type="email"
            icon={<IconMail />}
            placeholder="abc@email.com"
            {...form.getInputProps("email")}
          />
          <Space h="md" />
          <Group position="center">
            <IconButton type={"next"}>NEXT</IconButton>
          </Group>
        </Container>
      </form>
    </div>
  );
}
