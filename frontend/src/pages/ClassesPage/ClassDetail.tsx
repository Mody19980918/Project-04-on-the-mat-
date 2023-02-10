//Class Photo (carousel)
//Duration ^Logic to calculate duration
//Location
//teacher  photo

import {
  Container,
  Group,
  Image,
  Space,
  Text,
  Title,
  Chip,
  Button,
} from "@mantine/core";
import { IconMapPin, IconMessage2 } from "@tabler/icons";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useFetch } from "../../hooks/Fetch";
import ReserveClassButton from "../../components/IconButton";
import BackButton from "../../components/BackButton";
import { Footer } from "../../components/Homepage/Footer";
import { request } from "http";
import {
  errorNotifications,
  successNotifications,
} from "../../hooks/Notification";
import IconButton from "../../components/IconButton";
import { useSelector } from "react-redux";
import { IRootState } from "../../store/store";
import { uuidv4 } from "@firebase/util";

export default function ClassDetails() {
  const navigate = useNavigate();
  const fetch = useFetch();
  const [attendance, setAttendance] = useState<boolean>(true);
  const [test, setTest] = useState<boolean>(true);
  const [classDetails, setClassDetails] = useState<any[]>([]);
  const [studentNameDetails, setStudentNameDetails] = useState<any[]>([]);
  const { id } = useParams();
  const [classState, setClassState] = useState<boolean>(false);
  const admin = useSelector((state: IRootState) => state.user.user?.admin);
  const [studioID, setStudioID] = useState<any[]>([]);

  const date = new Date();
  let month: any = date.getMonth() + 1;
  let year: any = date.getFullYear();
  let day: any = date.getDate();
  let hours: any = date.getHours();
  let minutes: any = date.getMinutes();
  let seconds: any = date.getSeconds();
  let milliseconds: any = date.getMilliseconds();

  if (year <= 9) {
    year = `0${year}`;
  }

  if (month < 10) {
    month = `0${month}`;
  }

  if (day < 10) {
    day = `0${day}`;
  }

  if (hours < 10) {
    hours = `0${hours}`;
  }

  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  if (seconds < 10) {
    seconds = `0${seconds}`;
  }

  let formattedDate = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}Z`;
  console.log(new Date(formattedDate));
  let nowDate = new Date(formattedDate);
  console.log(formattedDate);

  useEffect(() => {
    get();
  }, []);
  useEffect(() => {
    console.log(studentNameDetails);
  }, [studentNameDetails]);
  useEffect(() => {}, [setClassDetails]);

  useEffect(() => {
    getstudentNameDetails();
  }, []);
  useEffect(() => {
    getUserBookClassState();
  }, []);

  async function get() {
    let options: any = {
      weekday: "long",
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    let res = await fetch.get(`/class/classDetails/${id}`);
    console.log(res);
    let result = res.resData.map((v: any) => {
      console.log(v.imagesList[0].path);

      return {
        newduration: res.newduration,
        address: v.address,
        name: v.name,
        type: v.type,
        date: new Date(v.date).toLocaleDateString("en-US", options),
        credits_needed: v.credits_needed,
        description: v.description,
        teacher_name: v.teacher_name,
        start_time: v.start_time,
        imagesList: v.imagesList[0].path,
        studio_name: v.studio_name,
        studio_id: v.studio_id,
        teacher_id: v.teacher_id,
      };
    });
    console.log("result", result);
    setStudioID(result[0].studio_id);
    setClassDetails([...result]);
  }
  async function getstudentNameDetails() {
    // console.log(id);

    let res = await fetch.get(`/class/getStudentNameForClassInformation/${id}`);
    let result = res.map((v: any) => {
      let date = v.class_date.substring(0, 10);
      let time = v.class_end_time.substring(10, v.class_end_time.length);
      let end_time = `${date}${time}`;
      console.log(end_time);

      console.log(new Date(end_time));

      return {
        first_name: v.first_name,
        last_name: v.last_name,
        id: v.id,
        attendance: v.attendance,
        date: new Date(end_time),
        user_id: v.user_id,
      };
    });

    setStudentNameDetails([...result]);
  }

  async function getUserBookClassState() {
    let res = await fetch.get(`/class/getUserBookClassState/${id}`);
    if (res.success) {
      return setClassState(!classState);
    }
  }

  async function reserveClass() {
    let res = await fetch.post(`/class/reserveClass/${id}`, { id });
    // console.log(res.messages);

    if (res.success) {
      setClassState(!classState);
      return successNotifications(res.messages);
    }

    if (res.success == "class is full") {
      setClassState(!classState);
      return;
    }

    return;
  }
  async function tickAttendancePresent(student_id: number) {
    console.log(id);

    let res = await fetch.post(`/class/tickAttendancePresent/${id}`, {
      student_id: +student_id,
    });
    console.log("HIHI");

    setAttendance(!attendance);

    return successNotifications(res.success);
  }
  function contactTeacher() {
    return navigate(`/ChatMessages/${studioID}`);
  }

  async function tickAttendanceLate(student_id: number) {
    let res = await fetch.post(`/class/tickAttendanceLate/${id}`, {
      student_id,
    });
    setAttendance(!attendance);

    return successNotifications(res.success);
  }

  async function tickAttendanceAbsent(student_id: number) {
    let res = await fetch.post(`/class/tickAttendanceAbsent/${id}`, {
      student_id,
    });
    setAttendance(!attendance);

    return successNotifications(res.success);
  }

  return (
    <div>
      <Container>
        <Group>
          <BackButton />
          <Title>Class Details</Title>
        </Group>
      </Container>
      {classDetails.map((value) => (
        <div style={{ width: 240, marginLeft: "auto", marginRight: "auto" }}>
          <Image radius="md" src={value.imagesList} />
          <Space h="md" />
          <Text>Class Name</Text>
          <Text m="xs" color="dimmed" size="sm">
            {value.name}
          </Text>
          <Space h="md" />
          <Text>Class Type</Text>
          <Text m="xs" color="dimmed" size="sm">
            {value.type}
          </Text>
          <Space h="md" />
          <Text>Date</Text>
          <Text m="xs" color="dimmed" size="sm">
            {value.date}
          </Text>
          <Space h="md" />
          <Text>Start Time</Text>
          <Text m="xs" color="dimmed" size="sm">
            {value.start_time.substring(11, 16)}
          </Text>
          <Space h="md" />
          <Text>Duration</Text>
          <Text m="xs" color="dimmed" size="sm">
            {value.newduration}
          </Text>
          <Space h="md" />
          <Text>Credits Needed</Text>
          <Text m="xs" color="dimmed" size="sm">
            {value.credits_needed}
          </Text>
          <Space h="md" />
          <Link
            to={`/teacherInformation/${value.teacher_id}`}
            style={{ color: "black", textDecoration: "none" }}
          >
            <Text>Instructor</Text>
            <Text m="xs" color="dimmed" size="sm">
              {value.teacher_name}
            </Text>
          </Link>
          <Space h="md" />
          <Text>Description</Text>
          <Text m="xs" color="dimmed" size="sm">
            {value.description}
          </Text>
          <Space h="md" />
          <Link
            to={`/studio/studioDetails/${value.studio_id}`}
            style={{ color: "black", textDecoration: "none" }}
          >
            <Text>Studio Name</Text>
            <Text m="xs" color="dimmed" size="sm">
              {value.studio_name}
            </Text>
          </Link>

          <Space h="md" />
          <Text>Studio Address</Text>
          <Text m="xs" color="dimmed" size="sm">
            {value.address}
          </Text>
          <Space h="md" />
          <Group position="center">
            <Text
              style={{ color: "blue", textDecoration: "none" }}
              onClick={contactTeacher}
            >
              Contact Us
            </Text>
            <div style={{ color: "blue", textDecoration: "none" }}>
              <IconMessage2 />
            </div>
          </Group>
          <Space h="md" />
          {admin ? (
            <></>
          ) : (
            <ReserveClassButton
              onClick={reserveClass}
              color="violet"
              type="next"
              disabled={classState}
            >
              Reserve Now
            </ReserveClassButton>
          )}

          <div>
            {admin ? (
              <div>
                <Text>Attendance List</Text>
                {studentNameDetails.map((value) => (
                  <div key={value.id}>
                    <Group>
                      <Text m="xs" color="dimmed" size="sm">
                        {value.first_name + " " + value.last_name}
                      </Text>
                      {nowDate > value.date && attendance ? (
                        <Button
                          size="xs"
                          color="violet.4"
                          onClick={() => tickAttendanceAbsent(value.id)}
                        >
                          A{" "}
                        </Button>
                      ) : (
                        <>
                          {attendance ? (
                            <div>
                              <Button
                                size="xs"
                                color="violet.4"
                                onClick={() => tickAttendancePresent(value.id)}
                              >
                                P
                              </Button>
                              <Button
                                size="xs"
                                color="violet.4"
                                onClick={() => tickAttendanceLate(value.id)}
                              >
                                L{" "}
                              </Button>
                            </div>
                          ) : (
                            <>{value.attendance}</>
                          )}
                        </>
                      )}
                    </Group>
                  </div>
                ))}{" "}
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
      ))}
      <Space h="xl" />
      <Space h="xl" />
      <Space h="xl" />
      <Space h="xl" />
      <Space h="xl" />
      <Space h="xl" />
    </div>
  );
}
