// import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/LoginPage/Login";
import Register from "./pages/RegisterPage/Register";
import ChangeUserInformation from "./pages/UserInformation/ChangeUserInformation";
import Payment from "./pages/PaymentPage/Payment";
import ForgetPassword from "./pages/ForgetPasswordPage/ForgetPassword";
import BusinessRegister from "./pages/RegisterPage/BusinessRegister";
import ClassInput from "./pages/ClassesPage/ClassInputForm";
import ClassDetails from "./pages/ClassesPage/ClassDetail";
import AddTeacher from "./pages/StudioPage/addTeacher";
import RegisterBusinessAccountSuccessful from "./pages/RegisterPage/RegisterBusinessAccountSuccessful";

import SuperAdmin from "./pages/SuperAdminPage/SuperAdmin";
import VerificationEmail from "./pages/ForgetPasswordPage/VerificationEmail";
import ChangePasswordWithParams from "./pages/ForgetPasswordPage/ChangePasswordWithParams";
import HomePage from "./pages/Homepage/HomePage";
import YogaList from "./pages/Homepage/YogaList";
import SeeAllClass from "./pages/Homepage/SeeAllClass";
import ChatList from "./pages/ChatRoomPage/ChatList";
import ChatMessages from "./pages/ChatRoomPage/ChatMessages";

import { io } from "socket.io-client";
import { useEffect } from "react";
import jwtDecode from "jwt-decode";
import { User } from "./store/userSlice";
import FilterMap from "./pages/Homepage/FilterMap";
import RegisterTestPage from "./pages/RegisterTestPage/RegisterTestPage";

import FilterList from "./pages/Homepage/FilterList";
import UserInformation from "./pages/UserInformation/UserInformation";
import ChangePasswordWithProfile from "./pages/UserInformation/ChangePasswordWithProfile";
import Reservations from "./pages/UserInformation/Reservations";
import StudioDetails from "./pages/StudioPage/studioDetails";
import AddReviews from "./pages/ClassesPage/addReviews";
import Search from "./pages/Search/Search";
import TeacherInformation from "./pages/TeacherInformation/TeacherInformation";
import ConfirmPassword from "./pages/UserInformation/ConfirmPassword";
import SeeAllStudioClass from "./pages/ClassesPage/SeeAllStudioClass";
import ChangeBusinessUserInformation from "./pages/StudioPage/ChangeBusinessUserInformation";
import SavedFollow from "./pages/UserInformation/SavedFollow";
import ForFirstGoogleLoginToInsertData from "./pages/UserInformation/ForFirstGoogleLoginToInsertData";
import FooterBarOulet from "./components/FooterBarOulet";
import { ChatMessageNotifications } from "./hooks/Notification";
import PaymentRecord from "./pages/UserInformation/PaymentRecord";

// let api_origin = import.meta.env.VITE_BACKEND_URL;

const socket = io(import.meta.env.VITE_BACKEND_URL);

function App() {
  function joinRoom() {
    let token: string | null = localStorage.getItem("token");
    let decoded: User = jwtDecode(token!);
    socket.emit("join_room", decoded.id);
  }

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Joined");
      joinRoom();
    });

    socket.on("receive_message", (data) => {
      ChatMessageNotifications(data.sender_username, data.text);
    });

    return () => {
      socket.off("connect");
      socket.off("receive_message");
    };
  }, []);

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/superAdmin" element={<SuperAdmin />} />
          <Route path="/Businessregister" element={<BusinessRegister />} />
          <Route path="/Search" element={<Search />} />
          <Route
            path="/registerbusinessaccountsuccessful"
            element={<RegisterBusinessAccountSuccessful />}
          />
          <Route
            path="/ChangePassword/:token"
            element={<ChangePasswordWithParams />}
          />
          <Route path="/ForgetPassword" element={<ForgetPassword />} />
          <Route
            path="/VerificationEmail/:id"
            element={<VerificationEmail />}
          />
          <Route
            path="/ForFirstGoogleLoginToInsertData"
            element={<ForFirstGoogleLoginToInsertData />}
          />
          <Route
            path="/"
            element={socket ? <FooterBarOulet socket={socket} /> : <></>}
          >
            <Route path="/" element={<HomePage />} />
            <Route path="/Payment" element={<Payment />} />
            <Route
              path="/ChangeUserInformation"
              element={<ChangeUserInformation />}
            />
            <Route path="/classinput" element={<ClassInput />} />
            <Route path="/classDetails/:id" element={<ClassDetails />} />

            <Route
              path="/teacherInformation/:id"
              element={<TeacherInformation />}
            />
            <Route path="homepage/:type" element={<YogaList />} />
            <Route path="/ChatList" element={<ChatList socket={socket} />} />
            <Route path="homepage/seeall" element={<SeeAllClass />} />
            <Route path="/filtermap" element={<FilterMap />} />
            <Route path="/filterlist" element={<FilterList />} />
            <Route path="/RegisterTestPage" element={<RegisterTestPage />} />
            <Route path="/UserInformation" element={<UserInformation />} />
            <Route
              path="/ChangePasswordWithProfile"
              element={<ChangePasswordWithProfile />}
            />
            <Route path="/Reservations" element={<Reservations />} />
            <Route path="/studio/addTeacher" element={<AddTeacher />} />
            <Route
              path="/studio/studioDetails/:id"
              element={<StudioDetails />}
            />
            <Route path="/studio/addReviews/:id" element={<AddReviews />} />
            <Route
              path="/studio/seeAllStudioClass/:id"
              element={<SeeAllStudioClass />}
            />
            <Route
              path="/studio/changeBusinessUserInformation/:id"
              element={<ChangeBusinessUserInformation />}
            />
            <Route path="/teacher/addReviews/:id" element={<AddReviews />} />

            <Route path="/class/addClassReviews/:id" element={<AddReviews />} />
            <Route path="/ConfirmPassword" element={<ConfirmPassword />} />
            <Route path="/SavedFollow" element={<SavedFollow />} />
            <Route path="/PaymentRecord" element={<PaymentRecord />} />
          </Route>
          <Route
            path="/ChatMessages/:userId"
            element={<ChatMessages socket={socket} />}
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
