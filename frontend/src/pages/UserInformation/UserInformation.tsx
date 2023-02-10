import { Container, Group, Skeleton, Space, Text } from "@mantine/core";
import Avatar from "boring-avatars";

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import BackButton from "../../components/BackButton";
import Title from "../../components/Title";
import { Footer } from "../../components/Homepage/Footer";
import { useFetch } from "../../hooks/Fetch";

import { logoutAction, User } from "../../store/userSlice";
import { v4 as uuidv4 } from "uuid";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, IRootState } from "../../store/store";
import {
  ChatMessageNotifications,
  successNotifications,
} from "../../hooks/Notification";

export default function UserInformation() {
  const fetch = useFetch();
  const id = useSelector((state: IRootState) => state.user.user?.id);
  const [skeleton, setSkeleton] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const [credit, setCredit] = useState<string>("");
  const [image, setImage] = useState<string>("");
  const [studioId, setStudioId] = useState<string>("");
  const admin = useSelector((state: IRootState) => state.user.user?.admin);
  const navigate = useNavigate();

  const dispatch = useDispatch<AppDispatch>();

  function logout() {
    dispatch(logoutAction());
    successNotifications("Logout Successful!!");
    navigate("/");
  }

  const arr = [
    { name: "Account", path: "/ChangeUserInformation" },
    { name: "Change Password", path: "/ConfirmPassword" },
  ];

  async function getUserInformationInProfile() {
    let res = await fetch.get(`/user/getUserInformationInProfile/`);
    setSkeleton(!skeleton);
    setUsername(res[0].first_name);
    setCredit(res[0].credit);
    setImage(res[0].profile_pic);
  }
  async function getStudioIdInProfile() {
    let res = await fetch.get(`/studio/getStudioIdInProfile/`);
    return setStudioId(res[0].id);
  }
  useEffect(() => {
    getUserInformationInProfile();
  }, []);

  useEffect(() => {
    if (admin) {
      getStudioIdInProfile();
    }
  }, []);

  return (
    <div>
      <div
        style={{
          width: "100%",
          position: "fixed",
          top: 0,
          zIndex: 1,
          backgroundColor: "white",
        }}
      >
        <Container>
          <Group>
            <BackButton />
            <Title>Profile</Title>
          </Group>
        </Container>
      </div>
      <Space h="xl" />
      <Space h="xl" />
      <Space h="xl" />
      <Space h="xl" />
      {skeleton ? (
        <>
          <Group position="center">
            <Avatar
              size={100}
              name={username}
              variant="beam"
              colors={["#92A1C6", "#146A7C", "#F0AB3D", "#C271B4", "#C20D90"]}
            />
          </Group>
          <Space h="xl" />
          <Group position="center">
            <Title>{username}</Title>
          </Group>
          <Space h="xl" />
          {admin ? (
            <></>
          ) : (
            <Group position="center">
              <div>
                <Text fz="xl" fw="700" sx={{ fontFamily: "Montserrat" }}>
                  {credit} credits
                </Text>
                <Group position="center">
                  <Text
                    fs="italic"
                    c="dimmed"
                    sx={{ fontFamily: "Montserrat" }}
                  >
                    Remaining
                  </Text>
                </Group>
              </div>
            </Group>
          )}

          <Space h="xl" />
          <Container>
            {admin ? (
              <></>
            ) : (
              <>
                <Link
                  to={`/PaymentRecord`}
                  style={{ color: "black", textDecoration: "none" }}
                >
                  <Title> Payment Record</Title>
                </Link>
                <Space h="xl" />
              </>
            )}
            {admin ? (
              <>
                <Link
                  to={`/studio/changeBusinessUserInformation/${id}`}
                  style={{ color: "black", textDecoration: "none" }}
                >
                  <Title>Change Studio Information</Title>
                </Link>
                <Space h="xl" />
              </>
            ) : (
              <></>
            )}
            {admin ? (
              <>
                <Link
                  to={`/studio/studioDetails/${id}`}
                  style={{ color: "black", textDecoration: "none" }}
                >
                  <Title>Studio Detail</Title>
                </Link>
                <Space h="xl" />
              </>
            ) : (
              <>
                <Link
                  to={`/Reservations`}
                  style={{ color: "black", textDecoration: "none" }}
                >
                  <Title>Reservations</Title>
                </Link>
                <Space h="xl" />
                <Link
                  to={`/SavedFollow`}
                  style={{ color: "black", textDecoration: "none" }}
                >
                  <Title>Saved Follow</Title>
                </Link>
                <Space h="xl" />
              </>
            )}
            {admin ? (
              <>
                <Link
                  to={`/classInput`}
                  style={{ color: "black", textDecoration: "none" }}
                >
                  <Title>Add Class</Title>
                </Link>
                <Space h="xl" />
              </>
            ) : (
              <>
                <Link
                  to={`/Payment`}
                  style={{ color: "black", textDecoration: "none" }}
                >
                  <Title>Credit</Title>
                </Link>
                <Space h="xl" />
              </>
            )}
            {arr.map((v) => (
              <div key={uuidv4()}>
                <Link
                  to={v.path}
                  style={{ color: "black", textDecoration: "none" }}
                >
                  <Title>{v.name}</Title>
                </Link>
                <Space h="xl" />
              </div>
            ))}
            <Text fz="xl" fw="700" onClick={logout} style={{ color: "black" }}>
              Logout
            </Text>

            <Space h="xl" />
            <Space h="xl" />
            <Space h="xl" />
            <Space h="xl" />
          </Container>
        </>
      ) : (
        <>
          <Space h="xl" />
          <Group position="center">
            <Skeleton height={105} circle mb="xl" />
          </Group>
          <Group position="center">
            <Skeleton height={25} mb="md" width="45%" />
          </Group>
          <Group position="center">
            <Skeleton height={50} mb="sm" width="35%" />
          </Group>
          <Space h="xl" />
          <Container>
            <Skeleton height={20} />
            <Space h="xl" />
            <Skeleton height={20} />
            <Space h="xl" />
            <Skeleton height={20} />
            <Space h="xl" />
            <Skeleton height={20} />
            <Space h="xl" />
            <Skeleton height={20} />
          </Container>
        </>
      )}

      {/* <Footer /> */}
    </div>
  );
}
