const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const { port } = require("config");

// middleware
const checkAuth = require("./middleware/auth.middleware")

// express use plugin
app.use(bodyParser.json())

// import controller
const Auth = require("./models/Auth/Auth.controller");
const User = require("./models/User/User.controller")

// user controller
app.use("/auth", Auth);
app.use("/user", checkAuth, User);

// server listen
app.listen(port, () => {
  console.log("Server is Running on port " + port);
});
