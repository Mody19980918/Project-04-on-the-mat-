import { useState, useRef, useEffect } from "react";
import dayjs from "dayjs";
import {
  createStyles,
  NumberInput,
  NumberInputHandlers,
  Select,
  Space,
  TextInput,
  useMantineTheme,
  Text,
  Container,
  FileInput,
  Title,
} from "@mantine/core";
import { DatePicker, isSameDate, TimeInput } from "@mantine/dates";
import { classInformation, UserInformation } from "../../global/Model";
import { useForm } from "@mantine/form";
import { useLocation, useNavigate } from "react-router-dom";
import { useFetch } from "../../hooks/Fetch";
import SubmitButton from "../../components/IconButton";
import { IconBackpack, IconUpload, IconYoga } from "@tabler/icons";
import React from "react";
import { useSelector } from "react-redux";
import { IRootState } from "../../store/store";
import BackButton from "../../components/BackButton";
import { Footer } from "../../components/Homepage/Footer";
import { errorNotifications, successNotifications } from "../../hooks/Notification";

const useStyles = createStyles((theme) => ({
  wrapper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: `6px ${theme.spacing.xs}px`,
    borderRadius: theme.radius.sm,
    border: `1px solid ${theme.colorScheme === "dark" ? "transparent" : theme.colors.gray[3]
      }`,
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.white,

    "&:focus-within": {
      borderColor: theme.colors[theme.primaryColor][6],
    },
  },

  control: {
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
    border: `1px solid ${theme.colorScheme === "dark" ? "transparent" : theme.colors.gray[3]
      }`,

    "&:disabled": {
      borderColor:
        theme.colorScheme === "dark" ? "transparent" : theme.colors.gray[3],
      opacity: 0.8,
      backgroundColor: "transparent",
    },
  },

  input: {
    textAlign: "center",
    paddingRight: `${theme.spacing.sm}px !important`,
    paddingLeft: `${theme.spacing.sm}px !important`,
    height: 28,
    flex: 1,
  },
}));

export default function ClassInput() {
  const fetch = useFetch();
  const { classes } = useStyles();
  const handlers = useRef<NumberInputHandlers>(null);
  const user = useSelector((state: IRootState) => state.user);
  const [classUpperValue, setClassUpperValue] = useState<number | undefined>(1);
  const [credit, setCredit] = useState<number | undefined>(1);
  const [teacherName, setTeacherName] = useState<any[]>([]);
  const [values, setValues] = useState<Date[]>([]);

  const navigate = useNavigate()

  const form = useForm({
    initialValues: {
      class_name: "",
      class_type: "",
      teacher_name: "",
      start_time: "",
      end_time: "",
      upper_limit: "",
      description: "",
      credits_needed: "",
      class_images: "",
    },
  });
  const theme = useMantineTheme();

  const dayStyle = (date: Date) => {
    if (values.some((day) => isSameDate(date, day))) {
      return {
        backgroundColor: theme.colors.blue[0],
        color: theme.colors.blue[9],
      };
    }
    return null;
  };

  const handleDayPick = (value: Date) => {
    setValues((current) => {
      if (current.some((day) => isSameDate(value, day))) {
        return current.filter((day) => !isSameDate(value, day));
      }

      return [...current, value];
    });
  };
  //
  function useQuery() {
    const { search } = useLocation();
    return React.useMemo(() => new URLSearchParams(search), [search]);
  }
  const query = useQuery();

  async function getTeacherName() {
    // console.log('byebye');

    let res = await fetch.get("/studio/getTeacherName");
    // console.log('HIHi');
    // console.log(res);
    // console.log(res[0].name);
    const newArr = res.map((v: any) => v.name);
    setTeacherName(newArr);
  }

  useEffect(() => {
    getTeacherName();
  }, []);
  useEffect(() => {
    console.log("teacher", teacherName);
  }, [teacherName]);
  async function confirmNewClass(value: classInformation) {
    const formData = new FormData();
    console.log(value);

    formData.append("date", JSON.stringify(values));
    formData.append("class_name", value.class_name);
    formData.append("class_type", value.class_type);
    formData.append("teacher_name", value.teacher_name);
    formData.append("start_time", value.start_time);
    formData.append("end_time", value.end_time);
    formData.append("upper_limit", String(value.upper_limit));
    formData.append("description", value.description);
    formData.append("credits_needed", String(value.credits_needed));
    formData.append("class_images", value.class_images[0]);

    let res = await fetch.fileRouter("/class/addClass", formData, "POST");
    if (res.success) {
      successNotifications(res.success);
      return navigate('/')

    }
    if (res.messages) {
      return errorNotifications(res.messages);
    }
  }

  return (
    <div className="App">
      <form
        onSubmit={form.onSubmit((value: any) => {
          return confirmNewClass(value);
        })}
      >
        <Container>

          <BackButton />
          <Title>Create New Class</Title>
          <TextInput
            type="text"
            placeholder="Class Name"
            withAsterisk
            icon={<IconBackpack />}
            {...form.getInputProps("class_name")}
          />
          <Space h="md" />
          <Select
            placeholder="Class Type"
            withAsterisk
            radius="md"
            icon={<IconYoga />}
            data={[
              { value: "Hatha", label: "Hatha" },
              { value: "Vinyasa", label: "Vinyasa" },
              { value: "Yin", label: "Yin" },
              { value: "WheelYoga", label: "Wheel Yoga" },
              { value: "Ashtanga", label: "Ashtanga" },
            ]}
            {...form.getInputProps("class_type")}
          ></Select>
          <Space h="md" />
          <Select
            placeholder="Teacher"
            radius="md"
            withAsterisk
            icon={<IconYoga />}
            data={teacherName.map((value) => ({ value: value, label: value }))}
            {...form.getInputProps("teacher_name")}
          ></Select>
          <Space h="md" />

          <Text>
            {values
              .sort(function (a, b) {
                return new Date(a).getTime() - new Date(b).getTime();
              })
              .map((date) => {
                return dayjs(date).format("MMM DD (ddd)");
              })
              .join(", ")}
          </Text>
          <DatePicker
            placeholder="Pick multiple days"
            closeCalendarOnChange={false}
            withAsterisk
            inputFormat={""}
            multiple
            onChange={handleDayPick}
            dayStyle={dayStyle as any}
          />
          <Space h="md" />
          <TimeInput
            label="Start Time"
            withAsterisk
            format="12"
            {...form.getInputProps("start_time")}
          />

          <Space h="md" />
          <TimeInput
            label="End Time"
            withAsterisk
            format="12"
            {...form.getInputProps("end_time")}
          />
          <Space h="md" />

          <div className={classes.wrapper}>
            <NumberInput
              variant="unstyled"
              min={1}
              max={99}
              withAsterisk
              placeholder="Credits Needed For One Class"
              handlersRef={handlers}
              classNames={{ input: classes.input }}
              {...form.getInputProps("credits_needed")}
            />
          </div>
          <Space h="md" />

          <div className={classes.wrapper}>
            <NumberInput
              variant="unstyled"
              min={1}
              max={99}
              withAsterisk
              placeholder="Class Size"
              handlersRef={handlers}
              classNames={{ input: classes.input }}
              {...form.getInputProps("upper_limit")}
            />
          </div>
          <Space h="md" />
          <TextInput
            type="text"
            withAsterisk
            placeholder="Description of the class"
            icon={<IconBackpack />}
            {...form.getInputProps("description")}
          />
          <Space h="md" />
          <FileInput
            label="Upload Class Photos"
            withAsterisk
            placeholder="Upload Class Photos"
            multiple
            accept="image/png,image/jpeg"
            icon={<IconUpload size={14} />}
            {...form.getInputProps("class_images")}
          />
          <Space h="md" />
          <SubmitButton color="violet" type="next">
            Submit
          </SubmitButton>
        </Container>
      </form>
      <Space h="xl" />
      <Space h="xl" />
      <Space h="xl" />
    </div>

  );
}
