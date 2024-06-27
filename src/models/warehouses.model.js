const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const warehouseSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    ownerName: {
      type: String,
    },
    street: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    zipCode: {
      type: String,
      required: false,
    },
    state: {
      type: String,
      required: false,
    },
    country: {
      type: String,
      required: true,
    },
    landmark: {
      type: String,
      required: true,
    },
    facilityAmenities: {
      type: Object,
      required: true,
    },
    approvedProducts: {
      type: Array,
    },
    totalSpace: {
      type: Number,
      required: true,
    },
    unitSize: {
      type: Number,
      required: true,
    },
    pricePerUnitPerYear: {
      type: Number,
      required: true,
    },
    purpose: {
      type: String,
      enum: ["rent", "lease"],
      default: "rent",
    },
    operatingDays: {
      Monday: Boolean,
      Tuesday: Boolean,
      Wednesday: Boolean,
      Thursday: Boolean,
      Friday: Boolean,
      Saturday: Boolean,
      Sunday: Boolean,
    },
    description: {
      type: String,
      required: false,
    },
    facilityName: {
      type: String,
      required: true,
    },
    operatingHours: {
      type: String,
      required: true,
    },
    facilityRules: {
      type: String,
      required: true,
    },
    aboutTheOwner: {
      type: String,
      required: false,
    },
    agreedToTerms: {
      type: Boolean,
      required: true,
    },
    photos: [
      {
        public_id: {
          type: String,
        },
        url: {
          type: String,
        },
      },
    ],
    videos: [
      {
        url: {
          type: String,
        },
      },
    ],

    bankAccounts: [
      {
        bank: {
          type: String,
        },
        accountNumber: {
          type: String,
        },
      },
    ],

    isDeleted: {
      type: Boolean,
      default: false,
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },

    isVerified: {
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

    averageRating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    ratingCount: {
      type: Number,
      default: 0,
    },

    users: {
      type: [Schema.Types.ObjectId],
      ref: "User",
    },

    isDeclined: {
      type: Boolean,
      default: false,
    },

    declinedReason: {
      type: String,
    },

    declinedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    occupancyRate: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "inactive",
    },

    contractDocument: [
      {
        public_id: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

warehouseSchema.index({ ratePerUnit: 1, rating: 1 });

const Warehouse = mongoose.model("Warehouse", warehouseSchema);

module.exports = Warehouse;
