const express = require("express");
const router = express.Router();
const multer = require("multer");

const Post = require("../models/post");

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = Boolean(MIME_TYPE_MAP[file.mimetype]);
    let error = new Error("Invalid mime type");
    if (isValid) {
      error = null;
    }
    cb(error, "backend/images");
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname.toLowerCase().split(" ").join("-");
    const extension = MIME_TYPE_MAP[file.mimetype];

    cb(null, `${fileName}-${Date.now()}.${extension}`);
  },
});

router.post(
  "",
  multer({ storage: storage }).single("image"),
  (req, res, next) => {
    const url = req.protocol + "://" + req.get("host");
    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      imagePath: url + "/images/" + req.file.filename,
    });
    post.save().then((addedPost) => {
      const post = new Post({
        ...addedPost,
        id: addedPost._id,
      });

      res.status(201).json({ message: "Successfully posted!", post });
    });
  }
);

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
