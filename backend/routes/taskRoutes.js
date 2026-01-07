const express = require("express");
const { protect, adminOnly } = require("../middlewares/authMiddleware");
const {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getUserTasks,
  addTodo,
  updateTodo,
} = require("../controllers/taskControllers");

const router = express.Router();

// Task Management Routes
router.post("/", protect, createTask); // Create task
router.get("/", protect, getTasks); // Get all tasks
router.get("/user/:userId", protect, getUserTasks); // Get user's tasks
router.get("/:id", protect, getTaskById); // Get task by ID
router.put("/:id", protect, updateTask); // Update task
router.delete("/:id", protect, deleteTask); // Delete task

// Todo Management Routes
router.post("/:id/todos", protect, addTodo); // Add todo to task
router.put("/:id/todos/:todoId", protect, updateTodo); // Update todo

module.exports = router;
