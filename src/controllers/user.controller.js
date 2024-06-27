const { StatusCodes } = require("http-status-codes");
const { User } = require("../services");
const { UserProfileService, WalletService } = require("../services");

const viewProfile = async (req, res) => {
  try {
    const id = req.user._id;
    const userProfile = await UserProfileService.getUserProfile(id);

    userProfile.__v = undefined;
    userProfile.updatedAt = undefined;
    userProfile.isDeleted = undefined;
    userProfile.isSuspended = undefined;

    res.status(StatusCodes.OK).json({
      success: true,
      message: "User profile retrieved successfully",
      data: userProfile,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};

const editProfile = async (req, res) => {
  try {
    const id = req.user._id;
    const data = req.body;
    const user = await UserProfileService.getUserProfile(id);

    if (data.firstName) {
      user.firstName = data.firstName;
    }
    if (data.firstname) {
      user.firstname = data.firstname;
    }
    if (data.email) {
      user.email = data.email;
    }
    if (data.phoneNumber) {
      user.phoneNumber = data.phoneNumber;
    }
    if (data.companyName) {
      user.companyName = data.companyName;
    }
    if (data.busineessAddress) {
      user.busineessAddress = data.busineessAddress;
    }
    if (data.businessCity) {
      user.businessCity = data.businessCity;
    }
    if (data.businessState) {
      user.businessState = data.businessState;
    }
    if (data.businessZip) {
      user.businessZip = data.businessZip;
    }
    if (data.businessPhone) {
      user.businessPhone = data.businessPhone;
    }
    if (data.businessDescription) {
      user.businessDescription = data.businessDescription;
    }
    if (data.NIN) {
      user.NIN = data.NIN;
    }
    if (data.businessIdPhoto) {
      user.businessIdPhoto = data.businessIdPhoto;
    }

    user.isVerified = undefined;
    user.updatedAt = undefined;
    user.isDeleted = undefined;
    user.isSuspended = undefined;

    const userProfile = await UserProfileService.editUserProfile(id, data);
    res.status(StatusCodes.OK).json({
      success: true,
      message: "User profile updated successfully",
      data: userProfile,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};

const totalRevenue = async (req, res) => {
  try {
    // get the users id
    const id = req.user._id;
    const user = await UserProfileService.getUserProfile(id);
    const walletID = user.wallet;
    const wallet = await WalletService.getWallet(walletID);
    if (!wallet) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Wallet not found, please verify your account",
      });
    }

    if (wallet.owner.toString() !== id.toString()) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: "You are not authorized to view this wallet",
      });
    }

    const totalRevenue = wallet.balance;

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Total revenue retrieved successfully",
      balance: totalRevenue,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  viewProfile,
  editProfile,
  totalRevenue,
};
