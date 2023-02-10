import { Card, Space, Image, Text, Grid, createStyles } from "@mantine/core";
import { IconArrowBackUp, IconMapPin } from "@tabler/icons";
import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { useFetch } from "../../hooks/Fetch";

export default function typeOfYogaList() {
  let { type } = useParams();
  const navigate = useNavigate();
  const fetch = useFetch();
  const [yogaData, setYogaData] = useState<any[]>([]);
  //
  useEffect(() => {
    get();
  }, []);
  //
  useEffect(() => {
    console.log(setYogaData);
  }, [setYogaData]);
  //
  async function get() {
    let res = await fetch.get(`/homepage/${type}`);
    // console.log(res);

    setYogaData([...res]);
  }
  const useStyles = createStyles((theme) => ({
    title: {
      color: "black",
      fontSize: "30px",
      fontFamily: "Serif",
      fontWeight: 30,
      margin: 5,
    },
    timeAndDate: {
      color: "grey",
      fontSize: "18px",
      fontFamily: "Serif",
    },
    description: {
      color: "black[0]",
      fontSize: "18px",
      fontFamily: "Serif",
    },
    address: {
      color: "black",
      fontSize: "18px",
      fontFamily: "Serif",
    },
  }));
  const { classes } = useStyles();

  return (
    <>
      <Link to="/">
        <IconArrowBackUp />
      </Link>
      <Space h="l" />
      {yogaData.map((value) => (
        <Card m={15} shadow="sm" p="xs" key={value.id} withBorder>
          <Card.Section onClick={() => navigate(`/classDetails/${value.id}`)}>
            <Image
              src={value.imagesList.length >= 1 ? value.imagesList[0].path : ""}
              height={130}
              alt="img"
            />
          </Card.Section>
          <Grid grow key={value.id}>
            <Grid.Col xl={3}></Grid.Col>
            <Text className={classes.title}>{value.name}</Text>
            <Grid.Col xs={9}>
              <Text
                m="xs"
                color="dimmed"
                size="sm"
                className={classes.timeAndDate}
              >
                {new Date(value.date).toLocaleDateString()}
              </Text>
              <Text
                m="xs"
                color="dimmed"
                size="sm"
                className={classes.timeAndDate}
              >
                {new Date(value.start_time).toLocaleTimeString()}
              </Text>
              <Text fw={15} m="xs" size="sm" className={classes.description}>
                {value.description}
              </Text>
              <Text m="xs" color="dimmed" size="sm" className={classes.address}>
                <IconMapPin />
                {value.address}
              </Text>
            </Grid.Col>
          </Grid>
        </Card>
      ))}
    </>
  );
}
