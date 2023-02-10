import { useFetch } from "../../hooks/Fetch";

import { Link, useNavigate } from "react-router-dom";

import {
  Container,
  Group,
  PasswordInput,
  Select,
  Space,
  Text,
  TextInput,
  Image,
} from "@mantine/core";

import {
  IconCake,
  IconDeviceMobile,
  IconGenderTransgender,
  IconLock,
  IconMail,
  IconUser,
} from "@tabler/icons";
import { DatePicker } from "@mantine/dates";

import BackButton from "../../components/BackButton";
import SignInOrSignUp from "../../components/SignInOrSignUp";
import GoogleLogin from "../../components/GoogleLogin";
import IconButton from "../../components/IconButton";
import { useForm } from "@mantine/form";
import { genValidator } from "../../hooks/getValidator";
import { UserRegister } from "../../global/Model";
import Title from "../../components/Title";
import {
  errorNotifications,
  successNotifications,
} from "../../hooks/Notification";

export default function Register() {
  const navigate = useNavigate();
  const fetch = useFetch();
  const form = useForm({
    initialValues: {
      email: "",
      first_name: "",
      last_name: "",
      password: "",
      gender: "male",
      birth_date: "",
      phone_number: "",
    },
    validateInputOnChange: true,
    validate: {
      email: genValidator([
        {
          reason: "Invalid email",
          match: (value) => !value.match(/^\S+@\S+$/),
        },
      ]),
      first_name: genValidator([
        {
          reason: "first name can't be null",
          match: (value) => value.length < 1 && typeof value == "string",
        },
      ]),
      last_name: genValidator([
        {
          reason: "last name can't be null",
          match: (value) => value.length < 1 && typeof value == "string",
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
      gender: genValidator([
        {
          reason: "Gender is required",
          match: (value: any) => value == "",
        },
      ]),
      birth_date: genValidator([
        {
          reason: "Birth date is required",
          match: (value) => typeof value == null,
        },
      ]),
      phone_number: genValidator([
        {
          reason: "Phone number is required",
          match: (value: any) => value == null,
        },
      ]),
    },
  });

  async function registerUser(value: UserRegister) {
    console.log(value);

    let result = await fetch.post("/user/register", value);
    console.log("HIHI");

    if (result.messages) {
      return errorNotifications(result.messages);
    }

    successNotifications(result.success);

    return navigate("/");
  }
  return (
    <div>
      <form onSubmit={form.onSubmit((value) => registerUser(value))}>
        <Container>
          <BackButton path="/login" />
          <Title>Sign up</Title>
          <Space h="md" />
          <TextInput
            placeholder="First name"
            icon={<IconUser />}
            radius="md"
            withAsterisk
            {...form.getInputProps("first_name")}
          />
          <Space h="md" />
          <TextInput
            placeholder="Last name"
            icon={<IconUser />}
            radius="md"
            withAsterisk
            {...form.getInputProps("last_name")}
          />
          <Space h="md" />
          <TextInput
            placeholder="abc@email.com"
            withAsterisk
            radius="md"
            icon={<IconMail />}
            {...form.getInputProps("email")}
          ></TextInput>
          <Space h="md" />

          <PasswordInput
            withAsterisk
            radius="md"
            placeholder="Your password"
            icon={<IconLock />}
            {...form.getInputProps("password")}
          />
          <Space h="md" />

          <TextInput
            placeholder="Your phone number"
            withAsterisk
            radius="md"
            icon={<IconDeviceMobile />}
            {...form.getInputProps("phone_number")}
          ></TextInput>
          <Space h="md" />

          <Select
            placeholder="Your gender"
            radius="md"
            withAsterisk
            icon={<IconGenderTransgender />}
            data={[
              { value: "male", label: "Male" },
              { value: "female", label: "Female" },
              { value: "other", label: "Other" },
            ]}
            {...form.getInputProps("gender")}
          ></Select>
          <Space h="md" />

          <DatePicker
            icon={<IconCake />}
            radius="md"
            placeholder="Your Birthday"
            withAsterisk
            {...form.getInputProps("birth_date")}
          />
          <Space h="md" />
          <Container>
            <IconButton type={"next"}>SIGN UP</IconButton>
          </Container>
          <Space h="md" />
          <Group position="center">
            <Text>OR</Text>
          </Group>
          <Space h="md" />
          <Group position="center">
            <Link to="/businessregister">
              <Text fs="italic">Sign up as business</Text>
            </Link>
          </Group>
          <Space h="md" />
          <GoogleLogin />
          <SignInOrSignUp
            router={"/login"}
            text={"Already"}
            signInOrSignOut={"Sign in"}
          />
        </Container>
      </form>
    </div>
  );
}
