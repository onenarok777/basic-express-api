const Router = require("express").Router();
const User = require("./User.service");
const user = new User();

Router.get("/get-users", async (req, res) => {
  user
    .getUser()
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
