import { UserService } from "./user.service";
import express from "express";

import { UserController } from "./user.controller";
import { knex } from "../db";
import { mongoClient } from "../mongo";

export const userRouter = express.Router();

let userService = new UserService(knex, mongoClient);
let userController = new UserController(userService);

userRouter.get("/user/getUserInformation", userController.getUserInformation);

userRouter.get("/user/comment", userController.getComment);

userRouter.get("/user/test", userController.get);

userRouter.get(
  "/user/resendVerificationEmail/:id",
  userController.resendVerificationEmail
);

userRouter.get("/user/getUsername/:token", userController.getUsername);

userRouter.get("/user/GetUserCredit", userController.getUserCredit);

userRouter.get(
  "/user/getReceiveUsername/:id",
  userController.getReceiveUsername
);

userRouter.get("/user/getOwnerName/:id", userController.getOwnerName);

userRouter.get(
  "/user/getUserInformationInProfile/",
  userController.getUserInformationInProfile
);

userRouter.get(
  "/user/getUserInformationInChangeUserInformation/",
  userController.getUserInformationInChangeUserInformation
);
userRouter.get(
  "/user/getUsernameInProfile/",
  userController.getUsernameInProfile
);

userRouter.get("/user/getUpcomingClass", userController.getUpcomingClass);

userRouter.get("/user/getPassingClass", userController.getPassingClass);

userRouter.get(
  "/user/navigateGoogleUserToInsertInformation/:id",
  userController.navigateGoogleUserToInsertInformation
);
userRouter.get("/user/getAddCreditRecord/", userController.getAddCreditRecord);

userRouter.get("/user/getMinusCredit/", userController.getMinusCredit);

userRouter.post(
  "/user/SendInformationOfYogaType",
  userController.sendInformationOfYogaType
);

userRouter.post(
  "/user/ConfirmVerification/:id",
  userController.confirmVerification
);

userRouter.post("/user/login", userController.login);

userRouter.post("/user/ConfirmEmail", userController.confirmEmail);

userRouter.post("/user/googlelogin", userController.googleLogin);

userRouter.post("/user/register", userController.register);

userRouter.post("/user/submitcomment", userController.submitComment);

userRouter.post(
  "/user/changeuserinformation",
  userController.changeUserInformation
);

userRouter.post("/user/businessregister", userController.businessRegister);

userRouter.post("/user/ChangePassword", userController.changePassword);

userRouter.post("/user/CheckOut/:id", userController.checkOut);

userRouter.post(
  "/user/sendChangedPasswordInProfile",
  userController.sendChangedPasswordInProfile
);

userRouter.post(
  "/user/sendConfirmPassword",
  userController.sendConfirmPassword
);

userRouter.put(
  "/user/changeUserInformationInChangeUserInformation",
  userController.changeUserInformationInChangeUserInformation
);
userRouter.put(
  "/user/updateUserInformationWithGoogleLogin",
  userController.changeUserInformationInChangeUserInformation
);
