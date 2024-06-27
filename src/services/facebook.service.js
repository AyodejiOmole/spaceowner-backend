const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;
const { User } = require("../models");
const { findOrCreateUser } = require("../utils");

const FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET;
const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID;

const prodURL = `https://warehouzit-server.onrender.com`;
const devURL = `http://localhost:8000`;

const facebookCallbackUrl = `${prodURL}/api/v1/auth/facebook/callback`;

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
  new FacebookStrategy(
    {
      clientID: FACEBOOK_APP_ID,
      clientSecret: FACEBOOK_APP_SECRET,
      callbackURL: facebookCallbackUrl,
      profileFields: ["id", "displayName", "picture", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log({ profile });
      let Username = profile.displayName ? profile.displayName : "";
      let id = profile.id ? profile.id : "";
      let photo = profile.photos ? profile.photos[0].value : "";

      try {
        const user = await findOrCreateUser(Username, id, photo);
        console.log("outside the findorcreatuser function");
        if (user) {
          console.log("successfully found or created" + user);
          done(null, user);
        } else {
          console.log("user either found nor created");
          throw new Error("could not find nor create user");
        }
      } catch (error) {
        console.log("passed the error along to passport.js");
        done(error);
      }
    }
  )
);

// create a function to handle the Google login process
const handleFacebookLogin = async (req, res, next) => {
  console.log("handleloginroute reached");
  passport.authenticate("facebook")(req, res, next);
};

// create a function to handle the Google login callback
const handleFacebookCallback = (req, res, next) => {
  console.log("handleCallbackroute reached!");
  passport.authenticate("facebook", {
    successRedirect: "/docs",
    failureRedirect: "/",
  })(req, res, next);
};

// create a factory function to generate the functions for handling Google login
const createFacebookAuthRoutes = () => {
  return {
    handleFacebookLogin,
    handleFacebookCallback,
  };
};

module.exports = createFacebookAuthRoutes;
