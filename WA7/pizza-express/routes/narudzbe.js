import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, async (req, res) => {
  try {
    const db = req.app.locals.db;
    const userId = req.user.userId;
    const { narucene_pizze } = req.body;

    if (!Array.isArray(narucene_pizze)) {
      return res.status(400).json({ message: "Neispravni podaci" });
    }

    let ukupna_cijena = 0;

    for (const stavka of narucene_pizze) {
      const pizza = await db.collection("pizze").findOne({
        naziv: { $regex: `^${stavka.naziv}$`, $options: "i" },
      });

      if (!pizza) {
        return res.status(400).json({ message: "Pizza ne postoji" });
      }

      const cijena = pizza.cijene[stavka.velicina];
      ukupna_cijena += cijena * stavka.kolicina;
    }

    ukupna_cijena = Number(ukupna_cijena.toFixed(2));

    const narudzba = {
      userId,
      narucene_pizze,
      ukupna_cijena,
      created_at: new Date(),
    };

    await db.collection("narudzbe").insertOne(narudzba);

    res.status(201).json(narudzba);
  } catch (err) {
    res.status(500).json({ message: "Greška pri kreiranju narudžbe" });
  }
});

router.get("/", authMiddleware, async (req, res) => {
  const db = req.app.locals.db;
  const userId = req.user.userId;

  const narudzbe = await db.collection("narudzbe").find({ userId }).toArray();

  res.json(narudzbe);
});

export default router;
