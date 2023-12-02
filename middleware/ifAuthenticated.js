const verify = require("./verify");
const ifAuthenticated = (req, res, next) => {
  if (verify(req, res, next)) {
    return res.redirect("/");
  }
  return next();
};

module.exports = ifAuthenticated;
