const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const postRoutes = require("./routes/posts");

const app = express();

mongoose
  .connect(
    "mongodb+srv://steve:7DGz8CzZCZ6kD2h@cluster0.mnk6i.mongodb.net/node-angular?retryWrites=true&w=majority"
  )
  .then(console.log("Connection successfully established"))
  .catch(() => {
    console.log("Connection error");
  });

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, Content-Type, Accept, X-Requested-With"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTION, PUT"
  );
  next();
});

app.use("/api/posts", postRoutes);

module.exports = app;
