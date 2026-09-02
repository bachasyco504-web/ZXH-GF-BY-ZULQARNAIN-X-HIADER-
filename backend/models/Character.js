import mongoose from "mongoose";

const schema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true, required: true },
  name: { type: String, required: true, maxlength: 60 },
  avatar: String,
  adult: { type: Boolean, required: true, default: true },
  personality: { type: String, default: "Caring" },
  speakingStyle: String,
  interests: [String],
  hobbies: [String],
  greeting: String,
  responseStyle: String,
  mood: { type: String, enum: ["happy","sad","excited","calm","playful","supportive","curious"], default: "calm" }
}, { timestamps: true });
export const Character = mongoose.model("Character", schema);