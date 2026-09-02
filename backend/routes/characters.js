import express from "express";
import { z } from "zod";
import { Character } from "../models/Character.js";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
const router = express.Router();
const createSchema = z.object({
  name:z.string().min(1).max(60), avatar:z.string().url().optional().or(z.literal("")),
  adult:z.literal(true), personality:z.string().max(100).optional(),
  speakingStyle:z.string().max(500).optional(), interests:z.array(z.string().max(50)).max(20).optional(),
  hobbies:z.array(z.string().max(50)).max(20).optional(), greeting:z.string().max(500).optional(),
  responseStyle:z.string().max(500).optional()
});
router.get("/",requireAuth,async(req,res,next)=>{try{res.json({characters:await Character.find({userId:req.user._id}).sort({createdAt:-1})})}catch(e){next(e)}});
router.post("/",requireAuth,validate(createSchema),async(req,res,next)=>{try{res.status(201).json({character:await Character.create({...req.body,userId:req.user._id})})}catch(e){next(e)}});
router.patch("/:id",requireAuth,async(req,res,next)=>{try{const c=await Character.findOneAndUpdate({_id:req.params.id,userId:req.user._id},{$set:req.body},{new:true,runValidators:true});if(!c)return res.status(404).json({error:"Character not found"});res.json({character:c})}catch(e){next(e)}});
router.delete("/:id",requireAuth,async(req,res,next)=>{try{await Character.deleteOne({_id:req.params.id,userId:req.user._id});res.json({ok:true})}catch(e){next(e)}});
export default router;