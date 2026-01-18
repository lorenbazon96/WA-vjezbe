import { Router } from "express";
import { param } from "express-validator";
import { findMovieById } from "../middleware/movies.js";
import { validate } from "../middleware/validation.js";
import { body } from "express-validator";
import { query } from "express-validator";

const router = Router();

const movies = [
  {
    id: 4222334,
    title: "The Shawshank Redemption",
    year: 1994,
    genre: "Drama",
    director: "Frank Darabont",
  },
  {
    id: 5211223,
    title: "The Godfather",
    year: 1972,
    genre: "Crime",
    director: "Francis Ford Coppola",
  },
  {
    id: 4123123,
    title: "The Dark Knight",
    year: 2008,
    genre: "Action",
    director: "Christopher Nolan",
  },
];

router.get(
  "/",
  [
    query("min_year")
      .optional()
      .isInt()
      .withMessage("min_year mora biti integer")
      .toInt(),
    query("max_year")
      .optional()
      .isInt()
      .withMessage("max_year mora biti integer")
      .toInt(),
    query().custom((value, { req }) => {
      const { min_year, max_year } = req.query;

      if (min_year !== undefined && max_year !== undefined) {
        if (Number(min_year) >= Number(max_year)) {
          throw new Error("min_year mora biti manji od max_year");
        }
      }

      return true;
    }),
    validate,
  ],
  (req, res) => {
    const { min_year, max_year } = req.query;

    let result = [...movies];

    if (min_year !== undefined) {
      result = result.filter((m) => m.year >= Number(min_year));
    }

    if (max_year !== undefined) {
      result = result.filter((m) => m.year <= Number(max_year));
    }

    return res.json(result);
  }
);

router.get(
  "/:id",
  [
    param("id").isInt().withMessage("id mora biti integer"),
    validate,
    findMovieById(movies),
  ],
  (req, res) => {
    return res.json(req.movie);
  }
);

router.post(
  "/",
  [
    body("title")
      .isString()
      .withMessage("Mora biti string")
      .trim()
      .notEmpty()
      .withMessage("Potrebno ispuniti")
      .escape(),
    body("year")
      .isInt({ min: 1888 })
      .withMessage("Mora biti integer (>= 1888)")
      .toInt(),
    body("genre")
      .isString()
      .withMessage("Mora biti string")
      .trim()
      .notEmpty()
      .withMessage("Potrebno ispuniti")
      .escape(),
    body("director")
      .isString()
      .withMessage("Mora biti string")
      .trim()
      .notEmpty()
      .withMessage("Potrebno ispuniti")
      .escape(),
    validate,
  ],
  (req, res) => {
    const { title, year, genre, director } = req.body;

    const nextId = movies.length ? Math.max(...movies.map((m) => m.id)) + 1 : 1;

    const newMovie = { id: nextId, title, year, genre, director };
    movies.push(newMovie);

    return res.status(201).json(newMovie);
  }
);

router.patch(
  "/:id",
  [
    param("id").isInt().withMessage("Mora biti integer"),
    body().custom((value, { req }) => {
      const allowed = ["title", "year", "genre", "director"];
      const keys = Object.keys(req.body);

      if (keys.length === 0) {
        throw new Error("Potrebno ispuniti barem jedno polje");
      }

      const hasAllowed = keys.some((k) => allowed.includes(k));
      if (!hasAllowed) {
        throw new Error(
          "Potrebno ispuniti barem jedno od dozvoljenih polja (title, year, genre, director)"
        );
      }

      return true;
    }),

    body("title")
      .optional()
      .isString()
      .withMessage("Mora biti string")
      .trim()
      .notEmpty()
      .withMessage("Mora biti ispunjeno")
      .escape(),

    body("year")
      .optional()
      .isInt({ min: 1888 })
      .withMessage("Mora biti integer (>= 1888)")
      .toInt(),

    body("genre")
      .optional()
      .isString()
      .withMessage("Mora biti string")
      .trim()
      .notEmpty()
      .withMessage("Mora biti ispunjeno")
      .escape(),

    body("director")
      .optional()
      .isString()
      .withMessage("Mora biti string")
      .trim()
      .notEmpty()
      .withMessage("Mora biti ispunjeno")
      .escape(),

    validate,
    findMovieById(movies),
  ],
  (req, res) => {
    const movie = req.movie;

    const { title, year, genre, director } = req.body;

    if (title !== undefined) movie.title = title;
    if (year !== undefined) movie.year = year;
    if (genre !== undefined) movie.genre = genre;
    if (director !== undefined) movie.director = director;

    return res.json(movie);
  }
);

export default router;
