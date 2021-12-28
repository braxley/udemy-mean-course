const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

exports.createUser = (req, res, next) => {
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
      .catch(() => {
        res
          .status(500)
          .json({ message: "Invalid authentication credentials!" });
      });
  });
};

exports.loginUser = (req, res, next) => {
  let fetchedUser;
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (user) {
        fetchedUser = user;
        return bcrypt.compare(req.body.password, user.password);
      }
      return res.status(401).json({ message: "Auth failed" });
    })
    .then((result) => {
      if (result) {
        const userId = fetchedUser._id;
        const token = jwt.sign(
          { email: fetchedUser.email, userId },
          "this_is_only_a_development_key",
          { expiresIn: "1h" }
        );
        return res
          .status(200)
          .json({ message: "Auth succeeded!", token, expiresIn: 3600, userId });
      }
      res.status(401).json({ message: "Invalid authentication credentials!" });
    })
    .catch((error) => {
      return res.status(401).json({ message: "Login failed" });
    });
};
