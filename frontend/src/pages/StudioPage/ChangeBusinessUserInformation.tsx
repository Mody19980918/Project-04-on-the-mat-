import {
  Container,
  FileInput,
  Group,
  Space,
  TextInput,
  Image,
} from "@mantine/core";

import { useForm } from "@mantine/form";
import { IconDeviceMobile, IconUpload, IconUser } from "@tabler/icons";
import { useEffect, useState } from "react";
import BackButton from "../../components/BackButton";
import Title from "../../components/Title";

import { useFetch } from "../../hooks/Fetch";
import { genValidator } from "../../hooks/getValidator";

import {
  errorNotifications,
  successNotifications,
} from "../../hooks/Notification";
import { useNavigate, useParams } from "react-router-dom";
import IconButton from "../../components/IconButton";

type changeBusinessUserInformation = {
  name: string;
  address: string;
  phone_number: string;
  description: string;
  path: string;
};

export default function ChangeBusinessUserInformation() {
  let { id } = useParams();
  const fetch = useFetch();
  const navigate = useNavigate();

  const [pic, setPic] = useState("");

  const form = useForm({
    initialValues: {
      src: "",
      name: "",
      address: "",
      phone_number: "",
      description: "",
      path: "",
    },
    validateInputOnChange: true,
    validate: {
      name: genValidator([
        {
          reason: "Studio name can't be null",
          match: (value) => value.length < 1 && typeof value == "string",
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
    get();
    getStudioImage();
  }, []);

  async function get() {
    let res = await fetch.get(`/studio/getBusinessUserInformation/${id}`);

    form.setValues({
      src: res[0].imagesList,
      name: res[0].name,
      address: res[0].address,
      phone_number: res[0].phone_number,
      description: res[0].description,
      path: "",
    });
  }
  async function getStudioImage(): Promise<string> {
    let res = await fetch.get(`/studio/getStudioImage/${id}`);
    console.log(res);

    console.log(res[0].path);

    setPic(res[0].path);
    return res[0];
  }
  async function ChangeBusinessUserInformation(
    value: changeBusinessUserInformation
  ) {
    const formData = new FormData();
    formData.append("name", value.name);
    formData.append("address", value.address);
    formData.append("phone_number", value.phone_number);
    formData.append("description", value.description);
    formData.append("path", value.path[0]);

    let res = await fetch.fileRouter(
      `/studio/changeBusinessUserInformation/${id}`,
      formData,
      "POST"
    );
    console.log("HIHI");

    if (res.message) {
      return errorNotifications(res.message);
    }

    successNotifications("Change Information Successful");
    return navigate("/");
  }

  useEffect(() => {
    console.log(pic);
  }, [pic]);
  return (
    <div>
      <form
        onSubmit={form.onSubmit((value: any) =>
          ChangeBusinessUserInformation(value)
        )}
      >
        <Container>
          <Group>
            <BackButton path="/UserInformation" />
            <Title>Change Studio Information</Title>
          </Group>
          <Group position="center">
            <Image
              radius="md"
              height={180}
              src={
                pic.includes("http")
                  ? pic
                  : `${import.meta.env.VITE_BACKEND_URL}/${pic}`
              }
            />
          </Group>
          <Space h="xl" />
          <TextInput
            placeholder="Studio name"
            icon={<IconUser />}
            radius="md"
            withAsterisk
            {...form.getInputProps("name")}
          />

          <Space h="md" />
          <TextInput
            placeholder="Studio Address"
            withAsterisk
            radius="md"
            icon={<IconDeviceMobile />}
            {...form.getInputProps("address")}
          ></TextInput>
          <Space h="md" />
          <TextInput
            placeholder="Studio Phone Number"
            withAsterisk
            radius="md"
            icon={<IconDeviceMobile />}
            {...form.getInputProps("phone_number")}
          ></TextInput>
          <Space h="md" />
          <TextInput
            placeholder="Studio Description"
            withAsterisk
            radius="md"
            icon={<IconDeviceMobile />}
            {...form.getInputProps("description")}
          ></TextInput>

          <Space h="xl" />
          <FileInput
            label="Upload Studio Photo"
            placeholder="Upload Studio Photo"
            multiple
            accept="image/png,image/jpeg"
            icon={<IconUpload size={14} />}
            {...form.getInputProps("path")}
          />
          <IconButton type="next">SUBMIT</IconButton>
        </Container>
      </form>
    </div>
  );
}
