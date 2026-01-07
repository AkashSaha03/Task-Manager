import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useTask } from "../../context/TaskContext";
import "./Admin.css";

const ManageTasks = () => {
  const { tasks, loading, error, fetchAllTasks, deleteTask } = useTask();

  useEffect(() => {
    fetchAllTasks();
  }, []);

  const handleDelete = async (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await deleteTask(taskId);
        alert("Task deleted successfully");
      } catch (err) {
        alert("Failed to delete task");
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "completed";
      case "In Progress":
        return "inprogress";
      case "Pending":
        return "pending";
      default:
        return "";
    }
  };

  return (
    <div className="admin-container">
      <div className="tasks-container">
        <h2>Manage Tasks</h2>
        <Link to="/admin/create-task" className="nav-btn" style={{ marginBottom: "20px", display: "inline-block" }}>
          + Create New Task
        </Link>

        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <div className="loading">Loading tasks...</div>
        ) : tasks.length > 0 ? (
          <div className="task-list">
            {tasks.map((task) => (
              <div key={task._id} className="task-item">
                <div className="task-info">
                  <h3>{task.title}</h3>
                  <p>{task.description}</p>
                  <p style={{ marginTop: "10px" }}>
                    <strong>Status:</strong> <span className={getStatusColor(task.status)}>{task.status}</span>
                    {" | "}
                    <strong>Priority:</strong> {task.priority}
                    {" | "}
                    <strong>Due:</strong> {new Date(task.dueDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="task-actions">
                  <Link to={`/admin/task-details/${task._id}`} className="btn btn-primary">
                    Edit
                  </Link>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(task._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No tasks found. <Link to="/admin/create-task">Create one now</Link></p>
        )}
      </div>
    </div>
  );
};

export default ManageTasks;
