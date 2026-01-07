import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../utils/axiosinstance";
import { REPORT_ENDPOINTS } from "../../utils/apiPath";
import "./User.css";

const UserDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (user?._id) {
        try {
          const response = await axiosInstance.get(
            REPORT_ENDPOINTS.GET_USER_STATS(user._id)
          );
          setStats(response.data);
        } catch (error) {
          console.error("Failed to fetch stats:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchStats();
  }, [user]);

  return (
    <div className="user-container">
      <div className="user-header">
        <h1>My Dashboard</h1>
        <p>Welcome, {user?.name}!</p>
      </div>

      <div className="user-nav">
        <Link to="/user/tasks" className="nav-btn">
          View My Tasks
        </Link>
      </div>

      {loading ? (
        <div className="loading">Loading your statistics...</div>
      ) : stats ? (
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Tasks</h3>
            <p className="stat-number">{stats.totalUserTasks}</p>
          </div>
          <div className="stat-card">
            <h3>Completed</h3>
            <p className="stat-number completed">{stats.completedUserTasks}</p>
          </div>
          <div className="stat-card">
            <h3>In Progress</h3>
            <p className="stat-number inprogress">{stats.inProgressUserTasks}</p>
          </div>
          <div className="stat-card">
            <h3>Pending</h3>
            <p className="stat-number pending">{stats.pendingUserTasks}</p>
          </div>
          <div className="stat-card">
            <h3>Completion Rate</h3>
            <p className="stat-number">{stats.userCompletionRate}%</p>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default UserDashboard;
