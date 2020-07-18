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
    totalAmt: {
      type: Number,
      required: true,
    },
    customer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      autopopulate: true,
    },
  },
  {
    timestamps: true,
  }
);

OrderSchema.methods.isRequestedBy = function (userId) {
  return (
    (this.customer && this.customer._id.toString() === userId.toString()) ||
    false
  );
};

module.exports = {
  OrderSchema,
};
