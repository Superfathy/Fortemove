import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="home-container">
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <h1>Welcome to Fortemove</h1>
            <p>Your partner in HR services and recruitment solutions</p>
          </div>
        </div>
      </section>

      <section className="role-selection-section">
        <div className="container">
          <h2>Are you looking for?</h2>
          <div className="role-cards">
            <div className="role-card">
              <div className="card-content">
                <h3>Job Opportunities</h3>
                <p>Find your dream job with our curated opportunities</p>
                <Link
                  to="/select-role?role=candidate"
                  className="btn btn-primary"
                >
                  I'm a Candidate
                </Link>
              </div>
            </div>

            <div className="role-card">
              <div className="card-content">
                <h3>HR Solutions</h3>
                <p>Get expert HR consultation and recruitment services</p>
                <Link
                  to="/select-role?role=business owner"
                  className="btn btn-primary"
                >
                  I'm a Business Owner
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="container">
          <h2>Why Choose Fortemove?</h2>
          <div className="features">
            <div className="feature">
              <h3>Expert Recruitment</h3>
              <p>We connect top talent with leading companies</p>
            </div>
            <div className="feature">
              <h3>HR Consultation</h3>
              <p>Professional HR services for businesses of all sizes</p>
            </div>
            <div className="feature">
              <h3>Streamlined Process</h3>
              <p>Efficient and transparent hiring process</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
