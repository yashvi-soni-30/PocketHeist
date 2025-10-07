import express from "express";
import dotenv from "dotenv";
import session from "express-session";
import passport from "./config/passport.js";

dotenv.config();
const app = express();

// Session middleware
app.use(
  session({
    secret: "keyboardcat", // use env in production
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Routes
app.get("/api/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get("/api/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    // Success → redirect frontend
    res.redirect("http://localhost:5500/index.html");
  }
);

// Test route
app.get("/", (req, res) => {
  res.send("✅ Backend running. Try /api/auth/google");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
