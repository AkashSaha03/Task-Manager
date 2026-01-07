import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTask } from "../../context/TaskContext";
import "./User.css";

const MyTasks = () => {
  const { user } = useAuth();
  const { loading, error, fetchUserTasks, updateTask } = useTask();
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      if (user?._id) {
        try {
          const userTasks = await fetchUserTasks(user._id);
          setTasks(userTasks);
        } catch (err) {
          console.error("Failed to fetch tasks:", err);
        }
      }
    };

    fetchTasks();
  }, [user]);

  const handleTaskClick = (taskId) => {
    navigate(`/user/task-details/${taskId}`);
  };

  const handleStatusChange = async (taskId, currentStatus) => {
    const statusOptions = ["Pending", "In Progress", "Completed"];
    const nextStatus = statusOptions[(statusOptions.indexOf(currentStatus) + 1) % 3];

    try {
      await updateTask(taskId, { status: nextStatus });
      // Refresh tasks
      const userTasks = await fetchUserTasks(user._id);
      setTasks(userTasks);
    } catch (err) {
      console.error("Failed to update task status:", err);
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
    <div className="user-container">
      <div className="tasks-container">
        <h2>My Tasks</h2>

        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <div className="loading">Loading your tasks...</div>
        ) : tasks.length > 0 ? (
          <div className="task-list">
            {tasks.map((task) => (
              <div key={task._id} className="task-item" onClick={() => handleTaskClick(task._id)}>
                <h3>{task.title}</h3>
                <p>{task.description}</p>

                <div className="task-meta">
                  <div className="meta-item">
                    <span className={`status-badge ${getStatusColor(task.status)}`}>
                      {task.status}
                    </span>
                  </div>
                  <div className="meta-item">
                    <span className={`priority-badge ${task.priority.toLowerCase()}`}>
                      {task.priority} Priority
                    </span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                  {task.progress !== undefined && (
                    <div className="meta-item">
                      <span className="meta-label">
                        Progress: {task.progress}%
                      </span>
                    </div>
                  )}
                </div>

                <div className="btn-group" onClick={(e) => e.stopPropagation()}>
                  <button
                    className="btn btn-primary"
                    onClick={() => handleStatusChange(task._id, task.status)}
                  >
                    Change Status
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-tasks">
            <p>You don't have any assigned tasks yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTasks;
