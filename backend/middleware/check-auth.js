const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    // the authorization header is mostly in the form of "Bearer ihgkhasdkjdih234073204fjlkl"
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, "this_is_only_a_development_key");
    next();
  } catch (error) {
    res.status(401).json({ message: "Auth failed!" });
  }
};
