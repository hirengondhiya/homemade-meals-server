const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Menu = new Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true,
      minlength: 5,
      maxlength: 100,
    },
    description: {
      type: String,
      trim: true,
      required: true,
      minlength: 5,
      maxlength: 100,
    },
    deliversOn: {
      type: Date,
      required: true,
    },
    mealType: {
      type: String,
      required: true,
      enumValues: ["lunch", "dinner"],
      default: "lunch",
    },
    orderStarts: {
      type: Date,
      required: true,
    },
    orderEnds: {
      type: Date,
      required: true,
    },
    maxOrders: {
      type: Number,
      required: true,
    },
    cost: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Menu", Menu);
