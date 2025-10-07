import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import passport from "../config/passport.js";
import User from "../models/User.js";
import nodemailer from "nodemailer";

const router = express.Router();

/* ----------------------------- 🟢 AUTH ROUTES ----------------------------- */

// 🟩 User Signup
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Signup failed", error: err.message });
  }
});

// 🟩 User Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.json({ message: "Login successful", token });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
});

/* ------------------------ 🔵 GOOGLE AUTH ROUTES ------------------------ */

// Start Google OAuth flow
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Callback from Google after authentication
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "http://127.0.0.1:3000/index.html" }),
  (req, res) => {
    res.redirect("http://127.0.0.1:3000/index.html");
  }
);

/* ------------------------ 🔐 PASSWORD RESET ROUTES ------------------------ */

// 📩 Forgot Password (Send Reset Email)
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Generate reset token valid for 15 minutes
    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "15m" });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const resetUrl = `http://127.0.0.1:3000/reset.html?token=${resetToken}`;

    await transporter.sendMail({
      from: `"Finance App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Password Reset Request",
      html: `<p>Click <a href="${resetUrl}">here</a> to reset your password. Link valid for 15 mins.</p>`,
    });

    res.json({ message: "Password reset link sent to email" });
  } catch (err) {
    res.status(500).json({ message: "Error sending email", error: err.message });
  }
});

// 🔒 Reset Password (After clicking link)
router.post("/reset-password", async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await User.findByIdAndUpdate(decoded.id, { password: hashedPassword });
    res.json({ message: "Password reset successful" });
  } catch (err) {
    res.status(400).json({ message: "Invalid or expired token" });
  }
});

/* ----------------------------------------------------------------------- */

export default router;
