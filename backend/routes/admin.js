import express from "express";
import { requireAuth } from "../middleware/auth.js";
import { User } from "../models/User.js";
const router=express.Router();
router.use(requireAuth,(req,res,next)=>req.user.role==="admin"?next():res.status(403).json({error:"Admin access required"}));
router.get("/stats",async(req,res,next)=>{try{res.json({users:await User.countDocuments(),timestamp:new Date().toISOString()})}catch(e){next(e)}});
export default router;