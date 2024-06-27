const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth2").Strategy;

const { User } = require("../models");


const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

passport.serializeUser((user, done) => {
  try {
    done(null, user.id);
  } catch (error) {
    done(error);
  }
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/v1/auth/google/callback",
      proxy: true,
    },
    async (accessToken, refreshToken, profile, email, done) => {
      let photo = email.picture ? email.picture : "";
      let userEmail = email.email ? email.email : "";

      const existingUser = await User.findOne({
        $or: [{ email: userEmail }, { googleId: email.id }],
      });

      if (existingUser) {
        return done(null, existingUser);
      }

      const user = await new User({
        username: email.displayName,
        googleId: email.id,
        photo,
        email: userEmail,
        isVerified: true,
      }).save();
      console.log({ User: user.id });
      done(null, user);
    }
  )
);

// create a function to handle the Google login process
const handleGoogleLogin = (req, res, next) => {
  passport.authenticate("google", { scope: ["profile", "email"] })(
    req,
    res,
    next
  );
};

// create a function to handle the Google login callback
const handleGoogleCallback = (req, res, next) => {
  passport.authenticate("google", {
    successRedirect: "/docs",
    failureRedirect: "/api/v1/auth/login",
  })(req, res, next);
};

// create a factory function to generate the functions for handling Google login
const createGoogleAuthRoutes = () => {
  return {
    handleGoogleLogin,
    handleGoogleCallback,
  };
};

module.exports = createGoogleAuthRoutes;
