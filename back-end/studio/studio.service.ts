import { Knex } from "knex";

export class StudioService {
  constructor(private knex: Knex) {}
  async getTeacherName(users_id: number) {
    try {
      let teacherName = await this.knex.raw(
        `select teachers.name from studio join users on studio.business_user_id = users.id join teachers on studio.id = teachers.studio_id where users.id=${users_id}`
      );
      console.log(teacherName.rows);

      return teacherName.rows;
    } catch (error) {
      console.log(error);
      return { error };
    }
  }
  async getStudioDetails(id: number) {
    try {
      console.log(id);

      let resData = await this.knex("studio")
        .leftJoin("studio_reviews", "studio_reviews.studio_id", "studio.id")
        .select(
          "studio.name" as "name",
          "studio.address" as "address",
          "studio.description" as "description",
          "studio.phone_number" as "phone_number",
          "studio.email" as "email",
          "studio.positions" as "positions"
        )
        .count("studio_reviews.comment as comment")
        .avg("studio_reviews.rating as rating")
        .where("studio.id", id)
        .groupBy("studio.id");

      console.log("resData", resData);

      for (let [i, _] of resData.entries()) {
        let imagesArr = await this.knex("images")
          .select("*")
          .where({ studio_id: id });

        resData[i].imagesList = imagesArr;
      }
      // let allComment = await this.knex("studio_reviews").select("comment").where("studio_id", id)
      // console.log(allComment);

      // let allRatings = await this.knex("studio_reviews").select("rating").where("studio_id", id)
      // console.log(allRatings);

      // console.log([...resData, ...allComment, ...allRatings]);

      return resData;
    } catch (error) {
      console.log(error);

      return error;
    }
  }
  async seeAllClassInfo(studio_id: number) {
    console.log({ studio_id });

    try {
      let resData = await this.knex("classes_interval")
        .select(
          "classes.*",
          "studio.address",
          "classes_interval.date as date",
          "classes_interval.id as class_id"
        )
        .join("classes", "classes.id", "=", "classes_interval.classes_id")
        .join("studio", "classes.studio_id", "=", "studio.id")
        .where("classes.studio_id", studio_id)
        .orderBy("classes.start_time");

      for (let [i, v] of resData.entries()) {
        let imagesArr = await this.knex("images")
          .select("*")
          .where({ class_id: v.id });

        resData[i].imagesList = imagesArr;
      }

      return resData;
    } catch (error) {
      console.log(error);
      return error;
    }
  }
  async addTeacher(user_id: number, name: string, descriptions: string) {
    try {
      let studio_id = await this.knex("studio")
        .select("studio.id")
        .join("users", "users.id", "=", "studio.business_user_id")
        .where("studio.business_user_id", user_id);
      await this.knex
        .insert({
          name: name,
          descriptions: descriptions,
          studio_id: studio_id[0].id,
        })
        .into("teachers");
      return { success: "Added new teacher successfully!" };
    } catch (error) {
      console.log(error);
      return { messages: error };
    }
  }
  async getStudioImage(user_id: number) {
    try {
      let studio_id = await this.knex
        .select("studio.id")
        .from("studio")
        .join("users", "users.id", "studio.business_user_id")
        .where("users.id", user_id);
      console.log(studio_id);

      let res = await this.knex
        .select("images.path")
        .from("studio")
        .where("studio.id", studio_id[0].id)
        .join("classes", "classes.studio_id", "studio.id")
        .join("images", "images.studio_id", "classes.id");
      // console.log("res:", res);
      // console.log('Hello', res[0]);
      console.log(res);

      return res;
    } catch (error) {
      console.log(error);
      return error;
    }
  }
  async getBusinessUserInformation(user_id: number) {
    try {
      let res = await this.knex
        .select(
          "studio.name as name",
          "studio.address as address",
          "studio.phone_number as phone_number",
          "studio.description as description"
        )
        .from("studio")
        .join("users", "users.id", "studio.business_user_id")
        .where("users.id", user_id);
      let studio_id = await this.knex
        .select("studio.id")
        .from("studio")
        .join("users", "users.id", "studio.business_user_id")
        .where("users.id", user_id);

      for (let [i, _] of res.entries()) {
        let imagesArr = await this.knex("images")
          .select("*")
          .where({ studio_id: studio_id[0].id });

        res[i].imagesList = imagesArr;

        return res;
      }
    } catch (error) {
      console.log(error);
      return error;
    }
  }
  async changeBusinessUserInformation(
    businessUserInfo: {
      name: string;
      address: string;
      phone_number: string;
      description: string;
    },
    file: string,
    user_id: string
  ) {
    try {
      let userExist = await this.knex
        .select("id")
        .from("users")
        .where("id", user_id);

      if (userExist.length == 0) {
        return { messages: "user does not exist" };
      }
      let studio_id = await this.knex
        .select("studio.id")
        .from("studio")
        .join("users", "users.id", "studio.business_user_id")
        .where("users.id", user_id);

      console.log(studio_id);

      await this.knex("studio")
        .update({
          name: businessUserInfo.name,
          address: businessUserInfo.address,
          phone_number: businessUserInfo.phone_number,
          description: businessUserInfo.description,
        })
        .where("studio.id", studio_id[0].id);
      let imageAlreadyExists = await this.knex
        .select("studio_id")
        .from("images")
        .where("studio_id", studio_id[0].id);
      if (imageAlreadyExists.length > 0) {
        await this.knex("images").update({
          path: file,
          studio_id: studio_id[0].id,
        });

        return { success: "Studio information has been changed successfully!" };
      }
      await this.knex
        .insert({
          path: file,
          studio_id: studio_id[0].id,
        })
        .into("images");

      return { success: "Studio information has been changed successfully!" };
    } catch (error) {
      console.log(error);
      return error;
    }
  }
  async getStudioInformationInFollowPage(id: number) {
    try {
      console.log(id);

      let res = await this.knex
        .select(
          "studio.id as studio_id",
          "studio.name as studio_name",
          "studio.address as studio_address",
          "studio.district as studio_district"
        )
        .from("user_bookmark")
        .join("studio", "studio.id", "user_bookmark.studio_id")
        .where("user_bookmark.user_id", id);
      console.log(res);
      return res;
    } catch (error) {
      console.log(error);
      return error;
    }
  }
  async unFollowStudio(id: number, studio_id: number) {
    try {
      await this.knex("user_bookmark")
        .where("studio_id", studio_id)
        .andWhere("user_id", id)
        .del();
      return;
    } catch (error) {
      console.log(error);
      return error;
    }
  }
  async followTeacher(id: number, studio_id: number) {
    try {
      await this.knex
        .insert({ user_id: id, studio_id: studio_id })
        .into("user_bookmark");
      return;
    } catch (error) {
      console.log(error);
      return error;
    }
  }
  async getFollowTeacherStatus(studio_id: number, id: number) {
    try {
      let result = await this.knex
        .select("id")
        .from("user_bookmark")
        .where("studio_id", studio_id)
        .andWhere("user_id", id);
      console.log("result", result);
      if (result.length == 0) {
        return { message: "User isn't follow this studio" };
      }
      return { success: "User is follow this studio" };
    } catch (error) {
      return error;
    }
  }
  async getStudioIdInProfile(user_id: number) {
    try {
      console.log("HIHIs");

      let studio_id = await this.knex
        .select("studio.id as id")
        .from("users")
        .join("studio", "studio.business_user_id", "users.id")
        .where("users.id", user_id);
      return studio_id;
    } catch (error) {
      console.log(error);
      return error;
    }
  }
}
