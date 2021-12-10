const express = require("express");
const router = express.Router();

const Post = require("../models/post");

router.post("", (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
  });
  post.save().then((addedPost) => {
    const id = addedPost._id;
    res.status(201).json({ message: "Successfully posted!", postId: id });
  });
});

router.get("", (req, res, next) => {
  Post.find().then((documents) => {
    res.status(200).json({ message: "Fetching successful!", posts: documents });
  });
});

router.get("/:id", (req, res, next) => {
  Post.findById(req.params.id).then((post) => {
    return post
      ? res.status(200).json(post)
      : res.status(404).json({ message: "Fetching failed!" });
  });
});

router.put("/:id", (req, res, next) => {
  const post = new Post({
    _id: req.params.id,
    title: req.body.title,
    content: req.body.content,
  });
  Post.updateOne({ _id: req.params.id }, post).then((result) => {
    res.status(200).json({ message: "Successfully updated!" });
  });
});

router.delete("/:id", (req, res, next) => {
  Post.deleteOne({ _id: req.params.id }).then((result) => {
    res.status(200).json({ message: "Successfully deleted!" });
  });
});

module.exports = router;
