import React from "react";
import ErrorAlert from "../layout/ErrorAlert";
import { previous, today, next } from "../utils/date-time";
import { useHistory } from "react-router-dom";
import ListTables from "../tables/ListTables";
import ListReservations from "../reservations/ListReservations";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({
  cancelHandler,
  date,
  reservations,
  setReservations,
  reservationsError,
  tables,
  setTables,
  tablesError,
}) {
  const history = useHistory();

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for {date}</h4>
      </div>
      {/*//////////// PREVIOUS //////////////*/}
      <button
        className="btn btn-info m-1 p-3"
        onClick={() => history.push(`/dashboard?date=${previous(date)}`)}
      >
        Previous
      </button>

      {/*//////////// TODAY //////////////*/}
      <button
        className="btn btn-dark m-1 p-3"
        onClick={() => history.push(`/dashboard?date=${today()}`)}
      >
        Today
      </button>

      {/*//////////// NEXT //////////////*/}
      <button
        className="btn btn-info m-1 p-3"
        onClick={() => history.push(`/dashboard?date=${next(date)}`)}
      >
        Next
      </button>

      {/*////////// DISPLAY COMPONENTS CALLS //////////*/}

      <ErrorAlert error={reservationsError} />

      <ListReservations
        reservations={reservations}
        setReservations={setReservations}
        cancelHandler={cancelHandler}
      />

      <h4 className="mb-0">Tables</h4>

      <ErrorAlert error={tablesError} />

      <ListTables
        tables={tables}
        setTables={setTables}
        date={date}
        setReservations={setReservations}
      />
    </main>
  );
}

export default Dashboard;
