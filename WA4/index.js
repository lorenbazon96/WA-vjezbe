import express from "express";
import fs from "fs/promises";

const app = express();
const PORT = 3000;
app.use(express.json());

const putanja = "data/zaposlenici.json";

app.get("/zaposlenici", async (req, res) => {
  try {
    const tekst = await fs.readFile(putanja, "utf8");
    let zaposlenici = JSON.parse(tekst);

    if (zaposlenici.length === 0) {
      return res.status(404).json({ greska: "nema zaposlenika u datoteci" });
    } else {
      if (req.query.pozicija !== undefined) {
        zaposlenici = zaposlenici.filter(
          (z) => z.pozicija === req.query.pozicija
        );
      }

      if (req.query.godine_staza_min !== undefined) {
        const min = Number(req.query.godine_staza_min);

        if (Number.isNaN(min)) {
          return res
            .status(400)
            .json({ greska: "godine_staza_min mora biti broj" });
        } else {
          zaposlenici = zaposlenici.filter(
            (z) => Number(z.godine_staza) >= min
          );
        }
      }

      if (req.query.godine_staza_max !== undefined) {
        const max = Number(req.query.godine_staza_max);

        if (Number.isNaN(max)) {
          return res
            .status(400)
            .json({ greska: "godine_staza_max mora biti broj" });
        } else {
          zaposlenici = zaposlenici.filter(
            (z) => Number(z.godine_staza) <= max
          );
        }
      }

      if (zaposlenici.length === 0) {
        return res.status(404).json({
          greska: "Nije pronađen zaposlenik",
        });
      } else {
        if (req.query.sortiraj_po_godinama !== undefined) {
          if (req.query.sortiraj_po_godinama === "uzlazno") {
            zaposlenici.sort(
              (a, b) => Number(a.godine_staza) - Number(b.godine_staza)
            );
          } else if (req.query.sortiraj_po_godinama === "silazno") {
            zaposlenici.sort(
              (a, b) => Number(b.godine_staza) - Number(a.godine_staza)
            );
          } else {
            return res.status(400).json({
              greska: "sortiraj_po_godinama mora biti uzlazno ili silazno",
            });
          }
        }

        res.status(200).json(zaposlenici);
      }
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      greska: `${err.message}`,
    });
  }
});

app.get("/zaposlenici/:id", async (req, res) => {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    return res.status(400).json({ greska: "id mora biti broj" });
  }

  try {
    const tekst = await fs.readFile(putanja, "utf8");
    const zaposlenici = JSON.parse(tekst);

    if (zaposlenici.length === 0) {
      res.status(404).json({ greska: "Nema zaposlenika u datoteci." });
    } else {
      const zaposlenik = zaposlenici.find((z) => Number(z.id) === id);

      if (!zaposlenik) {
        res
          .status(404)
          .json({ greska: "Zaposlenik s traženim ID-om nije pronađen." });
      } else {
        res.status(200).json(zaposlenik);
      }
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      greska: `${err.message}`,
    });
  }
});

app.post("/zaposlenici", async (req, res) => {
  const ime = req.body.ime;
  const prezime = req.body.prezime;
  const godine_staza = req.body.godine_staza;
  const pozicija = req.body.pozicija;

  if (
    ime === undefined ||
    prezime === undefined ||
    godine_staza === undefined ||
    pozicija === undefined
  ) {
    return res.status(400).json({
      greska: "Morate poslati ime, prezime, godine_staža i pozicija.",
    });
  } else if (typeof ime !== "string" || ime.trim() === "") {
    return res.status(400).json({ greska: "ime mora biti tekst." });
  } else if (typeof prezime !== "string" || prezime.trim() === "") {
    return res.status(400).json({ greska: "prezime mora biti tekst." });
  } else if (Number.isNaN(Number(godine_staza))) {
    return res.status(400).json({ greska: "godine_staza mora biti broj." });
  } else if (typeof pozicija !== "string" || pozicija.trim() === "") {
    return res.status(400).json({ greska: "pozicija mora biti tekst." });
  }

  try {
    const tekst = await fs.readFile(putanja, "utf8");
    let zaposlenici = JSON.parse(tekst);

    let maxId = 0;
    for (let i = 0; i < zaposlenici.length; i++) {
      const trenutniId = Number(zaposlenici[i].id);
      if (!Number.isNaN(trenutniId) && trenutniId > maxId) {
        maxId = trenutniId;
      }
    }

    const noviZaposlenik = {
      id: maxId + 1,
      ime: ime.trim(),
      prezime: prezime.trim(),
      godine_staza: Number(godine_staza),
      pozicija: pozicija.trim(),
    };

    zaposlenici.push(noviZaposlenik);
    await fs.writeFile(putanja, JSON.stringify(zaposlenici, null, 2), "utf8");

    res.status(201).json(noviZaposlenik);
  } catch (err) {
    console.error(err);
    res.status(500).json({ greska: "Ne može se spremiti zaposlenika" });
  }
});

app.listen(PORT, () => {
  console.log(`Poslužitelj je pokrenut na portu ${PORT}`);
});
