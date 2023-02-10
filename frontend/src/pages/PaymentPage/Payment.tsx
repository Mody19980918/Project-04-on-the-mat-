import {
  Card,
  Container,
  Group,
  Space,
  Text,
  Image,
  Skeleton,
} from "@mantine/core";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import BackButton from "../../components/BackButton";
import Title from "../../components/Title";
import yoga_Image from "../../assets/yoga_Image.png";

import { useFetch } from "../../hooks/Fetch";
import { AppDispatch, IRootState } from "../../store/store";
import { successNotifications } from "../../hooks/Notification";
import { logoutAction, User } from "../../store/userSlice";
import { useNavigate } from "react-router-dom";
import PaypalCheckoutButton from "../../components/PaypalCheckoutButton";
import { v4 as uuidv4 } from "uuid";
function timer(t: number) {
  return new Promise((rec) => {
    setTimeout(() => rec(true), t);
  });
}

export default function Payment() {
  const user: User | null = useSelector((state: IRootState) => state.user.user);
  const navigate = useNavigate();
  const fetch = useFetch();
  console.log(user && user.id);
  const [credit, setCredit] = useState<number | null>(null);
  const [skeleton, setSkeleton] = useState<boolean>(false);

  const super_admin = useSelector(
    (state: IRootState) => state.user.user?.super_admin
  );
  const admin = useSelector((state: IRootState) => state.user.user?.admin);

  useEffect(() => {
    getUserCredit();
  }, []);

  useEffect(() => {
    if (super_admin) {
      return navigate("/");
    }
  }, []);
  useEffect(() => {
    if (admin) {
      return navigate("/");
    }
  }, []);

  let price = [20, 50, 100, 200, 300];

  async function getUserCredit() {
    let res = await fetch.get("/user/GetUserCredit");
    setCredit(res.credit);
    setSkeleton(!skeleton);
    return;
  }

  return (
    <div>
      <Container>
        <Group>
          <BackButton path="/UserInformation"></BackButton>
          <Title>Add Credit</Title>
        </Group>
        <Space h="xl" />
        {skeleton ? (
          <>
            <Group position="center">
              <Text>{credit} Credits Remaining</Text>
            </Group>
            <Container>
              <Space h="xl" />
              {price.map((value) => {
                return (
                  <Container key={uuidv4()}>
                    <Card shadow="sm" p="lg" radius="md" withBorder>
                      <Group>
                        <Container>
                          <Image
                            radius="sm"
                            src={yoga_Image}
                            alt="Error"
                            height={250}
                          />
                        </Container>
                        <Container>
                          <Group position="center">
                            <Text>
                              {value / 10} Credits {value} HKD
                            </Text>
                            <Space h="xl" />
                            <PaypalCheckoutButton
                              key={value}
                              description={`${value / 10} Credits`}
                              price={`${value}`}
                              id={user ? user.id : -1}
                              getCredit={getUserCredit}
                            ></PaypalCheckoutButton>
                          </Group>
                        </Container>
                      </Group>
                    </Card>
                    <Space h="xl" />
                  </Container>
                );
              })}
              <Space h="xl" />
              <Space h="xl" />
              <Space h="xl" />
              <Space h="xl" />
            </Container>
          </>
        ) : (
          <>
            <Group position="center">
              <Skeleton height={20} mb="xl" width="50%" />
            </Group>
            <Group position="center">
              <Skeleton height={360} mb="md" width="85%" />
            </Group>
            <Group position="center">
              <Skeleton height={360} mb="md" width="85%" />
            </Group>
            <Group position="center">
              <Skeleton height={360} mb="md" width="85%" />
            </Group>
            <Group position="center">
              <Skeleton height={360} mb="md" width="85%" />
            </Group>
            <Group position="center">
              <Skeleton height={360} mb="md" width="85%" />
            </Group>
          </>
        )}
      </Container>
    </div>
  );
}
