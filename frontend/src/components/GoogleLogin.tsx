import { Button, Group, Image, Space, Text } from "@mantine/core";
import { useFetch } from "../hooks/Fetch";
import { signInWithPopup } from "firebase/auth";
import { auth, provide } from "../configs/Firebase";
import { successNotifications } from "../hooks/Notification";
import { useNavigate } from "react-router-dom";
import { AppDispatch } from "../store/store";
import { useDispatch } from "react-redux";
import { loginAction } from "../store/userSlice";

export default function GoogleLogin() {
  const fetch = useFetch();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const googleLogin = async () => {
    const result: any = await signInWithPopup(auth, provide);
    const accessToken = result.user.accessToken;
    let res = await fetch.post("/user/googlelogin", { accessToken });
    console.log("token", res.token);
    localStorage.setItem("token", res.token);

    dispatch(loginAction({ token: res.token }));
    successNotifications("Login successful!");
    return navigate("/");
  };
  return (
    <>
      <Group position="center">
        <Button onClick={googleLogin} variant="subtle">
          <Group position="center">
            <Image width={30} src="./Google_Login.png" />
            <Text fs="italic"> Login with Google</Text>
          </Group>
        </Button>
      </Group>
      <Space h="md" />
    </>
  );
}
