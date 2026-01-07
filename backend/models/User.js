const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    profileImageUrl: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      enum: ["admin", "member"],
      default: "member", // Role-based access
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
