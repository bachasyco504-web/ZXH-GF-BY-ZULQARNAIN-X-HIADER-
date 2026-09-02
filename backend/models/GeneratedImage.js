import mongoose from "mongoose";
const schema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
  characterId: { type: mongoose.Schema.Types.ObjectId, ref: "Character" },
  prompt: String,
  url: String,
  status: { type: String, enum: ["pending","ready","failed"], default: "pending" }
}, { timestamps: true });
export const GeneratedImage = mongoose.model("GeneratedImage", schema);