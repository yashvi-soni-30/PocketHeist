// server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import session from "express-session";
import passport from "./config/passport.js";
import pool from "./config/mysql.js";
import connectMongo from "./config/mongo.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();
const app = express();

/* ------------------------- 🔧 MIDDLEWARE ------------------------- */
app.use(express.json());

// ✅ CORS — allow your frontend URLs
app.use(
  cors({
    origin: ["http://127.0.0.1:3000", "http://localhost:3000"],
    credentials: true,
  })
);

// ✅ Express session (needed for Passport)
app.use(
  session({
    secret: process.env.SESSION_SECRET || "keyboardcat",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // true only for HTTPS
  })
);

// ✅ Passport initialization
app.use(passport.initialize());
app.use(passport.session());

/* ---------------------------- 🛠 ROUTES ---------------------------- */

// Auth routes (login, signup, forgot-password, Google)
app.use("/api/auth", authRoutes);

// ✅ Remove duplicate Google routes — already handled inside authRoutes.js
// Keeping them both causes conflicts or multiple redirects

/* ---------------------------- 🧪 TEST ROUTE ---------------------------- */
app.get("/api/test", (req, res) => {
  res.json({ message: "API is working 🚀" });
});

/* ---------------------------- 🚀 SERVER START ---------------------------- */
const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`✅ Server running on port ${PORT}`);

  // MySQL test
  try {
    const [rows] = await pool.query("SELECT 1 + 1 AS result");
    console.log("✅ MySQL connected, test result:", rows[0].result);
  } catch (err) {
    console.error("❌ MySQL error:", err.message);
  }

  // MongoDB connection
  connectMongo();
});

console.log("🌐 Google Callback URL:", process.env.GOOGLE_CALLBACK_URL);
