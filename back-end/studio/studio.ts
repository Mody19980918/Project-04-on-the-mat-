import { StudioService } from "./studio.service";
import express from "express";
import { StudioController } from "./studio.controller";
import { knex } from "../db";

export const studioRouter = express.Router();
let studioService = new StudioService(knex);
let studioController = new StudioController(studioService);

studioRouter.get("/studio/getTeacherName", studioController.getTeacherName);
studioRouter.get(
  "/studio/studioDetails/:id",
  studioController.getStudioDetails
);
studioRouter.get(
  "/studio/seeAllStudioClass/:studio_id",
  studioController.seeAllClassInfo
);
studioRouter.post("/studio/addTeacher", studioController.AddTeacher);
studioRouter.post(
  "/studio/changeBusinessUserInformation/:id",
  studioController.ChangeBusinessUserInformation
);
studioRouter.get(
  "/studio/getBusinessUserInformation/:id",
  studioController.getBusinessUserInformation
);
studioRouter.get("/studio/getStudioImage/:id", studioController.getStudioImage);
studioRouter.get(
  "/studio/getStudioInformationInFollowPage/",
  studioController.getStudioInformationInFollowPage
);
studioRouter.get(
  "/studio/getFollowStudioStatus/:id",
  studioController.getFollowStudioStatus
);
studioRouter.get(
  "/studio/getStudioIdInProfile/",
  studioController.getStudioIdInProfile
);
studioRouter.post("/studio/followTeacher/", studioController.followTeacher);

studioRouter.delete("/studio/unFollowStudio/", studioController.unFollowStudio);
