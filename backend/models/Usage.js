import mongoose from "mongoose";
const schema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
  period: { type: String, index: true },
  messages: { type: Number, default: 0 },
  images: { type: Number, default: 0 },
  voiceSeconds: { type: Number, default: 0 }
}, { timestamps: true });
export const Usage = mongoose.model("Usage", schema);