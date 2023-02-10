import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Socket } from "socket.io-client";
import { ChatMessageNotifications } from "../hooks/Notification";
import { Footer } from "./Homepage/Footer";

type FooterBarOuletProps = {
  socket: Socket;
};

function FooterBarOulet({ socket }: FooterBarOuletProps) {
  return (
    <>
      <Outlet />
      <Footer socket={socket} />
    </>
  );
}

export default FooterBarOulet;
