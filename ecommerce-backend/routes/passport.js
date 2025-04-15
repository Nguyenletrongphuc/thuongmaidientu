const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");
require("dotenv").config();

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await User.findOne({ email: profile.emails[0].value });
        if (!user) {
            user = await User.create({
                name: profile.displayName,
                email: profile.emails[0].value,
                password: "",   // để trống khi đăng nhập Google
                phone: "",
                address: "",
                provider: "google"
            });
            console.log("✅ Tạo user mới từ Google:", user.email);
        } else {
            console.log("🔁 User đã tồn tại:", user.email);
        }
        done(null, user);
    } catch (err) {
        console.error("❌ Lỗi khi xử lý Google OAuth:", err);
        done(err, null);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);
    done(null, user);
});
