// server.js
const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Route pour obtenir les niveaux
app.get("/api/maps/:map", (req, res) => {
  const map = req.params.map;
  const filePath = path.join(__dirname, "maps", `map${map}.json`);

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      res.status(404).send({ error: "Map not found" });
      return;
    }
    res.send(JSON.parse(data));
  });
});

// Route pour obtenir les niveaux
app.get("/api/levels/:level", (req, res) => {
  const level = req.params.level;
  const filePath = path.join(__dirname, "levels", `level${level}.json`);

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      res.status(404).send({ error: "Level not found" });
      return;
    }
    res.send(JSON.parse(data));
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
