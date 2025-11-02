import express from "express";

const router = express.Router();

const pizze = [
  { id: 1, naziv: "Margerita", cijena: 7.0 },
  { id: 2, naziv: "Capricciosa", cijena: 9.0 },
  { id: 3, naziv: "Šunka sir", cijena: 8.0 },
  { id: 4, naziv: "Vegetariana", cijena: 12.0 },
  { id: 5, naziv: "Quattro formaggi", cijena: 15.0 },
];

router.get("/", (req, res) => {
  res.json(pizze);
});

router.get("/:id", (req, res) => {
  const id_pizza = req.params.id;
  if (isNaN(id_pizza)) {
    return res
      .status(400)
      .json({ message: "Proslijedili ste parametar id koji nije broj!" });
  }
  const pizza = pizze.find((pizza) => pizza.id == id_pizza);
  if (pizza) {
    res.json(pizza);
  } else {
    return res
      .status(404)
      .json({ message: "Pizza s traženim ID-em ne postoji." });
  }
});

router.put("/:id", (req, res) => {
  const id_pizza = req.params.id;
  if (isNaN(id_pizza))
    return res.status(400).json({ message: "Parametar id mora biti broj." });

  const index = pizze.findIndex((pizza) => pizza.id == id_pizza);
  if (index === -1)
    return res
      .status(404)
      .json({ message: "Pizza s traženim ID-em ne postoji." });

  const nova_pizza = req.body;
  nova_pizza.id = Number(id_pizza);
  pizze[index] = nova_pizza;

  return res.json(pizze[index]);
});

router.patch("/:id", (req, res) => {
  const id_pizza = req.params.id;
  if (isNaN(id_pizza))
    return res.status(400).json({ message: "Parametar id mora biti broj." });

  const index = pizze.findIndex((pizza) => pizza.id == id_pizza);
  if (index === -1)
    return res
      .status(404)
      .json({ message: "Pizza s traženim ID-em ne postoji." });

  const nova_pizza = req.body;
  for (const key in nova_pizza) {
    pizze[index][key] = nova_pizza[key];
  }
  return res.json(pizze[index]);
});

router.delete("/:id", (req, res) => {
  const id_pizza = req.params.id;
  if (isNaN(id_pizza))
    return res.status(400).json({ message: "Parametar id mora biti broj." });

  const index = pizze.findIndex((pizza) => pizza.id == id_pizza);
  if (index === -1)
    return res
      .status(404)
      .json({ message: "Pizza s traženim ID-em ne postoji." });

  pizze.splice(index, 1);
  return res.status(204).send();
});

export { pizze };
export default router;
