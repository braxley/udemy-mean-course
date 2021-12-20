const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

const router = express.Router();

router.post("/signup", (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then((hash) => {
    const user = new User({
      email: req.body.email,
      password: hash,
    });
    user
      .save()
      .then((result) => {
        res.status(201).json({ message: "Successfully signed up!", result });
      })
      .catch((error) => {
        res.status(500).json({ error });
      });
  });
});

router.post("/login", (req, res, next) => {
  let fetchedUser;
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ message: "Auth failed!" });
      }
      fetchedUser = user;

      return bcrypt.compare(req.body.password, user.password);
    })
    .then((result) => {
      if (!result) {
        return res.status(401).json({ message: "Auth failed!" });
      }
      const token = jwt.sign(
        { email: fetchedUser.email, userId: fetchedUser._id },
        "this_is_only_a_development_key",
        { expiresIn: "1h" }
      );
      res.status(200).json({ message: "Auth succeeded!", token });
    })
    .catch((error) => {
      return res.status(401).json({ error });
    });
});

module.exports = router;
