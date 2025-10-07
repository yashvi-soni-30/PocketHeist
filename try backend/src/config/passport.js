import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";

dotenv.config();

passport.use(
    new GoogleStrategy(
        {
            clientID: "830191445655-t7064j4icl4151r378383nrbkaagp9l.apps.googleusercontent.com",
            clientSecret: "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",
            callbackURL: "http://localhost:5000/api/auth/google/callback",
        },
        (accessToken, refreshToken, profile, done) => {
            console.log("✅ Google profile:", profile); // Debugging
            return done(null, profile);
        }
    )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

export default passport;
