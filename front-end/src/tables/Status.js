import React, { useState, useEffect } from "react";

export default function Status({ status }) {
  const [currentStatus, setCurrentStatus] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/dashboard")
      .then((response) => response.json())
      .then(setCurrentStatus)
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const seatedTable = currentStatus.map((item) => {
    return (
      <div key={item.status}>
        <h3 onClick={() => (item.status = "occupied")}>{item.status}</h3>
      </div>
    );
  });

  return <div className="Status">{seatedTable}</div>;
}
