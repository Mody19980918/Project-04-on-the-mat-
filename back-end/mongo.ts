import { MongoClient } from "mongodb";
// Connection URI
const uri = "";
// Create a new MongoClient
export const mongoClient = new MongoClient(uri);
mongoClient.connect();
