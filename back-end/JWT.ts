import * as jwt from "jwt-simple";
import express from "express";
import dotenv from "dotenv";
dotenv.config();

export interface JWTPayload {
  id: number;
  admin: string;
  super_admin: string;
}

export interface JWTPayloadWithExpire extends JWTPayload {
  exp: number;
}

export function encodedJWT(payload: JWTPayload) {
  return jwt.encode(payload, "xxx");
}

export function decodeBearerJWT(req: express.Request) {
  try {
    if (!req.headers.authorization) {
      throw "No token, Please check the user identity";
    }

    let token = req.headers.authorization.split(" ")[1];
    let payload = jwt.decode(token, "xxx");

    return payload;
  } catch (error) {
    console.log(error);
    return error;
  }
}
