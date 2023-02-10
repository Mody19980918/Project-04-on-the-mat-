import { Space, Text, Image, Container, Group, Title } from "@mantine/core";
import { IconMapPin, IconMessage2 } from "@tabler/icons";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useFetch } from "../../hooks/Fetch";
import BackButton from "../../components/BackButton";
import { Footer } from "../../components/Homepage/Footer";
import ViewStudioClassButton from "../../components/IconButton";
import { Link, redirect, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { successNotifications } from "../../hooks/Notification";
import IconButton from "../../components/IconButton";
import { useSelector } from "react-redux";
import { IRootState } from "../../store/store";

export default function StudioDetails() {
  const fetch = useFetch();
  const [studioDetails, setStudioDetails] = useState<any[]>([]);
  const [followStatus, setFollowStatus] = useState<boolean>(false);
  const admin = useSelector((state: IRootState) => state.user.user?.admin);
  const token = useSelector((state: IRootState) => state.user.user?.token);
  const { id } = useParams();
  const [skeleton, setSkeleton] = useState<boolean>(false);
  const navigate = useNavigate();
  useEffect(() => {
    get();
  }, []);

  useEffect(() => {
    console.log(studioDetails);
  }, [studioDetails]);

  useEffect(() => {
    getFollowStudioStatus();
  }, []);

  async function get() {
    let res = await fetch.get(`/studio/studioDetails/${id}`);
    console.log(res);
    setSkeleton(!skeleton);

    setStudioDetails([...res]);
  }
  async function viewStudioClasses() {
    return navigate(`/studio/seeallstudioclass/${id}`);
  }

  async function getFollowStudioStatus() {
    let res = await fetch.get(`/studio/getFollowStudioStatus/${id}`);
    if (res.success) {
      setFollowStatus(!followStatus);
    }
    return;
  }
  function contactTeacher() {
    return navigate(`/ChatMessages/${id}`);
  }

  async function followStudio() {
    let res = await fetch.post(`/studio/followTeacher`, { studio_id: id });
    successNotifications(res.success);
    getFollowStudioStatus();
  }

  async function unFollowStudio() {
    let res = await fetch.deleted(`/studio/unFollowTeacher`, {
      studio_id: id,
    });
    successNotifications(res.success);
    getFollowStudioStatus();
  }

  return (
    <div>
      <Container>
        <Group>
          <BackButton />
          <Title>Studio Details</Title>
        </Group>
      </Container>
      {skeleton ? (
        <>
          {Array.isArray(studioDetails) &&
            studioDetails.map((value) => (
              <div
                style={{ width: 240, marginLeft: "auto", marginRight: "auto" }}
              >
                <Image
                  radius="md"
                  src={
                    value.imagesList.length >= 1 ? value.imagesList[0].path : ""
                  }
                />
                <Space h="md" />
                <Text>Name</Text>
                <Text m="xs" color="dimmed" size="sm">
                  {value.name}
                </Text>
                <Space h="md" />
                <Text>Address</Text>
                <Text m="xs" color="dimmed" size="sm">
                  {value.address}
                </Text>
                <Space h="md" />
                <Text>Details</Text>
                <Text m="xs" color="dimmed" size="sm">
                  {value.description}
                </Text>
                <Space h="md" />
                <Text>Phone Number</Text>
                <Text m="xs" color="dimmed" size="sm">
                  {value.phone_number}
                </Text>
                <Space h="md" />
                <Text>Email</Text>
                <Text m="xs" color="dimmed" size="sm">
                  {value.email}
                </Text>
                <Space h="md" />
                <Text m="xs" color="dimmed" size="sm">
                  {/* {value.positions} */}
                </Text>
                <Space h="md" />
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
                <ViewStudioClassButton
                  onClick={viewStudioClasses}
                  color="violet"
                  type="next"
                >
                  View Schedule
                </ViewStudioClassButton>
                <Space h="xl" />
                {admin ? (
                  <></>
                ) : token ? (
                  <Group position="center">
                    {followStatus ? (
                      <IconButton type={"heartOff"} onClick={unFollowStudio}>
                        UNFOLLOW
                      </IconButton>
                    ) : (
                      <IconButton type={"heart"} onClick={followStudio}>
                        FOLLOW
                      </IconButton>
                    )}
                  </Group>
                ) : (
                  <Group position="center">
                    <Link to="/login">
                      <IconButton type={"plusUser"} onClick={followStudio}>
                        FOLLOW
                      </IconButton>
                    </Link>
                  </Group>
                )}
                {/* <Footer /> */}
              </div>
            ))}
        </>
      ) : (
        <></>
      )}
      <Space h="xl" />
      <Space h="xl" />
      <Space h="xl" />
      <Space h="xl" />
      <Space h="xl" />
    </div>
  );
}
