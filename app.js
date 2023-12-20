require("dotenv").config();
const express = require("express");
const app = express();
const connectDB = require("./db/connect");
const cookie = require("cookie-parser");
const session = require("express-session");

// Routers
const authRoute = require("./routes/auth");
const homeRoute = require("./routes/home");
const notFoundRoute = require("./routes/not-found");

// Middleware
app.set("views", "./views");
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
// Cookie
app.use(cookie());
// Session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
// middleware to make 'user' available to all templates
app.use(function (req, res, next) {
  res.locals.user = req.session.user;
  next();
});
// Parse JSON
app.use(express.json());
// Parse Form Data
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/", homeRoute);
app.use("/", authRoute);
// Not Found
app.use("*", notFoundRoute);

const port = process.env.PORT || 3000;
const start = async () => {
  try {
    await connectDB(process.env.MONGODB_URI);
    app.listen(port, () => {
      console.log(`App is listening on port ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
