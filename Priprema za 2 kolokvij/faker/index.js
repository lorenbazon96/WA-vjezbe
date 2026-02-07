import express from "express";
import dotenv from "dotenv";
import { connectToDB } from "./db.js";
import usersRouter from "./routes/users.js";

dotenv.config();

const app = express();
const PORT = 3000;

app.use((req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    const time = new Date().toISOString();
    console.log(`[${time}] ${req.method} ${req.originalUrl} ${res.statusCode}`);
  });

  next();
});

app.use(express.json());
app.use("/users", usersRouter);

const db = await connectToDB(process.env.MONGO_URI);
app.locals.db = db;

app.get("/", (req, res) => {
  res.send("Pozdrav iz Express poslužitelja!");
});

app.listen(PORT, () => {
  console.log(`Poslužitelj pokrenut na http://localhost:${PORT}`);
});
