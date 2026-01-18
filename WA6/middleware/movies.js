export function findMovieById(movies) {
  return (req, res, next) => {
    const id = parseInt(req.params.id, 10);

    const movie = movies.find((m) => m.id === id);

    if (!movie) {
      return res.status(404).json({ message: "Film nije pronađen" });
    }

    req.movie = movie;
    return next();
  };
}
