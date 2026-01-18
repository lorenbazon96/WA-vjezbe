export function findActorById(actors) {
  return (req, res, next) => {
    const id = parseInt(req.params.id, 10);

    const actor = actors.find((a) => a.id === id);

    if (!actor) {
      return res.status(404).json({ message: "Glumac nije poronađen" });
    }

    req.actor = actor;
    return next();
  };
}
