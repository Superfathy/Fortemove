import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Components
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import ProtectedRoute from "./components/common/ProtectedRoute";

// Pages
import Home from "./pages/Home";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import RoleSelection from "./components/auth/RoleSelection";
import About from "./pages/About";
import Contact from "./pages/Contact";

// Admin Components
import AdminDashboard from "./components/admin/Dashboard";
import UsersManagement from "./components/admin/UsersManagement";
import JobsManagement from "./components/admin/JobsManagement";
import ApplicationsManagement from "./components/admin/ApplicationsManagement";
import FormsManagement from "./components/admin/FormsManagement";
import ImportExport from "./components/admin/ImportExport";

// Candidate Components
import CandidateDashboard from "./components/candidate/Dashboard";
import JobList from "./components/candidate/JobList";
import JobDetail from "./components/candidate/JobDetail";
import Applications from "./components/candidate/Applications";

// Business Components
import BusinessDashboard from "./components/business/Dashboard";
import BusinessForm from "./components/business/BusinessForm";

// Styles
import "./styles/App.css";

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main className="main-content">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/select-role" element={<RoleSelection />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />

            {/* Admin Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <UsersManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/jobs"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <JobsManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/applications"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <ApplicationsManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/forms"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <FormsManagement />
                </ProtectedRoute>
              }
              
            />
            <Route 
  path="/admin/import-export" 
  element={
    <ProtectedRoute allowedRoles={['admin']}>
      <ImportExport />
    </ProtectedRoute>
  } 
/>

            {/* Candidate Routes */}
            <Route
              path="/candidate/dashboard"
              element={
                <ProtectedRoute allowedRoles={["candidate"]}>
                  <CandidateDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/candidate/jobs"
              element={
                <ProtectedRoute allowedRoles={["candidate"]}>
                  <JobList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/candidate/jobs/:id"
              element={
                <ProtectedRoute allowedRoles={["candidate"]}>
                  <JobDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/candidate/applications"
              element={
                <ProtectedRoute allowedRoles={["candidate"]}>
                  <Applications />
                </ProtectedRoute>
              }
            />

            {/* Business Owner Routes */}
            <Route
              path="/business/dashboard"
              element={
                <ProtectedRoute allowedRoles={["business owner"]}>
                  <BusinessDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/business/form"
              element={
                <ProtectedRoute allowedRoles={["business owner"]}>
                  <BusinessForm />
                </ProtectedRoute>
              }
            />

            {/* 404 Route */}
            <Route
              path="*"
              element={
                <div className="container">
                  <h2>Page not found</h2>
                </div>
              }
            />
          </Routes>
        </main>
        <Footer />
        <ToastContainer position="bottom-right" />
      </div>
    </Router>
  );
}

export default App;
