import { Container, Space, Stepper } from "@mantine/core";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "../../components/BackButton";
import StepOneForm from "../../components/BusinessRegister/StepOneForm";
import StepTwoForm from "../../components/BusinessRegister/StepTwoForm";

import SignInOrSignUp from "../../components/SignInOrSignUp";
import Title from "../../components/Title";
import { useFetch } from "../../hooks/Fetch";
import {
  errorNotifications,
  successNotifications,
} from "../../hooks/Notification";

export default function BusinessRegister() {
  const navigate = useNavigate();
  const [active, setActive] = useState<number>(0);

  const [overAllData, setOverAllData] = useState({
    first_name: "",
    last_name: "",
    business_user_email: "",
    password: "",
    business_user_phone_number: "",
  });

  const fetch = useFetch();
  function storeStepOneData(businessAccount: any) {
    setOverAllData({ ...overAllData, ...businessAccount });
    setActive(1);
  }

  useEffect(() => {
    console.log(overAllData);
  }, [overAllData]);

  async function finalSubmit(studioData: any) {
    setOverAllData({ ...overAllData, ...studioData });

    const formData = new FormData();

    formData.append("first_name", overAllData.first_name);
    formData.append("last_name", overAllData.last_name);
    formData.append("business_user_email", overAllData.business_user_email);
    formData.append("password", overAllData.password);
    formData.append(
      "business_user_phone_number",
      overAllData.business_user_phone_number
    );
    formData.append("studio_name", studioData.studio_name);
    formData.append("address", studioData.address);
    formData.append("studio_email", studioData.studio_email);
    formData.append("description", studioData.description);
    console.log(studioData.path);

    formData.append("path", studioData.path); // files
    formData.append("phone_number", studioData.phone_number);
    formData.append("district", studioData.district);
    formData.append("point_x", studioData.pointX);
    formData.append("point_y", studioData.pointY);

    let res = await fetch.fileRouter(
      "/user/businessregister",
      formData,
      "POST"
    );

    console.log(res);

    if (res.messages) {
      return errorNotifications(res.messages);
    }
    if (res.error) {
      if (res.error.issues) {
        return errorNotifications(res.error.issues[0].message);
      }
      return errorNotifications("unknown error");
    }

    successNotifications(res.successful);

    return navigate("/registerbusinessaccountsuccessful");
  }
  function backToStepOne(studioData: any) {
    setOverAllData({ ...overAllData, ...studioData });
    setActive(0);
  }
  return (
    <div>
      <Container>
        <BackButton path="/register" />
        <Title>Create Your Studio Here</Title>
        <Space h="xl" />
        <Stepper
          active={active}
          onStepClick={setActive}
          color="violet.4"
          iconSize={36}
          allowNextStepsSelect={false}
        >
          <Stepper.Step
            label="Step 1"
            description="Create Account"
          ></Stepper.Step>
          <Stepper.Step
            label="Step 2"
            description="Insert Information"
          ></Stepper.Step>
        </Stepper>
        <Space h="xl" />

        {active === 0 && (
          <StepOneForm storeData={storeStepOneData} data={overAllData} />
        )}
        {active === 1 && (
          <StepTwoForm
            finalSubmit={finalSubmit}
            backToSterOne={backToStepOne}
            data={overAllData}
          />
        )}
        <Space h="xl" />
      </Container>
    </div>
  );
}
