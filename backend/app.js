const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const Post = require("./models/post");

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
    "GET, POST, PATCH, DELETE, OPTION"
  );
  next();
});

app.post("/api/posts", (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
  });
  post.save().then((addedPost) => {
    const id = addedPost._id;
    res.status(201).json({ message: "Successfully posted!", postId: id });
  });
});

app.get("/api/posts", (req, res, next) => {
  Post.find().then((documents) => {
    console.log(documents);
    res.status(200).json({ message: "Fetching successful!", posts: documents });
  });
});

app.delete("/api/posts/:id", (req, res, next) => {
  Post.deleteOne({ _id: req.params.id }).then((result) => {
    console.log(result);
    res.status(200).json({ message: "Successfully deleted!" });
  });
});

module.exports = app;
