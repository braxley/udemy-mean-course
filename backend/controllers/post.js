const Post = require("../models/post");

exports.postPost = (req, res, next) => {
  const url = req.protocol + "://" + req.get("host");
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + "/images/" + req.file.filename,
    creator: req.userData.userId,
  });
  post
    .save()
    .then((addedPost) => {
      const post = new Post({
        ...addedPost,
        id: addedPost._id,
      });

      res.status(201).json({ message: "Successfully posted!", post });
    })
    .catch(() => {
      res.status(500).json({ message: "Creating the post failed." });
    });
};

exports.getPosts = (req, res, next) => {
  const page = +req.query.page;
  const pageSize = +req.query.pageSize;
  const postQuery = Post.find();
  let fetchedPosts;
  if (page && pageSize) {
    postQuery.skip((page - 1) * pageSize).limit(pageSize);
  }
  postQuery
    .then((documents) => {
      fetchedPosts = documents;
      Post.count();
    })
    .then((count) => {
      res.status(200).json({
        message: "Fetching successful!",
        posts: fetchedPosts,
        maxPosts: count,
      });
    })
    .catch(() => {
      res.status(500).json({ message: "Fetching posts failed." });
    });
};

exports.getPost = (req, res, next) => {
  Post.findById(req.params.id)
    .then((post) => {
      return post
        ? res.status(200).json(post)
        : res.status(404).json({ message: "Fetching failed!" });
    })
    .catch(() => {
      res.status(500).json({ message: "Fetching post failed." });
    });
};

exports.updatePost = (req, res, next) => {
  let imagePath;
  if (req.file) {
    const url = req.protocol + "://" + req.get("host");
    imagePath = url + "/images/" + req.file.filename;
  } else {
    imagePath = req.body.imagePath;
  }

  const userId = req.userData.userId;
  const post = new Post({
    _id: req.params.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath,
    creator: userId,
  });
  Post.updateOne({ _id: req.params.id, creator: userId }, post)
    .then((result) => {
      if (result.modifiedCount > 0) {
        res.status(200).json({ message: "Successfully updated!", post });
      } else {
        res.status(401).json({ message: "The user not authorized!" });
      }
    })
    .catch(() => {
      res.status(500).json({ message: "Couldn't update post." });
    });
};

exports.deletePost = (req, res, next) => {
  Post.deleteOne({ _id: req.params.id, creator: req.userData.userId })
    .then((result) => {
      if (result.deletedCount > 0) {
        res.status(200).json({ message: "Successfully deleted!" });
      } else {
        res.status(401).json({ message: "User not authorized!" });
      }
    })
    .catch(() => {
      res.status(500).json({ message: "Deleting post failed." });
    });
};
