const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const saltRounds = parseInt(process.env.SALT_ROUNDS);

const getRegister = (req, res) => {
  return res.render("pages/register");
};

const postRegister = async (req, res) => {
  const { name, username, password, email } = req.body;
  let errors = {};

  // Validation
  if (!name) {
    errors.name = { msg: "Name is required!" };
  }
  if (!username) {
    errors.username = { msg: "Username is required!" };
  }
  if (!email) {
    errors.email = { msg: "Email is required!" };
  }
  if (email) {
    const regexCode =
      '/^(([^<>()[]\\.,;:s@"]+(.[^<>()[]\\.,;:s@"]+)*)|(".+"))@(([[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}])|(([a-zA-Z-0-9]+.)+[a-zA-Z]{2,}))$/';
    if (!username.match(regexCode)) {
      errors.username = { msg: "Email is not valid" };
    }
  }
  if (!password) {
    errors.password = { msg: "Password is required!" };
  }

  if (Object.keys(errors).length > 0) {
    return res.render("pages/register", {
      errors,
      name,
      username,
      email,
      password,
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = new User({
      name,
      username,
      email,
      password: hashedPassword,
    });

    const save = await newUser.save();
    if (save) {
      req.session.success = "Registration successful!";
      return res.redirect("/login");
    } else {
      req.session.error = "Failed to register!";
    }
  } catch (err) {}
};

const getLogin = (req, res) => {
  return res.render("pages/login");
};

const postLogin = async (req, res) => {
  const { username, password } = req.body;
  let errors = [];
  if (!username) errors.push({ msg: "Username is required!" });
  if (!password) errors.push({ msg: "Password is required" });

  if (errors.length > 0) {
    return res.render("pages/login", {
      errors,
      username,
    });
  }
  try {
    const user = await User.findOne({ username });
    if (!user) {
      req.session.error = "User not found";
      return res.redirect("/login");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      req.session.error = "Password is incorrect!";
      return res.redirect("/login");
    }
    let userData = {
      id: user._id,
      username: user.username,
    };

    const token =
      "Bearer " +
      jwt.sign(userData, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_LIFETIME,
      });

    req.session.user = userData;

    res.cookie("token", token, {
      maxAge: 24 * 60 * 60 * 1000,
      secure: true,
      httpOnly: true,
    });
    req.session.success = "Login successful!";
    return res.redirect("/");
  } catch (error) {
    req.session.error = "There was something wrong, try again!";
    return res.redirect("/login");
  }
};

const logout = (req, res, next) => {
  req.session.destroy();
  res.clearCookie("token");
  return res.redirect("/login");
};

module.exports = {
  getLogin,
  postLogin,
  getRegister,
  postRegister,
  logout,
};
