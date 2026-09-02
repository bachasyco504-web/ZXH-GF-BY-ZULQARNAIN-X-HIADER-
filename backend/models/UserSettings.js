import mongoose from "mongoose";
const schema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true },
  theme: { type: String, enum: ["dark","light"], default: "dark" },
  accentColor: { type: String, default: "#ff4fa3" },
  memoryEnabled: { type: Boolean, default: true },
  autoPlayVoice: { type: Boolean, default: false },
  enterToSend: { type: Boolean, default: true },
  language: { type: String, default: "en" }
}, { timestamps: true });
export const UserSettings = mongoose.model("UserSettings", schema);