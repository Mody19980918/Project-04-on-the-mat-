import { ChatRecordService } from "./chatRecord.service";
import express from "express";

import { ChatRecordController } from "./chatRecord.controller";
import { knex } from "../db";

export const chatRecordRouter = express.Router();

let chatRecordService = new ChatRecordService(knex);
let chatRecordController = new ChatRecordController(chatRecordService);

chatRecordRouter.get(
  "/socket/getChatRecord/:id",
  chatRecordController.getChatRecord
);

chatRecordRouter.get("/socket/getChatList", chatRecordController.getChatList);

chatRecordRouter.get(
  "/socket/getChatUnread",
  chatRecordController.getChatUnread
);

chatRecordRouter.get(
  "/socket/getCountOfUserUnread",
  chatRecordController.getCountOfUserUnread
);
