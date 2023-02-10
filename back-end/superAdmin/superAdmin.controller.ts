import express from "express";
import { SuperAdminService } from "./superAdmin.service";
export class SuperAdminController {
  constructor(private superAdminService: SuperAdminService) {}
  getValidateStudioOrFreelance = async (
    req: express.Request,
    res: express.Response
  ) => {
    try {
      let result = await this.superAdminService.getValidateStudioOrFreelance();

      return res.status(200).json(result);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ messages: error });
    }
  };
  approvedStudioOrFreelanceStatus = async (
    req: express.Request,
    res: express.Response
  ) => {
    try {
      let { id } = req.body;
      let result = await this.superAdminService.approvedStudioOrFreelanceStatus(
        id
      );

      return res.status(200).json(result);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ messages: error });
    }
  };
  forbiddenStudioOrFreelanceStatus = async (
    req: express.Request,
    res: express.Response
  ) => {
    try {
      let { id, name, email, messages } = req.body;
      console.log("id:", id);

      let userInformation = { id, name, email, messages };

      let result =
        await this.superAdminService.forbiddenStudioOrFreelanceStatus(
          userInformation
        );
      if (result.messages) {
        return res.status(500).json(result);
      }
      return res.status(200).json(result);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ messages: error });
    }
  };
}
