const validateSingleDrink = (drink) => {
  if (
    drink.naziv === undefined ||
    drink.zapremnina === undefined ||
    drink.cijena === undefined ||
    drink.kolicina === undefined
  ) {
    return "Nedostaju podaci o napitku";
  }

  if (
    typeof drink.naziv !== "string" ||
    drink.naziv.length < 3 ||
    drink.naziv.length > 50
  ) {
    return "Naziv napitka mora biti string duljine između 3 i 50 znakova";
  }

  if (typeof drink.zapremnina !== "number" || drink.zapremnina < 0.1) {
    return "Zapremnina mora biti 0.1 ili veća";
  }

  if (typeof drink.cijena !== "number" || drink.cijena < 0.5) {
    return "Cijena mora biti 0.5 ili veća";
  }

  if (typeof drink.kolicina !== "number" || drink.kolicina < 50) {
    return "Količina mora biti 50 ili veća";
  }

  return null;
};

const validateDrink = (req, res, next) => {
  const body = req.body;

  if (Array.isArray(body)) {
    if (body.length === 0) {
      return res
        .status(400)
        .json({ message: "Polje napitaka ne smije biti prazno" });
    }

    for (const drink of body) {
      const error = validateSingleDrink(drink);
      if (error) {
        return res.status(400).json({ message: error });
      }
    }

    req.type = "array";
    return next();
  }

  if (typeof body === "object" && body !== null) {
    const error = validateSingleDrink(body);
    if (error) {
      return res.status(400).json({ message: error });
    }

    req.type = "single";
    return next();
  }

  return res.status(400).json({ message: "Neispravan format podataka" });
};

export default validateDrink;
