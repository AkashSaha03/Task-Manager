import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosinstance";
import { USER_ENDPOINTS } from "../../utils/apiPath";
import "./Admin.css";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axiosInstance.get(USER_ENDPOINTS.GET_ALL_USERS);
        setUsers(response.data);
      } catch (err) {
        setError("Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axiosInstance.delete(USER_ENDPOINTS.DELETE_USER(userId));
        setUsers(users.filter((user) => user._id !== userId));
        alert("User deleted successfully");
      } catch (err) {
        alert("Failed to delete user");
      }
    }
  };

  return (
    <div className="admin-container">
      <div className="users-container">
        <h2>Manage Users</h2>

        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <div className="loading">Loading users...</div>
        ) : users.length > 0 ? (
          <div className="user-list">
            {users.map((user) => (
              <div key={user._id} className="user-item">
                <div className="user-avatar">
                  {user.profileImageUrl ? (
                    <img 
                      src={`http://localhost:8000/${user.profileImageUrl}`}
                      alt={user.name}
                      className="profile-img"
                    />
                  ) : (
                    <div className="avatar-placeholder">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="user-info">
                  <h3>{user.name}</h3>
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Role:</strong> <span style={{ 
                    background: user.role === "admin" ? "#e74c3c" : "#667eea",
                    color: "white",
                    padding: "4px 8px",
                    borderRadius: "4px",
                    fontSize: "12px",
                    fontWeight: "600"
                  }}>{user.role.toUpperCase()}</span></p>
                </div>
                <div className="user-actions">
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(user._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No users found.</p>
        )}
      </div>
    </div>
  );
};

export default ManageUsers;
