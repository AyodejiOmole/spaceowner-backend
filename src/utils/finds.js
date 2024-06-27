const { User } = require("../models");

const findOrCreateUser = async (Username, id, photo) => {
  try {
    console.log({
      Username, id, photo
    });
    // Search for a user with the specified email
    console.log("inside the find or create function");
    const user = await User.findOne({
      $or: [{ facebookId: id }, { username: Username }],
    });
    if (user) {
      // User was found
      console.log("user found in the database");
      return user;
    } else {
      // User was not found, create a new user
      const newUser = new User({
        username: Username,
        facebookId: id,
        photo,
        isVerified: true,
      });
      console.log(newUser);
      const user = await newUser.save();
      if (user) {
        console.log("new user created" + { user });
      }
      return user;
    }
  } catch (err) {
    console.log(err.message);
    return false;
  }
};

module.exports = {
  findOrCreateUser,
};
