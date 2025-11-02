import React, { useState, useEffect } from "react";
import { getJobs } from "../../services/api";
import JobCard from "./JobCard";

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await getJobs();
        setJobs(response.data.data.jobs);
      } catch (err) {
        setError("Failed to load jobs");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  if (loading) return <div className="loading">Loading jobs...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Available Jobs</h1>
      </div>

      <div className="jobs-grid">
        {jobs.map((job) => (
          <JobCard key={job._id} job={job} />
        ))}
      </div>

      {jobs.length === 0 && (
        <div className="loading">No jobs available at the moment.</div>
      )}
    </div>
  );
};

export default JobList;
