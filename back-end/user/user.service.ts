import { Knex } from "knex";
import { MongoClient } from "mongodb";

import { checkPassword, hashPassword } from "../hash";
import { encodedJWT, JWTPayload, JWTPayloadWithExpire } from "../JWT";
import { admin } from "../server";
import { createClient } from "redis";
import { createTransport } from "nodemailer";
import { env } from "../env";
// import { createTransport } from "nodemailer";
type UserExist = {
  email: string;
  verification_status: string;
};
export type UserInformation = {
  first_name: string;
  last_name: string;
  business_user_phone_number: string;
  studio_name: string;
  business_user_email: string;
  password: string;
  address: string;
  studio_email: string;
  description: string;
  phone_number: string;
  district: string;
  point_x: string;
  point_y: string;
};

type userInformation = {
  first_name: string;
  last_name: string;
  phone_number: string;
  gender: string;
  birth_date: Date;
};

type updateUserInformationWithGoogleLogin = {
  first_name: string;
  last_name: string;
  phone_number: string;
  gender: string;
  birth_date: Date;
};
export class UserService {
  constructor(private knex: Knex, private mongoClient: MongoClient) {}
  async register(
    email: string,
    password: string,
    first_name: string,
    last_name: string,
    birth_date: string,
    gender: string,
    phone_number: string
  ) {
    try {
      let checkUserIsExist: UserExist[] = await this.knex
        .select("email", "verification_status")
        .from("users")
        .where("email", email);

      if (checkUserIsExist.length != 0) {
        return { messages: "user already exists" };
      }
      if (
        checkUserIsExist.length != 0 &&
        checkUserIsExist[0].verification_status == "pending"
      ) {
        return {
          validation:
            "We are verify your business account, please wait our confirm email. If you have any question, you can send email to tecky2022kb@outlook.com.",
        };
      }

      let hashedPassword = await hashPassword(password);
      let result = await this.knex
        .insert({
          email: email,
          first_name: first_name,
          last_name: last_name,
          password: hashedPassword,
          gender: gender,
          birth_date: birth_date,
          phone_number: phone_number,
          verification_status: "true",
          admin: "false",
          super_admin: "false",
          credit: 0,
        })
        .into("users");
      console.log(result);

      return { success: "register is successful" };
    } catch (error) {
      console.log(error);
      return { messages: error };
    }
  }

  async login(email: string, password: string) {
    console.log(email);
    try {
      let userInformation = await this.knex
        .select(
          "id",
          "password",
          "email",
          "admin",
          "super_admin",
          "verification_status"
        )
        .from("users")
        .where("email", email);

      if (userInformation.length == 0) {
        return { messages: "user not found" };
      }

      if (userInformation[0].verification_status == "pending") {
        return {
          validation:
            "We are identity your certification, please wait our email response",
        };
      }

      let hashedPassword = await userInformation[0].password;

      let comparePassword = checkPassword(password, hashedPassword);

      if ((await comparePassword) == false) {
        return { messages: "password is wrong" };
      }

      let payload: JWTPayload = {
        id: userInformation[0].id,
        admin: userInformation[0].admin,
        super_admin: userInformation[0].super_admin,
      };

      let token = encodedJWT(payload);

      return { token: token };
    } catch (error) {
      console.log(error);

      return { messages: error };
    }
  }

  async confirmEmail(email: string) {
    try {
      let userExist = await this.knex
        .select("id")
        .from("users")
        .where({ email });

      if (userExist.length == 0) {
        return { messages: "user not found" };
      }

      let res = `${Math.floor(Math.random() * 10)}${Math.floor(
        Math.random() * 10
      )}${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}`;

      let verification_code = Number(res);
      console.log(verification_code);

      let client = createClient();
      client.on("error", (err) => console.log("Redis Client Error", err));
      await client.connect();
      await client.set(`${verification_code}`, `${email}`);

      await client.expire(`${verification_code}`, 90);
      await client.disconnect();

      await this.knex("users")
        .update({
          verification_code,
        })
        .where({ email });

      let transporter = createTransport({
        service: "Outlook365",
        auth: {
          user: env.OUTLOOK_AC,
          pass: env.OUTLOOK_PASS,
        },
      });

      let options = {
        from: env.OUTLOOK_AC,
        to: email,
        subject: "Verification Code of Forget Password",
        text: `<p>Hi ${email}! For the reference of Verification Code of Forget Password</p>
      <p>We are send the Verification Code for validation,
      Verification Code: ${verification_code}
      Don't reply this email <br>
      Regard,
      On_The_Mat Teams</p>
                        `,
      };

      transporter.sendMail(options, (err, info) => {
        if (err) {
          console.log(err);
          return;
        }
        console.log("Sent:" + info.response);
      });

      return { success: "email is confirmed", id: userExist[0].id };
    } catch (error) {
      console.log(error);

      return { message: error };
    }
  }

  async googleLogin(accessToken: string) {
    try {
      let results = await admin.auth().verifyIdToken(accessToken);
      console.log(results);

      let addUserInformation = await this.knex
        .select("email")
        .from("users")
        .where({ email: results.email });

      if (addUserInformation.length == 0) {
        await this.knex
          .insert({
            email: results.email,
            credit: 0,
            verification_status: "true",
            admin: "false",
            super_admin: "false",
          })
          .into("users");
      }
      let googleLoginInformation = await this.knex
        .select("id", "admin", "super_admin")
        .from("users")
        .where({ email: results.email });
      console.log(googleLoginInformation);

      let payload: JWTPayload = {
        id: googleLoginInformation[0].id,
        admin: googleLoginInformation[0].admin,
        super_admin: googleLoginInformation[0].super_admin,
      };
      let token = encodedJWT(payload);
      return { success: "Login successful!", token };
    } catch (error) {
      console.log(error);

      return { error };
    }
  }

  async getComment(user_id: number) {
    let event = await this.knex
      .select("username")
      .from("users")
      .where({ id: user_id })
      .first();

    let username = event.username;

    let commentInformation = await this.knex
      .join("users", "users_id", "comment.user_id")
      .select(
        "users.username" as "username",
        "comment.comment" as "comment",
        "comment.id" as "id",
        "comment.review" as "review"
      )
      .from("comment");

    return { commentInformation, username };
  }
  async submitComment(user_id: number, comment: string, review: number) {
    await this.knex
      .insert({
        user_id: user_id,
        comment: comment,
        review: review,
      })
      .into("comment");
    return { success: "comment is inserted" };
  }

  async getUserInformation(user_id: number) {
    try {
      let res = await this.knex
        .select("id", "username", "email", "gender")
        .from("users")
        .where("id", user_id);
      return res;
    } catch (error) {
      return error;
    }
  }

  async changeUserInformation(
    user_id: number,
    email: string,
    username: string,
    gender: string
  ) {
    let userExist = await this.knex
      .select("id")
      .from("users")
      .where("id", user_id);

    if (userExist.length == 0) {
      return { messages: "user is not exist" };
    }
    await this.knex
      .insert({
        email: email,
        username: username,
        gender: gender,
      })
      .into("users");
    return { success: "Change information successful" };
  }
  async businessRegister(userInformation: UserInformation, file: string) {
    const txn = await this.knex.transaction();
    try {
      let userExist = await txn
        .select("*")
        .from("users")
        .where("email", userInformation.business_user_email);

      if (userExist.length != 0) {
        return { messages: "user is exist" };
      }

      // insert Business Account
      let business_user_id = await txn
        .insert({
          first_name: userInformation.first_name,
          last_name: userInformation.last_name,
          email: userInformation.business_user_email,
          password: userInformation.password,
          phone_number: userInformation.business_user_phone_number,
          verification_status: "pending",
        })
        .into("users")
        .returning("id");
      console.log(business_user_id[0].id);

      let studioId = await txn
        .insert({
          name: userInformation.studio_name,
          address: userInformation.address,
          email: userInformation.studio_email,
          description: userInformation.description,
          phone_number: userInformation.phone_number,
          verification_status: "pending",
          business_user_id: business_user_id[0].id,
          district: userInformation.district,
          positions: this.knex.raw(
            `POINT(${userInformation.point_x}, ${userInformation.point_y})`
          ),
        })
        .into("studio")
        .returning("studio.id");

      // insert Image
      await txn
        .insert({
          path: file,
          studio_id: studioId[0].id,
        })
        .into("images");
      await txn.commit();
      return { success: "Register is successful" };
    } catch (error) {
      await txn.rollback();
      console.log(error);

      return { messages: error };
    }
  }
  async get() {
    let result = await this.knex.select("*").from("classes");

    return result;
  }

  async confirmVerification(verificationCode: string, id: string) {
    try {
      const client = createClient();
      client.on("error", (err) => console.log("Redis Client Error", err));
      await client.connect();
      let res: string | null = await client.get(`${verificationCode}`);

      if (res == null) {
        return { messages: "Invalid Verification Code" };
      }

      let compareEmail = await this.knex
        .select("email", "admin", "super_admin")
        .from("users")
        .where("id", id);
      if (compareEmail[0].email != res) {
        return { messages: "Invalid Verification Code" };
      }

      let payload: JWTPayloadWithExpire = {
        id: Number(id),
        admin: compareEmail[0].admin,
        super_admin: compareEmail[0].super_admin,
        exp: Date.now() + 60 * 5,
      };

      let token = encodedJWT(payload);
      await client.del(`${verificationCode}`);

      return { success: "Validation is successful!!", token: token };
    } catch (error) {
      console.log(error);
      return { messages: error };
    }
  }
  async resendVerificationEmail(id: number) {
    try {
      let res = `${Math.floor(Math.random() * 9) + 1}${Math.floor(
        Math.random() * 10
      )}${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}`;

      let verification_code = Number(res);
      let client = createClient();
      client.on("error", (err) => console.log("Redis Client Error", err));
      await client.connect();
      await client.set(`${verification_code}`, `${id}`);

      await client.expire(`${verification_code}`, 90);
      await client.disconnect();

      await this.knex("users")
        .update({
          verification_code,
        })
        .where({ id });

      return { success: "resend code success!!" };
    } catch (error) {
      return error;
    }
  }

  async getUsername(id: number) {
    try {
      let username = await this.knex
        .select("first_name")
        .from("users")
        .where({ id });

      return {
        success: "get username successful!!",
        username: username[0].first_name,
      };
    } catch (error) {
      return error;
    }
  }

  async changePassword(password: string, id: number) {
    try {
      let userInformation = await this.knex
        .select("id", "password")
        .from("users")
        .where({ id });

      if (userInformation.length == 0) {
        return { messages: "user not found" };
      }

      let confirmPassword = await checkPassword(
        password,
        userInformation[0].password
      );

      if (confirmPassword == true) {
        return {
          messages: "you already use this password, please insert new password",
        };
      }

      let hashedPassword = await hashPassword(password);

      await this.knex("users")
        .update({
          password: hashedPassword,
        })
        .where({ id });

      return { success: "password changed" };
    } catch (error) {
      return { messages: error };
    }
  }

  async getUserCredit(id: number) {
    let res = await this.knex.select("credit").from("users").where({ id });
    return { success: "Get credit successful", credit: res[0].credit };
  }

  async checkOut(id: number, credit: string) {
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

    await this.mongoClient
      .db("OnTheMat")
      .collection("credit_record")
      .insertOne({
        user_id: id,
        credit: credit,
        status: "addCredit",
        time: formattedDate,
      });

    await this.knex.raw(
      /* sql */ `
update users
set credit = credit + ?
where id = ?
`,
      [credit, id]
    );

    // let userCredit = await this.knex
    //   .select("credit")
    //   .from("users")
    //   .where({ id });

    // let finalCredit = +credit + userCredit[0].credit;

    // console.log(finalCredit);

    // await this.knex.update({ credit: finalCredit }).from("users").where({ id });

    return true;
  }
  async getReceiveUsername(id: string) {
    try {
      let studio_name = await this.knex
        .select("studio.name as first_name")
        .from("users")
        .where("users.id", id)
        .join("studio", "studio.business_user_id", "users.id");
      if (studio_name.length > 0) {
        return studio_name;
      }
      let res = await this.knex
        .select("first_name")
        .from("users")
        .where({ id });
      return res;
    } catch (error) {
      console.log(error);

      return error;
    }
  }
  async getOwnerName(id: string) {
    try {
      let studio_name = await this.knex
        .select("studio.name as first_name")
        .from("users")
        .where("users.id", id)
        .join("studio", "studio.business_user_id", "users.id");
      if (studio_name.length > 0) {
        return studio_name;
      }
      let res = await this.knex
        .select("first_name")
        .from("users")
        .where({ id });
      return res;
    } catch (error) {
      return error;
    }
  }

  async sendInformationOfYogaType(id: string, informationArr: string[]) {
    try {
      return;
    } catch (error) {
      return error;
    }
  }

  async getUserInformationInProfile(id: number) {
    try {
      let studio_name = await this.knex
        .select(
          "studio.name as first_name",
          "users.profile_pic",
          "users.credit"
        )
        .from("users")
        .where("users.id", id)
        .join("studio", "studio.business_user_id", "users.id");
      if (studio_name.length > 0) {
        return studio_name;
      }
      let res = await this.knex
        .select("first_name", "profile_pic", "credit")
        .from("users")
        .where({ id });
      return res;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async getUserInformationInChangeUserInformation(id: number) {
    try {
      let res = await this.knex
        .select(
          "phone_number",
          "email",
          "first_name",
          "last_name",
          "gender",
          "birth_date",
          "profile_pic"
        )
        .from("users")
        .where({ id });
      return res;
    } catch (error) {
      console.log(error);
      return error;
    }
  }
  async changeUserInformationInChangeUserInformation(
    userInformation: userInformation,
    id: number
  ) {
    try {
      const { first_name, last_name, phone_number, gender, birth_date } =
        userInformation;
      await this.knex("users")
        .update({ first_name, last_name, phone_number, gender, birth_date })
        .where({ id });
      return { success: "Change Successful!!" };
    } catch (error) {
      console.log(error);
      return error;
    }
  }
  async getUsernameInProfile(id: number) {
    try {
      let studio_name = await this.knex
        .select(
          "studio.name as first_name",
          "users.profile_pic",
          "users.credit"
        )
        .from("users")
        .where("users.id", id)
        .join("studio", "studio.business_user_id", "users.id");
      if (studio_name.length > 0) {
        return studio_name;
      }
      let res = await this.knex
        .select("first_name")
        .from("users")
        .where({ id });

      return res;
    } catch (error) {
      console.log(error);
      return error;
    }
  }
  async sendChangedPasswordInProfile(password: string, id: number) {
    try {
      let originalPassword = await this.knex
        .select("password")
        .from("users")
        .where({ id });
      let final = await checkPassword(password, originalPassword[0].password);
      if (final == true) {
        return {
          message: "you already use this password, please insert new password",
        };
      }
      let newPassword = await hashPassword(password);
      await this.knex("users").update("password", newPassword).where({ id });
      return { success: "Password is Changed!!" };
    } catch (error) {
      console.log(error);
      return error;
    }
  }
  async getUpcomingClass(id: number) {
    try {
      console.log({ id });

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
        .select(
          "classes_interval.date" as "date",
          "classes.name" as "name",
          "classes.type" as "type",
          "classes.start_time" as "start_time",
          "classes.end_time" as "end_time",
          "classes.description" as "description",
          "teachers.name as teachers_name",
          "images.path" as "path"
        )
        .from("classes_interval")
        .join("classes", "classes.id", "classes_interval.classes_id")
        .join(
          "user_classes_lesson",
          "user_classes_lesson.classes_id",
          "classes.id"
        )
        .join("teachers", "teachers.id", "classes.teacher_id")
        .join("images", "images.class_id", "classes.id")
        .where("classes_interval.date", ">", nowDate)
        .andWhere("user_classes_lesson.user_id", id);
      return result;
    } catch (error) {
      console.log(error);

      console.log(error);
      return error;
    }
  }
  async getPassingClass(id: number) {
    try {
      console.log({ id });

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
        .select(
          "classes_interval.id as classes_id",
          "classes_interval.date as date",
          "classes.name as name",
          "classes.type as type",
          "classes.start_time as start_time",
          "classes.end_time as end_time",
          "classes.description as description",
          "teachers.name as teachers_name",
          "images.path as path"
        )
        .from("classes_interval")
        .join("classes", "classes.id", "classes_interval.classes_id")
        .join(
          "user_classes_lesson",
          "user_classes_lesson.classes_id",
          "classes.id"
        )
        .join("teachers", "teachers.id", "classes.teacher_id")
        .join("images", "images.class_id", "classes.id")
        .where("classes_interval.date", "<", nowDate)
        .andWhere("user_classes_lesson.user_id", id);

      console.log("RESULT", result);
      return result;
    } catch (error) {
      console.log(error);
      return error;
    }
  }
  async sendConfirmPassword(id: number, password: string) {
    try {
      console.log("HIHI");

      let comparePassword = await this.knex
        .select("password")
        .from("users")
        .where("id", id);
      let final = await checkPassword(password, comparePassword[0].password);
      if (final == false) {
        return { message: "Password is wrong!" };
      }
      return { success: "Password is confirmed" };
    } catch (error) {
      console.log(error);
      return { message: error };
    }
  }
  async navigateGoogleUserToInsertInformation(id: number) {
    try {
      let firstNameExist = await this.knex
        .select("first_name")
        .from("users")
        .where({ id });
      console.log(firstNameExist);

      if (firstNameExist[0].first_name == null) {
        return {
          message: "Password is not exist, please improve the information",
        };
      }
      return { success: "No problem" };
    } catch (error) {
      console.log(error);
      return error;
    }
  }
  async updateUserInformationWithGoogleLogin(
    value: updateUserInformationWithGoogleLogin,
    id: number
  ) {
    try {
      const { first_name, last_name, birth_date, phone_number, gender } = value;
      await this.knex("users").update({
        first_name,
        last_name,
        birth_date,
        phone_number,
        gender,
      });
      return { success: "update Successful!!Enjoy our member service!" };
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async getAddCreditRecord(user_id: number) {
    try {
      console.log(user_id);

      let res = this.mongoClient
        .db("OnTheMat")
        .collection("credit_record")
        .find({ user_id: user_id, status: "addCredit" });

      let result = await res.toArray();

      // console.log(res);
      return result;
    } catch (error) {
      console.log(error);
      return error;
    }
  }
  async getMinusCredit(user_id: number) {
    try {
      console.log(user_id);

      let creditRecords = await this.mongoClient
        .db("OnTheMat")
        .collection("credit_record")
        .find({ user_id: user_id, status: "minusCredit" })
        .toArray();

      await Promise.all(
        creditRecords.map(async (creditRecord) => {
          let row = await this.knex
            .select(
              "classes.name",
              "classes_interval.date",
              "classes.start_time"
            )
            .from("classes_interval")
            .where("classes_interval.id", creditRecord.class_id)
            .join("classes", "classes.id", "classes_interval.classes_id")
            .first();
          creditRecord.class_name = row.name;
          creditRecord.date = row.date;
          creditRecord.time = row.start_time;
        })
      );

      console.log("result", creditRecords);
      return creditRecords;
    } catch (error) {
      console.log(error);
      return error;
    }
  }
}
