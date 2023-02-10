import { useFetch } from "../../hooks/Fetch";
import BackButton from "../../components/BackButton";
import { useForm } from "@mantine/form";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Rating,
  Space,
  TextInput,
  Title,
  Text,
} from "@mantine/core";
import { IconUser } from "@tabler/icons";

import SubmitButton from "../../components/IconButton";
import { Footer } from "../../components/Homepage/Footer";
import {
  errorNotifications,
  successNotifications,
} from "../../hooks/Notification";
import { useState } from "react";

export default function AddReviews() {
  const navigate = useNavigate();
  const fetch = useFetch();
  const form = useForm({
    initialValues: {
      comment: "",
      rating: 5,
    },
  });

  async function addClassReviews(value: any) {
    console.log(value);

    let result = await fetch.post("/class/addClassReviews", value);

    if (result.messages) {
      return errorNotifications(result.messages);
    }

    successNotifications(result.success);
  }
  return (
    <div>
      <form onSubmit={form.onSubmit((value) => addClassReviews(value))}>
        <Container>
          <BackButton path="/login" />
          <Title>Leave Your Reviews</Title>
          <Space h="md" />
          <Text>How good was your class?</Text>
          <Rating {...form.getInputProps("rating")} />

          <Space h="md" />
          <TextInput
            placeholder="Any comments?"
            radius="md"
            withAsterisk
            {...form.getInputProps("comment")}
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
