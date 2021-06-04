import React from "react";
import { today } from "../utils/date-time";
import useQuery from "../utils/useQuery";
import { deletePartyFromTable, listTables, listReservations } from "../utils/api";

export default function ListTables({ tables, setTables, setReservations }) {
  const query = useQuery();
  const date = query.get("date") || today();
  
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
      <div className="card" key={table.table_id}>
        <div className="card-body">
          <h4 className="card-title">{table.table_name}</h4>
          <p className="card-text">{table.capacity}</p>
          <p data-table-id-status={table.table_id} className="card-text">
            {table.reservation_id ? "occupied" : "free"}
          </p>
          {table.reservation_id ? (
            <button
              data-table-id-finish={table.table_id}
              type="btn btn-primary"
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
