import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, lowercase: true, trim: true, required: true },
  username: { type: String, required: true, trim: true, maxlength: 40 },
  passwordHash: { type: String, required: true },
  avatar: String,
  role: { type: String, enum: ["user", "admin"], default: "user" },
  createdAt: { type: Date, default: Date.now }
});
export const User = mongoose.model("User", userSchema);