const express = require("express");
const path = require("path");
const app = express();

const PORT = 3000;

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "about.html"));
});

const users = [
  { id: 1, ime: "Ivan", prezime: "Ivić" },
  { id: 2, ime: "Ana", prezime: "Anić" },
  { id: 3, ime: "Marija", prezime: "Marić" },
];

app.get("/users", (req, res) => {
  res.json(users);
});

app.listen(PORT, (error) => {
  if (error) {
    console.error(`Greška prilikom pokretanja poslužitelja: ${error.message}`);
  } else {
    console.log(`Server je pokrenut na http://localhost:${PORT}`);
  }
});
