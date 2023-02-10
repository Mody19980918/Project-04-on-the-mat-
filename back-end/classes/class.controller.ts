import express from "express";
import { form, formParse, toArray } from "../upload/local.upload.service";
import { decodeBearerJWT } from "../JWT";
import { ClassService } from "./class.service";


type ClassInfo =
    {
        class_name: string,
        class_type: string,
        teacher_name: string,
        date: Date[],
        start_time: Date,
        end_time: Date,
        upper_limit: number,
        description: string,
        credits_needed: number,
        class_images: string,
    };
export class ClassController {
    constructor(private classService: ClassService) { }

    addClass = async (req: express.Request, res: express.Response) => {
        try {


            let formData = await formParse(form, req)
            let classInfo: ClassInfo = formData.fields as any
            const fileArr = toArray(formData.files as any);


            let file = fileArr[0].class_images.newFilename;
            // console.log({ res: formData.fields });
            console.log("classinfo: ", classInfo);

            let payload = decodeBearerJWT(req)

            if (!classInfo.class_name) {
                return res.status(400).json({ messages: "Class name cannot be void" });
            }

            if (!classInfo.class_type) {
                return res.status(400).json({ messages: "Class type cannot be void" });
            }

            if (!classInfo.teacher_name) {
                return res.status(400).json({ messages: "Teacher name cannot be void" });
            }
            if (!classInfo.date) {
                return res.status(400).json({ messages: "Class date cannot be void" });
            }
            if (!classInfo.start_time) {
                return res.status(400).json({ messages: "Start time cannot be void" });
            }
            if (!classInfo.end_time) {
                return res.status(400).json({ messages: "End time cannot be void" });
            }
            if (!classInfo.upper_limit) {
                return res.status(400).json({ messages: "Class size cannot be void" });
            }
            if (!classInfo.description) {
                return res.status(400).json({ messages: "Description cannot be void" });
            }
            if (!file) {
                return res.status(400).json({ messages: "Class images cannot be void" });
            }


            if (classInfo.start_time > classInfo.end_time) {
                return res.status(400).json({
                    messages: "Start time cannot be after end time"
                })
            }
            console.log(classInfo);
            console.log("payload.id:", payload);


            let result = await this.classService.addClass(classInfo, file, payload.id)
            console.log('result', result);

            if (result.messages) {
                return res.status(400).json(result);
            }
            return res.status(200).json(result);
        } catch (error) {
            console.log(error);

            return { error };
        }
    };
    getClassInformation = async (req: express.Request, res: express.Response) => {
        try {

            console.log("getClassInformation ID")
            const { id } = req.params;
            let result = await this.classService.getClassInformation(+id)
            return res.status(200).json(result);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ messages: error });
        }
    }
    reserveClass = async (req: express.Request, res: express.Response) => {
        try {
            let payload = decodeBearerJWT(req)
            const { id } = req.params;
            let result = await this.classService.reserveClass(payload.id, +id)
            console.log(result);

            if (result.messages) {

                return res.status(400).json(result);
            }
            return res.status(200).json(result);

        } catch (error) {
            console.log(error);

            return { error };
        }
    }
    addReviews = async (req: express.Request, res: express.Response) => {
        try {
            let payload = decodeBearerJWT(req)
            const { id } = req.params;
            let { comment, rating } = req.body
            let result = await this.classService.addReviews(payload.id, +id, rating, comment)
            if (result.messages) {
                return res.status(400).json(result);
            }
            return res.status(200).json(result);
        } catch (error) {
            console.log(error);

            return { error };
        }
    }
    getStudentNameForClassInformation = async (req: express.Request, res: express.Response) => {
        try {
            const { id } = req.params;
            let payload = decodeBearerJWT(req)
            let user_id = payload.id
            let result = await this.classService.getStudentNameForClassInformation(+id, +user_id)
            return res.status(200).json(result);

        } catch (error) {
            console.log(error);

            return { error };
        }
    }

    getUserBookClassState = async (req: express.Request, res: express.Response) => {
        try {
            const { id } = req.params;
            let payload = decodeBearerJWT(req)
            let user_id = payload.id
            let result = await this.classService.getUserBookClassState(+id, +user_id)
            return res.status(200).json(result);

        } catch (error) {
            console.log(error);

            return { error };
        }
    }
    tickAttendancePresent = async (req: express.Request, res: express.Response) => {
        try {
            let payload = decodeBearerJWT(req)
            const { id } = req.params;
            const { student_id } = req.body;
            console.log(student_id);

            let result = await this.classService.tickAttendancePresent(payload.id, +id, +student_id)
            // if (result.messages) {
            //     return res.status(400).json(result);
            // }
            console.log(result);

            return res.status(200).json(result);

        } catch (error) {
            console.log(error);

            return { error };
        }
    }
    tickAttendanceLate = async (req: express.Request, res: express.Response) => {
        try {
            let payload = decodeBearerJWT(req)
            const { id } = req.params;
            const { student_id } = req.body;
            let result = await this.classService.tickAttendanceLate(payload.id, +id, +student_id)
            // if (result.messages) {
            //     return res.status(400).json(result);
            // }
            return res.status(200).json(result);
        } catch (error) {
            console.log(error);

            return { error };
        }
    }
    tickAttendanceAbsent = async (req: express.Request, res: express.Response) => {
        try {
            let payload = decodeBearerJWT(req)
            const { id } = req.params;
            const { student_id } = req.body;
            let result = await this.classService.tickAttendanceAbsent(payload.id, +id, +student_id)
            // if (result.messages) {
            //     return res.status(400).json(result);
            // }
            return res.status(200).json(result);
        } catch (error) {
            console.log(error);

            return { error };
        }
    }

}