import {
  ActionIcon,
  Container,
  Group,
  Select,
  Space,
  TextInput,
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { useForm } from "@mantine/form";
import {
  IconArrowBigLeft,
  IconCake,
  IconDeviceMobile,
  IconGenderTransgender,
  IconUser,
} from "@tabler/icons";
import yoga_Image from "../../assets/yoga_Image.png";
import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import BackButton from "../../components/BackButton";
import IconButton from "../../components/IconButton";
import Title from "../../components/Title";
import { genValidator } from "../../hooks/getValidator";
import {
  errorNotifications,
  successNotifications,
} from "../../hooks/Notification";
import { AppDispatch } from "../../store/store";
import { logoutAction } from "../../store/userSlice";
import { useFetch } from "../../hooks/Fetch";

export default function ForFirstGoogleLoginToInsertData() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const fetch = useFetch();
  function logout() {
    dispatch(logoutAction());
    navigate("/");
  }
  const form = useForm({
    initialValues: {
      first_name: "",
      last_name: "",
      gender: "male",
      birth_date: "",
      phone_number: "",
    },
    validateInputOnChange: true,
    validate: {
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
  async function updateUserInformationWithGoogleLogin(value: any) {
    let res = await fetch.put(
      `/user/updateUserInformationWithGoogleLogin`,
      value
    );
    if (res.message) {
      return errorNotifications(res.message);
    }
    successNotifications(res.success);
    return navigate("/");
  }
  return (
    <div>
      <form
        onSubmit={form.onSubmit((value) =>
          updateUserInformationWithGoogleLogin(value)
        )}
      >
        <Container>
          <Group>
            <div>
              <Space h="xl" />
              <ActionIcon onClick={logout}>
                <IconArrowBigLeft />
              </ActionIcon>
              <Space h="xl" />
            </div>
            <div>
              <Title>Update Informtion</Title>
            </div>
          </Group>
          <Group position="center">
            <img src={yoga_Image} height={280} />
          </Group>
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
          <IconButton type="next">SUBMIT</IconButton>
        </Container>
      </form>
    </div>
  );
}
