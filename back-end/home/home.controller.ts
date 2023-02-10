import express from "express";
import { decodeBearerJWT } from "../JWT";
import { HomeService } from "./home.service";

export class HomeController {
  constructor(private homeService: HomeService) {}
  //
  //
  //
  upcomingCardInfo = async (req: express.Request, res: express.Response) => {
    try {
      let payload = decodeBearerJWT(req);
      let classes_id = payload.id;
      let result = await this.homeService.upcomingCardInfo(classes_id);

      return res.status(200).json(result);
    } catch (error) {
      return error;
    }
  };

  typeOfYoga = async (req: express.Request, res: express.Response) => {
    try {
      let class_type = req.params.type;
      let result = await this.homeService.typeOfYoga(class_type);

      return res.status(200).json(result);
    } catch (error) {
      return error;
    }
  };
  seeAllClassInfo = async (req: express.Request, res: express.Response) => {
    try {
      let result = await this.homeService.seeAllClassInfo();

      return res.status(200).json(result);
    } catch (error) {
      return error;
    }
  };
  nearestCardInfo = async (req: express.Request, res: express.Response) => {
    try {
      let userX = req.params.lat;
      let userY = req.params.lng;

      console.log(req.params);

      let result = await this.homeService.nearestCardInfo([+userX, +userY]);

      return res.status(200).json(result);
    } catch (error) {
      return error;
    }
  };

  filterList = async (req: express.Request, res: express.Response) => {
    try {
      console.log("query:", req.query);

      let result = await this.homeService.filterList(req.query);

      return res.status(200).json(result);
    } catch (error) {
      return error;
    }
  };

  filterMap = async (req: express.Request, res: express.Response) => {
    try {
      let result = await this.homeService.filterMap();

      return res.status(200).json(result);
    } catch (error) {
      return error;
    }
  };
}
