import express from "express";
import { requireAuth } from "../middleware/auth.js";
import { UserSettings } from "../models/UserSettings.js";
const router = express.Router();
router.get("/profile", requireAuth, (req,res)=>res.json({ user:req.user }));
router.get("/settings", requireAuth, async(req,res,next)=>{try{res.json({settings:await UserSettings.findOne({userId:req.user._id})})}catch(e){next(e)}});
router.patch("/settings", requireAuth, async(req,res,next)=>{try{const settings=await UserSettings.findOneAndUpdate({userId:req.user._id},{$set:req.body},{new:true,runValidators:true});res.json({settings})}catch(e){next(e)}});
export default router;