import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import { createTable } from "../utils/api";

export default function NewTable() {
  const history = useHistory();
  const todaysDate = new Date();
  const [error, setError] = useState([]);
  const [formData, setFormData] = useState({
    // initial (default) data
    table_name: "",
    capacity: 1,
  });

  function validateFields() {
    let foundError = "";

    if (formData.table_name === "" || formData.capacity === "") {
      foundError += "Please fill out all fields.";
    } else {
      if (formData.table_name.length < 2) {
        foundError += "Table name must be at least 2 characters.";
      }
      if (formData.capacity < 1 || !formData.capacity) {
        foundError += "Table name must be at least 1.";
      }
    }

    if (foundError.length) {
      setError(new Error(foundError));
      return false;
    }
    return true;
  }

  function handleChange({ target }) {
    setFormData({ ...formData, [target.name]: target.value });
  }

  function handleSubmit(event) {
    event.preventDefault();
    const abortController = new AbortController();
    setError(null);
    if (validateFields()) {
      createTable(formData, abortController.signal)
        .then(() => history.push("/dashboard"))
        .catch(setError);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <ErrorAlert error={error} />

      <label htmlFor="table_name">Table Name:&nbsp;</label>
      <input
        name="table_name"
        id="table_name"
        type="text"
        minLength="2"
        onChange={handleChange}
        value={formData.table_name}
        required
      />

      <label htmlFor="capacity">Capacity:&nbsp;</label>
      <input
        name="capacity"
        id="capacity"
        type="number"
        min="1"
        onChange={handleChange}
        value={formData.capacity}
        required
      />
      <br />

      <button type="submit">Submit</button>
      <button type="button" onClick={history.goBack}>
        Cancel
      </button>
    </form>
  );
}