import express from "express";
import { requireAuth } from "../middleware/auth.js";
import { Memory } from "../models/Memory.js";
const router=express.Router();
router.get("/",requireAuth,async(req,res,next)=>{try{res.json({memories:await Memory.find({userId:req.user._id}).sort({updatedAt:-1})})}catch(e){next(e)}});
router.post("/",requireAuth,async(req,res,next)=>{try{const {characterId,text}=req.body;if(!characterId||!text)return res.status(400).json({error:"characterId and text required"});res.status(201).json({memory:await Memory.create({userId:req.user._id,characterId,text})})}catch(e){next(e)}});
router.patch("/:id",requireAuth,async(req,res,next)=>{try{const m=await Memory.findOneAndUpdate({_id:req.params.id,userId:req.user._id},{$set:req.body},{new:true});if(!m)return res.status(404).json({error:"Memory not found"});res.json({memory:m})}catch(e){next(e)}});
router.delete("/:id",requireAuth,async(req,res,next)=>{try{await Memory.deleteOne({_id:req.params.id,userId:req.user._id});res.json({ok:true})}catch(e){next(e)}});
export default router;