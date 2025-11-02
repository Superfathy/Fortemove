import React from "react";
import { Link } from "react-router-dom";

const JobCard = ({ job }) => {
  return (
    <div className="job-card">
      <h3>{job.title}</h3>
      <div className="location">
        <span>📍 {job.location}</span>
      </div>
      <div className="description">
        {job.description.length > 100
          ? `${job.description.substring(0, 100)}...`
          : job.description}
      </div>
      {job.salaryVisible && <div className="salary">Salary: ${job.salary}</div>}
      <Link to={`/candidate/jobs/${job._id}`} className="btn btn-primary">
        View Details
      </Link>
    </div>
  );
};

export default JobCard;
