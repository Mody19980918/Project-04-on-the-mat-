import { Space, Card, Grid, Image, Text, createStyles } from "@mantine/core";
import { IconArrowBackUp, IconMapPin } from "@tabler/icons";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useFetch } from "../../hooks/Fetch";

export default function FilteredList() {
  const [filterListData, setFilterListData] = useState<any>([]);
  const location = useLocation();
  const navigate = useNavigate();
  const fetch = useFetch();
  //
  async function get() {
    const query = window.location.search;

    let res;
    if (query) {
      res = await fetch.get(`/filterlist${query}`);
    }

    console.log(res);
    if (Array.isArray(res)) {
      setFilterListData(res);
    }
  }
  //
  useEffect(() => {
    get();
  }, []);
  //
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
      {filterListData.map((value: any) => (
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
