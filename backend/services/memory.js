import { Memory } from "../models/Memory.js";
export async function getRelevantMemories(userId, characterId) {
  return Memory.find({ userId, characterId, enabled: true }).sort({ updatedAt: -1 }).limit(20).lean();
}