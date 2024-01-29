const knex = require("../../services/Connect");
const genCode = require("../../services/GenerateUniqueId");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const auth = class Auth {
  constructor() {}

  async signIn(data) {
    if (!data.username) throw new Error("username not found");
    if (!data.password) throw new Error("password not found");

    const userCheck = await knex("user_account")
      .select("*")
      .where("username", data.username);

    const userObject = userCheck[0];
    if (!userObject) throw new Error("Invalid username or password");

    const checkPassword = await bcrypt.compare(
      data.password,
      userObject.password
    );
    if (!checkPassword) throw new Error("Invalid username or password");

    delete userObject.password;
    delete userObject.created;
    userObject.access_token = await jwt.sign(userObject, "eiei");

    return userObject;
  }

  async signUp(data) {
    if (!data.username) throw new Error("username not found");
    if (!data.password) throw new Error("password not found");

    const userCheck = await knex("user_account")
      .select("*")
      .where("username", data.username.trim());

    if (userCheck.length > 0) throw new Error("Username already taken.");

    const saltRounds = 10;
    data.username = data.username.trim();
    data.password = await bcrypt.hash(data.password, saltRounds);

    return knex
      .transaction(async (trx) => {
        let unique_code = await genCode("user_account", trx);
        data.user_code = unique_code;

        return knex
          .insert(data)
          .into("user_account")
          .then(trx.commit)
          .catch(trx.rollback);
      })
      .then((res) => {
        delete data.password;
        return Promise.resolve(data);
      })
      .catch((err) => {
        return Promise.reject(err);
      });
  }
};

module.exports = auth;
