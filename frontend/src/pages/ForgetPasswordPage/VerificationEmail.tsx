import {
  Container,
  Title,
  Text,
  Space,
  TextInput,
  Group,
  Stepper,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconLock } from "@tabler/icons";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BackButton from "../../components/BackButton";
import IconButton from "../../components/IconButton";
import { useFetch } from "../../hooks/Fetch";
import { genValidator } from "../../hooks/getValidator";
import {
  errorNotifications,
  successNotifications,
} from "../../hooks/Notification";
import VerificationInput from "react-verification-input";

const COUNT_NUM = 60;

export default function VerificationEmail() {
  //   const [verificationCodeStatus, setVerificationCodeStatus] = useState(true);

  const [count, setCount] = useState<number>(COUNT_NUM);
  const [active, setActive] = useState<number>(1);

  const [verificationCode, setVerificationCode] = useState<string>("");

  const fetch = useFetch();
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    let counterRun = setInterval(() => counterChange(), 1000);

    return () => {
      clearInterval(counterRun);
    };
  }, []);

  useEffect(() => console.log(verificationCode), [verificationCode]);

  async function resendVerificationCode() {
    if (count > 1) {
      return;
    }

    // send code
    await fetch.get(`/user/resendVerificationEmail/${id}`);
    setCount(COUNT_NUM);
  }

  function counterChange() {
    if (count <= 0) {
      return;
    }

    setCount((prev) => prev - 1);
  }

  async function confirmVerificationCode() {
    let res = await fetch.post(`/user/ConfirmVerification/${id}`, {
      verificationCode,
    });

    if (res.messages) {
      return errorNotifications(res.messages);
    }
    successNotifications(res.success);
    return navigate(`/ChangePassword/${res.token}`);
  }

  return (
    <div>
      <Container>
        <BackButton path="/ForgetPassword"></BackButton>
        <Title>Verification</Title>
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
        <Space h="xl" />
        <Text fs="italic" c="dimmed">
          We have send you the verification code to your email
        </Text>
        <Space h="xl" />
        <Group position="center">
          <VerificationInput
            length={4}
            validChars="0-9"
            onChange={(value) => setVerificationCode(value)}
          />
        </Group>
        <Space h="xl" />
        <IconButton type={"next"} onClick={confirmVerificationCode}>
          NEXT
        </IconButton>
        <Space h="xl" />
        {count >= 1 ? (
          <Group position="center">
            <Text fs="italic" c="dimmed">
              Re-send code in {count} second
            </Text>
          </Group>
        ) : (
          <Group position="center">
            <Text
              fs="italic"
              c="dimmed"
              onClick={resendVerificationCode}
              color="blue"
            >
              Click here to re-send verification code
            </Text>
          </Group>
        )}
      </Container>
    </div>
  );
}
