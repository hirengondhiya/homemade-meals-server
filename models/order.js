const { Schema } = require("mongoose");

const OrderSchema = new Schema(
  {
    pickupAt: {
      type: Date,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, "Atleast one meal must be ordered."],
    },
    cancelAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = {
  OrderSchema,
};
