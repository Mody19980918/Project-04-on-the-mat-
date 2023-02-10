import {
  Badge,
  Button,
  Card,
  Container,
  Group,
  Modal,
  Space,
  Text,
  Textarea,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconCheck, IconForbid, IconMapPin } from "@tabler/icons";
import { useState } from "react";
import { useFetch } from "../hooks/Fetch";
import { genValidator } from "../hooks/getValidator";
import {
  errorNotifications,
  successNotifications,
} from "../hooks/Notification";

import IconButton from "./IconButton";

type CardInformation = {
  id: number;
  name: string;
  address: string;
  description: string;
  phone_number: number;
  email: string;
  path: string;
  refreshFunction?: Function;
};

export default function CardFormat({
  id,
  name,
  address,
  description,
  phone_number,
  email,
  path,
  refreshFunction,
}: CardInformation) {
  const [moreDetailsModal, setMoreDetailsModal] = useState(false);
  const [approvedModal, setApprovedModel] = useState(false);
  const [forbiddenModal, setForbiddenModel] = useState(false);
  const [messages, setMessages] = useState("");
  const fetch = useFetch();

  async function approvedStudioOrFreelanceStatus(id: string) {
    setApprovedModel(false);
    let res = await fetch.put("/superAdmin/approvedStudioOrFreelanceStatus", {
      id: id,
    });

    if (res.messages) {
      return errorNotifications(res.messages);
    }

    !!refreshFunction && refreshFunction();
    return successNotifications("Successful to approve!");
  }
  async function forbiddenStudioOrFreelanceStatus(id: string) {
    setForbiddenModel(false);
    let res = await fetch.deleted(
      "/superAdmin/forbiddenStudioOrFreelanceStatus",
      {
        id: id,
        name: name,
        email: email,
        messages: messages,
      }
    );
    if (res.messages) {
      return errorNotifications(res.messages);
    }
    !!refreshFunction && refreshFunction();
    return successNotifications("Successful to forbidden!");
  }
  return (
    <>
      <Card shadow="sm" p="lg" radius="md" withBorder>
        <Space h="xl" />
        <Group position="center">
          <img
            src={
              "https://i1.wp.com/www.globalglam.com/wp-content/uploads/2018/09/Screen-Shot-2018-08-22-at-8.39.06-AM.png?resize=914%2C739&ssl=1"
            }
            height={150}
          />
        </Group>
        <Space h="xl" />
        <Title>{name}</Title>
        <Space h="md" />

        <Badge color="red">Pending</Badge>

        <Space h="md" />
        <Text>
          <IconMapPin />
          {address}
        </Text>
        <Space h="md" />
        <Group position="center">
          <Button color="green" onClick={() => setApprovedModel(true)}>
            <IconCheck />
          </Button>
          <Button color="red" onClick={() => setForbiddenModel(true)}>
            <IconForbid />
          </Button>
        </Group>
        <Space h="md" />
        <IconButton type="home" onClick={() => setMoreDetailsModal(true)}>
          MORE DETAILS
        </IconButton>
      </Card>

      <Modal
        opened={moreDetailsModal}
        onClose={() => setMoreDetailsModal(false)}
        title=""
      >
        <Container>
          <Group position="center">
            <img
              src={
                "https://i1.wp.com/www.globalglam.com/wp-content/uploads/2018/09/Screen-Shot-2018-08-22-at-8.39.06-AM.png?resize=914%2C739&ssl=1"
              }
              height={300}
            />
          </Group>
          <Space h="xl" />
          <Text>Name: {name}</Text>
          <Space h="xl" />
          <Text>Address: {address}</Text>
          <Space h="xl" />
          <Text>Description: {description}</Text>
          <Space h="xl" />
          <Text>Phone Number: {phone_number}</Text>
          <Space h="xl" />
          <Text>Email: {email}</Text>
          <Space h="xl" />

          <IconButton type="back" onClick={() => setMoreDetailsModal(false)}>
            CLOSE
          </IconButton>
        </Container>
      </Modal>

      <Modal
        opened={approvedModal}
        onClose={() => setApprovedModel(false)}
        title="Approve"
      >
        <Container>
          <Title size="xl">Approve this client?</Title>
          <Space h="xl" />
          <Group position="center">
            <IconButton
              type="tick"
              color="green"
              onClick={() => approvedStudioOrFreelanceStatus(String(id))}
            >
              YES
            </IconButton>
            <IconButton
              type="back"
              color="red"
              onClick={() => setApprovedModel(false)}
            >
              NO
            </IconButton>
          </Group>
        </Container>
      </Modal>
      <Modal
        opened={forbiddenModal}
        onClose={() => setForbiddenModel(false)}
        title="Forbidden"
      >
        <Container>
          <Title fz="xl">
            Please give a messages why you need to forbidden the studio or
            freelance, we will send the messages to users.
          </Title>
          <Space h="xl" />
          <Textarea
            placeholder="please write your messages in here"
            label="Your comment"
            withAsterisk
            onChange={(event) => setMessages(event.target.value)}
          ></Textarea>
          <Space h="xl" />
          <Group position="center">
            <IconButton
              type="back"
              color="green"
              onClick={() => forbiddenStudioOrFreelanceStatus(String(id))}
            >
              YES
            </IconButton>
            <IconButton
              type="back"
              color="red"
              onClick={() => setForbiddenModel(false)}
            >
              NO
            </IconButton>
          </Group>
        </Container>
      </Modal>
    </>
  );
}
