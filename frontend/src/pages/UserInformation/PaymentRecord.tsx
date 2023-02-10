import {
  Card,
  Container,
  Group,
  SegmentedControl,
  Skeleton,
  Space,
  Text,
} from "@mantine/core";
import React, { useEffect, useState } from "react";
import BackButton from "../../components/BackButton";
import Title from "../../components/Title";
import { useFetch } from "../../hooks/Fetch";
import { v4 as uuidv4 } from "uuid";

export default function PaymentRecord() {
  const [addCreditRecord, setAddCreditRecord] = useState<any[]>([]);
  const [minusCreditRecord, setMinusCreditRecord] = useState<any[]>([]);
  const [value, setValue] = useState<string>("addCredit");
  const [skeleton, setSkeleton] = useState<boolean>(false);
  const fetch = useFetch();
  async function getAddCreditRecord() {
    let res = await fetch.get("/user/getAddCreditRecord");

    let result = res.map((v: any) => {
      let date = v.time.substring(0, 10);
      let time = v.time.substring(11, 16);
      let newTime = `${date} ${time}`;
      return {
        credit: v.credit,
        time: newTime,
      };
    });
    setSkeleton(!skeleton);

    setAddCreditRecord([...result]);
  }
  async function getMinusCredit() {
    let res = await fetch.get("/user/getMinusCredit");

    let result = res.map((v: any) => {
      let date = v.date.substring(0, 10);
      let time = v.time.substring(11, 16);
      let newTime = `${date} ${time}`;
      return {
        credit: v.credit,
        time: newTime,
        name: v.class_name,
      };
    });
    console.log(result);

    setMinusCreditRecord([...result]);
  }

  useEffect(() => {
    getAddCreditRecord();
  }, []);
  useEffect(() => {
    getMinusCredit();
  }, []);
  useEffect(() => {
    console.log("minusCXrt", minusCreditRecord);
  }, [minusCreditRecord]);
  return (
    <div>
      <Container>
        <Group>
          <BackButton path="/UserInformation" />
          <Title>Payment Record</Title>
        </Group>
        <Space h="sm" />
        <Group position="center">
          <SegmentedControl
            value={value}
            onChange={setValue}
            data={[
              { label: "Add Credit", value: "addCredit" },
              { label: "Minus Credit", value: "minusCredit" },
            ]}
          />
        </Group>
        <Space h="xl" />
        <>
          {skeleton ? (
            value == "addCredit" ? (
              addCreditRecord.map((v) => (
                <div key={v._id}>
                  <Card shadow="sm" p="xl" radius="md" withBorder>
                    <Text>Credit: {v.credit}</Text>
                    <Text>HKD$ {v.credit * 10}</Text>
                    <Text>Payment-time: {v.time}</Text>
                  </Card>
                  <Space h="xl" />
                </div>
              ))
            ) : value == "minusCredit" ? (
              minusCreditRecord.map((v) => (
                <div key={v._id}>
                  <Card shadow="sm" p="xl" radius="md" withBorder>
                    <Text>Credit: {v.credit}</Text>
                    <Text>Class Name : {v.name}</Text>
                    <Text>Class Start Time : {v.time}</Text>
                  </Card>
                  <Space h="xl" />
                </div>
              ))
            ) : (
              <></>
            )
          ) : (
            <>
              <Group position="center">
                <Skeleton height={120} mb="md" width="98%" />
              </Group>
              <Group position="center">
                <Skeleton height={120} mb="md" width="98%" />
              </Group>
              <Group position="center">
                <Skeleton height={120} mb="md" width="98%" />
              </Group>
              <Group position="center">
                <Skeleton height={120} mb="md" width="98%" />
              </Group>
              <Group position="center">
                <Skeleton height={120} mb="md" width="98%" />
              </Group>
            </>
          )}
          <></>
        </>
        <Space h="xl" />
        <Space h="xl" />
        <Space h="xl" />
        <Space h="xl" />
      </Container>
    </div>
  );
}
