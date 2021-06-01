import React from "react";
import { useHistory } from "react-router-dom";

export default function SeatReservation({ tables }) {
  const history = useHistory();
  return (
    <div>
      <button type="button" className="m-2">
        <div>
          <a href={`/dashboard`}>Submit</a>
        </div>
      </button>
      <button type="button" onClick={history.goBack} className="m-2">
        Cancel
      </button>
    </div>
  );
}
