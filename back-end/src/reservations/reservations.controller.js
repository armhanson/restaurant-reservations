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
  const reserveDate = new Date(data.reservation_date);
  const todaysDate = new Date();

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

// US-06 - Reservation status
//     POST /reservations
//       ✓ returns 201 if status is 'booked' (489 ms)
//       ✕ returns 400 if status is 'seated' (390 ms)
//       ✕ returns 400 if status is 'finished' (372 ms)
//     PUT /reservations/:reservation_id/status
//       ✕ returns 404 for non-existent reservation_id (370 ms)
//       ✕ returns 400 for unknown status (376 ms)
//       ✕ returns 400 if status is currently finished (a finished reservation cannot be updated) (439 ms)
//       ✕ returns 200 for status 'booked' (370 ms)
//       ✕ returns 200 for status 'seated' (362 ms)
//       ✕ returns 200 for status 'finished' (402 ms)
//     PUT /tables/:table_id/seat
//       ✕ returns 200 and changes reservation status to 'seated' (676 ms)
//       ✕ returns 400 if reservation is already 'seated' (750 ms)
//     DELETE /tables/:table_id/seat
//       ✕ returns 200 and changes reservation status to 'finished' (826 ms)
//     GET /reservations/date=XXXX-XX-XX
//       ✓ does not include 'finished' reservations (1060 ms)

//////////// END ///////////////

//////// UPDATE VALIDATION ////////

function updateValidation() {
  const status = res.locals.reservation.status;

  if (status !== "booked") {
    return next({
      status: 400,
      message: "Reservation has been seated.",
    });
  }

  if (
    status !== "booked" &&
    status !== "seated" &&
    status !== "finished" &&
    status !== "cancelled"
  ) {
    return next({
      status: 400,
      message: "Unknown status.",
    });
  }

  return next();
}

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

async function update(req, res) {
  const reservation_id = req.params.reservation_id;
  const status = req.body.data.status;

  const updateStatus = await service.update(reservation_id, status);
  res.status(200).json({ data: updateStatus });
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [validateFields, asyncErrorBoundary(create)],
  read: [asyncErrorBoundary(reservationExists), asyncErrorBoundary(read)],
  update: [
    asyncErrorBoundary(reservationExists),
    updateValidation,
    asyncErrorBoundary(update),
  ],
};
