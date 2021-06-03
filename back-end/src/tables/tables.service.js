const knex = require("../db/connection");
const reservationsService = require("../reservations/reservations.service");

const tableName = "tables";

function create(newTable) {
  return knex(tableName)
    .insert(newTable)
    .returning("*")
    .then((createdTable) => createdTable[0]);
}

function list() {
  return knex(tableName).select("*").orderBy("table_name", "asc");
}

function read(table_id) {
  return knex(tableName).where({ table_id }).first();
}

function update(updatedTable) {
  return knex(tableName)
    .where({ table_id: updatedTable.table_id })
    .update(updatedTable, "*")
    .returning("*")
    .then((theNewStuff) => theNewStuff[0]);
}

function finish(table) {
  return knex.transaction(async (transaction) => {
    await knex("reservations")
      .where({ reservation_id: table.reservation_id })
      .update({ status: "finished" })
      .transacting(transaction);

    return knex(tableName)
      .where({ table_id: table.table_id })
      .update({ reservation_id: null }, "*")
      .transacting(transaction)
      .then((records) => records[0]);
  });
}

function destroy(table_id, reservationId) {
  return knex(tableName).where({ table_id }).update("reservation_id", null);
}

module.exports = {
  create,
  list,
  read,
  update,
  finish,
  destroy,
};
