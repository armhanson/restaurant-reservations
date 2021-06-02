import React from "react";
import { useHistory } from "react-router";
import { deletePartyFromTable, listTables } from "../utils/api";

export default function ListTables({ tables, setTables }) {
  const history = useHistory();

  function handleFinish({ table_id }) {
    const result = window.confirm(
      "Is this table ready to seat new guests? This cannot be undone."
    );

    if (result) {
      console.log(table_id);
      deletePartyFromTable(table_id)
        .then(() => listTables())
        .then(setTables)
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
