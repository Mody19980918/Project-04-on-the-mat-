import { Container, Space, Image, Group } from "@mantine/core";
import { redirect, useNavigate } from "react-router-dom";
import BackButton from "../../components/BackButton";
import IconButton from "../../components/IconButton";
import Title from "../../components/Title";
import yoga_Image from "../../assets/yoga_Image.png";

export default function RegisterBusinessAccountSuccessful() {
  const navigate = useNavigate();
  function BackToLoginPage() {
    return navigate("/login");
  }
  return (
    <>
      <Container>
        <BackButton />
        <Image radius="sm" src={yoga_Image} alt="Error" height={250} />
        <Group position="center" p={10}>
          <Title>
            We have received your request, please wait for our confirmation on
            your business account set up.
          </Title>
        </Group>
        <Space h="xl" />
        <IconButton type={"next"} onClick={BackToLoginPage}>
          BACK TO LOGIN PAGE
        </IconButton>
      </Container>
    </>
  );
}
