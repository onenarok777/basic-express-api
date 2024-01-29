const knex = require("../../services/Connect");

const user = class User {
  constructor() {}

  async getUser() {
    let result = await knex("user_account").select("*");
    return Promise.resolve(result);
  }
};
module.exports = user;
