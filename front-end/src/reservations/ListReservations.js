import React from "react";

// import { Status } from "../tables/Status";

export default function ListReservations({ reservations }) {
  if (reservations) {
    return reservations.map((reservation) => (
      <div key={reservation.reservation_id}>
        <div className="card">
          <div className="card-body">
            <h4 className="card-title">
              Reservation for: {reservation.first_name} {reservation.last_name}
            </h4>
            {reservation.status}
            <p className="card-text">{reservation.mobile_number}</p>
            <p className="card-text">{reservation.reservation_date}</p>
            <p className="card-text">{reservation.reservation_time}</p>
            <p className="card-text">{reservation.people}</p>
            <p className="card-text">{}</p>
          </div>
          <button type="btn btn-small">
            <div>
              <a href={`/reservations/${reservation.reservation_id}/seat`}>
                Seat
              </a>
            </div>
          </button>
        </div>
      </div>
    ));
  }
}
