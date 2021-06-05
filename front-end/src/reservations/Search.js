import React, { useState } from "react";
import { listReservationsForPhoneNumber } from "../utils/api";
import ListReservations from "./ListReservations"; // USED TO POPULATE RESULTS FROM SEARCH

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
      <h2 className="mt-3 ml-3">Search</h2>
      <form name="reservation" onSubmit={handleSearch}>
        <input
          className="ml-3"
          type="text"
          name="mobile_number"
          placeholder="Enter customer's phone number"
          onChange={handleChange}
          value={mobileNumber}
        ></input>
        <button type="submit" className="btn btn-info m-2 p-3">
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
