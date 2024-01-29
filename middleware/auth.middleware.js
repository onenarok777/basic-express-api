const knex = require("../services/Connect");
const jwt = require("jsonwebtoken");

const checkAuth = async (req, res, next) => {
  try {
    const access_token = req.headers.authorization;
    if (!access_token) throw new Error("access_token not found");
    const token = access_token.replace("Bearer ", "");
    const userObject = jwt.verify(token, "eiei");
    res.locals.user = userObject;

    const userCheck = await knex("user_account")
      .select("*")
      .where("username", userObject.username.trim())
      .limit(1);

    if (userCheck.length == 0) throw new Error("username not found");

    next();
  } catch (err) {
    res.status(403).send(
      {
        message: err.message,
      } || err
    );
  }
};

module.exports = checkAuth;
