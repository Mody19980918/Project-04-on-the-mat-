import {
  Button,
  ActionIcon,
  createStyles,
  Group,
  Drawer,
  NativeSelect,
  RangeSlider,
  Grid,
} from "@mantine/core";
import { Carousel } from "@mantine/carousel";
import { DateRangePicker } from "@mantine/dates";
import {
  IconApiApp,
  IconBrandMiniprogram,
  IconCalendar,
  IconDisabled2,
  IconFilter,
  IconGeometry,
  IconMapPin,
  IconYinYang,
  IconYoga,
} from "@tabler/icons";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

//
export default function HomeFilterButton() {
  const navigate = useNavigate();

  let today = new Date();

  let tomorrow: any = today.setUTCDate(today.getUTCDate() + 1);

  const [opened, setOpened] = useState(false); //Drawer
  const [formValid, setFormValid] = useState<string[]>([""]);
  const formValidParams = new URLSearchParams();
  const [dateRange, setDateRange] = useState<[Date, Date]>([
    new Date(),
    tomorrow,
  ]);

  formValid.forEach((formValid) =>
    formValidParams.append(formValid, formValid)
  );

  function gotoSearchPage() {
    navigate(
      `/filterlist?selectedType=${selectedType}&selectedDate=${selectedDate}&selectedLocation=${selectedLocation}&selectedCreditRange=${selectedCreditRange}`
    );
  }

  const location = [
    { value: "", label: "Please select location" },
    { value: "centralandwest", label: "Central and West" },
    { value: "eastern", label: "Eastern District" },
    { value: "southern", label: "Southern District" },
    { value: "wanChai", label: "Wan Chai District" },
    { value: "kowloonCity", label: "Kowloon City District" },
    { value: "kwunTong", label: "Kwun Tong District" },
    { value: "shamShuiPo", label: "Sham Shui Po District" },
    { value: "wongTaiSin", label: "Wong Tai Sin District" },
    { value: "yauTsimMong", label: "Yau Tsim Mong District" },
    { value: "island", label: "Island District" },
    { value: "kwaiTsing", label: "Kwai Tsing District" },
    { value: "north", label: "North District" },
    { value: "saiKung", label: "Sai Kung District" },
    { value: "shaTin", label: "Sha Tin District" },
    { value: "taiPo", label: "Tai Po District" },
    { value: "tsuenWan", label: "Tsuen Wan District" },
    { value: "tuenMun", label: "Tuen Mun District" },
    { value: "yuenLong", label: "Yuen Long District" },
  ];
  //
  const credit = [
    { value: 10, label: "10" },
    { value: 20, label: "20" },
    { value: 30, label: "30" },
    { value: 40, label: "40" },
    { value: 50, label: "50" },
    { value: 60, label: "60" },
    { value: 70, label: "70" },
    { value: 80, label: "80" },
    { value: 90, label: "90" },
    { value: 100, label: "100" },
  ];
  //
  const [selectedType, setSelectedType] = useState("");
  // const [selectedTime, setSelectedTime] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedCreditRange, setSelectedCreditRange] = useState([10, 20]);
  const [isApplyDisabled, setIsApplyDisabled] = useState(true);
  //
  useEffect(() => {
    if (
      selectedType == "" ||
      selectedDate == new Date() ||
      selectedLocation == ""
    ) {
      setIsApplyDisabled(true);
    } else {
      setIsApplyDisabled(false);
    }
  }, [selectedType, selectedDate, selectedLocation]);

  // Handle changes to the type of yoga
  const handleTypeChange = (str: string) => {
    setSelectedType(str);
  };
  // Handle changes to the date
  const handleDateChange = (date: any) => {
    setSelectedDate(date);
    // setSelectedTime("disabled");
    setDateRange(date);
  };
  // Handle changes to the location
  const handleLocationChange = (location: any) => {
    setSelectedLocation(location);
  };
  // Handle changes to the price range
  const handleCreditRangeChange = (credit: any) => {
    console.log(credit);
    setSelectedCreditRange(credit);
  };
  // Handle resetting the form
  const handleReset = () => {
    setSelectedType("");
    // setSelectedTime("");
    setSelectedDate(new Date());
    setSelectedLocation("");
    setSelectedCreditRange([10, 20]);
    setIsApplyDisabled(true);
  };
  //
  //
  const useStyles = createStyles((theme) => ({
    header: {
      padding: 0,
      margin: 0,
    },
    title1: {
      color: "grey",
      fontSize: "30px",
      marginBottom: "30px",
      marginLeft: "10px",
      fontFamily: "Andalé-Mono",
      fontWeight: "lighter",
    },
    buttonText: {
      color: "grey",
      fontSize: "10px",
      marginBottom: "50px",
      fontFamily: "Andalé-Mono",
      fontWeight: "bold",
      textAlign: "center",
    },
    title2: {
      color: "grey[2]",
      fontSize: "25px",
      marginBottom: "10px",
      marginLeft: "10px",
      fontFamily: "Andalé-Mono",
      fontWeight: "inherit",
    },
    button: {
      borderRadius: "50%",
      textAlign: "center",
      color: "grey",
      fontSize: "10px",
      fontFamily: "Andalé-Mono",
      fontWeight: "lighter",
    },
    filterText: {
      color: "white",
      fontSize: "13px",
      fontFamily: "Andalé-Mono",
      fontWeight: "lighter",
    },
    rangeSlider: {
      color: "indigo[9]",
    },
  }));
  //
  const { classes } = useStyles();

  return (
    <>
      <Drawer
        position="bottom"
        opened={opened}
        onClose={() => setOpened(false)}
        title=""
        padding="xs"
        overlayOpacity={0.5}
        overlayBlur={3}
        size="85%"
      >
        <div className={classes.title1}>Filter</div>

        {/* Drawer content */}
        {/*  */}
        {/*  */}
        {/*  */}
        <Carousel
          slideSize="100%"
          height={100}
          align="start"
          slideGap="lg"
          controlsOffset="xs"
          controlSize={22}
          dragFree
          withControls={false}
        >
          <Grid>
            <Grid.Col span={2}>
              <Button
                type="button"
                value="Hatha"
                onClick={() => handleTypeChange("Hatha")}
                color="indigo"
                variant={selectedType == "Hatha" ? "filled" : "light"}
                className={classes.button}
                size="sm"
              >
                <IconYoga size={35} />
              </Button>
              <div className={classes.buttonText}>Hatha</div>
            </Grid.Col>
            <Grid.Col span={2}>
              <Button
                type="button"
                value="Vinyasa"
                onClick={() => handleTypeChange("Vinyasa")}
                color="indigo"
                variant={selectedType == "Vinyasa" ? "filled" : "light"}
                className={classes.button}
                size="sm"
              >
                <IconApiApp size={35} />
              </Button>
              <div className={classes.buttonText}>Vinyasa</div>
            </Grid.Col>
            <Grid.Col span={2}>
              <Button
                type="button"
                value="Yin"
                onClick={() => handleTypeChange("Yin")}
                color="indigo"
                variant={selectedType == "Yin" ? "filled" : "light"}
                className={classes.button}
                size="sm"
              >
                <ActionIcon>
                  <IconBrandMiniprogram size={35} />
                </ActionIcon>
              </Button>
              <div className={classes.buttonText}>Yin</div>
            </Grid.Col>
            <Grid.Col span={2}>
              <Button
                type="button"
                value="Wheel-yoga"
                onClick={() => handleTypeChange("Wheel-yoga")}
                color="indigo"
                variant={selectedType == "Wheel-yoga" ? "filled" : "light"}
                className={classes.button}
                size="sm"
              >
                <IconDisabled2 size={35} />
              </Button>
              <div className={classes.buttonText}>Wheel-Yoga</div>
            </Grid.Col>
            <Grid.Col span={2}>
              <Button
                type="button"
                value="Ashtanga"
                onClick={() => handleTypeChange("Ashtanga")}
                color="indigo"
                variant={selectedType == "Ashtanga" ? "filled" : "light"}
                className={classes.button}
                size="sm"
              >
                <IconGeometry size={35} />
              </Button>
              <div className={classes.buttonText}>Ashtanga</div>
            </Grid.Col>
          </Grid>
        </Carousel>
        {/*  */}
        {/*  */}
        {/*  */}
        <div className={classes.title2}>Date</div>
        {/*  */}
        {/*  */}
        {/*  */}
        <DateRangePicker
          label="*Let's pick a DAY or DATE RANGE"
          placeholder="Pick dates range"
          value={dateRange}
          onChange={handleDateChange}
          mb={15}
        />
        {/*  */}
        {/*  */}
        {/*  */}
        <div className={classes.title2}>Location</div>
        <NativeSelect
          value={selectedLocation}
          onChange={(event) => handleLocationChange(event.currentTarget.value)}
          data={location}
          // label=""
          placeholder="Choose a area"
          color="indigo.8"
          mb={20}
        />
        {/*  */}
        {/*  */}
        {/*  */}
        <RangeSlider
          onChange={(event) => handleCreditRangeChange(event)}
          defaultValue={[10, 20]}
          min={0}
          max={100}
          marks={credit}
          step={5}
          mb={50}
          className={classes.rangeSlider}
        />
        {/*  */}
        {/*  */}
        {/*  */}
        <Group mt={50} position="center">
          <Button
            type="button"
            value="reset"
            onClick={handleReset}
            variant="outline"
            color="gray"
            size="lg"
          >
            RESET
          </Button>
          <Button
            disabled={isApplyDisabled}
            type="button"
            value="apply"
            color="indigo"
            size="lg"
            onClick={() => gotoSearchPage()}
          >
            Apply
          </Button>
        </Group>
        {/*  */}
      </Drawer>
      {/* Drawer content */}
      {/*  */}
      {/*  */}
      {/*  */}

      <Group>
        <Button
          onClick={() => setOpened(true)}
          color="gray"
          radius="xl"
          size="xs"
          opacity="0.5"
          leftIcon={<IconFilter size={30} />}
        >
          <ActionIcon className={classes.filterText}>
            <IconFilter size={30} />
            Filter
          </ActionIcon>
        </Button>
      </Group>
    </>
  );
}
