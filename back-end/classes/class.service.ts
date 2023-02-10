import { Knex } from "knex";
import { MongoClient } from "mongodb";




export class ClassService {
    constructor(private knex: Knex, private mongoClient: MongoClient) { }
    async addClass(classInfo: {
        class_name: string;
        class_type: string;
        teacher_name: string;
        date: Date[];
        start_time: Date;
        end_time: Date;
        upper_limit: number;
        description: string;
        credits_needed: number;
        class_images: string;

    }, file: string, user_id: number) {
        const txn = await this.knex.transaction();

        try {


            let teacher_id = await txn.select("id").from("teachers")
                .where({ name: classInfo.teacher_name, studio_id: user_id })
            // console.log("teacher_id: ", teacher_id);
            let studio_id = await txn.select("id").from("studio")
                .where("business_user_id", user_id)
            // console.log(studio_id);

            let [{ id: class_id }] = await txn
                .insert({
                    name: classInfo.class_name,
                    type: classInfo.class_type,
                    start_time: new Date(classInfo.start_time),
                    end_time: new Date(classInfo.end_time),
                    upper_limit: classInfo.upper_limit,
                    teacher_id: teacher_id[0].id,
                    description: classInfo.description,
                    credits_needed: classInfo.credits_needed,
                    create_date: new Date(),
                    studio_id: studio_id[0].id
                })
                .into("classes")
                .returning('id');

            // console.log("classInfo", classInfo);

            let dateArray = JSON.parse(classInfo.date as any)

            let insertArray = dateArray.map((v: string) => {
                return {
                    state: "open",
                    classes_id: class_id,
                    date: new Date(v)
                }
            })


            let class_array = await txn.insert(insertArray)
                .into("classes_interval").returning('id')
            console.log(class_array);


            for (let id of class_array) {
                console.log('id', id);

                await txn.insert({ teachers_id: teacher_id[0].id, classes_id: id.id })
                    .into("teachers_class")
            }

            await txn
                .insert({
                    path: file,
                    class_id: class_id,
                })
                .into("images");
            await txn.commit();
            return { success: "Class created successfully!" };
        } catch (error) {
            await txn.rollback();
            console.log(error);
            console.log('HIH');

            return { messages: error };
        }
    }
    async getUserBookClassState(classes_id: number, user_id: number) {
        try {
            let userID = await this.knex("user_classes_lesson")
                .select("user_id as user_id", "classes_id as classes_id").where("user_id", user_id).andWhere("classes_id", classes_id)
            if (userID.length > 0) {
                return { success: "User already booked this class" }
            }
            return
        } catch (error) {
            console.log(error);

            return error;
        }
    }
    async getStudentNameForClassInformation(classes_id: number, user_id: number) {
        try {
            let studio_id = await this.knex("studio").select("id").where("studio.business_user_id", user_id)
            console.log(studio_id);

            let student_name = await this.knex("user_classes_lesson")
                .select("users.first_name as first_name",
                    "users.last_name as last_name",
                    "users.id as id",
                    'classes_interval.date as class_date',
                    'classes.end_time as class_end_time',
                    "user_classes_lesson.attendance as attendance",


                )
                .join("users", "users.id", "=", "user_classes_lesson.user_id")
                .join("classes_interval", "classes_interval.id", "=", "user_classes_lesson.classes_id")
                .join("classes", "classes.id", "=", "classes_interval.classes_id")
                .join("studio", "studio.id", "=", "classes.studio_id")
                .where({
                    "user_classes_lesson.classes_id": classes_id,
                    "studio.id": studio_id[0].id
                })
            console.log(student_name);

            return student_name


        } catch (error) {
            console.log(error);

            return error;
        }
    }
    async tickAttendancePresent(user_id: number, classes_id: number, student_id: number) {

        try {
            console.log({ classes_id, student_id });

            await this.knex("user_classes_lesson")
                .where({ "user_id": student_id, "classes_id": classes_id })
                .update({ attendance: "Present" })
            console.log("Inserted successfully");
            return { success: "Student's attendance record is updated" }
        } catch (error) {
            console.log(error);
            return error;
        }
    }
    async tickAttendanceLate(user_id: number, classes_id: number, student_id: number) {

        try {
            await this.knex("user_classes_lesson")
                .where({ "user_id": student_id, "classes_id": classes_id })
                .update({ attendance: "Late" })
            console.log("Inserted successfully");
            return { success: "Student's attendance record is updated" }
        } catch (error) {
            console.log(error);
            return error;
        }
    }
    async tickAttendanceAbsent(user_id: number, classes_id: number, student_id: number) {

        try {
            await this.knex("user_classes_lesson")
                .where({ "user_id": student_id, "classes_id": classes_id })
                .update({ attendance: "Absent" })
            console.log("Inserted successfully");
            return { success: "Student's attendance record is updated" }
        } catch (error) {
            console.log(error);
            return error;
        }
    }

    async getClassInformation(classes_id: number) {
        try {
            let resData = await this.knex("classes_interval")
                .select(
                    "studio.address as address",
                    "classes_interval.date as date",
                    "classes.name as name",
                    "classes.type as type",
                    "classes.start_time as start_time",
                    "classes.end_time as end_time",
                    "classes.upper_limit as upper_limit",
                    "classes.credits_needed as credits_needed",
                    "classes.description as description",
                    "teachers.name as teacher_name",
                    "studio.name as studio_name",
                    "studio.id as studio_id",
                    "teachers.id as teacher_id"

                )
                .join("classes", "classes.id", "=", "classes_interval.classes_id")
                .join("studio", "studio.id", "=", "classes.studio_id")

                .leftJoin("teachers", "teachers.id", "=", "classes.teacher_id")
                .where("classes_interval.id", classes_id);

            console.log("resData", resData);



            for (let [i, _] of resData.entries()) {
                let imagesArr = await this.knex("images")
                    .select("*")
                    .where({ class_id: classes_id });

                resData[i].imagesList = imagesArr;
            }
            const start = new Date(resData[0].start_time);
            const end = new Date(resData[0].end_time);

            const durationInMs = end.getTime() - start.getTime();
            let duration = new Date(durationInMs);
            const hours = duration.getUTCHours();
            const minutes = duration.getUTCMinutes();
            let newduration = `${hours} hours, ${minutes} minutes`

            return { resData, newduration };
        } catch (error) {
            console.log(error);

            return error;
        }
    }
    async updateClassStatus(classes_id: number) {
        try {
            let classStudentNumber = await this.knex("user_classes_lesson")
                .count("user_id")
                .where("classes_id", classes_id)
            let upper_limit = await this.knex("classes_interval")
                .join("classes", "classes.id", "=", "classes_interval.classes_id")
                .select("classes.upper_limit")
            if (classStudentNumber >= upper_limit) {
                await this.knex("classes_interval").where("classes_id", classes_id)
                    .update({ state: "full" })
            }
            return { success: 'class is full' }
        } catch (error) {
            return { messages: error };
        }

    }
    async reserveClass(user_id: number, classes_id: number) {
        const txn = await this.knex.transaction();
        console.log("classes_id:", classes_id);
        const date = new Date();
        let month: any = date.getMonth() + 1;
        let year: any = date.getFullYear();
        let day: any = date.getDate();
        let hours: any = date.getHours();
        let minutes: any = date.getMinutes();
        let seconds: any = date.getSeconds();
        let milliseconds: any = date.getMilliseconds();

        if (year <= 9) {
            year = `0${year}`;
        }

        if (month < 10) {
            month = `0${month}`;
        }

        if (day < 10) {
            day = `0${day}`;
        }

        if (hours < 10) {
            hours = `0${hours}`;
        }

        if (minutes < 10) {
            minutes = `0${minutes}`;
        }

        if (seconds < 10) {
            seconds = `0${seconds}`;
        }

        let formattedDate = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}Z`;
        try {

            let userCredit = await txn.select("credit").from("users").where("id", user_id)
            console.log("usercredit:", userCredit);

            let classStudentNumber = await txn("user_classes_lesson")
                .count("user_id")
                .where("classes_id", classes_id)
                .groupBy('user_id')
            // console.log("class student number:", classStudentNumber);
            let upper_limit = await txn("classes_interval")
                .join("classes", "classes.id", "=", "classes_interval.classes_id")
                .where("classes_interval.classes_id", classes_id)
                .select("classes.upper_limit")
            // console.log("class upper limit:", upper_limit[0].upper_limit);

            let credits_needed = await txn("classes_interval")
                .join("classes", "classes.id", "=", "classes_interval.classes_id")
                .where("classes_interval.classes_id", classes_id)
                .select("classes.credits_needed")

            if (classStudentNumber[0].count < upper_limit[0].upper_limit && credits_needed[0].credits_needed < userCredit[0].credit) {
                await this.mongoClient
                    .db("OnTheMat")
                    .collection("credit_record")
                    .insertOne({ user_id: user_id, create_time: formattedDate, class_id: classes_id, credit: credits_needed[0].credits_needed, status: "minusCredit" });

                await this.knex.raw(
                /* sql */ `
          update users
          set credit = credit - ?
          where id = ?
          `,
                    [credits_needed[0].credits_needed, user_id]
                );
                let result = await txn.insert({
                    user_id: user_id,
                    classes_id: classes_id
                }).into("user_classes_lesson")
                await txn.commit();
                this.updateClassStatus
                return { result, success: "Class reserved successfully!" };
            }
            if (credits_needed[0].credits_needed > userCredit[0].credit) {

                return { messages: "You do not have sufficient credits for this class, please buy more credits." }
            }
            return { messages: "Not Successful" }
        }


        catch (error) {
            await txn.rollback();
            console.log(error);

            return { messages: error };
        }
    }
    async addReviews(user_id: number, classes_id: number, rating: number, comment: string) {
        try {
            await this.knex.insert({ rating: rating, comment: comment, class_id: classes_id, user_id: user_id })
                .into("class_reviews")
            return { success: "Reviews added successfully!" }
        } catch (error) {
            console.log(error);

            return { messages: error };
        }
    }
}
