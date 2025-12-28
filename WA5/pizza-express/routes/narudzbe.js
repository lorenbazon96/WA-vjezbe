import express from "express";
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { ime, adresa, telefon, narucene_pizze } = req.body;

    if (
      typeof ime !== "string" ||
      typeof adresa !== "string" ||
      !/^\d+$/.test(String(telefon)) ||
      !Array.isArray(narucene_pizze)
    ) {
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
      ime,
      adresa,
      telefon: String(telefon),
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

export default router;
