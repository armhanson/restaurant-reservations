import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { createReservation, formatPhoneNumber } from "../utils/api";
import { today } from "../utils/date-time";
import ErrorAlert from "../layout/ErrorAlert";

export default function NewReservation() {
  const [errors, setErrors] = useState(null);
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
    const reserveTime = formData.reservation_time;
    const todaysDate = today();
    const foundErrors = [];

    // this test sometimes references Tue as 1, sometimes as 2
    if (reserveDate.getDay() === 1) {
      foundErrors.push(
        "Reservations cannot be made on a Tuesday (Restaurant is closed)."
      );
    }

    if (reserveDate < todaysDate) {
      foundErrors.push("Reservations cannot be made in the past.");
    }

    if (reserveTime.localeCompare("10:30") === -1) {
      foundErrors.push(
        "Reservation cannot be made: Restaurant is not open until 10:30AM."
      );
    } else if (reserveTime.localeCompare("21:30") === 1) {
      foundErrors.push(
        "Reservation cannot be made: Restaurant is closed after 9:30PM."
      );
    } else if (reserveTime.localeCompare("20:30") === 1) {
      foundErrors.push(
        "Reservation cannot be made: Reservation must be made before 8:30PM."
      );
    }

    if (foundErrors.length) {
      setErrors(new Error(foundErrors.toString()));
      return false;
    }
    return true;
  }

  function handleChange({ target }) {
    setFormData({ ...formData, [target.name]: target.value });
  }

  const phoneNumberFormatter = ({ target }) => {
    const formattedInputValue = formatPhoneNumber(target.value);
    setFormData({
      ...formData,
      mobile_number: formattedInputValue,
    });
  };

  function handleSubmit(event) {
    event.preventDefault();
    setErrors(null);
    const validDate = valiDate();
    if (validDate) {
      createReservation(formData)
        .then(() =>
          history.push(`/dashboard?date=${formData.reservation_date}`)
        )
        .catch(setErrors);
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <ErrorAlert error={errors} />
        <label htmlFor="first_name">First Name:&nbsp;</label>
        <input
          name="first_name"
          id="first_name"
          type="text"
          placeholder="First Name"
          onChange={handleChange}
          value={formData.first_name}
          required
        />
        <label htmlFor="last_name">Last Name:&nbsp;</label>
        <input
          name="last_name"
          id="last_name"
          type="text"
          placeholder="Last Name"
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
          placeholder="xxx-xxx-xxxx"
          onChange={phoneNumberFormatter}
          value={formData.mobile_number}
          required
        />
        <br />
        <label htmlFor="reservation_date">Date:&nbsp;</label>
        <input
          name="reservation_date"
          id="reservation_date"
          type="date"
          placeholder="Reservation Date"
          onChange={handleChange}
          value={formData.reservation_date}
          required
        />
        <label htmlFor="reservation_time">Time:&nbsp;</label>
        <input
          name="reservation_time"
          id="reservation_time"
          type="time"
          placeholder="HH:MM"
          pattern="[0-9]{2}:[0-9]{2}"
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
        <button type="submit">Submit</button>
        <button type="button" onClick={history.goBack}>
          Cancel
        </button>
      </form>
    </>
  );
}
