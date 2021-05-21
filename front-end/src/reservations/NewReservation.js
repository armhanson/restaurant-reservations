import React, { useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";

export default function NewReservation() {
  const [errors, setErrors] = useState([]);
  const history = useHistory();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: 1,
  });

  function valiDate() {
    const reserveDate = new Date(formData.reservation_date);
    const todaysDate = new Date();
    const foundErrors = [];

    if (reserveDate.getDay() === 1) {
      foundErrors.push({
        message:
          "Reservations cannot be made on a Tuesday (Restaurant is closed).",
      });
    }

    if (reserveDate < todaysDate) {
      foundErrors.push({ message: "Reservations cannot be made in the past." });
    }

    setErrors(foundErrors);

    if (foundErrors.length > 0) {
      return false;
    }

    return true;
  }

  function handleChange({ target }) {
    setFormData({ ...formData, [target.name]: target.value });
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (valiDate()) {
      history.push(`/dashboard?date=${formData.reservation_date}`);
    }
  }

  const dateErrors = () => {
    return errors.map((error, idx) => <ErrorAlert key={idx} error={error} />);
  };

  return (
    <form>
      {dateErrors()}
      <label htmlFor="first_name">First Name:&nbsp;</label>
      <input
        name="first_name"
        id="first_name"
        type="text"
        onChange={handleChange}
        value={formData.first_name}
        required
      />
      <label htmlFor="last_name">Last Name:&nbsp;</label>
      <input
        name="last_name"
        id="last_name"
        type="text"
        onChange={handleChange}
        value={formData.last_name}
        required
      />
      <br />
      <label htmlFor="mobile_number">Mobile Number:&nbsp;</label>
      <input
        name="mobile_number"
        id="mobile_number"
        type="tel"
        onChange={handleChange}
        value={formData.mobile_number}
        required
      />
      <br />
      <label htmlFor="reservation_date">Date:&nbsp;</label>
      <input
        name="reservation_date"
        id="reservation_date"
        type="date"
        onChange={handleChange}
        value={formData.reservation_date}
        required
      />
      <label htmlFor="reservation_time">Time:&nbsp;</label>
      <input
        name="reservation_time"
        id="reservation_time"
        type="time"
        onChange={handleChange}
        value={formData.reservation_time}
        required
      />
      <br />
      <label htmlFor="people">Guests:&nbsp;</label>
      <input
        name="people"
        id="people"
        type="number"
        min="1"
        max="25"
        onChange={handleChange}
        value={formData.people}
        required
      />
      <br />
      <button type="submit" onClick={handleSubmit}>
        Submit
      </button>
      <button type="button" onClick={history.goBack}>
        Cancel
      </button>
    </form>
  );
}
