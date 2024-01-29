const Router = require("express").Router();
const Auth = require("../Auth/Auth.service");
const auth = new Auth();

Router.post("/sign-in", async (req, res) => {
  auth
    .signIn(req.body)
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((err) => {
      res.status(400).send(
        {
          message: err.message,
        } || err
      );
    });
});

Router.post("/sign-up", async (req, res) => {
  auth
    .signUp(req.body)
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((err) => {
      res.status(400).send(
        {
          message: err.message,
        } || err
      );
    });
});

module.exports = Router;
