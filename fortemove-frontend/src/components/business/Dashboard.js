import React from "react";
import { Link } from "react-router-dom";

const BusinessDashboard = () => {
  const user = JSON.parse(localStorage.getItem("user") || {});

  return (
    <div className="container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Business Owner Dashboard</h1>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Welcome</h3>
          <p>{user.name}</p>
        </div>
      </div>

      <div className="form-container">
        <h2>HR Services Request</h2>
        <p>
          Thank you for choosing Fortemove for your HR needs. Please fill out
          our business questionnaire so we can understand your requirements and
          provide you with the best possible service.
        </p>

        <div style={{ textAlign: "center", marginTop: "2rem" }}>
          <Link to="/business/form" className="btn btn-primary">
            Fill Out Business Form
          </Link>
        </div>
      </div>

      <div className="form-container" style={{ marginTop: "2rem" }}>
        <h2>Our Services</h2>
        <div className="features">
          <div className="feature">
            <h3>Recruitment</h3>
            <p>We help you find the best talent for your organization</p>
          </div>
          <div className="feature">
            <h3>HR Consultation</h3>
            <p>Expert advice on all HR matters and best practices</p>
          </div>
          <div className="feature">
            <h3>Training & Development</h3>
            <p>Employee training programs to enhance skills</p>
          </div>
          <div className="feature">
            <h3>Performance Management</h3>
            <p>Systems to manage and improve employee performance</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessDashboard;
