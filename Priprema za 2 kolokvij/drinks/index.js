import express from "express";
import { connectToDatabase } from "./db.js";
import dotenv from "dotenv";
import drinksRouter from "./routes/drinks.js";

dotenv.config();

const app = express();

const PORT = 3000;

app.use(express.json());
app.use("/drinks", drinksRouter);

app.use((err, req, res, next) => {
  res.on("finish", () => {
    const time = new Date().toISOString();
    console.log(
      `[${time}] ${req.method} ${req.originalUrl} - ${res.statusCode}`,
    );
  });
  next(err);
});

const db = await connectToDatabase(process.env.MONGO_URI);

app.locals.db = db;

app.listen(PORT, () => {
  console.log(`Poslužitelj radi na portu ${PORT}`);
});
