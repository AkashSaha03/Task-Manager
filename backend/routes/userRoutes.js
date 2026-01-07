const express = require("express");
const { adminOnly, protect } = require("../middlewares/authMiddleware");
const { getUsers, getUserById, deleteUser, uploadProfileImage } = require("../controllers/userControllers");
const upload = require("../middlewares/uploadsMiddleware");
const router = express.Router();

router.get("/", protect, adminOnly, getUsers);
router.get("/:id", protect, getUserById);
router.delete("/:id", protect, adminOnly, deleteUser);
router.post("/:id/upload-avatar", protect, upload.single("profileImage"), uploadProfileImage);

module.exports = router;