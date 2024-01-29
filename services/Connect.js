const { db } = require("config");

const knex = require("knex")({
  client: "pg",
  connection: {
    connectionString: db.connectionString,
  },
});

module.exports = knex;
