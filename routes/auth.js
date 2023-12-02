const express = require("express");
const router = express.Router();
const {
  getLogin,
  postLogin,
  getRegister,
  postRegister,
  logout,
} = require("../controllers/auth");
const ifAuthenticated = require("../middleware/ifAuthenticated");
const authenticate = require("../middleware/authenticate");

router.get("/login", ifAuthenticated, getLogin);
router.post("/login", ifAuthenticated, postLogin);
router.get("/register", ifAuthenticated, getRegister);
router.post("/register", ifAuthenticated, postRegister);
router.get("/logout", authenticate, logout);

module.exports = router;
