const Task = require("../models/Task");
const User = require("../models/User");

// @desc   Get task statistics
// @route  GET /api/reports/stats
// @access Private
const getTaskStats = async (req, res) => {
  try {
    const totalTasks = await Task.countDocuments();
    const completedTasks = await Task.countDocuments({ status: "Completed" });
    const pendingTasks = await Task.countDocuments({ status: "Pending" });
    const inProgressTasks = await Task.countDocuments({ status: "In Progress" });

    const highPriorityTasks = await Task.countDocuments({ priority: "High" });
    const mediumPriorityTasks = await Task.countDocuments({ priority: "Medium" });
    const lowPriorityTasks = await Task.countDocuments({ priority: "Low" });

    res.json({
      totalTasks,
      completedTasks,
      pendingTasks,
      inProgressTasks,
      highPriorityTasks,
      mediumPriorityTasks,
      lowPriorityTasks,
      completionRate: totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(2) : 0,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// @desc   Get user task statistics
// @route  GET /api/reports/user-stats/:userId
// @access Private
const getUserTaskStats = async (req, res) => {
  try {
    const userId = req.params.userId;

    const totalUserTasks = await Task.countDocuments({ assignedTo: userId });
    const completedUserTasks = await Task.countDocuments({
      assignedTo: userId,
      status: "Completed",
    });
    const pendingUserTasks = await Task.countDocuments({
      assignedTo: userId,
      status: "Pending",
    });
    const inProgressUserTasks = await Task.countDocuments({
      assignedTo: userId,
      status: "In Progress",
    });

    res.json({
      totalUserTasks,
      completedUserTasks,
      pendingUserTasks,
      inProgressUserTasks,
      userCompletionRate:
        totalUserTasks > 0
          ? ((completedUserTasks / totalUserTasks) * 100).toFixed(2)
          : 0,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// @desc   Get overdue tasks report
// @route  GET /api/reports/overdue
// @access Private
const getOverdueTasks = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const overdueTasks = await Task.find({
      dueDate: { $lt: today },
      status: { $ne: "Completed" },
    }).populate("createdBy assignedTo", "-password");

    res.json({
      overdueCount: overdueTasks.length,
      tasks: overdueTasks,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// @desc   Get tasks by priority report
// @route  GET /api/reports/by-priority
// @access Private
const getTasksByPriority = async (req, res) => {
  try {
    const highPriorityTasks = await Task.find({ priority: "High" }).populate(
      "createdBy assignedTo",
      "-password"
    );
    const mediumPriorityTasks = await Task.find({ priority: "Medium" }).populate(
      "createdBy assignedTo",
      "-password"
    );
    const lowPriorityTasks = await Task.find({ priority: "Low" }).populate(
      "createdBy assignedTo",
      "-password"
    );

    res.json({
      high: highPriorityTasks,
      medium: mediumPriorityTasks,
      low: lowPriorityTasks,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// @desc   Get tasks by status report
// @route  GET /api/reports/by-status
// @access Private
const getTasksByStatus = async (req, res) => {
  try {
    const pendingTasks = await Task.find({ status: "Pending" }).populate(
      "createdBy assignedTo",
      "-password"
    );
    const inProgressTasks = await Task.find({ status: "In Progress" }).populate(
      "createdBy assignedTo",
      "-password"
    );
    const completedTasks = await Task.find({ status: "Completed" }).populate(
      "createdBy assignedTo",
      "-password"
    );

    res.json({
      pending: pendingTasks,
      inProgress: inProgressTasks,
      completed: completedTasks,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  getTaskStats,
  getUserTaskStats,
  getOverdueTasks,
  getTasksByPriority,
  getTasksByStatus,
};
