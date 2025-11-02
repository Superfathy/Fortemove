import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Link } from "react-router-dom";
import "./RoleSelection.css";

const RoleSelection = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [selectedRole, setSelectedRole] = useState(
    searchParams.get("role") || ""
  );

  const roles = [
    {
      id: "candidate",
      title: "Candidate",
      description: "Looking for job opportunities and career growth",
      icon: "👤",
      benefits: [
        "Access to exclusive job listings",
        "Personalized career guidance",
        "Application tracking system",
        "Professional profile visibility",
      ],
    },
    {
      id: "business",
      title: "Business Owner",
      description: "Seeking HR solutions and recruitment services",
      icon: "🏢",
      benefits: [
        "Expert HR consultation",
        "Talent acquisition services",
        "Recruitment process management",
        "Custom HR solutions",
      ],
    },
  ];

  const handleRoleSelect = (roleId) => {
    setSelectedRole(roleId);
  };

  const handleContinue = () => {
    if (selectedRole) {
      navigate(`/signup?role=${selectedRole}`);
    }
  };

  return (
    <div className="container">
      <div className="role-selection-container">
        <div className="role-selection-header">
          <h1>Join Fortemove as...</h1>
          <p>Select your role to get started with our platform</p>
        </div>

        <div className="role-cards-grid">
          {roles.map((role) => (
            <div
              key={role.id}
              className={`role-card ${selectedRole === role.id ? "selected" : ""}`}
              onClick={() => handleRoleSelect(role.id)}
            >
              <div className="role-card-header">
                <div className="role-icon">{role.icon}</div>
                <h3>{role.title}</h3>
              </div>
              <p className="role-description">{role.description}</p>

              <div className="benefits-list">
                <h4>Benefits:</h4>
                <ul>
                  {role.benefits.map((benefit, index) => (
                    <li key={index}>{benefit}</li>
                  ))}
                </ul>
              </div>

              <div className="role-card-footer">
                <div className="selection-indicator">
                  {selectedRole === role.id ? "✓ Selected" : "Select"}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="role-selection-actions">
          <button
            className="btn btn-primary btn-large"
            onClick={handleContinue}
            disabled={!selectedRole}
          >
            Continue to Sign Up
          </button>

          <p className="login-redirect">
            Already have an account? <Link to="/login">Log in here</Link>
          </p>
        </div>

        <div className="role-selection-info">
          <h3>Why choose Fortemove?</h3>
          <div className="platform-benefits">
            <div className="platform-benefit">
              <h4>Trusted Platform</h4>
              <p>
                Join thousands of professionals and businesses who trust us with
                their HR needs
              </p>
            </div>
            <div className="platform-benefit">
              <h4>Secure & Reliable</h4>
              <p>
                Your data is protected with enterprise-grade security measures
              </p>
            </div>
            <div className="platform-benefit">
              <h4>24/7 Support</h4>
              <p>
                Our team is always available to help you with any questions or
                issues
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;
