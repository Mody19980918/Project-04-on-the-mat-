import express from "express";
import { SearchController } from "./search.controller";
import { knex } from "../db";
import { SearchService } from "./search.service";

export const searchRouter = express.Router();

let userService = new SearchService(knex);
let searchController = new SearchController(userService);

searchRouter.get(
  "/search/getTeacherInformation/:data",
  searchController.getTeacherInformation
);

searchRouter.get(
  "/search/getClassInformation/:data",
  searchController.getClassInformation
);

searchRouter.get(
  "/search/getStudioInformation/:data",
  searchController.getStudioInformation
);
