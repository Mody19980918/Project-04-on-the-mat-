import {
  Container,
  Flex,
  Group,
  Select,
  Skeleton,
  Space,
  TextInput,
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { useForm } from "@mantine/form";
import {
  IconCake,
  IconDeviceMobile,
  IconGenderTransgender,
  IconUser,
} from "@tabler/icons";
import { useEffect, useState } from "react";
import BackButton from "../../components/BackButton";
import Title from "../../components/Title";

import { useFetch } from "../../hooks/Fetch";
import { genValidator } from "../../hooks/getValidator";
import Avatar from "boring-avatars";
import {
  errorNotifications,
  successNotifications,
} from "../../hooks/Notification";
import { useNavigate } from "react-router-dom";
import IconButton from "../../components/IconButton";

type changeUserInformationInChangeUserInformation = {
  first_name: string;
  last_name: string;
  phone_number: number;
  gender: "male" | "female" | "other";
  birth_date: Date;
};

export default function ChangeUserInformation() {
  const fetch = useFetch();
  const navigate = useNavigate();
  const [skeleton, setSkeleton] = useState<boolean>(false);

  const form = useForm({
    initialValues: {
      first_name: "",
      last_name: "",
      gender: "male",
      birth_date: new Date(),
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
          reason: "Birth_date cannot be null",
          match: (value: any) => value == "",
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

  useEffect(() => {
    getUserInformationInChangeUserInformation();
  }, []);

  async function getUserInformationInChangeUserInformation() {
    let res = await fetch.get(
      "/user/getUserInformationInChangeUserInformation"
    );
    setSkeleton(!skeleton);

    form.setValues({
      first_name: res[0].first_name,
      last_name: res[0].last_name,
      phone_number: res[0].phone_number,
      gender: res[0].gender,
      birth_date: new Date(res[0].birth_date),
    });
  }

  async function changeUserInformationInChangeUserInformation(
    value: changeUserInformationInChangeUserInformation
  ) {
    let res = await fetch.put(
      "/user/changeUserInformationInChangeUserInformation",
      value
    );

    if (res.message) {
      return errorNotifications(res.message);
    }

    console.log("OK");

    successNotifications("Change Information Successful");
    return navigate("/UserInformation");
  }
  return (
    <div>
      <Container>
        <Group>
          <BackButton path="/UserInformation" />
          <Title>Change User Information</Title>
        </Group>
        {skeleton ? (
          <form
            onSubmit={form.onSubmit((value: any) =>
              changeUserInformationInChangeUserInformation(value)
            )}
          >
            <Group position="center">
              <Avatar
                size={100}
                name={form.values.first_name}
                variant="beam"
                colors={["#92A1C6", "#146A7C", "#F0AB3D", "#C271B4", "#C20D90"]}
              />
            </Group>
            <Space h="xl" />
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
            <Space h="xl" />
            <IconButton type="next">SUBMIT</IconButton>
          </form>
        ) : (
          <>
            <Space h="sm" />
            <Group position="center">
              <Skeleton height={105} circle mb="xl" />
            </Group>
            <Skeleton height={30} radius="md" />
            <Space h="xl" />
            <Skeleton height={30} radius="md" />
            <Space h="xl" />
            <Skeleton height={30} radius="md" />
            <Space h="xl" />
            <Skeleton height={30} radius="md" />
            <Space h="xl" />
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
