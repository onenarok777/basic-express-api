const knex = require("./Connect");

const genCode = async (tableName, trx) => {
  try {
    if (!tableName) throw new Error("table name not found");

    const preCode = tableName.substring(0, 1).toUpperCase();
    const dateNow = new Date();
    const yearNow = dateNow.getFullYear();
    const monthNow = dateNow.getMonth() + 1;
    const dayNow = dateNow.getDate().toString().padStart(2, "0");
    const newNumber = 1;
    const newPreCode = preCode + yearNow + monthNow + dayNow;
    let newCodeGen = null;

    const oldCodeArray = await knex("unique_code")
      .select("*")
      .where("table_name", tableName)
      .andWhereLike("unique_code", `${newPreCode}%`)
      .limit(1)
      .orderBy("id", "desc");

    if (oldCodeArray.length > 0) {
      const oldCode = oldCodeArray[0].unique_code;
      const oldPreCode = oldCode.substring(0, 9);
      const oldNumber = oldCode.slice(-3);

      newCodeGen =
        newPreCode +
        (Number(oldNumber) + Number(newNumber)).toString().padStart(3, "0");
    } else {
      newCodeGen = newPreCode + newNumber.toString().padStart(3, "0");
    }

    return knex
      .insert({
        unique_code: newCodeGen,
        table_name: tableName,
      })
      .into("unique_code")
      .then(() => {
        if (trx) trx.commit;
        return newCodeGen;
      })
      .catch((err) => {
        if (trx) trx.rollback;
        throw new Error(err);
      });
  } catch (error) {
    if (trx) trx.rollback();

    throw new Error(error);
  }
};
module.exports = genCode;
