import express from "express";
import { z } from "zod";
import { requireAuth } from "../middleware/auth.js";
import { Character } from "../models/Character.js";
import { Conversation } from "../models/Conversation.js";
import { Message } from "../models/Message.js";
import { getRelevantMemories } from "../services/memory.js";
import { generateReply } from "../services/ai/provider.js";
import { moderatePrompt } from "../services/moderation.js";
import { incrementUsage } from "../services/usage.js";
import { validate } from "../middleware/validate.js";
const router = express.Router();

const chatSchema = z.object({ characterId:z.string(), conversationId:z.string().optional(), content:z.string().min(1).max(12000) });

router.post("/",requireAuth,validate(chatSchema),async(req,res,next)=>{
  try {
    if (!moderatePrompt(req.body.content)) return res.status(400).json({error:"Message blocked by safety policy"});
    const character=await Character.findOne({_id:req.body.characterId,userId:req.user._id});
    if(!character)return res.status(404).json({error:"Character not found"});
    let conversation=req.body.conversationId?await Conversation.findOne({_id:req.body.conversationId,userId:req.user._id}):null;
    if(!conversation) conversation=await Conversation.create({userId:req.user._id,characterId:character._id,title:req.body.content.slice(0,50)});
    await Message.create({conversationId:conversation._id,userId:req.user._id,role:"user",content:req.body.content});
    const recent=await Message.find({conversationId:conversation._id}).sort({createdAt:-1}).limit(30).lean();
    const memories=await getRelevantMemories(req.user._id,character._id);
    const system=`You are ${character.name}, a fictional adult AI companion. Never claim to have real emotions. Be affectionate, supportive, playful and non-explicit. Personality: ${character.personality}. Speaking style: ${character.speakingStyle||"warm and natural"}. Interests: ${(character.interests||[]).join(", ")}. Relevant user memories: ${memories.map(m=>m.text).join(" | ")}`;
    const answer=await generateReply({system,messages:recent.reverse().map(m=>({role:m.role,content:m.content}))});
    const saved=await Message.create({conversationId:conversation._id,userId:req.user._id,role:"assistant",content:answer});
    await incrementUsage(req.user._id,"messages");
    res.json({conversationId:conversation._id,message:saved});
  } catch(e){next(e)}
});
router.get("/conversations",requireAuth,async(req,res,next)=>{try{res.json({conversations:await Conversation.find({userId:req.user._id}).sort({updatedAt:-1})})}catch(e){next(e)}});
router.get("/conversations/:id",requireAuth,async(req,res,next)=>{try{const c=await Conversation.findOne({_id:req.params.id,userId:req.user._id});if(!c)return res.status(404).json({error:"Conversation not found"});res.json({conversation:c,messages:await Message.find({conversationId:c._id,userId:req.user._id}).sort({createdAt:1})})}catch(e){next(e)}});
export default router;