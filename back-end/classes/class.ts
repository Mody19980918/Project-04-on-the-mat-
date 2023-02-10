import { mongoClient } from './../mongo';
import { ClassService } from './class.service';
import express from 'express';
import { ClassController } from './class.controller';
import { knex } from "../db"

export const classRouter = express.Router();
let classService = new ClassService(knex, mongoClient);
let classController = new ClassController(classService);

classRouter.post("/class/addClass", classController.addClass);
classRouter.post("/class/reserveClass/:id", classController.reserveClass);
classRouter.get("/class/classDetails/:id", classController.getClassInformation);
classRouter.post("/class/addReviews/:id", classController.addReviews);
classRouter.get("/class/getStudentNameForClassInformation/:id", classController.getStudentNameForClassInformation);
classRouter.post("/class/tickAttendancePresent/:id", classController.tickAttendancePresent);
classRouter.post("/class/tickAttendanceLate/:id", classController.tickAttendanceLate);
classRouter.post("/class/tickAttendanceAbsent/:id", classController.tickAttendanceAbsent);
classRouter.get("/class/getUserBookClassState/:id", classController.getUserBookClassState);

