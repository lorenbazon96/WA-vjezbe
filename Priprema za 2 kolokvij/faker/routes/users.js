import express from "express";
import { faker } from "@faker-js/faker";
import { ObjectId } from "mongodb";
import { findUserById } from "../middleware/middleware.js";
import { body, validationResult } from "express-validator";
import { hashPassword } from "../auth.js";
import jwt from "jsonwebtoken";
import { comparePasswords } from "../auth.js";
import { authUser } from "../middleware/middleware.js";

const router = express.Router();

function createFakeUser() {
  return {
    username: faker.internet.username(),
    email: faker.internet.email(),
    avatar: faker.image.avatar(),
    birthdate: faker.date.birthdate(),
    registeredAt: new Date(),
  };
}

router.post(
  "/fake",
  body("password").isLength({ min: 6 }).isAlphanumeric(),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const db = req.app.locals.db;
      const { password } = req.body;

      const user = createFakeUser();

      user.password = await hashPassword(password);

      const result = await db.collection("users").insertOne(user);

      res.status(201).json({
        message: "Fake user uspješno dodan",
        userId: result.insertedId,
      });
    } catch (err) {
      res.status(500).json({ message: "Greška pri dodavanju usera" });
    }
  },
);

router.post("/login", async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { username, email, password } = req.body;

    if ((!username && !email) || !password) {
      return res.status(400).json({ message: "Nedostaju podaci" });
    }

    const user = await db.collection("users").findOne({
      $or: [{ username }, { email }],
    });

    if (!user) {
      return res.status(401).json({ message: "Neispravni podaci za prijavu" });
    }

    const passwordMatch = await comparePasswords(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Neispravni podaci za prijavu" });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        username: user.username,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" },
    );

    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ message: "Greška pri prijavi" });
  }
});

router.get("/", authUser, async (req, res) => {
  try {
    const db = req.app.locals.db;
    const limit = parseInt(req.query.limit);

    let query = db.collection("users").find();

    if (!isNaN(limit)) {
      query = query.limit(limit);
    }

    const users = await query.toArray();

    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: "Greška pri dohvaćanju korisnika" });
  }
});

router.get("/:id", authUser, findUserById, (req, res) => {
  res.status(200).json(req.user);
});

router.delete("/:id", authUser, findUserById, async (req, res) => {
  const db = req.app.locals.db;

  await db.collection("users").deleteOne({ _id: req.user._id });

  res.status(200).json({ message: "Korisnik obrisan" });
});

export default router;
