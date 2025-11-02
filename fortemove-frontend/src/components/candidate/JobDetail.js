import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getJob, applyForJob } from "../../services/api";

const JobDetail = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [applicationData, setApplicationData] = useState({
    name: "",
    email: "",
    coverLetter: "",
    cv: null,
  });

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await getJob(id);
        setJob(response.data.data.job);
      } catch (error) {
        toast.error("Failed to load job details");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  const handleInputChange = (e) => {
    setApplicationData({
      ...applicationData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    setApplicationData({
      ...applicationData,
      cv: e.target.files[0],
    });
  };

  const handleSubmitApplication = async (e) => {
    e.preventDefault();
    setApplying(true);

    try {
      await applyForJob(id, applicationData);
      toast.success("Application submitted successfully!");
      setShowApplicationForm(false);
      setApplicationData({
        name: "",
        email: "",
        coverLetter: "",
        cv: null,
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Application failed");
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <div className="loading">Loading job details...</div>;
  if (!job) return <div className="error">Job not found</div>;

  return (
    <div className="container">
      <div className="job-detail">
        <h1>{job.title}</h1>
        <div className="job-meta">
          <span>📍 {job.location}</span>
          {job.salaryVisible && <span>💰 ${job.salary}</span>}
        </div>

        <div className="job-section">
          <h2>Job Description</h2>
          <p>{job.description}</p>
        </div>

        <div className="job-section">
          <h2>Requirements</h2>
          <p>{job.requirements}</p>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => setShowApplicationForm(!showApplicationForm)}
        >
          {showApplicationForm ? "Cancel Application" : "Apply for this Job"}
        </button>

        {showApplicationForm && (
          <div className="form-container" style={{ marginTop: "2rem" }}>
            <h2>Apply for this Position</h2>
            <form onSubmit={handleSubmitApplication}>
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={applicationData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={applicationData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="coverLetter">Cover Letter</label>
                <textarea
                  id="coverLetter"
                  name="coverLetter"
                  value={applicationData.coverLetter}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="cv">Upload CV (PDF/DOC)</label>
                <input
                  type="file"
                  id="cv"
                  name="cv"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx"
                  required
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={applying}
              >
                {applying ? "Submitting..." : "Submit Application"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobDetail;
