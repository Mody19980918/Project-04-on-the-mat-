import { uuidv4 } from "@firebase/util";
import {
  Button,
  Card,
  Container,
  Group,
  SegmentedControl,
  Skeleton,
  Space,
  Text
} from "@mantine/core";
import React, { useEffect, useState } from "react";
import BackButton from "../../components/BackButton";
import Title from "../../components/Title";
import UpcomingClassAndPastClassCard from "../../components/UpcomingClassAndPastClassCard";
import { useFetch } from "../../hooks/Fetch";



export default function Reservations() {
  const [value, setValue] = useState<string>("upcoming");
  const [upcomingClass, setUpcomingClass] = useState<any[]>([]);
  const [pastClass, setPastClass] = useState<any[]>([]);
  const [skeleton, setSkeleton] = useState<boolean>(false);
  const fetch = useFetch();

  async function getUpcomingClass() {
    let res = await fetch.get("/user/getUpcomingClass");
    console.log(res);

    let result = res.map((v: any) => {
      let newDate = v.date.substring(0, 10);
      let newStart_name = v.start_time.substring(11, 19);
      let newEnd_name = v.end_time.substring(11, 19);
      return {
        newDate,
        newStart_name,
        newEnd_name,
        teachers_name: v.teachers_name,
        class_name: v.name,
        type: v.type,
        description: v.description,
        path: v.path
      }

    })
    console.log(result);

    setSkeleton(!skeleton);
    setUpcomingClass([...result]);
  }
  async function getPassingClass() {
    let res = await fetch.get("/user/getPassingClass");
    setPastClass(res);
  }
  useEffect(() => {
    getUpcomingClass();
  }, []);
  useEffect(() => {
    getPassingClass();
  }, []);
  return (
    <div>
      <Container>
        <Group>
          <BackButton path="/UserInformation" />
          <Title>Reservations</Title>
        </Group>
        <Space h="xs" />
        {skeleton ? (
          <>
            <Group position="center">
              <SegmentedControl
                value={value}
                onChange={setValue}
                data={[
                  { label: "Upcoming", value: "upcoming" },
                  { label: "Past", value: "past" },
                ]}
              />
            </Group>
            <Space h="sm" />
            <>
              {value == "upcoming"
                ? upcomingClass.map((v) => (
                  <div key={uuidv4()}>
                    <Card shadow="sm" p="lg" radius="md" withBorder>
                      <Group position="center">
                        <img src={`${v.path}`} width={200} />
                      </Group>
                      <Space h="sm" />
                      <Text>Date: {v.newDate}</Text>
                      <Text>Class Name: {v.class_name}</Text>
                      <Text>Teacher: {v.teachers_name}</Text>
                      <Text>Type: {v.type}</Text>
                      <Text>Start time: {v.newStart_name}</Text>
                      <Text>End time: {v.newEnd_name}</Text>
                      <Text>Description: {v.description}</Text>

                    </Card>
                    <Space h="sm" />
                  </div>
                ))
                : pastClass.map((v) => (
                  <>
                    <UpcomingClassAndPastClassCard
                      key={uuidv4()}
                      date={v.date}
                      class_name={v.name}
                      type={v.type}
                      start_time={v.start_time}
                      end_time={v.end_time}
                      description={v.description}
                      teachers_name={v.teachers_name}
                      path={v.path}
                      id={v.classes_id}
                    />
                    <Space h="sm" />
                  </>
                ))}
            </>
          </>
        ) : (
          <>
            <Group position="center">
              <Skeleton height={30} mb="md" width="45%" />
            </Group>
            <Group position="center">
              <Skeleton height={280} mb="md" width="95%" />
            </Group>
            <Group position="center">
              <Skeleton height={280} mb="md" width="95%" />
            </Group>
            <Group position="center">
              <Skeleton height={280} mb="md" width="95%" />
            </Group>
          </>
        )}
      </Container>
    </div>
  );
}
