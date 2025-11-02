import React, { useState, useEffect } from "react";
import { getAdminDashboard } from "../../services/api";
import StatsCard from "./StatsCard";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await getAdminDashboard();
        setStats(response.data.data);
      } catch (err) {
        setError("Failed to load dashboard data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <div className="loading">Loading dashboard...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Admin Dashboard</h1>
      </div>

      <div className="stats-grid">
        <StatsCard title="Total Jobs" value={stats?.totalJobs} icon="📋" />
        <StatsCard
          title="Total Applications"
          value={stats?.totalApplications}
          icon="📄"
        />
        <StatsCard title="Total Users" value={stats?.totalUsers} icon="👥" />
        <StatsCard
          title="Total Candidates"
          value={stats?.totalCandidates}
          icon="👤"
        />
        <StatsCard
          title="Business Owners"
          value={stats?.totalBusinessOwners}
          icon="🏢"
        />
        <StatsCard
          title="Questionnaires"
          value={stats?.totalQuestionnaires}
          icon="📝"
        />
        <StatsCard title="Talents" value={stats?.totalTalents} icon="🌟" />
      </div>
    </div>
  );
};

export default AdminDashboard;
