import {
  Badge,
  Card,
  Container,
  Grid,
  Group,
  Rating,
  SegmentedControl,
  Skeleton,
  Text,
  UnstyledButton,
} from "@mantine/core";
import { Space } from "@mantine/core";
import { useEffect, useState } from "react";
import BackButton from "../../components/BackButton";
import Title from "../../components/Title";
import { useFetch } from "../../hooks/Fetch";
import Avatar from "boring-avatars";
import IconButton from "../../components/IconButton";
import { useNavigate } from "react-router-dom";
import { successNotifications } from "../../hooks/Notification";
import { IconArrowNarrowRight } from "@tabler/icons";

export default function SavedFollow() {
  const [value, setValue] = useState<string>("teacher");
  const [name, setName] = useState<string>("");
  const [teacher, setTeacher] = useState<any[]>([]);
  const [studio, setStudio] = useState<any[]>([]);
  const [skeleton, setSkeleton] = useState<boolean>(false);
  const navigate = useNavigate();
  const fetch = useFetch();

  async function getUserName() {
    let res = await fetch.get("/user/getUsernameInProfile");
    return setName(res[0].first_name);
  }
  async function getStudioInformationInFollowPage() {
    let res = await fetch.get("/studio/getStudioInformationInFollowPage");
    let result = res.map((v: any) => {
      let firstLetter = v.studio_district.substring(0, 1).toUpperCase();
      let letter = v.studio_district
        .substring(1, v.studio_district.length)
        .split(/(?=[A-Z])/)
        .join(" ");
      let district = `${firstLetter}${letter}`;
      return {
        studio_id: v.studio_id,
        studio_name: v.studio_name,
        studio_address: v.studio_address,
        studio_district: district,
      };
    });
    console.log(result);

    setStudio([...result]);
  }

  async function getTeacherInformationInFollowPage() {
    let res = await fetch.get("/teacher/getTeacherInformationInFollowPage");
    let type = await fetch.get("/teacher/getTeacherTypeInFollowPage");
    setSkeleton(!skeleton);
    let result = res.map((v: any) => {
      if (v.rating) {
        v.rating.substring(0, 3);
      }

      return {
        rating: v.rating,
        teacher_name: v.teacher_name,
        studio_name: v.studio_name,
        teacher_id: v.teacher_id,
        type: type.map((k: any) => {
          if (v.teacher_id === k.teacher_id) {
            return k.type;
          }
        }),
      };
    });
    setTeacher([...result]);
  }
  async function unFollowTeacher(id: number) {
    let res = await fetch.deleted(`/teacher/unFollowTeacher`, {
      teacher_id: id,
    });
    successNotifications(res.success);
    getTeacherInformationInFollowPage();
  }
  async function unFollowStudio(id: number) {
    let res = await fetch.deleted(`/studio/unFollowStudio`, {
      studio_id: id,
    });
    successNotifications(res.success);
    getStudioInformationInFollowPage();
  }
  useEffect(() => {
    getUserName();
  }, []);
  useEffect(() => {
    getTeacherInformationInFollowPage();
  }, []);
  useEffect(() => {
    getStudioInformationInFollowPage();
  }, []);
  useEffect(() => {
    console.log(studio);
  }, [studio]);
  return (
    <div>
      <Container>
        <Group>
          <BackButton path="/UserInformation" />
          <Title>Saved Follow</Title>
        </Group>
        <Space h="xl" />
        {skeleton ? (
          <>
            <Group position="center">
              <Avatar
                size={100}
                name={name}
                variant="beam"
                colors={["#92A1C6", "#146A7C", "#F0AB3D", "#C271B4", "#C20D90"]}
              />
            </Group>
            <Space h="xl" />
            <Group position="center">
              <Title>{name}</Title>
            </Group>
            <Space h="xl" />
            <Group position="center">
              <SegmentedControl
                value={value}
                onChange={setValue}
                data={[
                  { label: "Teacher", value: "teacher" },
                  { label: "Studio", value: "studio" },
                ]}
              />
            </Group>
            <Space h="xl" />
            {value == "teacher" ? (
              teacher.map((v) => (
                <div>
                  <Card shadow="sm" p="lg" radius="md" withBorder>
                    <Grid>
                      <Grid.Col span={4}></Grid.Col>
                      <Grid.Col span={4}>
                        <Avatar
                          size={100}
                          name={v.teacher_name}
                          variant="beam"
                          colors={[
                            "#92A1C6",
                            "#146A7C",
                            "#F0AB3D",
                            "#C271B4",
                            "#C20D90",
                          ]}
                        />
                      </Grid.Col>
                      <Grid.Col span={4}>
                        <Group position="right">
                          <div>
                            <Grid>
                              <Grid.Col span={2}></Grid.Col>
                              <Grid.Col span={6}>
                                <UnstyledButton
                                  onClick={() =>
                                    navigate(
                                      `/teacherInformation/${v.teacher_id}`
                                    )
                                  }
                                  style={{
                                    color: "rgb(132, 88, 248)",
                                    top: 0,
                                    right: 0,
                                  }}
                                >
                                  DETAIL
                                </UnstyledButton>
                              </Grid.Col>
                              <Grid.Col span={4}>
                                <IconArrowNarrowRight
                                  style={{
                                    color: "rgb(132, 88, 248)",
                                  }}
                                />
                              </Grid.Col>
                            </Grid>
                          </div>
                        </Group>
                      </Grid.Col>
                    </Grid>
                    <Text>Name: {v.teacher_name}</Text>
                    <Space h="xs" />
                    <Text>Studio Name: {v.studio_name}</Text>
                    <Space h="xs" />
                    {v.rating > 0 ? (
                      <Text>
                        Rating: <Rating value={v.rating} readOnly />
                      </Text>
                    ) : (
                      <></>
                    )}
                    <Space h="xl" />
                    <Group position="center">
                      <IconButton
                        type="heartOff"
                        onClick={() => unFollowTeacher(v.teacher_id)}
                      >
                        UNFOLLOW
                      </IconButton>
                    </Group>
                  </Card>
                  <Space h="xl" />
                </div>
              ))
            ) : (
              <div>
                {studio.map((v) => (
                  <div>
                    <Card shadow="sm" p="lg" radius="md" withBorder>
                      <Grid>
                        <Grid.Col span={4}></Grid.Col>
                        <Grid.Col span={4}>
                          <Avatar
                            size={100}
                            name={v.teacher_name}
                            variant="beam"
                            colors={[
                              "#92A1C6",
                              "#146A7C",
                              "#F0AB3D",
                              "#C271B4",
                              "#C20D90",
                            ]}
                          />
                        </Grid.Col>
                        <Grid.Col span={4}>
                          <Group position="right">
                            <div>
                              <Grid>
                                <Grid.Col span={2}></Grid.Col>
                                <Grid.Col span={6}>
                                  <UnstyledButton
                                    onClick={() =>
                                      navigate(
                                        `/studio/studioDetails/${v.studio_id}`
                                      )
                                    }
                                    style={{
                                      color: "rgb(132, 88, 248)",
                                      top: 0,
                                      right: 0,
                                    }}
                                  >
                                    DETAIL
                                  </UnstyledButton>
                                </Grid.Col>
                                <Grid.Col span={4}>
                                  <IconArrowNarrowRight
                                    style={{
                                      color: "rgb(132, 88, 248)",
                                    }}
                                  />
                                </Grid.Col>
                              </Grid>
                            </div>
                          </Group>
                        </Grid.Col>
                      </Grid>
                      <Space h="xs" />
                      <Text>Name: {v.studio_name}</Text>
                      <Space h="xs" />
                      <Text>Address: {v.studio_address}</Text>
                      <Space h="xs" />
                      <Text>District: {v.studio_district}</Text>
                      <Space h="xs" />
                      <Group position="center">
                        <IconButton
                          type="heartOff"
                          onClick={() => unFollowStudio(v.studio_id)}
                        >
                          UNFOLLOW
                        </IconButton>
                      </Group>
                    </Card>
                    <Space h="xl" />
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            <Group position="center">
              <Skeleton height={105} circle mb="xl" />
            </Group>
            <Space h="sm" />
            <Group position="center">
              <Skeleton height={25} mb="md" width="45%" />
            </Group>
            <Space h="sm" />
            <Group position="center">
              <Skeleton height={30} mb="md" width="30%" />
            </Group>
            <Space h="sm" />
            <Group position="center">
              <Skeleton height={280} mb="md" width="95%" />
            </Group>
            <Space h="sm" />
            <Group position="center">
              <Skeleton height={280} mb="md" width="95%" />
            </Group>
          </>
        )}
      </Container>
    </div>
  );
}
