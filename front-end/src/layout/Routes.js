import React, { useEffect, useState } from "react";

import NotFound from "./NotFound";
import useQuery from "../utils/useQuery";
import NewTable from "../tables/NewTable";
import { today } from "../utils/date-time";
import Dashboard from "../dashboard/Dashboard";
import { Redirect, Route, Switch } from "react-router-dom";
import { listReservations, listTables } from "../utils/api";
import NewReservation from "../reservations/NewReservation";
import SeatConfirm from "../reservations/SeatConfirm";
import SeatReservation from "../reservations/SeatReservation";
import Search from "../reservations/Search";

/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
function Routes() {
  const query = useQuery();
  const date = query.get("date") || today();

  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [tables, setTables] = useState([]);
  const [tablesError, setTablesError] = [];

  // render dashboard anytime new date or setTablesError occurs
  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    listTables(abortController.signal).then(setTables).catch(setTablesError);
    return () => abortController.abort();
  }

  return (
    <Switch>
      <Route exact={true} path="/">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route exact={true} path="/reservations">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route exact={true} path="/reservations/new">
        <NewReservation setReservations={setReservations} />
      </Route>
      <Route exact={true} path="/tables/new">
        <NewTable tables={tables} setTables={setTables} />
      </Route>
      <Route exact={true} path="/dashboard">
        <Dashboard
          date={date ? date : today()}
          reservations={reservations}
          setReservations={setReservations}
          reservationsError={reservationsError}
          tables={tables}
          setTables={setTables}
          tablesError={tablesError}
        />
      </Route>
      <Route exact={true} path={`/reservations/:reservation_id/seat`}>
        <SeatReservation
          tables={tables}
          setTables={setTables}
          setReservations={setReservations}
        />
      </Route>
      <Route exact={true} path={`/reservations/seat-confirm`}>
        <SeatConfirm tables={tables} />
      </Route>
      <Route exact={true} path={`/search`}>
        <Search reservations={reservations} setReservations={setReservations} />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Routes;
