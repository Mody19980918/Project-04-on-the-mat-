import { Group, ActionIcon, Indicator, createStyles } from "@mantine/core";
import {
  IconHome,
  IconCirclePlus,
  IconMapPin,
  IconUser,
  IconBrandHipchat,
} from "@tabler/icons";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Socket } from "socket.io-client";
import { useFetch } from "../../hooks/Fetch";
import { IRootState } from "../../store/store";
// import "./Footer.css";

export function Footer({ socket }: { socket: Socket }) {
  const navigate = useNavigate();

  const token = useSelector((state: IRootState) => state.user.user?.token);
  const admin = useSelector((state: IRootState) => state.user.user?.admin);

  const [unread, setUnread] = useState<string>("0");

  const fetch = useFetch();
  async function getCountOfUserUnread() {
    let res = await fetch.get("/socket/getCountOfUserUnread");
    if (res.name != "error") {
      console.log(res[0].countofread_status);

      setUnread(res[0].countofread_status);
    }
  }
  useEffect(() => {
    if (token === null) {
      navigate("/login");
    }
  }, [token]);

  useEffect(() => {
    getCountOfUserUnread();
  }, []);

  useEffect(() => {
    socket &&
      socket.on("receive_message", (data) => {
        getCountOfUserUnread();
      });

    return () => {
      socket && socket.off("receive_message");
    };
  }, []);

  const useStyles = createStyles((theme) => ({
    footer: {
      marginTop: 0,
      padding: 0,
      borderTop: 10,
      position: "fixed",
      bottom: 0,
      width: "100%",
      backgroundColor: "whitesmoke",
      color: "white",
      height: 80,
      textAlign: "center",
      opacity: 0.9,
    },
    footerPlus: {
      transform: "translate(0px, -25px)",
      color: "rgb(67,70,227)",
    },
    footerBTN: {
      textDecoration: "none",
      color: "grey",
      fontSize: "10px",
      marginBottom: "30px",
      fontFamily: "Andalé-Mono",
      fontWeight: "lighter",
    },
  }));
  const { classes } = useStyles();

  return (
    <div className={classes.footer}>
      <Group spacing={35} position="center">
        <Link className={classes.footerBTN} to="/">
          <ActionIcon size="md">
            <IconHome size={30} stroke={1.5} />
          </ActionIcon>
          <div>Home</div>
        </Link>
        <Link className={classes.footerBTN} to="/filtermap">
          <ActionIcon size="md">
            <IconMapPin size={30} stroke={1.5} />
          </ActionIcon>
          <div>Map</div>
          {/*  */}
          {/*  */}
          {/*  */}
        </Link>
        <div className={classes.footerPlus}>
          {admin ? (
            <ActionIcon
              className="footerPlus"
              onClick={() => navigate("/classInput")}
              mb={50}
              size="xl"
              color="indigo.8"
            >
              <IconCirclePlus className="" size={50} stroke={1.5} />
            </ActionIcon>
          ) : token ? (
            <ActionIcon
              className="footerPlus"
              onClick={() => navigate("/Payment")}
              mb={50}
              size="xl"
              color="indigo.8"
            >
              <IconCirclePlus size={50} stroke={1.5} />
            </ActionIcon>
          ) : (
            <ActionIcon
              className="footerPlus"
              onClick={() => navigate("/login")}
              mb={50}
              size="xl"
              color="indigo.8"
            >
              <IconCirclePlus size={50} stroke={1.5} />
            </ActionIcon>
          )}
        </div>
        {/*  */}
        {/*  */}
        {/*  */}
        {token == null ? (
          <Link className={classes.footerBTN} to="/login">
            <ActionIcon size="md">
              <IconBrandHipchat size={30} stroke={1.5} />
            </ActionIcon>
            <div className={classes.footerBTN}>Chat</div>
          </Link>
        ) : (
          <Link className={classes.footerBTN} to="/ChatList">
            <Indicator
              inline
              label={unread}
              showZero={false}
              dot={false}
              size={16}
              color="red"
            >
              <ActionIcon size="md">
                <IconBrandHipchat size={30} stroke={1.5} />
              </ActionIcon>
              <div>Chat</div>
            </Indicator>
          </Link>
        )}
        {token == null ? (
          <Link className={classes.footerBTN} to="/login">
            <ActionIcon size="md">
              <IconUser size={30} stroke={1.5} />
            </ActionIcon>
            <div>Profile</div>
          </Link>
        ) : (
          <Link className={classes.footerBTN} to="/UserInformation">
            <ActionIcon size="md" variant="subtle">
              <IconUser size={30} stroke={1.5} />
            </ActionIcon>
            <div>Profile</div>
          </Link>
        )}
      </Group>
    </div>
  );
}
