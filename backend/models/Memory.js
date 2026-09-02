import mongoose from "mongoose";
const schema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
  characterId: { type: mongoose.Schema.Types.ObjectId, ref: "Character", index: true },
  text: { type: String, required: true, maxlength: 500 },
  enabled: { type: Boolean, default: true }
}, { timestamps: true });
export const Memory = mongoose.model("Memory", schema);