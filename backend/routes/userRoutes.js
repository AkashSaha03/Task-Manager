const express = require("express");
const { adminOnly, protect } = require("../middlewares/authMiddleware");
const { getUsers, getUserById, deleteUser, uploadProfileImage } = require("../controllers/userControllers");
const upload = require("../middlewares/uploadsMiddleware");
const router = express.Router();

// User Management Routes
router.get("/", protect, adminOnly, getUsers); // Get all users (Admin only)
router.get("/:id", protect, getUserById); // Get user by ID
router.delete("/:id", protect, adminOnly, deleteUser); // Delete user (Admin only)
router.post("/:id/upload-avatar", protect, upload.single("profileImage"), uploadProfileImage); // Upload profile image

module.exports = router;