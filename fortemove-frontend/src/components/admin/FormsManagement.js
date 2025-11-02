import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  getQuestionnaires,
  getTalents,
  deleteQuestionnaire,
  deleteTalent,
} from "../../services/api";

const FormsManagement = () => {
  const [questionnaires, setQuestionnaires] = useState([]);
  const [talents, setTalents] = useState([]);
  const [activeTab, setActiveTab] = useState("questionnaires");
  const [loading, setLoading] = useState(true);
  const [selectedQuestionnaire, setSelectedQuestionnaire] = useState(null);
  const [selectedTalent, setSelectedTalent] = useState(null);

  useEffect(() => {
    fetchForms();
  }, []);

  const fetchForms = async () => {
    try {
      const [questionnairesRes, talentsRes] = await Promise.all([
        getQuestionnaires(),
        getTalents(),
      ]);

      setQuestionnaires(questionnairesRes.data.data.forms || []);
      setTalents(talentsRes.data.data.talents || []);
    } catch (error) {
      toast.error("Failed to fetch forms");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteQuestionnaire = async (id) => {
    if (window.confirm("Are you sure you want to delete this questionnaire?")) {
      try {
        await deleteQuestionnaire(id);
        toast.success("Questionnaire deleted successfully");
        fetchForms();
        setSelectedQuestionnaire(null);
      } catch (error) {
        toast.error("Failed to delete questionnaire");
      }
    }
  };

  const handleDeleteTalent = async (id) => {
    if (window.confirm("Are you sure you want to delete this talent form?")) {
      try {
        await deleteTalent(id);
        toast.success("Talent form deleted successfully");
        fetchForms();
        setSelectedTalent(null);
      } catch (error) {
        toast.error("Failed to delete talent form");
      }
    }
  };

  const downloadCV = (cvUrl) => {
    window.open(cvUrl, "_blank");
  };

  if (loading) return <div className="loading">Loading forms...</div>;

  return (
    <div className="container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Forms Management</h1>
      </div>

      <div className="tabs" style={{ marginBottom: "1rem" }}>
        <button
          className={`btn ${activeTab === "questionnaires" ? "btn-primary" : "btn-secondary"}`}
          onClick={() => setActiveTab("questionnaires")}
        >
          Business Questionnaires ({questionnaires.length})
        </button>
        <button
          className={`btn ${activeTab === "talents" ? "btn-primary" : "btn-secondary"}`}
          onClick={() => setActiveTab("talents")}
        >
          Talent Forms ({talents.length})
        </button>
      </div>

      {activeTab === "questionnaires" && (
        <div className="forms-management">
          <div className="table-container">
            <div className="table-header">
              <h2 className="table-title">Business Questionnaires</h2>
            </div>

            <div className="forms-layout">
              <div className="forms-list">
                <table>
                  <thead>
                    <tr>
                      <th>Company</th>
                      <th>Contact</th>
                      <th>Position Needed</th>
                      <th>Submitted</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {questionnaires.map((form) => (
                      <tr
                        key={form._id}
                        className={
                          selectedQuestionnaire?._id === form._id
                            ? "selected"
                            : ""
                        }
                        onClick={() => setSelectedQuestionnaire(form)}
                      >
                        <td>
                          <div>
                            <strong>{form.companyIndustry}</strong>
                          </div>
                          <small>
                            {form.companySize} • {form.companyType}
                          </small>
                        </td>
                        <td>
                          <div>{form.name}</div>
                          <small>{form.email}</small>
                        </td>
                        <td>{form.positionNeeded}</td>
                        <td>{new Date(form.createdAt).toLocaleDateString()}</td>
                        <td>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteQuestionnaire(form._id);
                            }}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {questionnaires.length === 0 && (
                  <div style={{ padding: "2rem", textAlign: "center" }}>
                    No questionnaires found.
                  </div>
                )}
              </div>

              {selectedQuestionnaire && (
                <div className="form-details">
                  <h3>Questionnaire Details</h3>
                  <div className="details-content">
                    <h4>Company Information</h4>
                    <p>
                      <strong>Industry:</strong>{" "}
                      {selectedQuestionnaire.companyIndustry}
                    </p>
                    <p>
                      <strong>Location:</strong>{" "}
                      {selectedQuestionnaire.companyLocation}
                    </p>
                    <p>
                      <strong>Size:</strong> {selectedQuestionnaire.companySize}
                    </p>
                    <p>
                      <strong>Type:</strong> {selectedQuestionnaire.companyType}
                    </p>

                    <h4>Position Requirements</h4>
                    <p>
                      <strong>Position:</strong>{" "}
                      {selectedQuestionnaire.positionNeeded}
                    </p>
                    <p>
                      <strong>Experience:</strong>{" "}
                      {selectedQuestionnaire.yearsOfExperience}
                    </p>
                    <p>
                      <strong>Work Model:</strong>{" "}
                      {selectedQuestionnaire.workModel}
                    </p>
                    <p>
                      <strong>Employment Type:</strong>{" "}
                      {selectedQuestionnaire.employmentType}
                    </p>

                    <h4>Contact Information</h4>
                    <p>
                      <strong>Name:</strong> {selectedQuestionnaire.name}
                    </p>
                    <p>
                      <strong>Title:</strong> {selectedQuestionnaire.title}
                    </p>
                    <p>
                      <strong>Email:</strong> {selectedQuestionnaire.email}
                    </p>
                    <p>
                      <strong>Phone:</strong>{" "}
                      {selectedQuestionnaire.phone || "Not provided"}
                    </p>

                    {selectedQuestionnaire.businessNeeds && (
                      <>
                        <h4>Additional Requirements</h4>
                        <p>{selectedQuestionnaire.businessNeeds}</p>
                      </>
                    )}

                    <p>
                      <strong>Submitted:</strong>{" "}
                      {new Date(
                        selectedQuestionnaire.createdAt
                      ).toLocaleString()}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === "talents" && (
        <div className="forms-management">
          <div className="table-container">
            <div className="table-header">
              <h2 className="table-title">Talent Forms</h2>
            </div>

            <div className="forms-layout">
              <div className="forms-list">
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Profession</th>
                      <th>Experience</th>
                      <th>Submitted</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {talents.map((talent) => (
                      <tr
                        key={talent._id}
                        className={
                          selectedTalent?._id === talent._id ? "selected" : ""
                        }
                        onClick={() => setSelectedTalent(talent)}
                      >
                        <td>
                          <div>{talent.name}</div>
                          <small>{talent.email}</small>
                        </td>
                        <td>{talent.profession}</td>
                        <td>{talent.experience}</td>
                        <td>
                          {new Date(talent.createdAt).toLocaleDateString()}
                        </td>
                        <td>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteTalent(talent._id);
                            }}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {talents.length === 0 && (
                  <div style={{ padding: "2rem", textAlign: "center" }}>
                    No talent forms found.
                  </div>
                )}
              </div>

              {selectedTalent && (
                <div className="form-details">
                  <h3>Talent Details</h3>
                  <div className="details-content">
                    <h4>Personal Information</h4>
                    <p>
                      <strong>Name:</strong> {selectedTalent.name}
                    </p>
                    <p>
                      <strong>Email:</strong> {selectedTalent.email}
                    </p>
                    <p>
                      <strong>Phone:</strong>{" "}
                      {selectedTalent.phone || "Not provided"}
                    </p>

                    <h4>Professional Information</h4>
                    <p>
                      <strong>Profession:</strong> {selectedTalent.profession}
                    </p>
                    <p>
                      <strong>Experience:</strong> {selectedTalent.experience}
                    </p>

                    <h4>CV</h4>
                    {selectedTalent.cvUrl && (
                      <button
                        className="btn btn-primary"
                        onClick={() => downloadCV(selectedTalent.cvUrl)}
                      >
                        Download CV
                      </button>
                    )}

                    <p>
                      <strong>Submitted:</strong>{" "}
                      {new Date(selectedTalent.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormsManagement;
