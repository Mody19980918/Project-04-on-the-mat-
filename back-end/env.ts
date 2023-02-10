import { config } from "dotenv";
import populateEnv from "populate-env";

config();

export let env = {
  WEB_PORT: 8100,
  NODE_ENV: "development",
  POSTGRES_DB: "",
  POSTGRES_USER: "",
  POSTGRES_PASSWORD: "",
  POSTGRES_HOST: "localhost",
  POSTGRES_PORT: 5432,
  JWT_SECRET: "",
  AWS_ACCESS_KEY_ID: "",
  AWS_SECRET_ACCESS_KEY: "",
  S3_BUCKET_NAME: "",
  S3_REGION: "",
  OUTLOOK_AC: "",
  OUTLOOK_PASS: "",
  PAYPAL_CLIENT: "",
  PAYPAL_SECRET: "",
  MONGO_USER: "",
  MONGO_PASSWORD: "",
  MONGO_DB: "",
};

populateEnv(env, { mode: "halt" });
