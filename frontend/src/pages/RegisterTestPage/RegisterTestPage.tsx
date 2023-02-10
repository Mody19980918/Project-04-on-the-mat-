import { Card, Container, Grid, Group, Space, Text } from "@mantine/core";
import React, { useEffect, useState } from "react";
import BackButton from "../../components/BackButton";
import IconButton from "../../components/IconButton";
import Title from "../../components/Title";
import Hatha from "../../assets/HathaYoga.jpg";
import Vinyasa from "../../assets/VinyasaYoga.webp";
import Wheel_Yoga from "../../assets/wheelyoga.jpg";
import Yin from "../../assets/YinYoga.png";
import Ashtanga from "../../assets/Ashtanga-Yoga.png";
import "./RegisterTestPage.css";
import { useFetch } from "../../hooks/Fetch";

export default function RegisterTestPage() {
  const fetch = useFetch();
  const [yogaType, setYogaType] = useState<string[]>([]);

  let typeOfYoga = [
    { name: "Hatha", image: Hatha },
    { name: "Vinyasa", image: Vinyasa },
    { name: "Yin", image: Yin },
    { name: "Wheel Yoga", image: Wheel_Yoga },
    { name: "Ashtanga", image: Ashtanga },
  ];

  async function sendInformationOfYogaType() {
    let res = await fetch.post("/user/SendInformationOfYogaType", yogaType);
  }

  useEffect(() => {
    console.log(yogaType);
  }, [yogaType]);

  //rgb(132, 88, 248)

  return (
    <div>
      <Container>
        <BackButton />
        <Group position="center">
          <Title>Let Us Get to Know You Better</Title>
          <br />
          <Text>Select which types of yoga interest you</Text>
        </Group>
        <Space h="xl" />
        <Grid>
          {typeOfYoga.map((v) => {
            return (
              <>
                <Grid.Col span={6}>
                  <Card
                    style={
                      yogaType.includes(v.name)
                        ? { backgroundColor: "rgb(132, 88, 248)" }
                        : {}
                    }
                    // style={{ backgroundColor: "rgb(132, 88, 248)" }}
                    shadow="sm"
                    p="lg"
                    radius="md"
                    withBorder
                    key={v.name}
                    onClick={() =>
                      setYogaType(
                        yogaType.includes(v.name)
                          ? yogaType.filter((key) => key !== v.name)
                          : [...yogaType, v.name]
                      )
                    }
                  >
                    <Group position="center">
                      <img src={v.image} width={"100px"} />
                    </Group>
                    <Space h="md" />
                    <Group position="center">
                      <Text>{v.name}</Text>
                    </Group>
                  </Card>
                  <Space h="md" />
                </Grid.Col>
              </>
            );
          })}
        </Grid>
        <Space h="sm" />
        <IconButton type="next" onClick={sendInformationOfYogaType}>
          LET'S START
        </IconButton>
        <Space h="xl" />
        <pre>
          <code>{JSON.stringify(yogaType)}</code>
        </pre>
      </Container>
    </div>
  );
}
