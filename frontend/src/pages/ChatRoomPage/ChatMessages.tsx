import { Container, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Socket } from "socket.io-client";
import SocketChat from "../../components/WebSocket";

// import { useFetch } from "../../hooks/Fetch";

export default function ChatMessages({ socket }: { socket: Socket }) {
  let { userId } = useParams();
  return (
    <div>
      <SocketChat targetUserId={userId || ""} socket={socket}></SocketChat>
    </div>
  );
}
