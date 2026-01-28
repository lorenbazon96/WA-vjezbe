import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Nedostaje username ili password" });
    }

    const existing = await db.collection("users").findOne({ username });
    if (existing) {
      return res.status(409).json({ message: "Korisnik već postoji" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await db.collection("users").insertOne({
      username,
      passwordHash,
      created_at: new Date(),
    });

    res.status(201).json({ message: "Korisnik registriran" });
  } catch (err) {
    res.status(500).json({ message: "Greška pri registraciji" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { username, password } = req.body;

    const user = await db.collection("users").findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Neispravni podaci" });
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return res.status(401).json({ message: "Neispravni podaci" });
    }

    const token = jwt.sign(
      { userId: user._id.toString(), username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "24h" },
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: "Greška pri prijavi" });
  }
});

export default router;
