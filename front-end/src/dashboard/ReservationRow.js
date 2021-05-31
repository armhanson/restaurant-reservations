import React from "react";

export default function TableRow({ reservation }) {
  if (!reservation) return null;

  return (
    <table class="table">
      <tr>
        <th scope="row">{reservation.reservation_id}</th>
        <td>{reservation.first_name}</td>
        <td>{reservation.last_name}</td>
        <td>{reservation.mobile_number}</td>
        <td>{reservation.reservation_date}</td>
        <td>{reservation.reservation_time}</td>
        <td>{reservation.reservation}</td>
      </tr>
    </table>
  );
}
