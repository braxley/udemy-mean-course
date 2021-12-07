const express = require("express");

const app = express();

app.use("/api/posts", (req, res, next) => {
  const posts = [
    { title: "First post title", content: "First post content" },
    { title: "First post title", content: "First post content" },
  ];
  res.status(200).json({ message: "Fetching successful!", posts: posts });
});

module.exports = app;
