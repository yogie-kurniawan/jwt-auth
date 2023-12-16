const verify = require("./verify");
const authenticate = (req, res, next) => {
  if (!verify(req, res, next)) {
    return res.redirect("/login");
  }
  next();
};

module.exports = authenticate;
