import express from "express";
import { decodeBearerJWT } from "../JWT";
import { form, formParse, toArray } from "../upload/local.upload.service";
import { StudioService } from "./studio.service";

type businessUserInfo = {
  name: string;
  address: string;
  phone_number: string;
  description: string;
};
export class StudioController {
  constructor(private studioService: StudioService) {}

  getTeacherName = async (req: express.Request, res: express.Response) => {
    let payload = decodeBearerJWT(req);
    let result = await this.studioService.getTeacherName(payload.id);
    console.log({ result });
    return res.json(result);
  };

  getStudioDetails = async (req: express.Request, res: express.Response) => {
    const { id } = req.params;
    let result = await this.studioService.getStudioDetails(+id);
    console.log(result);
    return res.status(200).json(result);
  };
  seeAllClassInfo = async (req: express.Request, res: express.Response) => {
    const { studio_id } = req.params;
    let result = await this.studioService.seeAllClassInfo(+studio_id);
    console.log({ result });
    return res.json(result);
  };

  AddTeacher = async (req: express.Request, res: express.Response) => {
    try {
      let payload = decodeBearerJWT(req);
      let { name, descriptions } = req.body;
      let result = await this.studioService.addTeacher(
        payload.id,
        name,
        descriptions
      );
      if (result.messages) {
        return res.status(400).json(result);
      }
      return res.status(200).json(result);
    } catch (error) {
      console.log(error);

      return { error };
    }
  };
  getStudioImage = async (req: express.Request, res: express.Response) => {
    try {
      let payload = decodeBearerJWT(req);
      let id = payload.id;
      let result = await this.studioService.getStudioImage(id);
      console.log("HIHI", result);

      return res.status(200).json(result);
    } catch (error) {
      console.log(error);
      return { error };
    }
  };
  getBusinessUserInformation = async (
    req: express.Request,
    res: express.Response
  ) => {
    try {
      let payload = decodeBearerJWT(req);
      let id = payload.id;
      let result = await this.studioService.getBusinessUserInformation(+id);
      return res.status(200).json(result);
    } catch (error) {
      console.log(error);
      return { error };
    }
  };
  ChangeBusinessUserInformation = async (
    req: express.Request,
    res: express.Response
  ) => {
    try {
      let formData = await formParse(form, req);
      let businessUserInfo: businessUserInfo = formData.fields as any;
      const fileArr = toArray(formData.files as any);
      let file = fileArr[0].path.newFilename;
      let payload = decodeBearerJWT(req);
      let user_id = payload.id;

      let result = await this.studioService.changeBusinessUserInformation(
        businessUserInfo,
        file,
        user_id
      );
      return res.status(200).json(result);
    } catch (error) {
      console.log(error);

      return { error };
    }
  };
  getStudioInformationInFollowPage = async (
    req: express.Request,
    res: express.Response
  ) => {
    try {
      let payload = decodeBearerJWT(req);
      let id = payload.id;
      let result = await this.studioService.getStudioInformationInFollowPage(
        +id
      );
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  };
  unFollowStudio = async (req: express.Request, res: express.Response) => {
    try {
      let payload = decodeBearerJWT(req);
      let id = payload.id;
      let { studio_id } = req.body;
      await this.studioService.unFollowStudio(+id, +studio_id);
      return res.status(200).json({ success: "UnFollow Successful!" });
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  };
  followTeacher = async (req: express.Request, res: express.Response) => {
    try {
      const { studio_id } = req.body;
      let payload = decodeBearerJWT(req);
      let id = payload.id;
      await this.studioService.followTeacher(+id, +studio_id);
      return res.status(200).json({ success: "Follow Successful!" });
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  };
  getFollowStudioStatus = async (
    req: express.Request,
    res: express.Response
  ) => {
    try {
      const { id } = req.params;
      let payload = decodeBearerJWT(req);
      let user_id = payload.id;
      let result = await this.studioService.getFollowTeacherStatus(
        +id,
        +user_id
      );
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  };
  getStudioIdInProfile = async (
    req: express.Request,
    res: express.Response
  ) => {
    try {
      console.log("HIHI");

      let payload = decodeBearerJWT(req);
      let user_id = payload.id;
      let result = await this.studioService.getStudioIdInProfile(+user_id);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  };
}
