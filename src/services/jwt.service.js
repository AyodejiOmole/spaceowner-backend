require("dotenv").config();

const jwt = require("jsonwebtoken");

const jwtSecretKey = process.env.JWT_SECRET_KEY;
const { User } = require("../models");
const blacklistedTokens = new Set();

const signToken = (payload, time = "3h") => {
  try {
    const token = jwt.sign(payload, jwtSecretKey, {
      expiresIn: time,
    });
    return token;
  } catch (error) {
    return false;
  }
};

const decodeToken = (token) => {
  try {
    const decodedToken = jwt.verify(token, jwtSecretKey);
    return decodedToken;
  } catch (error) {
    return false;
  }
};

const protect = async (req, res, next) => {
  try {
    const googleProtected = req.user ? req.user : null;

    if (googleProtected == null) {
      const token = req.headers.authorization
        ? req.headers.authorization.split(" ")[1]
        : null;
      if (token == null) {
        return res.status(400).json({
          message: "No Token Provided!",
        });
      }
      // Check if the token is blacklisted
      if (blacklistedTokens.has(token)) {
        return res.status(401).send("Unauthorized");
      }
      // decode the token
      const decoded = decodeToken(token);

      // check if the token is valid
      if (!decoded) {
        return res.status(401).json({
          error: "Invalid Token",
        });
      }
      // check if the token is expired
      if (decoded.exp < Date.now() / 1000) {
        return res.status(401).json({
          error: "Token Expired",
        });
      }

      // check if the user exists
      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(401).json({
          error: "User Not Found",
        });
      }
      
      // check if user is verified
      if (!user.isVerified) {
        return res.status(401).json({
          error: "User Not Verified",
        });
      }

      console.log(user.username + " is successfully authenticated");
      req.user = user;
      next();
    } else {
      const id = googleProtected.id;
      const validUser = await User.findById(id);
      if (validUser) {
        next();
      }
    }
  } catch (error) {
    return res.status(401).json({
      status: "authentication error",
      error: error.message,
      msg: "you are not authorized, register or login to continue!",
    });
  }
};

const adminProtect = async (req, res, next) => {
  try {
    if (req.user.role === "admin") {
      next();
    } else {
      return res.status(401).json({
        status: "authentication error",
        msg: "you are not authorized to access this route!",
      });
    }
  } catch (error) {
    return res.status(401).json({
      status: "authentication error",
      error: error.message,
      msg: "you are not authorized, register or login to continue!",
    });
  }
};

const spaceownerProtect = async (req, res, next) => {
  try {
    if (req.user.role === "spaceowner") {
      next();
    } else {
      return res.status(401).json({
        status: "authentication error",
        msg: "you are not authorized to access this route!",
      });
    }
  } catch (error) {
    return res.status(401).json({
      status: "authentication error",
      error: error.message,
      msg: "you are not authorized, register or login to continue!",
    });
  }
};

const spaceseekerProtect = async (req, res, next) => {
  try {
    if (req.user.role === "spaceseeker") {
      next();
    } else {
      return res.status(401).json({
        status: "authentication error",
        msg: "you are not authorized to access this route!",
      });
    }
  } catch (error) {
    return res.status(401).json({
      status: "authentication error",
      error: error.message,
      msg: "you are not authorized, register or login to continue!",
    });
  }
};

module.exports = {
  signToken,
  decodeToken,
  protect,
  spaceseekerProtect,
  spaceownerProtect,
  adminProtect,
};
