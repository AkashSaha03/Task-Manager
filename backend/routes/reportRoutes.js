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

router.get("/stats", protect, adminOnly, getTaskStats);
router.get("/user-stats/:userId", protect, getUserTaskStats);
router.get("/overdue", protect, getOverdueTasks);
router.get("/by-priority", protect, getTasksByPriority);
router.get("/by-status", protect, getTasksByStatus);

module.exports = router;