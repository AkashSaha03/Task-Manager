const express = require("express");
const { protect, adminOnly } = require("../middlewares/authMiddleware");
const {
  getTaskStats,
  getUserTaskStats,
  getOverdueTasks,
  getTasksByPriority,
  getTasksByStatus,
} = require("../controllers/reportControllers");

const router = express.Router();

// Report Routes
router.get("/stats", protect, adminOnly, getTaskStats); // Get task statistics
router.get("/user-stats/:userId", protect, getUserTaskStats); // Get user task statistics
router.get("/overdue", protect, getOverdueTasks); // Get overdue tasks
router.get("/by-priority", protect, getTasksByPriority); // Get tasks by priority
router.get("/by-status", protect, getTasksByStatus); // Get tasks by status

module.exports = router;
