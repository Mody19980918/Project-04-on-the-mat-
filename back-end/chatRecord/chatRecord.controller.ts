import express from "express";

import { decodeBearerJWT } from "../JWT";
import { ChatRecordService } from "./chatRecord.service";

export class ChatRecordController {
  constructor(private chatRecordService: ChatRecordService) {}

  getChatRecord = async (req: express.Request, res: express.Response) => {
    try {
      let { id } = req.params;
      let payload = decodeBearerJWT(req);
      let owner_id = payload.id;
      let result = await this.chatRecordService.getChatRecord(owner_id, id);
      return res.status(200).json(result);
    } catch (err) {
      return res.status(500).json({ message: err });
    }
  };

  getChatList = async (req: express.Request, res: express.Response) => {
    try {
      let payload = decodeBearerJWT(req);
      let id = payload.id;
      let result = await this.chatRecordService.getChatList(id);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  };
  getChatUnread = async (req: express.Request, res: express.Response) => {
    try {
      let payload = decodeBearerJWT(req);
      let user_id = payload.id;
      let result = await this.chatRecordService.getChatUnread(+user_id);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  };
  getCountOfUserUnread = async (
    req: express.Request,
    res: express.Response
  ) => {
    try {
      let payload = decodeBearerJWT(req);
      console.log("payload", payload);

      let user_id = payload.id;
      console.log("user_id", user_id);

      let result = await this.chatRecordService.getCountOfUserUnread(+user_id);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  };
}
