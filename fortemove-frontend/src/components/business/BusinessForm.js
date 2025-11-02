import React, { useState } from "react";
import { toast } from "react-toastify";
import { submitBusinessForm } from "../../services/api";

const BusinessForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    title: "",
    companySize: "",
    companyType: "",
    companyIndustry: "",
    companyLocation: "",
    positionNeeded: "",
    yearsOfExperience: "",
    workModel: "",
    employmentType: "",
    businessNeeds: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await submitBusinessForm(formData);
      toast.success(
        "Business form submitted successfully! We will contact you soon."
      );
      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        title: "",
        companySize: "",
        companyType: "",
        companyIndustry: "",
        companyLocation: "",
        positionNeeded: "",
        yearsOfExperience: "",
        workModel: "",
        employmentType: "",
        businessNeeds: "",
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Form submission failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="form-container">
        <h2 className="form-title">Business HR Services Questionnaire</h2>
        <p style={{ marginBottom: "2rem", textAlign: "center" }}>
          Please provide detailed information about your business needs so we
          can offer you the best HR solutions.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="title">Job Title *</label>
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
            <label htmlFor="companyIndustry">Company Industry *</label>
            <input
              type="text"
              id="companyIndustry"
              name="companyIndustry"
              value={formData.companyIndustry}
              onChange={handleChange}
              required
              placeholder="e.g., Technology, Healthcare, Finance"
            />
          </div>

          <div className="form-group">
            <label htmlFor="companyLocation">Company Location *</label>
            <input
              type="text"
              id="companyLocation"
              name="companyLocation"
              value={formData.companyLocation}
              onChange={handleChange}
              required
              placeholder="City, Country"
            />
          </div>

          <div className="form-group">
            <label htmlFor="positionNeeded">Position Needed *</label>
            <input
              type="text"
              id="positionNeeded"
              name="positionNeeded"
              value={formData.positionNeeded}
              onChange={handleChange}
              required
              placeholder="e.g., Senior Developer, Marketing Manager"
            />
          </div>

          <div className="form-group">
            <label htmlFor="companySize">Company Size</label>
            <select
              id="companySize"
              name="companySize"
              value={formData.companySize}
              onChange={handleChange}
            >
              <option value="">Select company size</option>
              <option value="1-10">1-10 employees</option>
              <option value="11-50">11-50 employees</option>
              <option value="51-200">51-200 employees</option>
              <option value="201-500">201-500 employees</option>
              <option value="501-1000">501-1000 employees</option>
              <option value="1000+">1000+ employees</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="companyType">Company Type</label>
            <select
              id="companyType"
              name="companyType"
              value={formData.companyType}
              onChange={handleChange}
            >
              <option value="">Select company type</option>
              <option value="Startup">Startup</option>
              <option value="SME">SME (Small/Medium Enterprise)</option>
              <option value="Enterprise">Enterprise</option>
              <option value="Freelancer">Freelancer</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="yearsOfExperience">Required Experience</label>
            <select
              id="yearsOfExperience"
              name="yearsOfExperience"
              value={formData.yearsOfExperience}
              onChange={handleChange}
            >
              <option value="">Select years of experience</option>
              <option value="0-1 year">0-1 year</option>
              <option value="1-3 years">1-3 years</option>
              <option value="3-5 years">3-5 years</option>
              <option value="5+ years">5+ years</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="workModel">Work Model *</label>
            <select
              id="workModel"
              name="workModel"
              value={formData.workModel}
              onChange={handleChange}
              required
            >
              <option value="">Select work model</option>
              <option value="Remote">Remote</option>
              <option value="On-site">On-site</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="employmentType">Employment Type *</label>
            <select
              id="employmentType"
              name="employmentType"
              value={formData.employmentType}
              onChange={handleChange}
              required
            >
              <option value="">Select employment type</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Internship">Internship</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="businessNeeds">
              Additional Business Needs/Requirements
            </label>
            <textarea
              id="businessNeeds"
              name="businessNeeds"
              value={formData.businessNeeds}
              onChange={handleChange}
              rows="4"
              placeholder="Please describe your specific HR needs, challenges, timeline, or any other requirements..."
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: "100%" }}
          >
            {loading ? "Submitting..." : "Submit Questionnaire"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BusinessForm;
