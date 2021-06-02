const knex = require("../db/connection");

const tableName = "reservations";

function list(reservation_date) {
  return knex(tableName)
    .select("*")
    .where({ reservation_date })
    .whereNot({ status: "finished" })
    .orderBy("reservation_time", "asc");
}

function create(newReservation) {
  return knex(tableName)
    .insert(newReservation, "*")
    .then((createdReservation) => createdReservation[0]);
}

function read(reservation_id) {
  return knex(tableName).where({ reservation_id }).first();
}

// reervation_id is the status pulled from res.locals in controller
function update(reservation_id, status) {
  return knex(tableName)
    .where({ reservation_id })
    .update("status", status)
    .returning("*")
    .then((theNewStuff) => theNewStuff[0]);
}

module.exports = {
  create,
  list,
  read,
  update,
};
