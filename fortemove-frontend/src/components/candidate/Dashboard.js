import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getMyApplications } from "../../services/api";
import { toast } from "react-toastify";

const CandidateDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    reviewed: 0,
    accepted: 0,
    rejected: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      console.log('Starting to fetch dashboard data...'); // Debug
      
      // Check if user is authenticated
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      console.log('Auth check - Token exists:', !!token, 'User exists:', !!user); // Debug
      console.log('Token value:', token); // Debug - remove this in production
      
      if (!token) {
        toast.error('Please log in to view your dashboard');
        setLoading(false);
        window.location.href = '/login'; // Redirect to login
        return;
      }

      // Test API connectivity first
      console.log('Making API call to getMyApplications...'); // Debug
      
      const response = await getMyApplications();
      console.log('Full API Response:', response); // Debug log
      console.log('Response status:', response.status); // Debug log
      console.log('Response data:', response.data); // Debug log
      
      // The API is returning the correct format based on your Postman test
      const userApplications = response.data.data.applications || [];
      
      console.log('Processed User Applications:', userApplications); // Debug log
      console.log('Applications count:', userApplications.length); // Debug log
      
      setApplications(userApplications);

      // Calculate stats from the applications data
      const calculatedStats = {
        total: userApplications.length,
        pending: userApplications.filter((app) => app.status === "pending").length,
        reviewed: userApplications.filter((app) => app.status === "reviewed").length,
        accepted: userApplications.filter((app) => app.status === "accepted").length,
        rejected: userApplications.filter((app) => app.status === "rejected").length,
      };
      
      console.log('Calculated Stats:', calculatedStats); // Debug log
      setStats(calculatedStats);
      
      if (userApplications.length === 0) {
        console.log('No applications found for user'); // Debug
      } else {
        console.log('Successfully loaded', userApplications.length, 'applications'); // Debug
      }
      
    } catch (error) {
      console.error("Detailed error:", error); // More detailed error log
      console.error("Error message:", error.message); // Log the error message
      console.error("Error response:", error.response); // Log the full error response
      
      if (error.response) {
        console.error("Response status:", error.response.status); // Log status code
        console.error("Response data:", error.response.data); // Log response data
      }
      
      if (error.response?.status === 401) {
        toast.error("Authentication failed. Please log in again.");
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      } else if (error.response?.status === 403) {
        toast.error("Access denied. Please check your account permissions.");
      } else if (error.response?.status === 404) {
        toast.error("API endpoint not found. Please check your server.");
      } else {
        toast.error(`Failed to load dashboard data: ${error.message || 'Unknown error'}`);
      }
      
      // Set empty state on error
      setApplications([]);
      setStats({
        total: 0,
        pending: 0,
        reviewed: 0,
        accepted: 0,
        rejected: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      pending: "btn-warning",
      reviewed: "btn-info",
      rejected: "btn-danger",
      accepted: "btn-success",
    };

    return (
      <span className={`btn btn-sm ${statusColors[status]}`}>{status}</span>
    );
  };

  if (loading) return <div className="loading">Loading dashboard...</div>;

  return (
    <div className="container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Candidate Dashboard</h1>
        <Link to="/candidate/jobs" className="btn btn-primary">
          Browse Jobs
        </Link>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>{stats.total}</h3>
          <p>Total Applications</p>
        </div>
        <div className="stat-card">
          <h3>{stats.pending}</h3>
          <p>Pending</p>
        </div>
        <div className="stat-card">
          <h3>{stats.reviewed}</h3>
          <p>Reviewed</p>
        </div>
        <div className="stat-card">
          <h3>{stats.accepted}</h3>
          <p>Accepted</p>
        </div>
        <div className="stat-card">
          <h3>{stats.rejected}</h3>
          <p>Rejected</p>
        </div>
      </div>

      {/* Recent Applications Preview */}
      <div className="recent-applications">
        <h3>Recent Applications</h3>
        {applications.length > 0 ? (
          <>
            {applications.slice(0, 3).map(application => (
              <div key={application._id} className="application-preview">
                <div className="application-preview-job">
                  <strong>{application.job?.title || 'Unknown Position'}</strong>
                  <span>{application.job?.company || 'N/A'}</span>
                </div>
                <div className="application-preview-status">
                  {getStatusBadge(application.status)}
                </div>
                <div className="application-preview-date">
                  {new Date(application.appliedAt).toLocaleDateString()}
                </div>
              </div>
            ))}
            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
              <Link to="/candidate/applications" className="btn btn-sm btn-primary">
                View All Applications
              </Link>
            </div>
          </>
        ) : (
          <p>You haven't applied to any jobs yet. <Link to="/candidate/jobs">Browse jobs</Link> to get started.</p>
        )}
      </div>

      {/* Detailed Table View for Recent Applications */}
      {applications.length > 0 && (
        <div className="table-container">
          <div className="table-header">
            <h2 className="table-title">Recent Applications Details</h2>
            <Link to="/candidate/applications" className="btn btn-sm btn-primary">
              View All
            </Link>
          </div>

          <table>
            <thead>
              <tr>
                <th>Job Title</th>
                <th>Company</th>
                <th>Location</th>
                <th>Status</th>
                <th>Applied Date</th>
              </tr>
            </thead>
            <tbody>
              {applications.slice(0, 5).map((application) => (
                <tr key={application._id}>
                  <td>{application.job?.title || "N/A"}</td>
                  <td>{application.job?.company || "N/A"}</td>
                  <td>{application.job?.location || "N/A"}</td>
                  <td>{getStatusBadge(application.status)}</td>
                  <td>{new Date(application.appliedAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CandidateDashboard;