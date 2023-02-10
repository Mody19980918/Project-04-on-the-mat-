import {
  Button,
  Container,
  Flex,
  Grid,
  Group,
  Skeleton,
  Space,
  Text,
} from "@mantine/core";
import BackButton from "../../components/BackButton";
import Title from "../../components/Title";
import CardFormat from "../../components/CardFormat";
import { useEffect, useState } from "react";
import { useFetch } from "../../hooks/Fetch";
import { logoutAction } from "../../store/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, IRootState } from "../../store/store";
import { successNotifications } from "../../hooks/Notification";
import { useNavigate } from "react-router-dom";
import { uuidv4 } from "@firebase/util";

export default function SuperAdmin() {
  const [data, setData] = useState<any[]>([]);
  const fetch = useFetch();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [skeleton, setSkeleton] = useState<boolean>(false);
  const super_admin = useSelector(
    (state: IRootState) => state.user.user?.super_admin
  );

  async function getValidateStudioOrFreelance() {
    let res = await fetch.get("/superAdmin/getValidateStudioOrFreelance");
    console.log(res);
    setData([...res]);
  }
  async function logout() {
    dispatch(logoutAction());
    successNotifications("Logout Successful!!");
    return navigate("/");
  }

  useEffect(() => {
    getValidateStudioOrFreelance();
  }, []);

  useEffect(() => {
    if (!super_admin) {
      return navigate("/");
    }
  }, []);

  return (
    <>
      <Container>
        <Grid align="center">
          <Grid.Col span={3}>
            <div>
              <Space h="xl" />
              <Button variant="subtle" onClick={logout}>
                <Text>Logout</Text>
              </Button>
            </div>
            <Space h="xl" />
          </Grid.Col>
          <Grid.Col span={9}>
            <div>
              <Title>Accounts to be approved</Title>
            </div>
          </Grid.Col>
        </Grid>
        <Space h="md" />

        <Container>
          <Text>
            {data.map((value) => {
              return (
                <div key={uuidv4()}>
                  <CardFormat
                    refreshFunction={() => getValidateStudioOrFreelance()}
                    id={value.id}
                    name={value.name}
                    address={value.address}
                    description={value.description}
                    phone_number={value.phone_number}
                    email={value.email}
                    path={value.path}
                  />
                  <Space h="xl" />
                </div>
              );
            })}
          </Text>
        </Container>
      </Container>
    </>
  );
}
