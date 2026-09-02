import mongoose from "mongoose";
const schema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true },
  plan: { type: String, enum: ["free","premium"], default: "free" },
  status: { type: String, enum: ["active","inactive","past_due"], default: "active" },
  providerCustomerId: String,
  providerSubscriptionId: String
}, { timestamps: true });
export const Subscription = mongoose.model("Subscription", schema);