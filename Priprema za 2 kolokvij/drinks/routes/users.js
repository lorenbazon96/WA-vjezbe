import express from "express";
import { body, validationResult } from "express-validator";
import { hashPassword } from "../auth.js";
import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator";
import { comparePassword } from "../auth.js";

const router = express.Router();

router.post(
  "/",
  [
    body("username")
      .isString()
      .isLength({ min: 3, max: 20 })
      .withMessage("Username mora imati između 3 i 20 znakova"),

    body("password")
      .isString()
      .isLength({ min: 8 })
      .isAlphanumeric()
      .withMessage(
        "Password mora imati najmanje 8 znakova i biti alfanumerički",
      ),

    body("email")
      .isString()
      .contains("@")
      .contains(".")
      .withMessage("Email mora sadržavati @ i ."),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const db = req.app.locals.db;
      const { username, password, email } = req.body;

      const existingUser = await db.collection("users").findOne({ username });

      if (existingUser) {
        return res.status(400).json({ message: "Korisničko ime već postoji" });
      }

      const hashedPassword = await hashPassword(password, 10);

      const result = await db.collection("users").insertOne({
        username,
        password: hashedPassword,
        email,
      });

      res.status(201).json({
        message: "Novi korisnik dodan",
        id: result.insertedId,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
);

router.post(
  "/login",
  [
    body("username").isString().notEmpty().withMessage("Username je obavezan"),

    body("password").isString().notEmpty().withMessage("Password je obavezan"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const db = req.app.locals.db;
      const { username, password } = req.body;

      const user = await db.collection("users").findOne({ username });
      if (!user) {
        return res.status(404).json({ message: "Korisnik ne postoji" });
      }

      const isMatch = await comparePassword(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Neispravna lozinka" });
      }

      const token = jwt.sign(
        { username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: "1h" },
      );

      res.status(200).json({ token });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
);

export default router;
