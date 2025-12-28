import { MongoClient } from "mongodb";
import { config } from "dotenv";

config();

const mongoURI = process.env.MONGO_URI;
const dbName = process.env.MONGO_DB_NAME;

async function connectToDatabase() {
  try {
    if (!mongoURI || !dbName) {
      throw new Error("Nedostaje MONGO_URI ili MONGO_DB_NAME u .env datoteci.");
    }

    const client = new MongoClient(mongoURI);
    await client.connect();
    console.log("Uspješno spajanje na bazu podataka");

    return client.db(dbName);
  } catch (error) {
    console.error("Greška prilikom spajanja na bazu podataka", error);
    throw error;
  }
}

export { connectToDatabase };
