import { Button, Card, Group, Space, Text } from "@mantine/core";
import React from "react";
import { useNavigate } from "react-router-dom";
import Title from "./Title";

type Information = {
  date: string;
  class_name: string;
  type: string;
  start_time: string;
  end_time: string;
  description: string;
  teachers_name: string;
  path: string;
  id: string
};

export default function UpcomingClassAndPastClassCard({
  date,
  class_name,
  type,
  start_time,
  end_time,
  description,
  teachers_name,
  path,
  id
}: Information) {
  let newDate = date.substring(0, 10);
  let newStart_name = start_time.substring(11, 19);
  let newEnd_name = end_time.substring(11, 19);
  const navigate = useNavigate();

  function addReviews() {
    return navigate(`/studio/addReviews/${id}`);
  }

  return (
    <div>
      <Card shadow="sm" p="lg" radius="md" withBorder>
        <Group position="center">
          <img src={`${path}`} width={200} />
        </Group>
        <Space h="sm" />
        <Text>Date: {newDate}</Text>
        <Text>Class Name: {class_name}</Text>
        <Text>Teacher: {teachers_name}</Text>
        <Text>Type: {type}</Text>
        <Text>Start time: {newStart_name}</Text>
        <Text>End time: {newEnd_name}</Text>
        <Text>Description: {description}</Text>
        <Button color="violet.4" onClick={addReviews}>
          Add Reviews
        </Button>
      </Card>
    </div>
  );
}
