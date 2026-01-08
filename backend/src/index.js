const path = require("path");
const express = require("express");
const { app } = require("./server");

const PORT = process.env.PORT || 8080;
const ENV = process.env.ENV || "local";

if (ENV === "online") {
  const distPath = path.join(__dirname, "../frontend/dist");
  app.use(express.static(distPath));

  app.get(/.*/, (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT} (env=${ENV})`);
});
