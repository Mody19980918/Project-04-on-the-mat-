import { createTransport } from "nodemailer";
import { Knex } from "knex";
import { env } from "../env";

type UserInformation = {
  id: string;
  name: string;
  email: string;
  messages: string;
};
export class SuperAdminService {
  constructor(private knex: Knex) {}

  async getValidateStudioOrFreelance() {
    try {
      let information = await this.knex
        .select(
          "studio.id as id",
          "studio.name as name",
          "studio.address as address",
          "studio.description as description",
          "studio.phone_number as phone_number",
          "studio.email as email",
          "studio.created_at as created_at",
          "images.path as path"
        )
        .from("studio")
        .leftJoin("images", "images.studio_id", "studio.id")
        .where("studio.verification_status", "pending");
      console.log(information);

      return information;
    } catch (error) {
      console.log(error);
      return error;
    }
  }
  async approvedStudioOrFreelanceStatus(id: number) {
    try {
      let userId = await this.knex
        .join("studio", "studio.business_user_id", "users.id")
        .select("users.id as user_id")
        .from("users")
        .where("users.id", id);

      console.log(userId);

      await this.knex
        .update({ verification_status: "true" })
        .from("studio")
        .where("id", id);

      await this.knex
        .update({ verification_status: "true" })
        .from("users")
        .where({ id: userId[0].id });

      let userInformationArr = await this.knex
        .select("email", "first_name")
        .from("users")
        .where("id", userId[0].id);
      let email = userInformationArr[0].email;
      let name = userInformationArr[0].first_name;

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
        subject: "About Your Business Account of register in On_The_Mat",
        html: `
<p>Hi ${name}! For the reference of Registration the Business Account</p>
<p>We are approved your registration, please use the business email to login your account (not studio email)</p>
<p>Don't reply this email </p>
<p>Regard</p>,
<p>On_The_Mat Teams</p>
                        `,
      };

      transporter.sendMail(options, (err, info) => {
        if (err) {
          console.log(err);
          return;
        }
        console.log("Sent:" + info.response);
      });

      return { success: "Successful!" };
    } catch (error) {
      console.log(error);
      return error;
    }
  }
  async forbiddenStudioOrFreelanceStatus(userInformation: UserInformation) {
    try {
      console.log("HIHI");

      let business_user_id = await this.knex
        .join("users", "users.id", "studio.business_user_id")
        .select("users.id")
        .from("studio")
        .where("studio.id", userInformation.id)
        .returning("id");
      console.log(business_user_id);
      console.log(userInformation.email);

      await this.knex("studio").where("id", userInformation.id).del();
      await this.knex("users").where("id", business_user_id[0].id).del();

      let transporter = createTransport({
        service: "Outlook365",
        auth: {
          user: env.OUTLOOK_AC,
          pass: env.OUTLOOK_PASS,
        },
      });

      let options = {
        from: env.OUTLOOK_AC,
        to: userInformation.email,
        subject: "About Your register of On_The_Mat",
        html: `
<p>Hi ${userInformation.name}! For the reference of Registration the Business Account</p>
<p>We are find some problem about your validation, </p>
<p>messages: ${userInformation.messages}</p>
<p>please fix the problem and register again in this page http://localhost:5173/businessregister</p>
<p>Don't reply this email 
<p>Regard,</p>
<p>On_The_Mat Teams</p>
                  `,
      };

      transporter.sendMail(options, (err, info) => {
        if (err) {
          console.log(err);
          return;
        }
        console.log("Sent:" + info.response);
      });
      return { messages: "Delete Successful!! " };
    } catch (error) {
      console.log(error);
      return { messages: error };
    }
  }
}
