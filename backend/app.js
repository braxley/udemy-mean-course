const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, Content-Type, Accept, X-Requested-With"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTION"
  );
  next();
});

app.post("/api/posts", (req, res, next) => {
  const post = req.body;
  console.log(post);
  res.status(201).json({ message: "Successfully posted!" });
});

app.get("/api/posts", (req, res, next) => {
  const posts = [
    {
      id: "1298u123hou",
      title: "First post title",
      content: "First post content",
    },
    {
      id: "98z12q408u",
      title: "First post title",
      content: "First post content",
    },
  ];
  res.status(200).json({ message: "Fetching successful!", posts: posts });
});

module.exports = app;
