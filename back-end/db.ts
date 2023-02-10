import Knex from "knex";

const knexConfigs = require("./knexfile");
const configMode = "development";
const knexConfig = knexConfigs[configMode];
export const knex = Knex(knexConfig);
