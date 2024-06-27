const { User } = require("../models");

class UserProfileService {
  static async getUserProfile(userId) {
    const userProfile = await User.findById(userId);
    return userProfile;
  }
  static async editUserProfile(userId, data) {
    try {
      const userProfile = await User.findByIdAndUpdate(
        userId,
        { $set: data },
        { new: true }
      );
      return userProfile;
    } catch (error) {
      throw new Error(`Error editing user profile: ${error.message}`);
    }
  }
}

module.exports = UserProfileService;
