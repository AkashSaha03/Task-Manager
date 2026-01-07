import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTask } from "../../context/TaskContext";
import "./User.css";

const ViewTaskDetails = () => {
  const { id } = useParams();
  const { loading, error, fetchTaskById, updateTask, addTodo, updateTodo } = useTask();
  const [task, setTask] = useState(null);
  const [newTodo, setNewTodo] = useState("");
  const [updating, setUpdating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadTask = async () => {
      try {
        const taskData = await fetchTaskById(id);
        setTask(taskData);
      } catch (err) {
        console.error("Failed to fetch task:", err);
      }
    };

    loadTask();
  }, [id]);

  const handleStatusChange = async (newStatus) => {
    try {
      setUpdating(true);
      await updateTask(id, { status: newStatus });
      setTask({ ...task, status: newStatus });
    } catch (err) {
      console.error("Failed to update status:", err);
    } finally {
      setUpdating(false);
    }
  };

  const handleProgressChange = async (e) => {
    const newProgress = parseInt(e.target.value);
    try {
      setUpdating(true);
      await updateTask(id, { progress: newProgress });
      setTask({ ...task, progress: newProgress });
    } catch (err) {
      console.error("Failed to update progress:", err);
    } finally {
      setUpdating(false);
    }
  };

  const handleAddTodo = async () => {
    if (!newTodo.trim()) return;

    try {
      const updatedTask = await addTodo(id, newTodo);
      setTask(updatedTask);
      setNewTodo("");
    } catch (err) {
      console.error("Failed to add todo:", err);
    }
  };

  const handleToggleTodo = async (todoId, currentCompleted) => {
    try {
      const updatedTask = await updateTodo(id, todoId, !currentCompleted);
      setTask(updatedTask);
    } catch (err) {
      console.error("Failed to update todo:", err);
    }
  };

  if (loading) return <div className="user-container"><div className="loading">Loading task...</div></div>;
  if (error) return <div className="user-container"><div className="error-message">{error}</div></div>;
  if (!task) return <div className="user-container"><div className="no-tasks">Task not found</div></div>;

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
      <button onClick={() => navigate(-1)} className="nav-btn" style={{ marginBottom: "20px" }}>
        ← Back
      </button>

      <div className="tasks-container">
        <h2>{task.title}</h2>
        <p>{task.description}</p>

        <div className="task-meta" style={{ margin: "20px 0" }}>
          <div className="meta-item">
            <span className="meta-label">Status:</span>
            <select
              value={task.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              disabled={updating}
              style={{ padding: "4px 8px", borderRadius: "4px", border: "1px solid #ddd" }}
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
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
        </div>

        {task.progress !== undefined && (
          <div style={{ margin: "20px 0" }}>
            <label style={{ display: "block", marginBottom: "10px", fontWeight: "600" }}>
              Progress: {task.progress}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={task.progress}
              onChange={handleProgressChange}
              disabled={updating}
              style={{ width: "100%", cursor: updating ? "not-allowed" : "pointer" }}
            />
          </div>
        )}

        <div style={{ marginTop: "30px" }}>
          <h3>Checklist</h3>
          <div style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleAddTodo()}
              placeholder="Add a new todo..."
              style={{ flex: 1, padding: "8px", border: "1px solid #ddd", borderRadius: "4px" }}
            />
            <button onClick={handleAddTodo} className="btn btn-primary">
              Add
            </button>
          </div>

          {task.todoChecklist && task.todoChecklist.length > 0 ? (
            <ul className="todo-list">
              {task.todoChecklist.map((todo) => (
                <li key={todo._id} className="todo-item">
                  <input
                    type="checkbox"
                    id={`todo-${todo._id}`}
                    checked={todo.completed}
                    onChange={() => handleToggleTodo(todo._id, todo.completed)}
                  />
                  <label htmlFor={`todo-${todo._id}`}>{todo.text}</label>
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ color: "#999" }}>No todos yet.</p>
          )}
        </div>

        {task.createdBy && (
          <div style={{ marginTop: "30px", paddingTop: "20px", borderTop: "1px solid #eee" }}>
            <p><strong>Created by:</strong> {task.createdBy.name}</p>
            <p><strong>Created at:</strong> {new Date(task.createdAt).toLocaleString()}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewTaskDetails;
