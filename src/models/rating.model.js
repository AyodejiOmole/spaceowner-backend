const mongoose = require("mongoose");
const { Schema } = mongoose;

const ratingSchema = new Schema(
  {
    rating: {
      type: Number,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    warehouse: {
      type: Schema.Types.ObjectId,
      ref: "Warehouse",
    },
  },
  {
    timestamps: true,
  }
);

const Rating = mongoose.model("Rating", ratingSchema);
module.exports = Rating;
