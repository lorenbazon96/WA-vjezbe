import express from "express";

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

router.post("/", async (req, res) => {
  const db = req.app.locals.db;
  const { naziv, zapremnina, cijena, kolicina } = req.body;
  if (!naziv || !zapremnina || !cijena || !kolicina) {
    return res.status(400).json({ error: "Sva polja su obavezna." });
  }
  try {
    const result = await db.collection("drinks").insertOne({
      naziv,
      zapremnina,
      cijena,
      kolicina,
    });
    res
      .status(201)
      .json({ message: "Piće uspješno dodano.", id: result.insertedId });
  } catch (error) {
    console.error("Greška prilikom dodavanja pića:", error);
    res
      .status(500)
      .json({ error: "Došlo je do greške prilikom dodavanja pića." });
  }
});

export default router;
