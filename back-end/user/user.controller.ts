import express from "express";
import { decodeBearerJWT, JWTPayload } from "../JWT";
import { UserInformation, UserService } from "./user.service";
import { z } from "zod";
import { form, formParse, toArray } from "../upload/local.upload.service";
import * as jwt from "jwt-simple";

import fetch from "cross-fetch";
import { env } from "../env";
import axios from "axios";

export class UserController {
  constructor(private userService: UserService) {}

  register = async (req: express.Request, res: express.Response) => {
    try {
      // const emailValidation = z.string().email();

      const UserData = z.object({
        first_name: z.string(),
        last_name: z.string(),
        email: z.string().email(),
        birth_date: z.string(),
        phone_number: z.string().length(8),
      });

      UserData.parse(req.body);

      let {
        first_name,
        last_name,
        email,
        password,
        gender,
        birth_date,
        phone_number,
      } = req.body;

      if (
        !password.match(/[a-z]/) ||
        !password.match(/[A-Z]/) ||
        !`\`~!@#$%^&*()_+-=[]{};':",./<>?\\|`
          .split("")
          .some((c) => password.includes(c))
      ) {
        res.status(400).json({ messages: "Invaild Password" });
      }

      if (["male", "female", "other"].indexOf(gender) === -1) {
        return res
          .status(400)
          .json({ messages: "gender must be male, female,other" });
      }

      let result = await this.userService.register(
        email,
        password,
        first_name,
        last_name,
        birth_date,
        gender,
        phone_number
      );
      if (result.messages) {
        return res.status(400).json(result);
      }
      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  };

  login = async (req: express.Request, res: express.Response) => {
    try {
      let { email, password } = req.body;

      if (!email) {
        return res.status(400).json({ messages: "Invalid email " });
      }

      if (!password) {
        return res.status(400).json({ messages: "Invalid password" });
      }

      let result = await this.userService.login(email, password);

      if (result.messages) {
        return res.status(400).json(result);
      }

      return res.status(200).json(result);
    } catch (error) {
      return { error };
    }
  };

  confirmEmail = async (req: express.Request, res: express.Response) => {
    try {
      let { email } = req.body;

      if (!email) {
        return res.status(400).json({ messages: "email cannot be null" });
      }

      let result = await this.userService.confirmEmail(email);

      if (result.messages) {
        return res.status(400).json(result);
      }

      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ messages: error });
    }
  };

  googleLogin = async (req: express.Request, res: express.Response) => {
    try {
      let { accessToken } = req.body;

      let result = await this.userService.googleLogin(accessToken);

      return res.status(200).json(result);
    } catch (error) {
      return res.status(400).json({ messages: error });
    }
  };

  getComment = async (req: express.Request, res: express.Response) => {
    try {
      let payload = decodeBearerJWT(req);
      let result = await this.userService.getComment(payload.id);

      return res.status(200).json(result);
    } catch (error) {
      return { error };
    }
  };

  submitComment = async (req: express.Request, res: express.Response) => {
    try {
      if (!req.body) {
        return res
          .status(400)
          .json({ messages: "Cannot receive comment and review" });
      }
      let { comment, review } = req.body;
      if (comment.length < 5) {
        return res
          .status(400)
          .json({ messages: "Comment should be more than 5 letter" });
      }

      if (typeof review !== "number" || 0 > review || review > 6) {
        return res
          .status(400)
          .json({ messages: "Please insert correct number" });
      }

      let payload = decodeBearerJWT(req);
      let user_id = payload.id;
      let result = await this.userService.submitComment(
        user_id,
        comment,
        review
      );

      return res.status(200).json(result);
    } catch (error) {
      return { error };
    }
  };

  getUserInformation = async (req: express.Request, res: express.Response) => {
    try {
      let payload = decodeBearerJWT(req);
      let user_id = payload.id;
      let result = await this.userService.getUserInformation(user_id);

      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ messages: error });
    }
  };

  changeUserInformation = async (
    req: express.Request,
    res: express.Response
  ) => {
    try {
      let payload = decodeBearerJWT(req);
      let { email, username, gender } = req.body;
      if (!email.includes("@")) {
        return res.status(401).json({ messages: "email format is wrong" });
      }
      if (username.length < 8) {
        return res
          .status(401)
          .json({ messages: "username's length should be more than 8" });
      }
      let user_id = payload.id;
      let result = await this.userService.changeUserInformation(
        user_id,
        email,
        username,
        gender
      );
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ messages: error });
    }
  };
  businessRegister = async (req: express.Request, res: express.Response) => {
    try {
      const formValues = await formParse(form, req);
      console.log(formValues);

      const fileArr = toArray(formValues.files as any);
      // console.log(fileArr);

      console.log(fileArr[0].path.newFilename);

      let file = fileArr[0].path.newFilename;

      console.log(formValues);

      const UserData = z.object({
        first_name: z.string(),
        last_name: z.string(),
        business_user_email: z.string().email(),
        password: z.string(),
        business_user_phone_number: z.string(),
        studio_name: z.string(),
        address: z.string(),
        phone_number: z.string(),
        studio_email: z.string().email(),
        description: z.string(),
        district: z.string(),
        point_x: z.string(),
        point_y: z.string(),
      });
      UserData.parse(formValues.fields);

      let {
        first_name,
        last_name,
        business_user_email,
        password,
        business_user_phone_number,
        studio_name,
        address,
        phone_number,
        studio_email,
        description,
        district,
        point_x,
        point_y,
      } = formValues.fields;

      let userInformation = {
        first_name,
        last_name,
        business_user_phone_number,
        studio_name,
        business_user_email,
        password,
        address,
        studio_email,
        description,
        phone_number,
        district,
        point_x,
        point_y,
      };
      if (
        !(password as string).match(/[a-z]/) ||
        !String(password).match(/[A-Z]/) ||
        !`\`~!@#$%^&*()_+-=[]{};':",./<>?\\|`
          .split("")
          .some((c) => password.includes(c))
      ) {
        res.status(400).json({ messages: "Invaild Password" });
      }

      let result = await this.userService.businessRegister(
        userInformation as UserInformation,
        file
      );

      if (result.messages) {
        return res.status(400).json({ messages: result.messages });
      }
      return res.status(200).json({ result });
    } catch (error) {
      console.log(error);

      return res.status(500).json({ error });
    }
  };

  get = async (req: express.Request, res: express.Response) => {
    let result = await this.userService.get();
    console.log(result);
    return res.status(200).json(result);
  };

  confirmVerification = async (req: express.Request, res: express.Response) => {
    try {
      let { verificationCode } = req.body;
      let { id } = req.params;

      console.log();

      if (verificationCode.length != 4) {
        return res.status(400).json({ messages: "Invalid verification_code" });
      }

      let result = await this.userService.confirmVerification(
        verificationCode,
        id
      );

      if (result.messages) {
        return res.status(400).json({ messages: result.messages });
      }

      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ messages: error });
    }
  };

  resendVerificationEmail = async (
    req: express.Request,
    res: express.Response
  ) => {
    try {
      const { id } = req.params;
      let result = await this.userService.resendVerificationEmail(Number(id));
      console.log(result);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ messages: error });
    }
  };

  getUsername = async (req: express.Request, res: express.Response) => {
    try {
      const { token } = req.params;
      let payload: JWTPayload = jwt.decode(token, "xxx");
      let id = payload.id;
      let result = await this.userService.getUsername(id);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ messages: error });
    }
  };

  changePassword = async (req: express.Request, res: express.Response) => {
    try {
      console.log(req.body);

      const { value, token } = req.body;
      let payload = jwt.decode(token, "xxx");
      let id = payload.id;
      console.log(id);

      let password = value.password;
      if (
        !password.match(/[a-z]/) ||
        !password.match(/[A-Z]/) ||
        !`\`~!@#$%^&*()_+-=[]{};':",./<>?\\|`
          .split("")
          .some((c) => password.includes(c))
      ) {
        res.status(400).json({ messages: "Invaild Password" });
      }

      let result = await this.userService.changePassword(password, id);

      if (result.messages) {
        console.log(result.messages);

        return res.status(400).json({ messages: result.messages });
      }

      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ errors: error });
    }
  };
  checkOut = async (req: express.Request, res: express.Response) => {
    try {
      console.log("HIHI");
      // const { id } = req.params;
      const { orderId } = req.body;
      const { id } = req.params;
      console.log(orderId);

      // let access_token = await fetch(
      //   "https://api-m.sandbox.paypal.com/v1/oauth2/token",
      //   {
      //     method: "POST",
      //     headers: {
      //       "Content-Type": "application/json",
      //       "Authorization": `Basic ${env.PAYPAL_CLIENT}:${env.PAYPAL_SECRET}`,
      //     },
      //   }
      // );

      const {
        data: { access_token },
      } = await axios({
        url: "https://api.sandbox.paypal.com/v1/oauth2/token",
        method: "post",
        headers: {
          Accept: "application/json",
          "Accept-Language": "en_US",
          "content-type": "application/x-www-form-urlencoded",
        },
        auth: {
          username: env.PAYPAL_CLIENT,
          password: env.PAYPAL_SECRET,
        },
        params: {
          grant_type: "client_credentials",
        },
      });

      // let access_token_data = await access_token.json();

      // console.log({ access_token_data });

      let data = await fetch(
        "https://api-m.sandbox.paypal.com/v2/checkout/orders/" + orderId,

        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access_token}`,
          },
        }
      );

      let result = await data.json();
      console.log(result.purchase_units[0].description);
      let credit = result.purchase_units[0].description.split(" ")[0];

      console.log("credit", credit);

      await this.userService.checkOut(+id, credit);

      return res.status(200).json({ success: "Successful!" });
    } catch (error) {
      console.log(error);

      return res.status(500).json({ messages: error });
    }
  };

  getUserCredit = async (req: express.Request, res: express.Response) => {
    try {
      let payload = decodeBearerJWT(req);
      let id = payload.id;
      let result = await this.userService.getUserCredit(id);

      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ messages: error });
    }
  };

  getReceiveUsername = async (req: express.Request, res: express.Response) => {
    try {
      let { id } = req.params;
      let result = await this.userService.getReceiveUsername(id);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  };

  getOwnerName = async (req: express.Request, res: express.Response) => {
    try {
      let { id } = req.params;
      let result = await this.userService.getOwnerName(id);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  };

  sendInformationOfYogaType = async (
    req: express.Request,
    res: express.Response
  ) => {
    try {
      let payload = decodeBearerJWT(req);
      let id = payload.id;
      let { informationArr } = req.body;
      if (informationArr.length == 0) {
        return res.status(400).json({ messages: "Selection can't be null" });
      }
      console.log(informationArr);

      let result = await this.userService.sendInformationOfYogaType(
        id,
        informationArr
      );
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  };

  getUserInformationInProfile = async (
    req: express.Request,
    res: express.Response
  ) => {
    try {
      let payload = decodeBearerJWT(req);
      let id = payload.id;
      let result = await this.userService.getUserInformationInProfile(+id);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  };

  getUserInformationInChangeUserInformation = async (
    req: express.Request,
    res: express.Response
  ) => {
    try {
      let payload = decodeBearerJWT(req);
      let id = payload.id;
      let result =
        await this.userService.getUserInformationInChangeUserInformation(+id);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  };

  changeUserInformationInChangeUserInformation = async (
    req: express.Request,
    res: express.Response
  ) => {
    try {
      console.log(req.body);

      const UserData = z.object({
        first_name: z.string(),
        last_name: z.string(),
        phone_number: z.string(),
        gender: z.string(),
        birth_date: z.string(),
      });

      UserData.parse(req.body);

      let userInformation = req.body;

      let payload = decodeBearerJWT(req);
      let id = payload.id;
      let result =
        await this.userService.changeUserInformationInChangeUserInformation(
          userInformation,
          +id
        );
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  };
  getUsernameInProfile = async (
    req: express.Request,
    res: express.Response
  ) => {
    try {
      let payload = decodeBearerJWT(req);
      let id = payload.id;
      let result = await this.userService.getUsernameInProfile(+id);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  };

  sendChangedPasswordInProfile = async (
    req: express.Request,
    res: express.Response
  ) => {
    try {
      let payload = decodeBearerJWT(req);
      let id = payload.id;
      let { password } = req.body;

      let result: any = await this.userService.sendChangedPasswordInProfile(
        password,
        +id
      );
      if (result.message) {
        return res.status(400).json({ message: result.message });
      }

      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  };
  getUpcomingClass = async (req: express.Request, res: express.Response) => {
    try {
      let payload = decodeBearerJWT(req);
      let id = payload.id;
      let result = await this.userService.getUpcomingClass(+id);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  };

  getPassingClass = async (req: express.Request, res: express.Response) => {
    try {
      let payload = decodeBearerJWT(req);
      let id = payload.id;
      let result = await this.userService.getPassingClass(+id);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  };
  sendConfirmPassword = async (req: express.Request, res: express.Response) => {
    try {
      const { password } = req.body;

      let payload = decodeBearerJWT(req);
      let id = payload.id;

      let result = await this.userService.sendConfirmPassword(+id, password);
      if (result.message) {
        return res.status(400).json({ message: result.message });
      }
      return res.status(200).json(result);
    } catch (error) {
      console.log(error);

      return res.status(500).json({ message: error });
    }
  };
  navigateGoogleUserToInsertInformation = async (
    req: express.Request,
    res: express.Response
  ) => {
    try {
      const { id } = req.params;
      let result = await this.userService.navigateGoogleUserToInsertInformation(
        +id
      );
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  };
  updateUserInformationWithGoogleLogin = async (
    req: express.Request,
    res: express.Response
  ) => {
    try {
      const UserData = z.object({
        first_name: z.string(),
        last_name: z.string(),
        email: z.string().email(),
        birth_date: z.string(),
        phone_number: z.string(),
      });

      UserData.parse(req.body);

      let payload = decodeBearerJWT(req);
      let id = payload.id;
      let result = await this.userService.updateUserInformationWithGoogleLogin(
        req.body,
        +id
      );
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  };
  getAddCreditRecord = async (req: express.Request, res: express.Response) => {
    try {
      const payload = decodeBearerJWT(req);
      let user_id = payload.id;
      let result = await this.userService.getAddCreditRecord(user_id);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  };
  getMinusCredit = async (req: express.Request, res: express.Response) => {
    try {
      const payload = decodeBearerJWT(req);
      let user_id = payload.id;
      let result = await this.userService.getMinusCredit(+user_id);
      console.log(result);

      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  };
}
