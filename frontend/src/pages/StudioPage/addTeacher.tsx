import { useFetch } from "../../hooks/Fetch";
import BackButton from "../../components/BackButton";
import { useForm } from "@mantine/form";
import { useNavigate } from "react-router-dom";
import { Container, Space, TextInput, Title } from "@mantine/core";
import { IconUser } from "@tabler/icons";

import SubmitButton from "../../components/IconButton";
import { Footer } from "../../components/Homepage/Footer";
import {
  errorNotifications,
  successNotifications,
} from "../../hooks/Notification";

export default function AddTeacher() {
  const navigate = useNavigate();
  const fetch = useFetch();
  const form = useForm({
    initialValues: {
      name: "",
      descriptions: "",
    },
  });

  async function addTeacher(value: any) {
    let result = await fetch.post("/studio/addTeacher", value);

    if (result.messages) {
      return errorNotifications(result.messages);
    }

    successNotifications(result.success);
  }
  return (
    <div>
      <form onSubmit={form.onSubmit((value) => addTeacher(value))}>
        <Container>
          <BackButton path="/login" />
          <Title>Add Teacher</Title>
          <Space h="md" />
          <TextInput
            placeholder="Name"
            icon={<IconUser />}
            radius="md"
            withAsterisk
            {...form.getInputProps("name")}
          />
          <Space h="md" />
          <TextInput
            placeholder="Descriptions"
            radius="md"
            withAsterisk
            {...form.getInputProps("descriptions")}
          />
          <Space h="md" />
          <SubmitButton color="violet" type="next">
            Submit
          </SubmitButton>
        </Container>
      </form>
      {/* <Footer /> */}
    </div>
  );
}
