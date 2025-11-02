import axios from "axios";
import { getToken, removeToken } from "./auth";

const API_BASE_URL = "http://localhost:3000/api/v1";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      removeToken();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const login = (credentials) => api.post("/users/login", credentials);
export const signup = (userData) => api.post("/users/signup", userData);
export const googleLogin = (tokenId, role) =>
  api.post("/users/googleLogin", { tokenId, role });
export const logout = () => api.get("/users/logout");
export const updatePassword = (data) =>
  api.patch("/users/updatePassword", data);
export const forgotPassword = (email) =>
  api.post("/users/forgotPassword", { email });
export const resetPassword = (token, data) =>
  api.patch(`/users/resetPassword/${token}`, data);

// Job endpoints
export const getJobs = () => api.get("/jobs");
export const getJob = (id) => api.get(`/jobs/${id}`);
export const createJob = (jobData) => api.post("/jobs", jobData);
export const updateJob = (id, jobData) => api.patch(`/jobs/${id}`, jobData);
export const deleteJob = (id) => api.delete(`/jobs/${id}`);
export const applyForJob = (id, applicationData) => {
  const formData = new FormData();
  Object.keys(applicationData).forEach((key) => {
    formData.append(key, applicationData[key]);
  });
  return api.post(`/jobs/${id}/apply`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// Application endpoints
export const getApplications = () => api.get("/admin/applications");
export const getApplication = (id) => api.get(`/admin/applications/${id}`);
export const updateApplicationStatus = (id, status) =>
  api.patch(`/admin/applications/${id}`, { status });
export const deleteApplication = (id) =>
  api.delete(`/admin/applications/${id}`);

// User endpoints
export const getUsers = () => api.get("/admin/users");
export const updateUserRole = (id, role) =>
  api.patch(`/admin/users/${id}`, { role });
export const deleteUser = (id) => api.delete(`/admin/users/${id}`);

// Form endpoints
export const submitBusinessForm = (formData) =>
  api.post("/forms/business", formData);
export const submitTalentForm = (formData) => {
  const data = new FormData();
  Object.keys(formData).forEach((key) => {
    data.append(key, formData[key]);
  });
  return api.post("/forms/talent", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
export const getQuestionnaires = () => api.get("/admin/questionnaires");
export const getTalents = () => api.get("/admin/talents");
export const deleteQuestionnaire = (id) =>
  api.delete(`/admin/questionnaires/${id}`);
export const deleteTalent = (id) => api.delete(`/admin/talents/${id}`);

// Admin dashboard
export const getAdminDashboard = () => api.get("/admin/dashboard");

export const getMyApplications = () => api.get("/candidate/my-applications");
export const getMyApplication = (id) => api.get(`/candidate/my-applications/${id}`);

export const candidateDashboard = () => api.get("/candidate/dashboard");

// Add these to your API services
export const importApplications = (formData) => 
  api.post('/import-export/applications/import', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });

export const exportApplications = (params) => 
  api.get('/import-export/applications/export', { 
    params,
    responseType: 'blob' // Important for file downloads
  });

export const getExportTemplate = () => 
  api.get('/import-export/applications/export/template', {
    responseType: 'blob'
  });

export default api;
