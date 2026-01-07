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

router.post("/", protect, createTask);
router.get("/", protect, getTasks);
router.get("/user/:userId", protect, getUserTasks);
router.get("/:id", protect, getTaskById);
router.put("/:id", protect, updateTask);
router.delete("/:id", protect, deleteTask);

router.post("/:id/todos", protect, addTodo);
router.put("/:id/todos/:todoId", protect, updateTodo);

module.exports = router;