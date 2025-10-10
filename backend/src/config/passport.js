// backend/src/config/passport.js
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";
import pool from "./mysql.js";

dotenv.config();

// ✅ Configure Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists
        const [rows] = await pool.query("SELECT * FROM users WHERE google_id = ?", [profile.id]);

        if (rows.length > 0) {
          return done(null, rows[0]);
        } else {
          // Create a new user
          const [result] = await pool.query(
            "INSERT INTO users (google_id, name, email) VALUES (?, ?, ?)",
            [profile.id, profile.displayName, profile.emails[0].value]
          );

          const newUser = {
            id: result.insertId,
            google_id: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
          };
          return done(null, newUser);
        }
      } catch (err) {
        console.error("Error with Google OAuth:", err);
        return done(err, null);
      }
    }
  )
);

// ✅ Serialize / Deserialize user
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const [rows] = await pool.query("SELECT * FROM users WHERE id = ?", [id]);
    done(null, rows[0]);
  } catch (err) {
    done(err, null);
  }
});

export default passport;
