import React from "react";

const StatsCard = ({ title, value, icon }) => {
  return (
    <div className="stat-card">
      <div className="stat-icon">{icon}</div>
      <h3>{value || 0}</h3>
      <p>{title}</p>
    </div>
  );
};

export default StatsCard;
