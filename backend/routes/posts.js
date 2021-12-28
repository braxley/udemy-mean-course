const express = require("express");
const router = express.Router();
const PostController = require("../controllers/post");
const checkAuth = require("../middleware/check-auth");

const multer = require("multer");
const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
};
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = Boolean(MIME_TYPE_MAP[file.mimetype]);
    const error = isValid ? null : (error = new Error("Invalid mime type"));
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
  checkAuth,
  multer({ storage }).single("image"),
  PostController.postPost
);

router.get("", PostController.getPosts);

router.get("/:id", PostController.getPost);

router.put(
  "/:id",
  checkAuth,
  multer({ storage }).single("image"),
  PostController.updatePost
);

router.delete("/:id", checkAuth, PostController.deletePost);

module.exports = router;
