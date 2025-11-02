import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  getApplications,
  updateApplicationStatus,
  deleteApplication,
} from "../../services/api";

const ApplicationsManagement = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await getApplications();
      setApplications(response.data.data.applications);
    } catch (error) {
      toast.error("Failed to fetch applications");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await updateApplicationStatus(id, newStatus);
      toast.success("Application status updated");
      fetchApplications(); // Refresh the list
    } catch (error) {
      toast.error("Failed to update application status");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this application?")) {
      try {
        await deleteApplication(id);
        toast.success("Application deleted successfully");
        fetchApplications();
      } catch (error) {
        toast.error("Failed to delete application");
      }
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

  if (loading) return <div className="loading">Loading applications...</div>;

  return (
    <div className="container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Applications Management</h1>
      </div>

      <div className="table-container">
        <div className="table-header">
          <h2 className="table-title">All Applications</h2>
        </div>

        <table>
          <thead>
            <tr>
              <th>Applicant</th>
              <th>Job Title</th>
              <th>Email</th>
              <th>Status</th>
              <th>Applied At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((application) => (
              <tr key={application._id}>
                <td>{application.name}</td>
                <td>{application.job?.title || "N/A"}</td>
                <td>{application.email}</td>
                <td>{getStatusBadge(application.status)}</td>
                <td>{new Date(application.appliedAt).toLocaleDateString()}</td>
                <td>
                  <div className="action-buttons">
                    <select
                      className="btn btn-sm"
                      value={application.status}
                      onChange={(e) =>
                        handleStatusUpdate(application._id, e.target.value)
                      }
                    >
                      <option value="pending">Pending</option>
                      <option value="reviewed">Reviewed</option>
                      <option value="rejected">Rejected</option>
                      <option value="accepted">Accepted</option>
                    </select>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(application._id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {applications.length === 0 && (
          <div style={{ padding: "2rem", textAlign: "center" }}>
            No applications found.
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationsManagement;
