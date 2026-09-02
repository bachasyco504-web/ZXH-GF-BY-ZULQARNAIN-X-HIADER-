import { Usage } from "../models/Usage.js";
export async function incrementUsage(userId, field) {
  const period = new Date().toISOString().slice(0, 7);
  return Usage.findOneAndUpdate({ userId, period }, { $inc: { [field]: 1 } }, { upsert: true, new: true });
}