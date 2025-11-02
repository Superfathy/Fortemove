import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { getUser, logout } from "../../services/auth";

const Header = () => {
  const user = getUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="header">
      <div className="container">
        <Link to="/" className="logo">
          <h2>Fortemove</h2>
        </Link>

        <nav className="nav">
          {user ? (
            <>
              <span className="welcome">Welcome, {user.name}</span>

              {user.role === "admin" && (
                <>
                  <Link to="/admin/dashboard">Dashboard</Link>
                  <Link to="/admin/users">Users</Link>
                  <Link to="/admin/jobs">Jobs</Link>
                  <Link to="/admin/applications">Applications</Link>
                  <Link to="/admin/forms">Forms</Link>
                </>
              )}

              {user.role === "candidate" && (
                <>
                  <Link to="/candidate/dashboard">Dashboard</Link>
                  <Link to="/candidate/jobs">Browse Jobs</Link>
                  <Link to="/candidate/applications">My Applications</Link>
                </>
              )}

              {user.role === "business owner" && (
                <>
                  <Link to="/business/dashboard">Dashboard</Link>
                  <Link to="/business/form">HR Services Form</Link>
                </>
              )}

              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/">Home</Link>
              <Link to="/login">Login</Link>
              <Link to="/signup">Sign Up</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
