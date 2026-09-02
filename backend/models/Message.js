import mongoose from "mongoose";
const schema = new mongoose.Schema({
  conversationId: { type: mongoose.Schema.Types.ObjectId, ref: "Conversation", index: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
  role: { type: String, enum: ["user","assistant","system"], required: true },
  content: { type: String, required: true, maxlength: 12000 },
  reaction: String
}, { timestamps: true });
export const Message = mongoose.model("Message", schema);