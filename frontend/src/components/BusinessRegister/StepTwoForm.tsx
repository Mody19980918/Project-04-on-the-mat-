import {
  TextInput,
  Button,
  FileInput,
  HoverCard,
  List,
  Space,
  Text,
  Group,
  NativeSelect,
  Select,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import {
  IconUser,
  IconMail,
  IconLock,
  IconUpload,
  IconFileDescription,
  IconDeviceMobile,
  IconMapPin,
  IconPinned,
} from "@tabler/icons";
import { useEffect, useState } from "react";
import { genValidator } from "../../hooks/getValidator";
import IconButton from "../IconButton";
import { Draggable, Map, Marker, Overlay } from "pigeon-maps";
import { number } from "zod";

type StudioInformation = {
  finalSubmit: Function;
  backToSterOne: Function;
  data: any;
};

type StudioData = {
  address: string;
  studio_email: string;
  description: string;
  path: string;
  phone_number: string;
};

function StepTwoForm({ finalSubmit, backToSterOne, data }: StudioInformation) {
  const [hue, setHue] = useState(0);
  const color = `hsl(${hue % 360}deg 39% 70%)`;
  const location = [
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
  const [picker, setPicker] = useState<[number, number]>([0, 0]);
  const form = useForm({
    initialValues: {
      studio_name: "",
      address: "",
      studio_email: "",
      description: "",
      path: "",
      phone_number: "",
      district: "",
      pointX: 0,
      pointY: 0,
    },
    validateInputOnChange: true,
    validate: {
      studio_name: genValidator([
        {
          reason: "Studio Name can't be null",
          match: (value) => value.length == 0,
        },
      ]),
      address: genValidator([
        {
          reason: "Address can't be null",
          match: (value) => value.length == 0,
        },
      ]),
      studio_email: genValidator([
        {
          reason: "Invalid email",
          match: (value) => !/^\S+@\S+$/.test(value),
        },
      ]),
      description: genValidator([
        {
          reason: "Description can't be null",
          match: (value) => value.length == 0,
        },
      ]),
      path: genValidator([
        {
          reason: "Invalid path",
          match: (value) => value == null || value.length == 0,
        },
      ]),
      phone_number: genValidator([
        {
          reason: "Description can't be null",
          match: (value) => value.length == 0,
        },
      ]),
      district: genValidator([
        {
          reason: "District can't be null",
          match: (value) => value.length == 0,
        },
      ]),
      pointX: genValidator([
        {
          reason: "point X can't be null",
          match: (value) => value.length == 0,
        },
      ]),
      pointY: genValidator([
        {
          reason: "point Y can't be null",
          match: (value) => value.length == 0,
        },
      ]),
    },
  });
  useEffect(() => {
    if (data) {
      form.setValues({
        studio_name: data.studio_name || "",
        address: data.address || "",
        studio_email: data.studio_email || "",
        description: data.description || "",
        phone_number: data.phone_number || "",
        district: data.district || "",
      });
    }
  }, [data]);
  function submitStudioData(value: StudioData) {
    finalSubmit(value);
  }

  useEffect(() => {
    if (picker) {
      form.setFieldValue("pointX", picker[0]);
      form.setFieldValue("pointY", picker[1]);
    }
  }, [picker]);

  return (
    <>
      <form onSubmit={form.onSubmit((value) => submitStudioData(value))}>
        <TextInput
          type="text"
          withAsterisk
          placeholder="Studio Name"
          radius="md"
          icon={<IconUser />}
          {...form.getInputProps("studio_name")}
        />
        <Space h="xl" />
        <TextInput
          type="text"
          icon={<IconUser />}
          radius="md"
          placeholder="Address"
          {...form.getInputProps("address")}
        />
        <Space h="xl" />
        <TextInput
          type="text"
          icon={<IconDeviceMobile />}
          placeholder="Studio phone number"
          {...form.getInputProps("phone_number")}
        />
        <Space h="xl" />
        <TextInput
          type="text"
          icon={<IconMail />}
          radius="md"
          placeholder="Your Studio email"
          {...form.getInputProps("studio_email")}
        />
        <Space h="xl" />
        <Select
          icon={<IconMapPin />}
          radius="md"
          withAsterisk
          searchable
          data={location}
          placeholder="Search District"
          {...form.getInputProps("district")}
        />
        <Space h="xl" />
        <TextInput
          type="text"
          radius="md"
          icon={<IconPinned />}
          placeholder="Write Point X in here"
          disabled
          {...form.getInputProps("pointX")}
        />
        <Space h="xl" />
        <TextInput
          type="text"
          radius="md"
          icon={<IconPinned />}
          placeholder="Write Point Y in here"
          disabled
          {...form.getInputProps("pointY")}
        />
        <Space h="xl" />
        <Text>Please Select your place in map</Text>
        <Space h="sm" />
        <Map
          onClick={({ event, latLng, pixel }) => setPicker(latLng)}
          height={700}
          defaultCenter={[22.3211602, 114.2092619]}
          defaultZoom={15}
        >
          <Marker width={50} anchor={picker} color={color} />
        </Map>
        <Space h="xl" />
        <TextInput
          type="text"
          radius="md"
          icon={<IconFileDescription />}
          placeholder="Description"
          {...form.getInputProps("description")}
        />
        <Space h="xl" />
        <FileInput
          placeholder="Upload Photo"
          withAsterisk
          accept="image/png,image/jpeg"
          icon={<IconUpload />}
          {...form.getInputProps("path")}
        />
        <Space h="xl" />
        <HoverCard width={280} shadow="md">
          <HoverCard.Target>
            <Button variant="subtle">Why Your need to Upload Photo?</Button>
          </HoverCard.Target>
          <HoverCard.Dropdown>
            <Text size="sm">We need to verity your identity.</Text>
            <List size="sm">
              <List.Item>
                If you are freelance of yoga tutor, please upload your
                Certificate in here.
              </List.Item>
              <List.Item>
                If you are yoga studio, please upload your Business Certificate.
              </List.Item>
            </List>
          </HoverCard.Dropdown>
        </HoverCard>
        <Space h="md" />
        <Group position="center">
          <IconButton
            type={"back"}
            onClick={form.onSubmit((value) => backToSterOne(value))}
          >
            BACK
          </IconButton>
          <IconButton type={"next"}>SUBMIT</IconButton>
        </Group>
      </form>
    </>
  );
}

export default StepTwoForm;
