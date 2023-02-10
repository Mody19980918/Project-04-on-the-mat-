import { Link, useNavigate } from "react-router-dom";
import { useFetch } from "../../hooks/Fetch";
import yoga_Image from "../../assets/yoga_Image.png";
import {
  Container,
  Group,
  PasswordInput,
  Text,
  TextInput,
  Image,
  Space,
  Modal,
} from "@mantine/core";
import {
  errorNotifications,
  successNotifications,
} from "../../hooks/Notification";
import { IconLock, IconMail } from "@tabler/icons";
import SignInOrSignUp from "../../components/SignInOrSignUp";
import GoogleLogin from "../../components/GoogleLogin";
import { useForm } from "@mantine/form";
import { loginFormat } from "../../global/Model";
import { genValidator } from "../../hooks/getValidator";
import IconButton from "../../components/IconButton";
import Title from "../../components/Title";
import { useDispatch, useSelector } from "react-redux";
import { loginAction } from "../../store/userSlice";
import { AppDispatch, IRootState } from "../../store/store";
import { useState } from "react";
import BackButton from "../../components/BackButton";

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const fetch = useFetch();
  const [validateModal, setValidateModal] = useState(false);

  const [validateMessage, setValidateMessage] = useState("");

  const form = useForm({
    initialValues: { email: "", password: "" },
    // validateInputOnChange: true,
    validate: {
      email: genValidator([
        {
          reason: "Invalid email",
          match: (value) => !value.match(/^\S+@\S+$/),
        },
      ]),
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
  async function confirmLogin(value: loginFormat) {
    let res = await fetch.post("/user/login", value);
    if (res.messages) {
      return errorNotifications(res.messages);
    }
    if (res.validation) {
      setValidateMessage(res.validation);
      return setValidateModal(true);
    }

    if (res.token) {
      localStorage.setItem("token", res.token);
      dispatch(loginAction({ token: res.token }));
      successNotifications("Login SuccessFul");
      return navigate(`/`);
    }
    console.error("invalid response from login api", res);
  }

  return (
    <div
      style={{
        backgroundSize: "cover",
      }}
    >
      {/* <BackgroundImage src={backgroundImage} /> */}
      <form onSubmit={form.onSubmit((value) => confirmLogin(value))}>
        <Container>
          <BackButton />
          <Image radius="sm" src={yoga_Image} alt="Error" height={280} />
          <Title>Sign In</Title>
          <Space h="xl" />

          <TextInput
            type="text"
            placeholder="abc@email.com"
            icon={<IconMail />}
            {...form.getInputProps("email")}
          />
          <Space h="xl" />

          <PasswordInput
            icon={<IconLock />}
            placeholder="Your password"
            {...form.getInputProps("password")}
          />
        </Container>
        <Space h="md" />
        <Group position="right" pr="xl">
          <Link to="/ForgetPassword">
            <Text fs="italic">Forget password?</Text>
          </Link>
        </Group>
        <Space h="" />
        <IconButton type="next">LOGIN</IconButton>
        <Space h="md" />
        <Group position="center">
          <Text>OR</Text>
        </Group>
        <Space h="xl" />
        <GoogleLogin />
        <SignInOrSignUp
          router={"/register"}
          text={"Don't"}
          signInOrSignOut={"Sign up"}
        />
        <Space h="xl" />
        <Modal
          opened={validateModal}
          onClose={() => setValidateModal(false)}
          title="About Your Business Account"
        >
          <Container>
            <Title size="xl">{validateMessage}</Title>
            <Space h="xl" />
            <Group position="center">
              <IconButton
                type="back"
                color="green"
                onClick={() => setValidateModal(false)}
              >
                OK
              </IconButton>
            </Group>
          </Container>
        </Modal>
      </form>
    </div>
  );
}
