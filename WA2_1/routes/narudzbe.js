import express from "express";
import { pizze } from "./pizze.js";

const router = express.Router();

const narudzbe = [];

router.post("/", (req, res) => {
  const tijelo = req.body;

  if (!tijelo || typeof tijelo !== "object") {
    return res
      .status(400)
      .json({ message: "Tijelo zahtjeva mora biti JSON objekt." });
  }
  const { narudzba, klijent } = tijelo;

  const requiredClient = ["prezime", "adresa", "broj_telefona"];
  const missingClient = requiredClient.filter(
    (k) => !(klijent && k in klijent)
  );
  if (missingClient.length) {
    return res.status(400).json({
      message: "Nedostaju podaci o klijentu.",
      nedostaje: missingClient,
    });
  }

  if (!Array.isArray(narudzba) || narudzba.length === 0) {
    return res.status(400).json({
      message: "Očekivano je polje 'narudzba' s barem jednom stavkom.",
      primjer: [
        { pizza: "Capricciosa", velicina: "jumbo", kolicina: 1 },
        { pizza: "Vegetariana", velicina: "srednja", kolicina: 2 },
      ],
    });
  }

  const greske = [];
  const stavkeValidirane = narudzba.map((s, i) => {
    const missing = [];
    if (!s || typeof s !== "object") {
      greske.push(`Stavka #${i + 1} nije objekt.`);
      return null;
    }
    if (!("pizza" in s)) missing.push("pizza");
    if (!("velicina" in s)) missing.push("velicina");
    if (!("kolicina" in s)) missing.push("kolicina");
    if (missing.length) {
      greske.push(`Stavka #${i + 1} nema ključeve: ${missing.join(", ")}`);
      return null;
    }

    const kolicinaOk = Number.isInteger(s.kolicina) && s.kolicina >= 1;
    if (!kolicinaOk) {
      greske.push(
        `Stavka #${i + 1} ima neispravnu kolicina (cijeli broj ≥ 1).`
      );
    }

    const pizzaObj = pizze.find(
      (p) => p.naziv.toLowerCase() === String(s.pizza).toLowerCase()
    );
    if (!pizzaObj) {
      greske.push(
        `Stavka #${i + 1}: pizza "${s.pizza}" ne postoji u jelovniku.`
      );
      return null;
    }

    const jedinicnaCijena = pizzaObj.cijena;

    return {
      pizza: pizzaObj.naziv,
      velicina: String(s.velicina),
      kolicina: s.kolicina,
      cijena: jedinicnaCijena,
    };
  });

  if (greske.length) {
    return res
      .status(400)
      .json({ message: "Neispravan zahtjev.", detalji: greske });
  }

  const ukupna_cijena = stavkeValidirane.reduce(
    (zbroj, s) => (zbroj += s.cijena * s.kolicina),
    0
  );

  const zapis = {
    id: narudzbe.length + 1,
    stavke: stavkeValidirane,
    klijent: {
      prezime: klijent.prezime,
      adresa: klijent.adresa,
      broj_telefona: klijent.broj_telefona,
    },
    ukupna_cijena,
    createdAt: new Date().toISOString(),
  };
  narudzbe.push(zapis);

  const opis = zapis.stavke
    .map((s) => `${s.pizza} (${s.velicina})`)
    .join(" i ");

  return res.status(201).json({
    message: `Vaša narudžba za ${opis} je uspješno zaprimljena!`,
    prezime: zapis.klijent.prezime,
    adresa: zapis.klijent.adresa,
    ukupna_cijena: zapis.ukupna_cijena,
    narudzbaId: zapis.id,
  });
});

router.get("/", (req, res) => {
  res.json(narudzbe);
});

router.get("/:id", (req, res) => {
  const id = req.params.id;
  if (isNaN(id))
    return res.status(400).json({ message: "Parametar id mora biti broj." });
  const n = narudzbe.find((x) => x.id == id);
  if (!n) return res.status(404).json({ message: "Narudžba nije pronađena." });
  res.json(n);
});

router.delete("/:id", (req, res) => {
  const id = req.params.id;
  if (isNaN(id))
    return res.status(400).json({ message: "Parametar id mora biti broj." });
  const i = narudzbe.findIndex((x) => x.id == id);
  if (i === -1)
    return res.status(404).json({ message: "Narudžba nije pronađena." });
  narudzbe.splice(i, 1);
  return res.status(204).send();
});

export default router;
