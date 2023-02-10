import express from "express";
import { knex } from "../db";
import { TeacherController } from "./teacher.controller";
import { TeacherService } from "./teacher.service";

export const teacherRouter = express.Router();

let teacherService = new TeacherService(knex);
let teacherController = new TeacherController(teacherService);

teacherRouter.get(
  "/teacher/getTeacherInformation/:id",
  teacherController.getTeacherInformation
);

teacherRouter.get(
  "/teacher/getTeacherReview/:id",
  teacherController.getTeacherReview
);

teacherRouter.get("/teacher/getUserId/:id", teacherController.getUserId);

teacherRouter.get(
  "/teacher/getTeacherData/:id",
  teacherController.getTeacherData
);

teacherRouter.get(
  "/teacher/getTeacherType/:id",
  teacherController.getTeacherType
);

teacherRouter.get(
  "/teacher/getStudioName/:id",
  teacherController.getStudioName
);

teacherRouter.get(
  "/teacher/getFollowTeacherStatus/:id",
  teacherController.getFollowTeacherStatus
);

teacherRouter.get(
  "/teacher/getTeacherInformationInFollowPage/",
  teacherController.getTeacherInformationInFollowPage
);

teacherRouter.get(
  "/teacher/getTeacherTypeInFollowPage/",
  teacherController.getTeacherTypeInFollowPage
);

teacherRouter.post("/teacher/followTeacher", teacherController.followTeacher);

teacherRouter.delete(
  "/teacher/unFollowTeacher",
  teacherController.unFollowTeacher
);
