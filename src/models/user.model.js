const mongoose = require("mongoose");
const Schema = mongoose.Schema;
mongoose.set("strictQuery", true);

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "username must be included"],
      unique: [true, "username already taken"],
    },
    firstname: {
      type: String,
    },
    lastname: {
      type: String,
    },
    googleId: {
      type: String,
    },
    facebookId: {
      type: String,
    },
    photo: {
      type: String,
    },
    role: {
      type: String,
      enum: ["admin", "spaceseeker", "spaceowner"],
      default: "spaceseeker",
    },
    email: {
      type: String,
    },
    phonenumber: {
      type: String,
    },
    password: {
      type: String,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isSuspended: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    bookings: [
      {
        type: Schema.Types.ObjectId,
        ref: "Booking",
      },
    ],
    paymentInfo: [{
      type: Schema.Types.ObjectId,
      ref: "PaymentInfo",
    }],
    warehouse: {
      type: Schema.Types.ObjectId,
      ref: "Warehouse",
    },
    notification: [{
      type: Schema.Types.ObjectId,
      ref: "Notification",
    }],
    companyName: {
      type: String,
    },
    busineessAddress: {
      type: String,
    },
    businessCity: {
      type: String,
    },
    businessState: {
      type: String,
    },
    businessZip: {
      type: String,
    },
    businessPhone: {
      type: String,
    },
    businessDescription: {
      type: String,
    },
    NIN: {
      type: String,
    },
    businessIdPhoto: [
      {
        public_id: {
          type: String,
        },
        url: {
          type: String,
        },
      },
    ],
    wallet: {
      type: Schema.Types.ObjectId,
      ref: "Wallet",
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
