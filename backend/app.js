const express = require("express");

const app = express();

app.use((req, res, next) => {
  console.log("In first app.use");
  next();
});

app.use((req, res, next) => {
  res.send("In second app.use");
});

module.exports = app;
