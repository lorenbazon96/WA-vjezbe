import { MongoClient } from "mongodb";

export async function connectToDB(uri) {
  const client = new MongoClient(uri);
  await client.connect();

  const db = client.db(process.env.MONGO_DB_NAME);

  console.log("Uspješno spajanje na bazu podataka");
  return db;
}
