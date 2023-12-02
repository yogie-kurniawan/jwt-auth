const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.cookies.token;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return false;
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.session.user = decoded;
    return true;
  } catch (error) {
    return false;
  }
};

module.exports = verifyToken;
