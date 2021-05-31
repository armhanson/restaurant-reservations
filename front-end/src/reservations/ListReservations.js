import React from "react";
// import { Status } from "../tables/Status";

export default function ListReservations({ reservations }) {
  const reservation_id = reservations.reservation_id;

  if (reservations) {
    return reservations.map((reservation) => (
      <div>
        <div className="card" key={reservation.reservation_id}>
          <div className="card-body">
            <h4 className="card-title">
              Reservation {reservation.first_name} {reservation.last_name}
            </h4>
            <p className="card-text">{reservation.mobile_number}</p>
            <p className="card-text">{reservation.reservation_date}</p>
            <p className="card-text">{reservation.reservation_time}</p>
            <p className="card-text">{reservation.people}</p>
            <p className="card-text">{}</p>
          </div>
          <button type="button" href={`/reservations/${reservation_id}/seat`}>
            Seat
          </button>
        </div>
      </div>
    ));
  }
}
