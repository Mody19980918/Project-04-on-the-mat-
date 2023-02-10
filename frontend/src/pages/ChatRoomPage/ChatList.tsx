import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { IRootState } from "../../store/store";
// import io from "socket.io-client";
import jwtDecode from "jwt-decode";
import { User } from "../../store/userSlice";
import { ChatItem, MessageBox } from "react-chat-elements";
import "react-chat-elements/dist/main.css";
import Title from "../../components/Title";
import { Container, Group, Skeleton, Space } from "@mantine/core";
import BackButton from "../../components/BackButton";
import { v4 as uuidv4 } from "uuid";
import { Socket } from "socket.io-client";
import { useFetch } from "../../hooks/Fetch";
import { Footer } from "../../components/Homepage/Footer";

import { ChatMessageNotifications } from "../../hooks/Notification";

// const socket = io("http://localhost:8080");

export default function ChatList({ socket }: { socket: Socket }) {
  const user: User | null = useSelector((state: IRootState) => state.user.user);
  const [name, setName] = useState<string>("");
  const [chatList, setChatList] = useState<any[]>([]);
  const [skeleton, setSkeleton] = useState<boolean>(false);
  const navigate = useNavigate();

  const fetch = useFetch();

  async function getChatList() {
    let res = await fetch.get("/socket/getChatList");
    let count: any[] = await fetch.get("/socket/getChatUnread");
    setSkeleton(!skeleton);
    console.log(count);
    let result = res.map((v: any) => {
      console.log(v);

      let regardingUserInd = count.findIndex((k) => k.sender_id === v.other_id);

      console.log("TARGET", count[regardingUserInd]);

      return {
        id: v.other_id,
        title: v.first_name,
        subtitle: v.messages,
        date: v.last_time,
        new_amountOfRead_status:
          regardingUserInd >= 0
            ? count[regardingUserInd].amountofread_status
            : null,
      };
    });

    console.log("RESULT", result);

    return setChatList([...result]);
  }
  async function getUserName() {
    let res = await fetch.get("/user/getOwnerName");
    console.log(res);
    setName(res[0].first_name);
  }

  useEffect(() => {
    getChatList();
  }, []);

  useEffect(() => {
    getUserName();
  }, []);

  function chatWithStudioOrStudent(id: number) {
    return navigate(`/ChatMessages/${id}`);
  }
  useEffect(() => {
    socket.on("receive_message", (data) => {
      ChatMessageNotifications(data.sender_username, data.text);
      getChatList();
    });

    return () => {
      socket.off("receive_message");
    };
  }, []);

  useEffect(() => {
    console.log(name);
  }, [name]);

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
            <BackButton path="/"></BackButton>
            <Title>Chat Boxes</Title>
          </Group>
        </Container>
      </div>
      <Space h="xl" />
      <Space h="xl" />
      <Space h="xl" />
      {skeleton ? (
        <>
          {chatList.map((v) => (
            <Container key={uuidv4()}>
              <ChatItem
                id={v.id}
                avatar={`https://source.boringavatars.com/beam/120/${v.name}?colors=264653,2a9d8f,e9c46a,f4a261,e76f51
            `}
                alt={"Error"}
                title={v.title}
                subtitle={v.subtitle}
                date={v.date}
                onClick={() => chatWithStudioOrStudent(v.id)}
                unread={v.new_amountOfRead_status}
              />
              <Space h="xl" />
            </Container>
          ))}
          <Space h="xl" />
          <Space h="xl" />
          <Space h="xl" />
          <Space h="xl" />
        </>
      ) : (
        <>
          <Space h="sm" />
          <Group position="center">
            <Skeleton height={60} mb="md" width="90%" />
          </Group>
          <Group position="center">
            <Skeleton height={60} mb="md" width="90%" />
          </Group>
          <Group position="center">
            <Skeleton height={60} mb="md" width="90%" />
          </Group>
          <Group position="center">
            <Skeleton height={60} mb="md" width="90%" />
          </Group>
          <Group position="center">
            <Skeleton height={60} mb="md" width="90%" />
          </Group>
          <Group position="center">
            <Skeleton height={60} mb="md" width="90%" />
          </Group>
          <Group position="center">
            <Skeleton height={60} mb="md" width="90%" />
          </Group>
          <Group position="center">
            <Skeleton height={60} mb="md" width="90%" />
          </Group>
          <Group position="center">
            <Skeleton height={60} mb="md" width="90%" />
          </Group>
          <Group position="center">
            <Skeleton height={60} mb="md" width="90%" />
          </Group>
          <Group position="center">
            <Skeleton height={60} mb="md" width="90%" />
          </Group>

        </>
      )}
      {/* <Footer></Footer> */}
      {/* <img src="http://localhost:8080/path-1674032935691.png" alt="" /> */}
    </div>
  );
}
