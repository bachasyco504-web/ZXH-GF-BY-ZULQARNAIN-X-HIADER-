import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { User } from "../models/User.js";
import { UserSettings } from "../models/UserSettings.js";
import { Subscription } from "../models/Subscription.js";
import { validate } from "../middleware/validate.js";

const router = express.Router();
const schema = z.object({ email: z.string().email(), username: z.string().min(2).max(40), password: z.string().min(8).max(128) });

router.post("/register", validate(schema), async (req, res, next) => {
  try {
    const { email, username, password } = req.body;
    if (await User.exists({ email })) return res.status(409).json({ error: "Email already registered" });
    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ email, username, passwordHash });
    await Promise.all([UserSettings.create({ userId: user._id }), Subscription.create({ userId: user._id })]);
    res.status(201).json({ ok: true });
  } catch (e) { next(e); }
});

router.post("/login", validate(z.object({ email: z.string().email(), password: z.string().min(1) })), async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user || !(await bcrypt.compare(req.body.password, user.passwordHash))) return res.status(401).json({ error: "Invalid credentials" });
    const token = jwt.sign({ sub: user._id.toString() }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.cookie("gf_session", token, { httpOnly: true, sameSite: "lax", secure: process.env.COOKIE_SECURE === "true", maxAge: 7*24*60*60*1000 });
    res.json({ user: { id: user._id, email: user.email, username: user.username, avatar: user.avatar } });
  } catch (e) { next(e); }
});

router.post("/logout", (req, res) => { res.clearCookie("gf_session"); res.json({ ok: true }); });
export default router;