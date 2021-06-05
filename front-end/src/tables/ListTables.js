import React from "react";
import { today } from "../utils/date-time";
import useQuery from "../utils/useQuery";
import {
  deletePartyFromTable,
  listTables,
  listReservations,
} from "../utils/api";

export default function ListTables({ tables, setTables, setReservations }) {
  const query = useQuery();
  const date = query.get("date") || today();

  ///////////// FINISH TABLE ////////////

  function handleFinish({ table_id }) {
    const result = window.confirm(
      "Is this table ready to seat new guests? This cannot be undone."
    );

    if (result) {
      deletePartyFromTable(table_id)
        .then(() => listTables())
        .then(setTables)
        .then(() => listReservations({ date }))
        .then(setReservations)
        .catch(console.log);
    }
  }

  if (tables) {
    return tables.map((table) => (
      <div className="card mx-1 my-2" key={table.table_id}>
        <div className="card-body bg-secondary text-light">
          <h4 className="card-title">{table.table_name}</h4>
          <p className="card-text">{table.capacity}</p>
          <p
            data-table-id-status={table.table_id}
            className={`card-text ${
              table.reservation_id ? "text-warning" : "text-success"
            }`}
          >
            {table.reservation_id ? "occupied" : "free"}
          </p>
          {table.reservation_id ? (
            <button
              data-table-id-finish={table.table_id}
              className="btn btn-danger p-3"
              name="confirm"
              onClick={(event) => {
                event.preventDefault();
                handleFinish(table);
              }}
            >
              Finish
            </button>
          ) : null}
        </div>
      </div>
    ));
  }
}
