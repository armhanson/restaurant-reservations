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
    .update(updatedTable, "*");
}

module.exports = {
  create,
  list,
  read,
  update,
};