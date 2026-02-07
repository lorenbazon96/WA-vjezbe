import { MongoClient } from "mongodb";

export async function connectToDatabase(uri) {
  const client = new MongoClient(uri);
  await client.connect();

  const db = client.db(process.env.MONGO_DB_NAME);
  console.log("Povezano s bazom podataka");

  return db;
}
