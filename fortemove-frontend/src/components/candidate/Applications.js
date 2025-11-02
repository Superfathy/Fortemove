import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getMyApplications } from '../../services/api';

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchMyApplications();
  }, []);

  const fetchMyApplications = async () => {
    try {
      const response = await getMyApplications();
      setApplications(response.data.data.applications);
    } catch (error) {
      toast.error('Failed to fetch your applications');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const downloadCV = (cvUrl) => {
    window.open(cvUrl, '_blank');
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      pending: 'btn-warning',
      reviewed: 'btn-info',
      rejected: 'btn-danger',
      accepted: 'btn-success'
    };
    
    return <span className={`btn btn-sm ${statusColors[status]}`}>{status}</span>;
  };

  const getStatusText = (status) => {
    const statusMessages = {
      pending: 'Your application is under review',
      reviewed: 'Your application has been reviewed',
      rejected: 'Your application was not selected',
      accepted: 'Congratulations! Your application was accepted'
    };
    
    return statusMessages[status] || 'Status: ' + status;
  };

  const filteredApplications = filterStatus === 'all' 
    ? applications 
    : applications.filter(app => app.status === filterStatus);

  if (loading) return <div className="loading">Loading your applications...</div>;

  return (
    <div className="container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">My Job Applications</h1>
        <div className="filter-controls">
          <label>Filter by status: </label>
          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
            className="btn btn-sm"
          >
            <option value="all">All Applications ({applications.length})</option>
            <option value="pending">Pending ({applications.filter(a => a.status === 'pending').length})</option>
            <option value="reviewed">Reviewed ({applications.filter(a => a.status === 'reviewed').length})</option>
            <option value="rejected">Rejected ({applications.filter(a => a.status === 'rejected').length})</option>
            <option value="accepted">Accepted ({applications.filter(a => a.status === 'accepted').length})</option>
          </select>
        </div>
      </div>

      <div className="applications-container">
        {filteredApplications.length === 0 ? (
          <div className="empty-state">
            <h3>No applications found</h3>
            <p>
              {filterStatus === 'all' 
                ? "You haven't applied to any jobs yet." 
                : `You don't have any ${filterStatus} applications.`
              }
            </p>
            {filterStatus === 'all' && (
              <a href="/candidate/jobs" className="btn btn-primary">
                Browse Jobs
              </a>
            )}
          </div>
        ) : (
          <div className="applications-grid">
            {filteredApplications.map(application => (
              <div key={application._id} className="application-card">
                <div className="application-header">
                  <h3>{application.job?.title || 'Unknown Position'}</h3>
                  <div className="application-status">
                    {getStatusBadge(application.status)}
                    <span className="status-message">
                      {getStatusText(application.status)}
                    </span>
                  </div>
                </div>

                <div className="application-details">
                  <div className="detail-item">
                    <strong>Company:</strong> {application.job?.company || 'N/A'}
                  </div>
                  <div className="detail-item">
                    <strong>Location:</strong> {application.job?.location || 'N/A'}
                  </div>
                  {application.job?.salary && (
                    <div className="detail-item">
                      <strong>Salary:</strong> ${application.job.salary}
                    </div>
                  )}
                  <div className="detail-item">
                    <strong>Applied on:</strong> {new Date(application.appliedAt).toLocaleDateString()}
                  </div>
                </div>

                <div className="application-actions">
                  {application.cvUrl && (
                    <button 
                      className="btn btn-sm btn-primary"
                      onClick={() => downloadCV(application.cvUrl)}
                    >
                      View CV
                    </button>
                  )}
                  
                  <button 
                    className="btn btn-sm btn-info"
                    onClick={() => setSelectedApplication(application)}
                  >
                    View Details
                  </button>
                </div>

                {selectedApplication && selectedApplication._id === application._id && (
                  <div className="application-full-details">
                    <h4>Application Details</h4>
                    
                    <div className="detail-section">
                      <h5>Cover Letter</h5>
                      <div className="cover-letter-content">
                        {application.coverLetter || 'No cover letter provided.'}
                      </div>
                    </div>

                    <div className="detail-section">
                      <h5>Contact Information</h5>
                      <p><strong>Email:</strong> {application.email}</p>
                      <p><strong>Phone:</strong> {application.phone || 'Not provided'}</p>
                    </div>

                    <div className="detail-section">
                      <h5>Application Status</h5>
                      <p>{getStatusText(application.status)}</p>
                      <p><strong>Last updated:</strong> {new Date(application.updatedAt).toLocaleDateString()}</p>
                    </div>

                    <button 
                      className="btn btn-sm btn-secondary"
                      onClick={() => setSelectedApplication(null)}
                    >
                      Close Details
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Application Statistics */}
      {applications.length > 0 && (
        <div className="application-stats">
          <h3>Application Statistics</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-number">{applications.length}</span>
              <span className="stat-label">Total Applications</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{applications.filter(a => a.status === 'pending').length}</span>
              <span className="stat-label">Pending</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{applications.filter(a => a.status === 'reviewed').length}</span>
              <span className="stat-label">Reviewed</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{applications.filter(a => a.status === 'accepted').length}</span>
              <span className="stat-label">Accepted</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Applications;