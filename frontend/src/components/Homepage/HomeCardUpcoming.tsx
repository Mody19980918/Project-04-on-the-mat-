import { Carousel } from "@mantine/carousel";
import {
  Card,
  Image,
  Text,
  Group,
  ActionIcon,
  Skeleton,
  Container,
  Space,
  Grid,
} from "@mantine/core";
import { IconBookmark, IconCalendarEvent, IconMapPin } from "@tabler/icons";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

import { useFetch } from "../../hooks/Fetch";

export default function HomeCardUpComing() {
  const fetch = useFetch();
  const [cardData, setCardData] = useState<any[]>([]);
  const [skeleton, setSkeleton] = useState<boolean>(false);
  const navigate = useNavigate();

  //
  useEffect(() => {
    get();
  }, []);
  //
  useEffect(() => {}, [setCardData]);
  //
  async function get() {
    let res = await fetch.get("/homepage/upcomingcardinfo");

    setSkeleton(true);

    // console.log(`upcoming:`, res.value.imagesList);

    setCardData([...res]);
  }

  // let dateString = new Date(value.start_time.toDateString());

  return (
    <div>
      {skeleton ? (
        <Carousel
          slideSize="70%"
          height={450}
          slideGap="xl"
          controlSize={undefined}
          dragFree
          withControls={false}
        >
          {cardData.map((value) => (
            <Carousel.Slide key={uuidv4()}>
              <Card shadow="xl" p="xl" radius="md" withBorder>
                <Card.Section
                  onClick={() => navigate(`/classDetails/${value.id}`)}
                >
                  <Image
                    src={
                      value.imagesList.length >= 0
                        ? value.imagesList[0].path
                        : ""
                    }
                    height={160}
                    alt="img"
                  />
                </Card.Section>
                <Group position="apart" m={20}>
                  <ActionIcon ml={8} key={value.id}>
                    <IconCalendarEvent size={50} />
                    {new Date(value.date).toLocaleDateString()}
                  </ActionIcon>
                  <ActionIcon>
                    {/* <IconBookmark size={26} /> */}
                    {/* {value = users_bookmark } */}
                  </ActionIcon>
                </Group>

                <Text weight={500}>{value.name}</Text>
                <Text size="md" mt={20} mb={50} color="dimmed">
                  <IconMapPin />
                  {value.address}
                </Text>
              </Card>
            </Carousel.Slide>
          ))}
        </Carousel>
      ) : (
        <>
          <Container>
            <Grid>
              <Grid.Col span={6}>
                <Skeleton height={420} width="120%" />
              </Grid.Col>
              <Grid.Col span={6}>
                <Skeleton height={420} width="100%" />
              </Grid.Col>
            </Grid>
          </Container>
        </>
      )}
    </div>
  );
}
