import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../utils/axiosinstance";
import { REPORT_ENDPOINTS } from "../../utils/apiPath";
import "./Admin.css";

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axiosInstance.get(REPORT_ENDPOINTS.GET_TASK_STATS);
        setStats(response.data);
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Welcome, {user?.name}!</p>
      </div>

      <div className="admin-nav">
        <Link to="/admin/tasks" className="nav-btn">View Tasks</Link>
        <Link to="/admin/create-task" className="nav-btn">Create Task</Link>
        <Link to="/admin/users" className="nav-btn">Manage Users</Link>
      </div>

      {loading ? (
        <div className="loading">Loading statistics...</div>
      ) : stats ? (
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Tasks</h3>
            <p className="stat-number">{stats.totalTasks}</p>
          </div>
          <div className="stat-card">
            <h3>Completed</h3>
            <p className="stat-number completed">{stats.completedTasks}</p>
          </div>
          <div className="stat-card">
            <h3>In Progress</h3>
            <p className="stat-number inprogress">{stats.inProgressTasks}</p>
          </div>
          <div className="stat-card">
            <h3>Pending</h3>
            <p className="stat-number pending">{stats.pendingTasks}</p>
          </div>
          <div className="stat-card">
            <h3>High Priority</h3>
            <p className="stat-number high">{stats.highPriorityTasks}</p>
          </div>
          <div className="stat-card">
            <h3>Completion Rate</h3>
            <p className="stat-number">{stats.completionRate}%</p>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Dashboard;
