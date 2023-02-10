import { Carousel } from "@mantine/carousel";
import {
  Card,
  Image,
  Text,
  ActionIcon,
  Group,
  Skeleton,
  Container,
  Grid,
} from "@mantine/core";
import { IconCalendarEvent, IconMapPin } from "@tabler/icons";
import { useEffect, useState } from "react";
// import { Map, Marker } from "pigeon-maps";
import { useGeolocated } from "react-geolocated";
import { useFetch } from "../../hooks/Fetch";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";

export default function HomeCardNearby() {
  //-----------------------------------------------------------------
  // ----------------------------Backend-------------------------------
  const fetch = useFetch();
  const [cardData, setCardData] = useState<any[]>([]);
  const [skeleton, setSkeleton] = useState<boolean>(false);
  const navigate = useNavigate();

  // ----------------------------Backend-------------------------------
  // ------------------------------------------------------------------
  // ----------------------------Map-----------------------------------

  const { coords, isGeolocationAvailable, isGeolocationEnabled } =
    useGeolocated({
      positionOptions: {
        enableHighAccuracy: false,
      },
      userDecisionTimeout: 5000,
    });

  useEffect(() => {
    // console.log(coords);
    userXY();
  }, [coords]);

  async function userXY() {
    if (!isGeolocationAvailable || !isGeolocationEnabled) {
      return;
    }

    const latitude = coords?.latitude;
    const longitude = coords?.longitude;

    // console.log(`/homepage/userXY/${latitude}/${longitude}`);
    let result = await fetch.get(`/homepage/userXY/${latitude}/${longitude}`);
    // console.log(`result XY`, result);
    setSkeleton(true);
    setCardData(result.allDistArr);
  }

  // console.log(
  //   "coords:",
  //   coords,
  //   "isGeolocationAvailable:",
  //   isGeolocationAvailable,
  //   "isGeolocationEnabled:",
  //   isGeolocationEnabled
  // );
  //
  //-----------------------------------------------------------------
  // -------------------------------Map------------------------------
  // -----------------------------------------------------------------
  //
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
          {cardData && Array.isArray(cardData)
            ? cardData.map((value) => (
                <Carousel.Slide key={uuidv4()}>
                  <Card shadow="sm" p="xl" radius="md" withBorder>
                    <Card.Section
                      component="a"
                      href={`/classDetails/${value.id}`}
                    >
                      <Image
                        src={
                          value.imagesList.length >= 1
                            ? value.imagesList[0].path
                            : ""
                        }
                        height={160}
                        alt="img"
                      />
                    </Card.Section>
                    <Group position="apart" m={20}>
                      <ActionIcon ml={8} p={0}>
                        <IconCalendarEvent size={26} />
                        {new Date(value.start_time).toLocaleDateString()}
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
              ))
            : null}
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
