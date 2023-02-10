import { HomeService } from "./home.service";
import express from "express";

import { HomeController } from "./home.controller";
import { knex } from "../db";

export const homeRouter = express.Router();
let homeService = new HomeService(knex);

let homeController = new HomeController(homeService);

homeRouter.get("/homepage/upcomingcardinfo", homeController.upcomingCardInfo);

homeRouter.get("/homepage/nearestcardinfo", homeController.nearestCardInfo);

homeRouter.get("/homepage/seeallclass", homeController.seeAllClassInfo);

homeRouter.get("/filterlist", homeController.filterList);

homeRouter.get("/filtermap", homeController.filterMap);

homeRouter.get("/homepage/userXY/:lat/:lng", homeController.nearestCardInfo);

homeRouter.get("/homepage/:type", homeController.typeOfYoga);
