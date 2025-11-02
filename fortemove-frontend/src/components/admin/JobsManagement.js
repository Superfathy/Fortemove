import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { getJobs, createJob, updateJob, deleteJob } from "../../services/api";

const JobsManagement = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    requirements: "",
    location: "",
    salaryVisible: false,
    salary: "",
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await getJobs();
      setJobs(response.data.data.jobs);
    } catch (error) {
      toast.error("Failed to fetch jobs");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingJob) {
        await updateJob(editingJob._id, formData);
        toast.success("Job updated successfully");
      } else {
        await createJob(formData);
        toast.success("Job created successfully");
      }

      setShowForm(false);
      setEditingJob(null);
      setFormData({
        title: "",
        description: "",
        requirements: "",
        location: "",
        salaryVisible: false,
        salary: "",
      });
      fetchJobs();
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed");
    }
  };

  const handleEdit = (job) => {
    setEditingJob(job);
    setFormData({
      title: job.title,
      description: job.description,
      requirements: job.requirements,
      location: job.location,
      salaryVisible: job.salaryVisible,
      salary: job.salary || "",
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      try {
        await deleteJob(id);
        toast.success("Job deleted successfully");
        fetchJobs();
      } catch (error) {
        toast.error("Failed to delete job");
      }
    }
  };

  if (loading) return <div className="loading">Loading jobs...</div>;

  return (
    <div className="container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Jobs Management</h1>
        <button
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Cancel" : "Add New Job"}
        </button>
      </div>

      {showForm && (
        <div className="form-container" style={{ marginBottom: "2rem" }}>
          <h2>{editingJob ? "Edit Job" : "Create New Job"}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="title">Job Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="requirements">Requirements</label>
              <textarea
                id="requirements"
                name="requirements"
                value={formData.requirements}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="location">Location</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  name="salaryVisible"
                  checked={formData.salaryVisible}
                  onChange={handleChange}
                />
                Show Salary
              </label>
            </div>
            {formData.salaryVisible && (
              <div className="form-group">
                <label htmlFor="salary">Salary</label>
                <input
                  type="number"
                  id="salary"
                  name="salary"
                  value={formData.salary}
                  onChange={handleChange}
                  required={formData.salaryVisible}
                />
              </div>
            )}
            <button type="submit" className="btn btn-primary">
              {editingJob ? "Update Job" : "Create Job"}
            </button>
          </form>
        </div>
      )}

      <div className="table-container">
        <div className="table-header">
          <h2 className="table-title">All Jobs</h2>
        </div>
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Location</th>
              <th>Salary</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job._id}>
                <td>{job.title}</td>
                <td>{job.location}</td>
                <td>{job.salaryVisible ? `$${job.salary}` : "Not shown"}</td>
                <td>{new Date(job.createdAt).toLocaleDateString()}</td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="btn btn-sm btn-warning"
                      onClick={() => handleEdit(job)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(job._id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default JobsManagement;
