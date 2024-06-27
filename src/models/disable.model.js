const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const disabledSchema = new Schema({
  user : {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  warehouse: {
    type: Schema.Types.ObjectId,
    ref: "Warehouse",
    required: true,
  },
}, {
  timestamps: true,
});

const Disabled = mongoose.model("Disabled", disabledSchema);
module.exports = Disabled;