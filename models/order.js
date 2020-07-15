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
    },
    total: {
      type: Number,
      required: true,
    },
    cancelled: {
      type: Boolean,
      default: false,
    },
    cancelDate: {
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
