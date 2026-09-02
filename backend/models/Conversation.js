import mongoose from "mongoose";
const schema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
  characterId: { type: mongoose.Schema.Types.ObjectId, ref: "Character", index: true },
  title: { type: String, default: "New conversation" }
}, { timestamps: true });
export const Conversation = mongoose.model("Conversation", schema);