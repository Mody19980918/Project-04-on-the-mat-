import express from "express";
import { decodeBearerJWT } from "../JWT";
import { TeacherService } from "./teacher.service";

export class TeacherController {
  constructor(private teacherService: TeacherService) {}

  getTeacherInformation = async (
    req: express.Request,
    res: express.Response
  ) => {
    try {
      const { id } = req.params;
      let result = await this.teacherService.getTeacherInformation(+id);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  };
  getTeacherReview = async (req: express.Request, res: express.Response) => {
    try {
      const { id } = req.params;
      let result = await this.teacherService.getTeacherReview(+id);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  };
  getUserId = async (req: express.Request, res: express.Response) => {
    try {
      const { id } = req.params;
      let result = await this.teacherService.getUserId(+id);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  };
  getTeacherData = async (req: express.Request, res: express.Response) => {
    try {
      const { id } = req.params;
      let result = await this.teacherService.getTeacherData(+id);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  };
  getTeacherType = async (req: express.Request, res: express.Response) => {
    try {
      const { id } = req.params;
      let result = await this.teacherService.getTeacherType(+id);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  };
  getStudioName = async (req: express.Request, res: express.Response) => {
    try {
      const { id } = req.params;
      let result = await this.teacherService.getStudioName(+id);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  };
  followTeacher = async (req: express.Request, res: express.Response) => {
    try {
      const { teacher_id } = req.body;

      let payload = decodeBearerJWT(req);
      let id = payload.id;
      await this.teacherService.followTeacher(+teacher_id, +id);
      return res.status(200).json({ success: "Follow Successful!" });
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  };
  unFollowTeacher = async (req: express.Request, res: express.Response) => {
    try {
      const { teacher_id } = req.body;
      let payload = decodeBearerJWT(req);
      let id = payload.id;
      await this.teacherService.unFollowTeacher(+teacher_id, +id);
      return res.status(200).json({ success: "UnFollow Successful!" });
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  };
  getFollowTeacherStatus = async (
    req: express.Request,
    res: express.Response
  ) => {
    try {
      let payload = decodeBearerJWT(req);
      let user_id = payload.id;
      const { id } = req.params;
      let result = await this.teacherService.getFollowTeacherStatus(
        +id,
        +user_id
      );

      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  };
  getTeacherInformationInFollowPage = async (
    req: express.Request,
    res: express.Response
  ) => {
    try {
      let payload = decodeBearerJWT(req);
      let user_id = payload.id;
      let result = await this.teacherService.getTeacherInformationInFollowPage(
        +user_id
      );
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  };
  getTeacherTypeInFollowPage = async (
    req: express.Request,
    res: express.Response
  ) => {
    try {
      let payload = decodeBearerJWT(req);
      let user_id = payload.id;
      let result = await this.teacherService.getTeacherTypeInFollowPage(
        +user_id
      );
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  };
}
