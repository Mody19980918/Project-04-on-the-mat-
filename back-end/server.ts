import cors from "cors";
import { studioRouter } from "./studio/studio";
import { userRouter } from "./user/user";
import { homeRouter } from "./home/home";
import dotenv from "dotenv";
dotenv.config();
import path from "path";
import express from "express";
import { print } from "listening-on";
import { classRouter } from "./classes/class";
import { superAdminRouter } from "./superAdmin/superAdmin";
// import { S3UploadService } from './upload/s3.uploads.service'
// import { UploadService } from './upload/upload.service'
import paypal from "paypal-rest-sdk";
// import { env } from "./env";
// import  { Knex } from "knex";
import { Server as SocketIO } from "socket.io";
import http from "http";

import { knex } from "./db";
import { chatRecordRouter } from "./chatRecord/chatRecord";
import { searchRouter } from "./search/search";
import { teacherRouter } from "./teacher/teacher";

export const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

// const uploadService: UploadService =
//   env.NODE_ENV === 'production'
//     ? new S3UploadService()
//     : new LocalUploadService('uploads')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

paypal.configure({
  mode: "sandbox",
  client_id: process.env.PAYPAL_CLIENT!,
  client_secret: process.env.PAYPAL_SECRET!,
});

let app = express();
app.use(cors());

const server = new http.Server(app);
const io = new SocketIO(server, {
  cors: {},
});

io.on("connection", function (socket) {
  console.log(`User Connected ${socket.id}`);

  socket.on("todo:read", readTodo);

  function readTodo() {}

  socket.on("join_room", async (data) => {
    console.log("JOINED ROOM", data);
    // const a = await knex.select("*").from("");
    socket.join(data); // self-user-id
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });

  socket.on("send_message", async (data) => {
    console.log("RECIVED", data);
    console.log(data);

    let chat_record_id = await knex
      .insert({
        sender_id: data.from,
        receiver_id: data.to,
        messages: data.text,
        read_status: false,
        receive_status: false,
      })
      .into("chat_record")
      .returning("id");
    // who
    io.to(data.to).emit(
      "receive_message",

      {
        id: chat_record_id[0].id,
        text: data.text,
        position: data.position,
        title: data.title,
        sender_username: data.sender_username,
        date: new Date(),
      }
    );
  });
});
// console.log(defaultApp);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(userRouter);
app.use(classRouter);
app.use(studioRouter);
app.use(superAdminRouter);
app.use(homeRouter);
app.use(chatRecordRouter);
app.use(searchRouter);
app.use(teacherRouter);
app.use(express.static(path.join(__dirname, "uploads")));
app.use(express.static(path.join(__dirname, "dist")));
app.use((req, res) => {
  res.status(404);
  res.sendFile(path.resolve("public", "404.html"));
});

let port = 8080;
server.listen(port, () => {
  print(port);
});
