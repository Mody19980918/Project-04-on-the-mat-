import { Knex } from "knex";

export class SearchService {
  constructor(private knex: Knex) {}
  async getClassInformation(data: string) {
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
      let result = await this.knex
        .distinct()
        .select(
          "classes.name as class_name",
          "classes.type as type",
          "teachers.name as teacher_name",
          "studio.name as studio_name",
          "images.path as path",
          "classes.start_time as time",
          "classes_interval.date as date",
          "classes_interval.id as class_id"
        )
        .from("classes")
        .join("studio", "studio.id", "classes.studio_id")
        .join("teachers", "teachers.id", "classes.teacher_id")
        .join("images", "images.class_id", "classes.id")
        .leftJoin(
          "classes_interval",
          "classes_interval.classes_id",
          "classes.id"
        )
        .where("classes.name", "ilike", `%${data}%`)
        .andWhere("classes_interval.date", ">", nowDate)
        .orderBy("classes_interval.date", "asc");

      return result;
    } catch (error) {
      console.log(error);
      return error;
    }
  }
  async getTeacherInformation(data: string) {
    try {
      let res = await this.knex
        .avg("class_reviews.rating as rating")
        .select("teachers.name", "teachers.descriptions", "teachers.id")
        .from("teachers")
        .leftJoin("classes", "classes.teacher_id", "teachers.id")
        .leftJoin("class_reviews", "class_reviews.class_id", "classes.id")
        .where("teachers.name", "ilike", `%${data}%`)
        .groupBy("teachers.id");
      return res;
    } catch (error) {
      console.log(error);
      return error;
    }
  }
  async getStudioInformation(data: string) {
    try {
      let res = await this.knex
        .select(
          "studio.id as id",
          "studio.name as name",
          "studio.address as address",
          "studio.description as description",
          "studio.phone_number as phone_number",
          "studio.email as email",
          "studio.district as district"
        )
        .from("studio")
        .where("studio.name", "ilike", `%${data}%`);
      return res;
    } catch (error) {
      console.log(error);
      return error;
    }
  }
}
