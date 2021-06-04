import React, { useState } from "react";
import { listReservationsForPhoneNumber } from "../utils/api";
import ListReservations from "./ListReservations"; // this component is only used after the form has been submitted

export default function Search() {
  const [list, setList] = useState([]);
  const [mobileNumber, setMobileNumber] = useState("");
  const [errors, setErrors] = useState(null);
  const [found, setFound] = useState(false);

  function handleChange({ target }) {
    setMobileNumber(target.value);
  }

  function handleSearch(event) {
    event.preventDefault();
    setFound(false);
    setErrors(null);
    listReservationsForPhoneNumber(mobileNumber)
      .then(setList)
      .then(() => setFound(true))
      .catch(setErrors);
  }

  return (
    <div>
      <h2>Search</h2>
      <form name="reservation" onSubmit={handleSearch}>
        <input
          className="m-3"
          type="text"
          name="mobile_number"
          placeholder="Enter a customer's phone number"
          onChange={handleChange}
          value={mobileNumber}
        ></input>
        <button type="submit" className="btn btn-primary mt-2">
          Find
        </button>
      </form>
      {list.length ? (
        <div>
          <ListReservations reservations={list} />
        </div>
      ) : (
        found && <div>No reservations found</div>
      )}
    </div>
  );
}
