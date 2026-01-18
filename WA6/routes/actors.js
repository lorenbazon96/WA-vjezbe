import { Router } from "express";
import { param } from "express-validator";
import { validate } from "../middleware/validation.js";
import { findActorById } from "../middleware/actors.js";
import { body } from "express-validator";

const router = Router();

const actors = [
  { id: 123, name: "Morgan Freeman", birthYear: 1937, movies: [4222334] },
  { id: 234, name: "Marlon Brando", birthYear: 1924, movies: [5211223] },
  { id: 345, name: "Al Pacino", birthYear: 1940, movies: [5211223] },
];

router.get("/", (req, res) => {
  return res.json(actors);
});

router.get(
  "/name/:name",
  [
    param("name")
      .isString()
      .withMessage("name mora biti string")
      .trim()
      .notEmpty()
      .withMessage("name ne smije biti prazan")
      .escape(),
    validate,
  ],
  (req, res) => {
    const q = req.params.name.toLowerCase();
    const filtered = actors.filter((a) => a.name.toLowerCase().includes(q));
    return res.json(filtered);
  }
);

router.get(
  "/:id",
  [
    param("id").isInt().withMessage("id mora biti integer"),
    validate,
    findActorById(actors),
  ],
  (req, res) => {
    return res.json(req.actor);
  }
);

router.post(
  "/",
  [
    body("name")
      .isString()
      .withMessage("Mora biti string")
      .trim()
      .notEmpty()
      .withMessage("Mora biti ispunjeno")
      .escape(),
    body("birthYear")
      .isInt({ min: 1850, max: new Date().getFullYear() })
      .withMessage("Mora biti integer")
      .toInt(),
    validate,
  ],
  (req, res) => {
    const { name, birthYear } = req.body;

    const nextId = actors.length ? Math.max(...actors.map((a) => a.id)) + 1 : 1;

    const newActor = { id: nextId, name, birthYear, movies: [] };
    actors.push(newActor);

    return res.status(201).json(newActor);
  }
);

router.patch(
  "/:id",
  [
    param("id").isInt().withMessage("Mora biti integer"),

    body().custom((value, { req }) => {
      const allowed = ["name", "birthYear"];
      const keys = Object.keys(req.body);

      if (keys.length === 0) {
        throw new Error("Barem jedno polje mora biti ispunjeno");
      }

      const hasAllowed = keys.some((k) => allowed.includes(k));
      if (!hasAllowed) {
        throw new Error("Barem jedno polje mora biti ispunjeno");
      }

      return true;
    }),

    body("name")
      .optional()
      .isString()
      .withMessage("Mora biti string")
      .trim()
      .notEmpty()
      .withMessage("Mora biti ispunjeno")
      .escape(),

    body("birthYear")
      .optional()
      .isInt({ min: 1850, max: new Date().getFullYear() })
      .withMessage("Mora biti integer")
      .toInt(),

    validate,
    findActorById(actors),
  ],
  (req, res) => {
    const actor = req.actor;
    const { name, birthYear } = req.body;

    if (name !== undefined) actor.name = name;
    if (birthYear !== undefined) actor.birthYear = birthYear;

    return res.json(actor);
  }
);

export default router;
