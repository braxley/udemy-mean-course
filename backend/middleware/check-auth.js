const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    // the authorization header is mostly in the form of "Bearer ihgkhasdkjdih234073204fjlkl"
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_TOKEN);
    req.userData = decodedToken;
    next();
  } catch (error) {
    res.status(401).json({ message: "You are not authenticated." });
  }
};
