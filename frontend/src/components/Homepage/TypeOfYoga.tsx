import { Carousel } from "@mantine/carousel";
import { Button, createStyles } from "@mantine/core";
import {
  IconApiApp,
  IconDisabled2,
  IconGeometry,
  IconYinYang,
  IconYoga,
} from "@tabler/icons";
import { Link } from "react-router-dom";
import "./TypeOfYoga.css";

export function TypeOfYoga() {
  const useStyles = createStyles((theme) => ({
    button: {
      transform: "translate(25px, 50px)",
      color: "rgb(67,70,227)",
    },
  }));
  const { classes } = useStyles();
  return (
    <div>
      <Carousel
        mt={50}
        slideSize="95%"
        height={70}
        slideGap={"xl"}
        controlsOffset="xl"
        controlSize={undefined}
        withControls={false}
        align="start"
        className={classes.button}
      >
        <Button color="pink" radius="xl" size="md">
          <IconYoga />
          <Link
            style={{ textDecoration: "none", color: "inherit" }}
            color="pink"
            to="/homepage/Hatha"
          >
            Hatha
          </Link>
        </Button>
        <Button color="yellow" radius="xl" size="md">
          <IconApiApp />
          <Link
            style={{ textDecoration: "none", color: "inherit" }}
            to="/homepage/Vinyasa"
          >
            Vinyasa
          </Link>
        </Button>
        <Button color="green" radius="xl" size="md">
          <IconYinYang />
          <Link
            style={{ textDecoration: "none", color: "inherit" }}
            to="/homepage/Yin"
          >
            Yin
          </Link>
        </Button>
        <Button color="cyan" radius="xl" size="md">
          <IconDisabled2 />
          <Link
            style={{ textDecoration: "none", color: "inherit" }}
            to="/homepage/Wheelyoga"
          >
            Wheel-Yoga
          </Link>
        </Button>
        <Button color="violet" radius="xl" size="md">
          <IconGeometry />
          <Link
            style={{ textDecoration: "none", color: "inherit" }}
            to="/homepage/Ashtanga"
          >
            Ashtanga
          </Link>
        </Button>
      </Carousel>
    </div>
  );
}
