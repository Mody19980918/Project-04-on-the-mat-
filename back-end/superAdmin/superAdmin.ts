import { SuperAdminService } from "./superAdmin.service";
import express from "express";

import { SuperAdminController } from "./superAdmin.controller";
import { knex } from "../db";

export const superAdminRouter = express.Router();

let superAdminService = new SuperAdminService(knex);
let superAdminController = new SuperAdminController(superAdminService);

superAdminRouter.get(
  "/superAdmin/getValidateStudioOrFreelance",
  superAdminController.getValidateStudioOrFreelance
);

superAdminRouter.put(
  "/superAdmin/approvedStudioOrFreelanceStatus",
  superAdminController.approvedStudioOrFreelanceStatus
);

superAdminRouter.delete(
  "/superAdmin/forbiddenStudioOrFreelanceStatus",
  superAdminController.forbiddenStudioOrFreelanceStatus
);
