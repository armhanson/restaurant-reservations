/**
 * List handler for reservation resources
 */

const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function reservationExists(req, res, next) {
  const reservation = await service.read(req.params.reservation_id);

  if (reservation) {
    res.locals.reservation = reservation;
    return next();
  }
  next({
    status: 404,
    message: `Reservation ${req.params.reservation_id} does not exist.`,
  });
}

const VALID_FIELDS = [
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people",
];

function notNull(obj) {
  for (let key in obj) {
    if (!obj[key]) return false;
  }
  return true;
}

/////////// VALIDATE FIELDS COMPONENT ///////////

function validateFields(req, res, next) {
  const { data = {} } = req.body;


  const dataFields = Object.getOwnPropertyNames(data);

  VALID_FIELDS.forEach((field) => {
    if (!dataFields.includes(field)) {
      return next({
        status: 400,
        message: `The ${field} is missing`,
      });
    }
  });

  if (!notNull(data)) {
    return next({
      status: 400,
      message:
        "Invalid data format provided. Requires {string: [first_name, last_name, mobile_number], date: reservation_date, time: reservation_time, number: people}",
    });
  }
  const reserveDate = new Date(data.reservation_date);
  // start = new Date(`${data.reservation_date} 10:30:00 GMT-500`),
  // end = new Date(`${data.reservation_date} 21:30:00 GMT-500`);

  const todaysDate = new Date();

  if (typeof data.people !== "number") {
    return next({
      status: 400,
      message: "Needs to be a number, people is not a number.",
    });
  }

  if (!/\d{4}-\d{2}-\d{2}/.test(data.reservation_date)) {
    return next({
      status: 400,
      message: "reservation_date is not a date.",
    });
  }
  
  if (reserveDate.getDay() === 1) {
    return next({
      status: 400,
      message:
        "Reservations cannot be made on a Tuesday, the restaurant is closed.",
    });
  }

  if (reserveDate < todaysDate) {
    return next({
      status: 400,
      message: "Reservations must be made for a future date.",
    });
  }

  if (!/[0-9]{2}:[0-9]{2}/.test(data.reservation_time)) {
    return next({
      status: 400,
      message: "reservation_time is not a time.",
    });
  }

  if (data.reservation_time < "10:30" || data.reservation_time > "21:30") {
    return next({
      status: 400,
      message: "Reservations cannot be made before 10:30am or after 9:30pm.",
    });
  }

  next();
}

//////////// END ///////////////

async function list(req, res) {
  const { date } = req.query;
  res.json({
    data: await service.list(date),
  });
}

async function create(req, res) {
  const makeRest = ({
    first_name,
    last_name,
    mobile_number,
    reservation_date,
    reservation_time,
    people,
  } = req.body.data);
  const createdRest = await service.create(makeRest);
  res.status(201).json({ data: createdRest });
}

async function read(req, res) {
  const { reservation } = res.locals;
  res.json({ data: reservation });
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [validateFields, asyncErrorBoundary(create)],
  read: [asyncErrorBoundary(reservationExists), read],
};
