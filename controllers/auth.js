const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const saltRounds = parseInt(process.env.SALT_ROUNDS);

const getRegister = (req, res) => {
  res.render("pages/register", { error: req.session.error });
  req.session.destroy();
  return;
};

const postRegister = async (req, res) => {
  const { name, username, password, email } = req.body;
  let errors = {};

  try {
    let valueExists = async (field, value) => {
      return await User.findOne({ field: value });
    };

    if (await valueExists("username", username)) {
      errors.username = { msg: "Username already exists!" };
    }
    if (await valueExists("email", email)) {
      errors.email = { msg: "Email already exists!" };
    }
  } catch (error) {
    console.log(error);
    req.session.error = "Failed to register!";
    return res.redirect("/register");
  }

  if (!name) {
    // Validation
    errors.name = { msg: "Name is required!" };
  }
  if (!username) {
    errors.username = { msg: "Username is required!" };
  }
  if (!email) {
    errors.email = { msg: "Email is required!" };
  } else if (!email.match(/^\S+@\S+\.\S+$/)) {
    errors.email = { msg: "Email is not valid!" };
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
    const savedUser = await newUser.save();

    if (savedUser) {
      req.session.success = "Registration successful!";
      return res.redirect("/login");
    } else {
      req.session.error = "Failed to register!";
      return res.redirect("/register");
    }
  } catch (err) {
    console.log(err);
    req.session.error = "Failed to register!";
    return res.redirect("/register");
  }
};

const getLogin = (req, res) => {
  return res.render("pages/login", {
    error: req.session.error,
    success: req.session.success,
  });
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
    console.log(error);
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
