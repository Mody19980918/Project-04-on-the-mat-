import jwtDecode from "jwt-decode";
import { useState, useEffect } from "react";

import { Socket } from "socket.io-client";
import { User } from "../store/userSlice";
import { MessageBox } from "react-chat-elements";
import "react-chat-elements/dist/main.css";
import BackButton from "./BackButton";
import {
  Button,
  Container,
  Group,
  Space,
  Text,
  Input,
  Box,
  Skeleton,
} from "@mantine/core";
import { IconBrandTelegram } from "@tabler/icons";
import { useFetch } from "../hooks/Fetch";
import Avatar from "boring-avatars";

export default function SocketChat({
  targetUserId,
  socket,
}: {
  targetUserId: string;
  socket: Socket;
}) {
  const fetch = useFetch();
  const [chatRecord, setChatRecord] = useState<any[]>([]);
  const [message, setMessage] = useState("");
  const [receiveUsername, setReceiveUsername] = useState<string>("");
  const [senderUsername, setSenderUsername] = useState<string>("");
  const [skeleton, setSkeleton] = useState<boolean>(false);
  async function getChatRecord() {
    let chatRecord = await fetch.get(`/socket/getChatRecord/${targetUserId}`);
    let chat = chatRecord;
    let payload: User = jwtDecode(localStorage.getItem("token")!);
    let owner_id = payload.id;
    let username = await fetch.get(`/user/getReceiveUsername/${targetUserId}`);
    let ownerUsername = await fetch.get(`/user/getOwnerName/${owner_id}`);
    console.log(chatRecord);
    console.log(username);

    setSkeleton(!skeleton);
    setReceiveUsername(username[0].first_name);
    setSenderUsername(ownerUsername[0].first_name);
    let result = chat.map((v: any) => {
      return {
        message: v.messages,
        position: v.sender_id == owner_id ? "right" : "left",
        title: v.first_name,
        sendTime: v.created_at,
      };
    });
    console.log(result);
    setChatRecord([...result]);
  }

  const sendMessage = () => {
    let decoded: User = jwtDecode(localStorage.getItem("token")!);
    console.log(receiveUsername);

    socket.emit("send_message", {
      message: message,
      text: message,
      position: "left",
      title: receiveUsername,
      sender_username: senderUsername,
      to: +targetUserId,
      from: +decoded.id,
    });

    setChatRecord([
      ...chatRecord,
      {
        position: "right",
        title: senderUsername,
        message: message,
      },
    ]);
    window.scrollTo(0, document.body.scrollHeight);
    setMessage("");
  };

  function setNewMessage(data: any) {
    console.log(chatRecord);
    console.log("RECIVED", data);

    setChatRecord((v) => [
      ...v,
      { id: data.id, position: "left", title: data.title, message: data.text },
    ]);
  }

  function sendMessageWithEnter(event: any) {
    if (event == 13) {
      return sendMessage();
    }
  }

  useEffect(() => {
    getChatRecord();
  }, []);

  useEffect(() => {
    console.log(chatRecord);
  }, [chatRecord]);

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setNewMessage(data);
      window.scrollTo(0, document.body.scrollHeight);
    });

    return () => {
      socket.off("receive_message");
    };
  }, []);

  return (
    <div>
      {skeleton ? (
        <>
          <div
            style={{
              width: "100%",
              position: "fixed",
              top: 0,
              zIndex: 1,
              backgroundColor: "#7352ab",
            }}
          >
            {" "}
            <Container>
              <Group>
                <BackButton path="/ChatList" />
                <Avatar
                  size={45}
                  name={receiveUsername}
                  variant="beam"
                  colors={[
                    "#92A1C6",
                    "#146A7C",
                    "#F0AB3D",
                    "#C271B4",
                    "#C20D90",
                  ]}
                />
                <Text color="white">{receiveUsername}</Text>
              </Group>
            </Container>
          </div>
          <Space h="xl" />
          <Space h="xl" />
          <Space h="xl" />

          {chatRecord.map((v: any) => (
            <Container key={v.id}>
              <MessageBox
                key={v.id}
                //@ts-ignore
                position={v.position}
                date={v.sendTime}
                type="text"
                title={v.title}
                text={v.message}
              />
              <Space h="ml" />
            </Container>
          ))}
          <Space h="xl" />
          <Space h="xl" />
          <div
            style={{ padding: 10, width: "97%", position: "fixed", bottom: 0 }}
          >
            <Input
              // size={30}
              style={{ marginRight: 0 }}
              placeholder="Message..."
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
              }}
              onKeyUp={(e: any) => sendMessageWithEnter(e.keyCode)}
              rightSection={
                <Button onClick={sendMessage} radius="lg" color="grape">
                  <IconBrandTelegram />
                </Button>
              }
            />
          </div>
        </>
      ) : (
        <>
          <Skeleton height={60} mb="xl" />

          <Container>
            <Group>
              <Skeleton height={80} width="40%" />
            </Group>
            <Space h="sm" />
            <Group position="right">
              <Skeleton height={80} width="40%" />
            </Group>
            <Space h="sm" />
            <Group>
              <Skeleton height={80} width="40%" />
            </Group>
            <Space h="sm" />
            <Group position="right">
              <Skeleton height={80} width="40%" />
            </Group>
            <Space h="sm" />
            <Group>
              <Skeleton height={80} width="40%" />
            </Group>
            <Space h="sm" />
            <Group position="right">
              <Skeleton height={80} width="40%" />
            </Group>
            <Space h="sm" />
            <Group>
              <Skeleton height={80} width="40%" />
            </Group>
            <Space h="xl" />
            <Space h="xl" />
            <Group position="center">
              <Skeleton height={35} width="90%" />
            </Group>
          </Container>
        </>
      )}
    </div>
  );
}
