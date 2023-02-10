import {
  Card,
  Container,
  Group,
  SegmentedControl,
  Space,
  TextInput,
  Text,
  Grid,
  Rating,
} from "@mantine/core";
import { IconSearch } from "@tabler/icons";
import React, { useEffect, useState } from "react";
import BackButton from "../../components/BackButton";
import IconButton from "../../components/IconButton";
import Title from "../../components/Title";
import { useFetch } from "../../hooks/Fetch";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";
import Avatar from "boring-avatars";

export default function Search() {
  const fetch = useFetch();
  const navigate = useNavigate();
  const [value, setValue] = useState<string>("class");
  const [classData, setClassData] = useState<any[]>([]);
  const [teacherData, setTeacherData] = useState<any[]>([]);
  const [studioData, setStudioData] = useState<any[]>([]);

  async function getClassInformation(inputValue: string) {
    // setClassData(value);
    if (!inputValue) {
      return;
    }
    let res = await fetch.get(`/search/getClassInformation/${inputValue}`);
    console.log(res);
    let result = res.map((v: any) => {
      let start_time = `${v.date.substring(0, 10)} ${v.time.substring(11, 16)}`;
      return {
        class_name: v.class_name,
        path: v.path,
        studio_name: v.studio_name,
        teacher_name: v.teacher_name,
        type: v.type,
        start_time,
        id: v.class_id,
      };
    });
    setClassData(result);
  }

  async function getTeacherInformation(inputValue: string) {
    if (!inputValue) {
      return;
    }
    let res = await fetch.get(`/search/getTeacherInformation/${inputValue}`);
    console.log(res);
    let result = res.map((v: any) => {
      if (v.rating != null) {
        v.rating.slice(0, 3);
      }

      return {
        name: v.name,
        descriptions: v.descriptions,
        rating: v.rating,
        user_id: v.id,
      };
    });
    setTeacherData([...result]);
  }
  async function getStudioInformation(inputValue: string) {
    let res = await fetch.get(`/search/getStudioInformation/${inputValue}`);
    let result = res.map((v: any) => {
      let firstLetter = v.district.substring(0, 1).toUpperCase();
      let letter = v.district
        .substring(1, v.district.length)
        .split(/(?=[A-Z])/)
        .join(" ");
      let district = `${firstLetter}${letter}`;
      return {
        id: v.id,
        name: v.name,
        address: v.address,
        description: v.description,
        phone_number: v.phone_number,
        email: v.email,
        district,
      };
    });
    setStudioData([...result]);
  }

  useEffect(() => {
    console.log(studioData);
  }, [studioData]);
  return (
    <div>
      <Container>
        <Group>
          <BackButton path="/" />
          <Title>Search</Title>
        </Group>
        <Space h="sm" />
        <Group position="center">
          <SegmentedControl
            value={value}
            onChange={setValue}
            data={[
              { label: "Class", value: "class" },
              { label: "Teacher", value: "teacher" },
              { label: "Studio", value: "studio" },
            ]}
          />
        </Group>
        <Space h="xl" />
        {value == "class" ? (
          <>
            <Group position="center">
              <TextInput
                placeholder="Search Class Name"
                icon={<IconSearch />}
                radius="xl"
                size="md"
                onChange={(e) => getClassInformation(e.target.value)}
              />
            </Group>
            <Space h="xl" />
            {classData.map((v) => (
              <div key={uuidv4()}>
                <Card shadow="sm" p="lg" radius="md" withBorder>
                  <Group position="center">
                    <img src={v.path} width={300} />
                  </Group>
                  <Space h="sm" />
                  <Text>Class Name: {v.class_name}</Text>
                  <Text>Type: {v.type}</Text>
                  <Text>Teacher Name: {v.teacher_name}</Text>
                  <Text>Studio Name: {v.studio_name}</Text>
                  <Text>Start time: {v.start_time}</Text>
                  <Space h="sm" />
                  <IconButton
                    type="next"
                    onClick={() => navigate(`/classDetails/${v.id}`)}
                  >
                    More
                  </IconButton>
                </Card>
                <Space h="xl" />
              </div>
            ))}
          </>
        ) : value == "teacher" ? (
          <>
            <Group position="center">
              <TextInput
                placeholder="Search Teacher Name"
                icon={<IconSearch />}
                radius="xl"
                size="md"
                onChange={(e) => getTeacherInformation(e.target.value)}
              />
            </Group>
            <Space h="xl" />
            {teacherData.map((v) => (
              <div>
                <Card shadow="sm" p="lg" radius="md" withBorder>
                  <Group position="center">
                    <Avatar
                      size={100}
                      name="J"
                      variant="beam"
                      colors={[
                        "#92A1C6",
                        "#146A7C",
                        "#F0AB3D",
                        "#C271B4",
                        "#C20D90",
                      ]}
                    />
                  </Group>
                  <Space h="sm" />
                  <Text>Name: {v.name}</Text>
                  <Space h="sm" />
                  {v.rating != null ? (
                    <>
                      <Group>
                        <Text>Rating:</Text>
                        <Rating value={v.rating} readOnly />
                      </Group>
                      <Space h="sm" />
                    </>
                  ) : (
                    <></>
                  )}

                  <Text>Description: {v.descriptions}</Text>
                  <Space h="md" />
                  <IconButton
                    type="next"
                    onClick={() => navigate(`/teacherInformation/${v.user_id}`)}
                  >
                    More Detail
                  </IconButton>
                </Card>
                <Space h="xl" />
              </div>
            ))}
          </>
        ) : (
          <div>
            <Group position="center">
              <TextInput
                placeholder="Search Studio Name"
                icon={<IconSearch />}
                radius="xl"
                size="md"
                onChange={(e) => getStudioInformation(e.target.value)}
              />
            </Group>
            <Space h="xl" />
            {studioData.map((v) => {
              return (
                <>
                  <Card shadow="sm" p="lg" radius="md" withBorder>
                    <Text>Name: {v.name}</Text>
                    <Space h="sm" />
                    <Text>Address: {v.address}</Text>
                    <Space h="sm" />
                    <Text>description: {v.description}</Text>
                    <Space h="sm" />
                    <Text>phone number: {v.phone_number}</Text>
                    <Space h="sm" />
                    <Text>email: {v.email}</Text>
                    <Space h="sm" />
                    <Text>district: {v.district}</Text>
                    <Space h="xl" />
                    <IconButton
                      type="next"
                      onClick={() => navigate(`/studio/studioDetails/${v.id}`)}
                    >
                      More Detail
                    </IconButton>
                  </Card>
                  <Space h="xl" />
                </>
              );
            })}
          </div>
        )}
      </Container>
    </div>
  );
}
