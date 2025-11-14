import express from "express";

const router = express.Router();

export const properties = [
  {
    id: 1,
    name: "Stan u Puli",
    description: "Lijep dvosoban stan u centru Pule",
    price: 120000,
    location: "Pula",
    rooms: 2,
    size: 60,
  },
  {
    id: 2,
    name: "Kuća u Rovinju",
    description: "Kuća u centru Rovinja",
    price: 425000,
    location: "Rovinj",
    rooms: 4,
    size: 150,
  },
];

function isValidId(id) {
  return !isNaN(id);
}

function validateProperty(data, { partial = false } = {}) {
  const requiredFields = [
    "name",
    "description",
    "price",
    "location",
    "rooms",
    "size",
  ];

  if (!partial) {
    const missing = requiredFields.filter((field) => !(field in data));
    if (missing.length > 0) {
      return `Nedostaju polja: ${missing.join(", ")}`;
    }
  }

  if ("price" in data && (typeof data.price !== "number" || data.price < 0)) {
    return "Cijena nekretnine mora biti pozitivan broj.";
  }

  if ("rooms" in data && (typeof data.rooms !== "number" || data.rooms < 0)) {
    return "Broj soba mora biti pozitivan.";
  }

  if ("size" in data && (typeof data.size !== "number" || data.size < 0)) {
    return "Površina nekretnine mora biti pozitivna.";
  }

  if ("name" in data && typeof data.name !== "string") {
    return "Naziv nekretnine mora biti string.";
  }

  if ("description" in data && typeof data.description !== "string") {
    return "Opis nekretnine mora biti string.";
  }

  if ("location" in data && typeof data.location !== "string") {
    return "Lokacija nekretnine mora biti string.";
  }

  return null;
}

router.get("/", (req, res) => {
  return res.status(200).json(properties);
});

router.get("/:id", (req, res) => {
  const id = req.params.id;

  if (!isValidId(id)) {
    return res.status(400).json({ message: "ID nekretnine mora biti broj." });
  }

  const property = properties.find((p) => p.id == id);

  if (!property) {
    return res.status(404).json({ message: "Nekretnina nije pronađena." });
  }

  return res.status(200).json(property);
});

router.post("/", (req, res) => {
  const data = req.body;

  const errorMessage = validateProperty(data, { partial: false });
  if (errorMessage) {
    return res.status(400).json({ message: errorMessage });
  }

  const newId =
    properties.length > 0 ? Math.max(...properties.map((p) => p.id)) + 1 : 1;

  const newProperty = {
    id: newId,
    name: data.name,
    description: data.description,
    price: data.price,
    location: data.location,
    rooms: data.rooms,
    size: data.size,
  };

  properties.push(newProperty);

  return res.status(201).json(newProperty);
});

router.put("/:id", (req, res) => {
  const id = req.params.id;

  if (!isValidId(id)) {
    return res.status(400).json({ message: "ID nekretnine mora biti broj." });
  }

  const index = properties.findIndex((p) => p.id == id);

  if (index === -1) {
    return res.status(404).json({ message: "Nekretnina nije pronađena." });
  }

  const data = req.body;
  const errorMessage = validateProperty(data, { partial: false });

  if (errorMessage) {
    return res.status(400).json({ message: errorMessage });
  }

  const updatedProperty = {
    id: properties[index].id,
    name: data.name,
    description: data.description,
    price: data.price,
    location: data.location,
    rooms: data.rooms,
    size: data.size,
  };

  properties[index] = updatedProperty;

  return res.status(200).json(updatedProperty);
});

router.patch("/:id", (req, res) => {
  const id = req.params.id;

  if (!isValidId(id)) {
    return res.status(400).json({ message: "ID nekretnine mora biti broj." });
  }

  const index = properties.findIndex((p) => p.id == id);

  if (index === -1) {
    return res.status(404).json({ message: "Nekretnina nije pronađena." });
  }

  const data = req.body;
  const errorMessage = validateProperty(data, { partial: true });

  if (errorMessage) {
    return res.status(400).json({ message: errorMessage });
  }

  properties[index] = { ...properties[index], ...data };

  return res.status(200).json(properties[index]);
});

router.delete("/:id", (req, res) => {
  const id = req.params.id;

  if (!isValidId(id)) {
    return res.status(400).json({ message: "ID nekretnine mora biti broj." });
  }

  const index = properties.findIndex((p) => p.id == id);

  if (index === -1) {
    return res.status(404).json({ message: "Nekretnina nije pronađena." });
  }

  properties.splice(index, 1);

  return res.status(204).send();
});

export default router;
