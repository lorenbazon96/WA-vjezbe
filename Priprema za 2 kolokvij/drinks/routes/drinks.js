import express from "express";
import validateDrink from "../middlewares/validateDrink.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const db = req.app.locals.db;
  try {
    const drinks = await db.collection("drinks").find().toArray();
    if (drinks.length === 0) {
      return res.status(404).json({ error: "Nema dostupnih pića." });
    }
    res.status(200).json(drinks);
  } catch (error) {
    console.error("Greška prilikom dohvaćanja pića:", error);
    res
      .status(500)
      .json({ error: "Došlo je do greške prilikom dohvaćanja pića." });
  }
});

router.post("/", validateDrink, async (req, res) => {
  try {
    const db = req.app.locals.db;

    if (req.type === "array") {
      const result = await db.collection("drinks").insertMany(req.body);
      return res.status(201).json({
        message: "Napitci uspješno dodani",
        count: result.insertedCount,
      });
    }

    const result = await db.collection("drinks").insertOne(req.body);
    res.status(201).json({
      message: "Novi napitak dodan",
      id: result.insertedId,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
