import { ObjectId } from "mongodb";
import jwt from "jsonwebtoken";

export async function findUserById(req, res, next) {
  try {
    const db = req.app.locals.db;
    const { id } = req.params;

    if (!id || typeof id !== "string" || id.length !== 24) {
      return res.status(400).json({ message: "Neispravan ID" });
    }

    const user = await db
      .collection("users")
      .findOne({ _id: new ObjectId(id) });

    if (!user) {
      return res.status(404).json({ message: "Korisnik ne postoji" });
    }

    req.user = user;

    next();
  } catch (err) {
    res.status(500).json({ message: "Greška u middlewareu" });
  }
}

export function authUser(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Nedostaje token" });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Neispravan token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.auth = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token nije valjan" });
  }
}
