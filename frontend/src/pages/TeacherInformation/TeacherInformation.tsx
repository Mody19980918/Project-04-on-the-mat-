import {
  Badge,
  Card,
  Container,
  Grid,
  Group,
  Rating,
  SegmentedControl,
  Skeleton,
  Space,
  Text,
} from "@mantine/core";
import { useEffect, useState } from "react";
import Avatar from "boring-avatars";
import { Link, useNavigate, useParams } from "react-router-dom";
import BackButton from "../../components/BackButton";
import Title from "../../components/Title";
import { useFetch } from "../../hooks/Fetch";
import IconButton from "../../components/IconButton";
import { successNotifications } from "../../hooks/Notification";
import { useSelector } from "react-redux";
import { IRootState } from "../../store/store";
import { IconMessage2 } from "@tabler/icons";

export default function TeacherInformation() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [value, setValue] = useState<string>("about");
  const [teacherData, setTeacherData] = useState<any[]>([]);
  const [teacherInformation, setTeacherInformation] = useState<any[]>([]);
  const [teacherReview, setTeacherReview] = useState<any[]>([]);
  const [teacherType, setTeacherType] = useState<any[]>([]);
  const [studioName, setStudioName] = useState<any[]>([]);
  const [userId, setUserId] = useState<any[]>([]);
  const [followStatus, setFollowStatus] = useState<boolean>(false);
  const fetch = useFetch();
  const admin = useSelector((state: IRootState) => state.user.user?.admin);
  const token = useSelector((state: IRootState) => state.user.user?.token);
  const [skeleton, setSkeleton] = useState<boolean>(false);

  async function getStudioName() {
    let res = await fetch.get(`/teacher/getStudioName/${id}`);
    console.log(res);
    setStudioName([...res]);
  }

  async function followTeacher() {
    let res = await fetch.post(`/teacher/followTeacher`, { teacher_id: id });
    successNotifications(res.success);
    getFollowTeacherStatus();
  }

  async function unFollowTeacher() {
    let res = await fetch.deleted(`/teacher/unFollowTeacher`, {
      teacher_id: id,
    });
    successNotifications(res.success);
    getFollowTeacherStatus();
  }

  async function getFollowTeacherStatus() {
    let res = await fetch.get(`/teacher/getFollowTeacherStatus/${id}`);
    if (res.success) {
      setFollowStatus(!followStatus);
    }
    return;
  }
  async function getTeacherData() {
    let res = await fetch.get(`/teacher/getTeacherData/${id}`);
    setTeacherData([...res]);
  }
  async function getTeacherInformation() {
    let res = await fetch.get(`/teacher/getTeacherInformation/${id}`);
    setSkeleton(!skeleton);
    let result = res.map((v: any) => {
      let start_time = `${v.date.substring(0, 10)} ${v.time.substring(11, 16)}`;
      return {
        class_id: v.class_id,
        class_name: v.class_name,
        path: v.path,
        studio_name: v.studio_name,
        teacher_name: v.teacher_name,
        type: v.type,
        start_time,
        id: v.class_id,
        description: v.description,
      };
    });
    setTeacherInformation([...result]);
  }
  async function getUserId() {
    let res = await fetch.get(`/teacher/getUserId/${id}`);
    setUserId(res.id);
  }
  async function getTeacherReview() {
    let res = await fetch.get(`/teacher/getTeacherReview/${id}`);
    console.log(res);
    let result = res.map((v: any) => {
      const monthEnglish = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Spt",
        "Oct",
        "Nov",
        "Dec",
      ];

      let sendDate = new Date(v.created_at).getDate();
      let sendMonth = monthEnglish[new Date(v.created_at).getMonth()];
      let sendTime = `${sendDate} ${sendMonth}`;

      return {
        comment: v.comment,
        first_name: v.first_name,
        rating: v.rating,
        time: sendTime,
      };
    });
    setTeacherReview([...result]);
  }

  async function getTeacherType() {
    let res = await fetch.get(`/teacher/getTeacherType/${id}`);
    console.log(res);
    setTeacherType([...res]);
  }
  function contactTeacher() {
    return navigate(`/ChatMessages/${userId}`);
  }

  useEffect(() => {
    getTeacherInformation();
  }, []);
  useEffect(() => {
    getTeacherReview();
  }, []);
  useEffect(() => {
    getUserId();
  }, []);
  useEffect(() => {
    getTeacherData();
  }, []);
  useEffect(() => {
    getTeacherType();
  }, []);
  useEffect(() => {
    getStudioName();
  }, []);
  useEffect(() => {
    getFollowTeacherStatus();
  }, []);
  useEffect(() => {
    console.log(studioName);
  }, [studioName]);
  useEffect(() => {
    console.log(teacherReview);
  }, [teacherReview]);

  return (
    <div>
      <Container>
        <Group>
          <BackButton />
          <Title>
            {teacherData.length > 0 ? teacherData[0].teacher_name : ""}
          </Title>
        </Group>
        <Space h="xl" />
        {skeleton ? (
          <>
            <Group position="center">
              <Avatar
                size={100}
                name={teacherData.length > 0 ? teacherData[0].teacher_name : ""}
                variant="beam"
                colors={["#92A1C6", "#146A7C", "#F0AB3D", "#C271B4", "#C20D90"]}
              />
            </Group>
            <Space h="xl" />
            <Group position="center">
              <Title>
                {teacherData.length > 0 ? teacherData[0].teacher_name : ""}
              </Title>
            </Group>
            <Space h="xl" />
            <Group position="center">
              <Text fz="xl" fw="700">
                Studio: {studioName.length > 0 ? studioName[0].studio_name : ""}
              </Text>
            </Group>
            <Space h="xl" />

            {teacherType.length > 0 ? (
              <>
                <Group position="center">
                  <Title>Teaching Type:</Title>
                </Group>
                <Space h="xl" />
                <Group position="center">
                  {teacherType.map((v) => (
                    <>
                      <Badge
                        color={
                          v.type == "Hatha"
                            ? "pink"
                            : v.type == "Vinyasa"
                            ? "yellow"
                            : v.type == "Yin"
                            ? "green"
                            : v.type == "Wheel-Yoga"
                            ? "cyan"
                            : "violet"
                        }
                      >
                        {v.type}
                      </Badge>
                    </>
                  ))}
                </Group>
                <Space h="xl" />
              </>
            ) : (
              <div></div>
            )}
            <Group position="center">
              <Text
                style={{ color: "blue", textDecoration: "none" }}
                onClick={contactTeacher}
              >
                Contact Us
              </Text>
              <div style={{ color: "blue", textDecoration: "none" }}>
                <IconMessage2 />
              </div>
            </Group>
            <Space h="xl" />

            {admin ? (
              <></>
            ) : token ? (
              <Group position="center">
                {followStatus ? (
                  <IconButton type={"heartOff"} onClick={unFollowTeacher}>
                    UNFOLLOW
                  </IconButton>
                ) : (
                  <IconButton type={"heart"} onClick={followTeacher}>
                    <Text>FOLLOW</Text>
                  </IconButton>
                )}
              </Group>
            ) : (
              <Group position="center">
                <Link to="/login" style={{ textDecoration: "none" }}>
                  <IconButton type={"plusUser"} onClick={followTeacher}>
                    FOLLOW
                  </IconButton>
                </Link>
              </Group>
            )}
            <Space h="xl" />
            <Group position="center">
              <SegmentedControl
                value={value}
                onChange={setValue}
                data={[
                  { label: "ABOUT", value: "about" },
                  { label: "CLASSES", value: "classes" },
                  { label: "REVIEW", value: "review" },
                ]}
              ></SegmentedControl>
            </Group>
            <Space h="md" />
            {value == "about" ? (
              <div>
                <Text>Description: </Text>
                <Text>
                  {teacherData.length >= 1 ? teacherData[0].descriptions : ""}
                </Text>
                <Space h="xl" />
              </div>
            ) : value == "classes" ? (
              <div>
                {teacherInformation.length > 0 ? (
                  teacherInformation.map((v) => (
                    <div>
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
                  ))
                ) : (
                  <Group position="center">
                    <Title>Coming Soon</Title>
                  </Group>
                )}
              </div>
            ) : (
              <div>
                {teacherReview.length > 0 ? (
                  teacherReview.map((v: any) => (
                    <div>
                      <Card>
                        <Grid>
                          <Grid.Col span={3}>
                            <Avatar
                              size={50}
                              name={v.first_name}
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
                          <Grid.Col span={9}>
                            <Text>{v.first_name}</Text>
                            <Rating value={v.rating} readOnly />
                            <Text>{v.comment}</Text>
                            <Group position="right">
                              <Text c="dimmed" fs="italic">
                                {v.time}
                              </Text>
                            </Group>
                          </Grid.Col>
                        </Grid>
                      </Card>
                    </div>
                  ))
                ) : (
                  <Group position="center">
                    <Title>Coming Soon</Title>
                  </Group>
                )}
              </div>
            )}
            <Space h="xl" />
            <Space h="xl" />
            <Space h="xl" />
            <Space h="xl" />
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
              <Skeleton height={25} mb="md" width="60%" />
            </Group>
            <Space h="sm" />
            <Group position="center">
              <Skeleton height={25} mb="md" width="45%" />
            </Group>
            <Space h="sm" />
            <Group position="center">
              <Skeleton height={25} mb="md" width="60%" />
            </Group>
            <Group position="center">
              <Skeleton height={25} mb="md" width="20%" />
            </Group>
            <Group position="center">
              <Skeleton height={25} mb="md" width="55%" />
            </Group>
            <Group position="center">
              <Skeleton height={500} mb="md" width="95%" />
            </Group>
          </>
        )}
      </Container>
    </div>
  );
}
