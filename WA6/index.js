import express from "express";
import requestLogger from "./middleware/requestLogger.js";
import moviesRouter from "./routes/movies.js";
import actorsRouter from "./routes/actors.js";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(requestLogger);
app.use("/movies", moviesRouter);
app.use("/actors", actorsRouter);

app.listen(PORT, () => {
  console.log(`Poslužitelj sluša na portu http://localhost:${PORT}`);
});
