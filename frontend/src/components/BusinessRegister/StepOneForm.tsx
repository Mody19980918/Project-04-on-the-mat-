import { Space, TextInput, PasswordInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconUser, IconMail, IconLock, IconDeviceMobile } from "@tabler/icons";
import { useEffect } from "react";

import { genValidator } from "../../hooks/getValidator";

import IconButton from "../IconButton";

type BusinessRegister = {
  first_name: string;
  last_name: string;
  business_user_email: string;
  password: string;
  business_user_phone_number: string;
};

type BusinessAccountProps = {
  storeData: Function;
  data: any;
};

function StepOneForm({ storeData, data }: BusinessAccountProps) {
  const form = useForm({
    initialValues: {
      first_name: "",
      last_name: "",
      business_user_email: "",
      password: "",
      business_user_phone_number: "",
    },
    validateInputOnChange: true,
    validate: {
      first_name: genValidator([
        {
          reason: "First Name can't be null",
          match: (value) => value.length == 0,
        },
      ]),
      last_name: genValidator([
        {
          reason: "Last Name can't be null",
          match: (value) => value.length == 0,
        },
      ]),
      business_user_email: genValidator([
        {
          reason: "Invalid email",
          match: (value) => !/^\S+@\S+$/.test(value),
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
      business_user_phone_number: genValidator([
        {
          reason: "phone_numebr is required",
          match: (value) => value == null,
        },
      ]),
    },
  });

  useEffect(() => {
    if (data) {
      form.setValues({
        first_name: data.first_name || "",
        last_name: data.last_name || "",
        business_user_email: data.business_user_email || "",
        password: data.password || "",
        business_user_phone_number: data.phone_number || "",
      });
    }
  }, [data]);

  async function registerBusinessAccount(value: BusinessRegister) {
    storeData(value);
  }

  return (
    <div>
      <form onSubmit={form.onSubmit((value) => registerBusinessAccount(value))}>
        <TextInput
          withAsterisk
          type="text"
          radius="md"
          placeholder="First Name"
          icon={<IconUser />}
          {...form.getInputProps("first_name")}
        />
        <Space h="xl" />
        <TextInput
          withAsterisk
          type="text"
          radius="md"
          placeholder="Last Name"
          icon={<IconUser />}
          {...form.getInputProps("last_name")}
        />
        <Space h="xl" />
        <TextInput
          withAsterisk
          type="text"
          radius="md"
          placeholder="Your Email for Login"
          icon={<IconMail />}
          {...form.getInputProps("business_user_email")}
        />
        <Space h="xl" />
        <PasswordInput
          radius="md"
          withAsterisk
          placeholder="Your Password"
          icon={<IconLock />}
          {...form.getInputProps("password")}
        />
        <Space h="xl" />
        <TextInput
          placeholder="Your Phone Number"
          withAsterisk
          radius="md"
          icon={<IconDeviceMobile />}
          {...form.getInputProps("business_user_phone_number")}
        ></TextInput>
        <Space h="md" />

        <IconButton type={"next"}>NEXT</IconButton>
      </form>
    </div>
  );
}

export default StepOneForm;
