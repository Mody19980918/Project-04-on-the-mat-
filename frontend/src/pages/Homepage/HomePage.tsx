import {
  Button,
  Grid,
  Space,
  Modal,
  Container,
  Group,
  Title,
  BackgroundImage,
  createStyles,
} from "@mantine/core";
// import { Footer } from "../../components/Homepage/Footer";
import HomeCardNearby from "../../components/Homepage/HomeCardNearby";
import HomeCardUpComing from "../../components/Homepage/HomeCardUpcoming";
import { TypeOfYoga } from "../../components/Homepage/TypeOfYoga";
import { Link, useNavigate } from "react-router-dom";
import HomeFilterButton from "../../components/Homepage/HomeFilter";
import hometop from "../../assets/hometop.jpg";
import "./HomePageCss.css";
import { IconCaretRight } from "@tabler/icons";
import { IRootState } from "../../store/store";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { IconSearch } from "@tabler/icons";
import IconButton from "../../components/IconButton";
import { useFetch } from "../../hooks/Fetch";

//
//
//
export default function HomePage() {
  // ****************************************************************
  // ****************************************************************
  // ****************************************************************
  const super_admin = useSelector(
    (state: IRootState) => state.user.user?.super_admin
  );
  const id = useSelector((state: IRootState) => state.user.user?.id);
  const [modal, setModal] = useState<boolean>(false);
  const fetch = useFetch();

  const navigate = useNavigate();
  function navigateToSearchPage() {
    return navigate("/Search");
  }
  // async function getData(value: string) {
  //   let res = await fetch.get(`/search/${data}`);
  // }

  async function navigateGoogleUserToInsertInformation() {
    let res = await fetch.get(
      `/user/navigateGoogleUserToInsertInformation/${id}`
    );
    // console.log(res);

    if (res.message) {
      setModal(true);
    }
  }
  useEffect(() => {
    navigateGoogleUserToInsertInformation();
  }, []);
  useEffect(() => {
    if (super_admin) {
      return navigate("/superAdmin");
    }
  });

  const useStyles = createStyles((theme) => ({
    headerSeach: {
      color: "grey",
      fontSize: "18px",
      fontFamily: "Andalé-Mono",
      fontWeight: "lighter",
    },

    hometop: {
      width: "100%",
      borderRadius: "50x 0px 0px 0px",
      transform: "translate(0px, -50px)",
    },
    header: {
      // transform: "translate(0px, 50px)",
    },
  }));

  const { classes } = useStyles();
  return (
    <div>
      <div>
        <BackgroundImage
          src={hometop}
          opacity={0.9}
          className={classes.hometop}
          radius="xl"
        >
          {/* starry sky */}
          {/* "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=720&q=80" */}
          <br />
          <br />
          <br />
          <br />
          <br />
          <Grid p={20} gutter="xl">
            <Grid.Col span={8} mt={25}>
              <Button
                leftIcon={<IconSearch size={30} />}
                variant="subtle"
                onClick={() => navigateToSearchPage()}
                style={{ color: "white" }}
                className={classes.header}
              >
                <div className={classes.headerSeach}>Search...</div>
              </Button>
            </Grid.Col>
            <Grid.Col span={2} mr={0} mt={30}>
              <div className={classes.header}>
                <HomeFilterButton />
              </div>
            </Grid.Col>
          </Grid>

          <TypeOfYoga />
        </BackgroundImage>
      </div>

      {/*  */}
      {/*  */}
      {/*  */}

      {/*  */}
      {/*  */}
      {/*  */}

      <Grid m={5}>
        <Grid.Col span={7}>
          <h2>Upcoming Event</h2>
        </Grid.Col>
        <Grid.Col mt={10} span={2} offset={3} color="gray">
          <Link
            style={{
              textDecoration: "none",
              color: "inherit",
            }}
            to="homepage/seeall"
          >
            See All
            <IconCaretRight />
          </Link>
        </Grid.Col>
      </Grid>

      <HomeCardUpComing />

      <Space h="xl" />
      <Space h="xl" />
      <Space h="xl" />

      <Grid m={5}>
        <Grid.Col span={7}>
          <h2>Nearest Event</h2>
        </Grid.Col>
        <Grid.Col mt={10} span={2} offset={3} color="gray">
          <Link
            style={{
              textDecoration: "none",
              color: "inherit",
            }}
            to="homepage/seeall"
          >
            See All
            <IconCaretRight />
          </Link>
        </Grid.Col>
      </Grid>
      {/*  */}
      <HomeCardNearby />
      {/*  */}

      <Space h="xl" />
      <Space h="xl" />
      <Space h="xl" />
      <Space h="xl" />
      <Space h="xl" />
      {/*  */}

      {/*  */}
      <Modal
        opened={modal}
        onClose={() => navigate("/ForFirstGoogleLoginToInsertData")}
        title="About Your Account"
      >
        <Container>
          <Title fz="xl">
            HI New Member ! Seem that you have used the google login to become
            our member. For first login, you need to give some for necessary
            information to us, Thank for your cooperation.
          </Title>
          <Space h="xl" />
          <Group position="center">
            <IconButton
              type="next"
              color="green"
              onClick={() => navigate("/ForFirstGoogleLoginToInsertData")}
            >
              OK
            </IconButton>
          </Group>
        </Container>
      </Modal>
    </div>
  );
}
