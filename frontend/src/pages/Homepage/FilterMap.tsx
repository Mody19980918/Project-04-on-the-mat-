import { useEffect } from "react";
import { Draggable, Map, Marker, Overlay } from "pigeon-maps";
import { useGeolocated } from "react-geolocated";
import { useState } from "react";
import { useFetch } from "../../hooks/Fetch";
import BackButton from "../../components/BackButton";
import { Footer } from "../../components/Homepage/Footer";
import { TypeOfYoga } from "../../components/Homepage/TypeOfYoga";
import { ActionIcon, Container } from "@mantine/core";
import { IconCurrentLocation } from "@tabler/icons";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";
import yoga_Image from "../../assets/yoga_Image.png";

export default function FilterMap() {
  //   //-----------------------------------------------------------------
  //   // ----------------------------Fetch-------------------------------
  const fetch = useFetch();
  const [filterMapData, setFilterMapData] = useState<any[]>([
    22.3211602, 114.2092619,
  ]);
  const [center, setCenter] = useState<any[]>([
    22.44988045122248, 114.22076712155187,
  ]);
  // fake user center^^^
  // 22.327313573781435, 114.18669774464273 <<<<real default center
  const navigate = useNavigate();
  const { coords, isGeolocationAvailable, isGeolocationEnabled } =
    useGeolocated({
      positionOptions: {
        enableHighAccuracy: false,
      },
      userDecisionTimeout: 5000,
    });

  const color = `hsl(248, 53%, 58%)`;

  //
  useEffect(() => {
    get();
  }, []);
  //
  //
  useEffect(() => {
    getUserPosition();
  }, []);

  async function get() {
    let res = await fetch.get("/filtermap");
    console.log("RES", res);
    setFilterMapData(res);

    // const studioPositions = [res.positions.x, res.positions.y];
    // console.log(studioPositions);
  }

  // ----------------------------Fetch-------------------------------
  //-----------------------------------------------------------------
  // ----------------------------Map---------------------------------
  // to get the user location

  // console.log(
  //   "coords:",
  //   coords,
  //   "isGeolocationAvailable:",
  //   isGeolocationAvailable,
  //   "isGeolocationEnabled:",
  //   isGeolocationEnabled
  // );

  function getUserPosition() {
    if (isGeolocationAvailable && isGeolocationEnabled && coords) {
      let mathRng = Math.random() / 100000;
      const userXY = [coords?.latitude, coords?.longitude + mathRng];

      console.log(userXY);
      setCenter(userXY);
    }
  }

  //
  // -------------------------------Map------------------------------
  //-----------------------------------------------------------------

  return (
    <>
      <BackButton />
      {/* center={center} */}
      <Container>
        <Map
          height={700}
          defaultCenter={[22.3211602, 114.2092619]}
          defaultZoom={13}
          center={center as [number, number]}
        >
          {filterMapData
            .filter((v) => !!v.positions)
            .map((v) => (
              <Marker
                key={uuidv4()}
                width={50}
                anchor={[v.positions.x, v.positions.y]}
                color={color}
                onClick={() => navigate(`/studio/studioDetails/${v.id}`)}
              ></Marker>
            ))}

          <Draggable offset={[40, -150]}>
            <img src={yoga_Image} width={250} height={250} alt="yoga_Image!" />
          </Draggable>
          <Draggable offset={[-120, 320]}>
            <ActionIcon
              variant="light"
              color="indigo"
              opacity={0.8}
              onClick={() => getUserPosition()}
              size={30}
            >
              <IconCurrentLocation size={20} />
            </ActionIcon>
          </Draggable>
        </Map>
      </Container>
      {/* <Footer /> */}
    </>
  );
}

// Hover Card mantine
