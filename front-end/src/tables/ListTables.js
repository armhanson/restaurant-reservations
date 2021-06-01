import React from "react";

export default function ListTables({ tables }) {
  if (tables) {
    return tables.map((table) => (
      <div className="card" key={table.table_id}>
        <div className="card-body">
          <h4 className="card-title">{table.table_name}</h4>
          <p className="card-text">{table.capacity}</p>
          <p className="card-text">
            {table.reservation_id ? "occupied" : "free"}
          </p>
        </div>
      </div>
    ));
  }
}
