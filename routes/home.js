const express = require("express");
const router = express.Router();
const { getHome } = require("../controllers/home");
const authenticate = require("../middleware/authenticate");

router.get("", authenticate, getHome);
module.exports = router;
