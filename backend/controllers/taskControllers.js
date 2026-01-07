const Task = require("../models/Task");
const User = require("../models/User");

// @desc   Create a new task
// @route  POST /api/tasks
// @access Private
const createTask = async (req, res) => {
  try {
    const { title, description, priority, dueDate, assignedTo, attachments } = req.body;

    const task = await Task.create({
      title,
      description,
      priority,
      dueDate,
      assignedTo: assignedTo || [],
      attachments: attachments || [],
      createdBy: req.user.id,
    });

    const populatedTask = await task.populate("createdBy assignedTo", "-password");

    res.status(201).json(populatedTask);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// @desc   Get all tasks (with optional status filter)
// @route  GET /api/tasks
// @route  GET /api/tasks?status=pending
// @access Private
const getTasks = async (req, res) => {
  try {
    const { status } = req.query;
    
    // Build query filter
    const query = status ? { status } : {};
    
    const tasks = await Task.find(query)
      .populate("createdBy assignedTo", "-password")
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// @desc   Get task by ID
// @route  GET /api/tasks/:id
// @access Private
const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate(
      "createdBy assignedTo",
      "-password"
    );

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// @desc   Update a task
// @route  PUT /api/tasks/:id
// @access Private
const updateTask = async (req, res) => {
  try {
    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const { title, description, priority, status, dueDate, assignedTo, progress } = req.body;

    task.title = title || task.title;
    task.description = description || task.description;
    task.priority = priority || task.priority;
    task.status = status || task.status;
    task.dueDate = dueDate || task.dueDate;
    task.assignedTo = assignedTo || task.assignedTo;
    task.progress = progress !== undefined ? progress : task.progress;

    const updatedTask = await task.save();
    const populatedTask = await updatedTask.populate("createdBy assignedTo", "-password");

    res.json(populatedTask);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// @desc   Delete a task
// @route  DELETE /api/tasks/:id
// @access Private
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// @desc   Get user's tasks
// @route  GET /api/tasks/user/:userId
// @access Private
const getUserTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.params.userId }).populate(
      "createdBy assignedTo",
      "-password"
    );

    res.json(tasks);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// @desc   Add todo to task
// @route  POST /api/tasks/:id/todos
// @access Private
const addTodo = async (req, res) => {
  try {
    const { text } = req.body;
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    task.todoChecklist.push({ text });
    const updatedTask = await task.save();

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// @desc   Update todo completion status
// @route  PUT /api/tasks/:id/todos/:todoId
// @access Private
const updateTodo = async (req, res) => {
  try {
    const { completed } = req.body;
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const todo = task.todoChecklist.id(req.params.todoId);
    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    todo.completed = completed;
    const updatedTask = await task.save();

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getUserTasks,
  addTodo,
  updateTodo,
};
