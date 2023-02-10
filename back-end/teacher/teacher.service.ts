import { Knex } from "knex";
import _ from "lodash";

export class TeacherService {
  constructor(private knex: Knex) {}
  async getTeacherInformation(id: number) {
    try {
      let year = new Date().getFullYear();
      let month: string | number = new Date().getMonth() + 1;
      if (month <= 9) {
        month = `0${month}`;
      }
      let day: string | number = new Date().getDate();
      if (day <= 9) {
        day = `0${day}`;
      }
      let nowDate = `${year}-${month}-${day}`;
      console.log(nowDate);

      let res = await this.knex
        .distinct()
        .select(
          "teachers.descriptions as description",
          "teachers.name as teacher_name",
          "classes.name as class_name",
          "classes.type as type",
          "teachers.name as teacher_name",
          "studio.name as studio_name",
          "images.path as path",
          "classes.start_time as time",
          "classes_interval.date as date",
          "classes_interval.id as class_id"
        )
        .from("teachers")
        .join("classes", "classes.teacher_id", "teachers.id")
        .join("studio", "studio.id", "classes.studio_id")
        .join("images", "images.class_id", "classes.id")
        .join("classes_interval", "classes_interval.classes_id", "classes.id")
        .where("teachers.id", id)
        .andWhere("classes_interval.date", ">", nowDate);
      return res;
    } catch (error) {
      console.log(error);

      return error;
    }
  }
  async getTeacherReview(id: number) {
    try {
      let res = await this.knex
        .select(
          "class_reviews.comment",
          "class_reviews.rating",
          "class_reviews.created_at",
          "users.first_name"
        )
        .from("teachers")
        .join("classes", "classes.teacher_id", "teachers.id")
        .join("class_reviews", "class_reviews.class_id", "classes.id")
        .join("users", "users.id", "class_reviews.user_id")
        .where("teachers.id", id);
      console.log(res);

      return res;
    } catch (error) {
      console.log(error);
      return error;
    }
  }
  async getUserId(id: number) {
    try {
      let res = await this.knex
        .select("users.id")
        .from("teachers")
        .join("studio", "studio.id", "teachers.studio_id")
        .join("users", "users.id", "studio.business_user_id")
        .where("teachers.id", id)
        .first();
      console.log(res);

      return res;
    } catch (error) {
      console.log(error);
      return error;
    }
  }
  async getTeacherData(id: number) {
    try {
      let res = await this.knex
        .distinct()
        .select(
          "teachers.name as teacher_name",
          "teachers.descriptions as descriptions",
          "users.id as business_user_id"
        )
        .from("teachers")
        .join("studio", "studio.id", "teachers.studio_id")
        .join("users", "users.id", "studio.business_user_id")
        .where("teachers.id", id);
      return res;
    } catch (error) {
      console.log(error);
      return error;
    }
  }
  async getTeacherType(id: number) {
    try {
      let res = await this.knex
        .distinct()
        .select("classes.type")
        .from("teachers")
        .join("classes", "classes.teacher_id", "teachers.id")
        .where("teachers.id", id);
      return res;
    } catch (error) {
      console.log(error);
      return error;
    }
  }
  async getStudioName(id: number) {
    try {
      let res = await this.knex
        .select("studio.name as studio_name")
        .from("teachers")
        .join("studio", "studio.id", "teachers.studio_id")
        .where("teachers.id", id);

      console.log(res);
      return res;
    } catch (error) {
      console.log(error);

      return error;
    }
  }
  async followTeacher(teacher_id: number, id: number) {
    console.log({ teacher_id: id });

    try {
      await this.knex.insert({ teacher_id, user_id: id }).into("user_bookmark");
      return;
    } catch (error) {
      console.log(error);
      return error;
    }
  }
  async getFollowTeacherStatus(teacher_id: number, id: number) {
    try {
      let res = await this.knex
        .select("id")
        .from("user_bookmark")
        .where("teacher_id", teacher_id)
        .andWhere("user_id", id);
      console.log("res", res);
      if (res.length == 0) {
        return { message: "User isn't follow this teacher" };
      }
      return { success: "User is follow this teacher" };
    } catch (error) {
      console.log(error);
      return error;
    }
  }
  async unFollowTeacher(teacher_id: number, id: number) {
    try {
      await this.knex("user_bookmark")
        .where("teacher_id", teacher_id)
        .andWhere("user_id", id)
        .del();
      return;
    } catch (error) {
      console.log(error);
      return error;
    }
  }
  async getTeacherInformationInFollowPage(id: number) {
    try {
      let res = await this.knex
        // .avg("class_reviews.rating as rating")
        .select(
          "teachers.name as teacher_name",
          "studio.name as studio_name",
          "teachers.id as teacher_id"
        )
        .from("user_bookmark")
        .join("teachers", "teachers.id", "user_bookmark.teacher_id")
        .join("studio", "studio.id", "teachers.studio_id")
        // .join("classes", "classes.teacher_id", "user_bookmark.teacher_id")
        // .leftJoin("class_reviews", "class_reviews.class_id", "classes.id")
        .where("user_bookmark.user_id", id)
        .groupBy("teachers.id")
        .groupBy("studio.id");
      console.log(res);

      return res;
    } catch (error) {
      console.log(error);
      return error;
    }
  }
  async getTeacherTypeInFollowPage(id: number) {
    try {
      let res = await this.knex
        .select("classes.type as type", "teachers.id as teacher_id")
        .from("user_bookmark")
        .join("classes", "classes.teacher_id", "user_bookmark.teacher_id")
        .join("teachers", "teachers.id", "user_bookmark.teacher_id")
        .where("user_bookmark.user_id", id);

      return res;
    } catch (error) {
      console.log(error);
      return error;
    }
  }
}
