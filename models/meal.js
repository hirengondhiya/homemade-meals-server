const mongoose = require("mongoose");
const moment = require("moment");

const { OrderSchema } = require("./order");
require("./user");
const Schema = mongoose.Schema;

const Meal = new Schema(
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
    orderCount: {
      type: Number,
      default: 0,
    },
    soldBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      autopopulate: true,
    },
    orders: [OrderSchema],
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);
Meal.virtual("dueSoon").get(function () {
  const now = new Date();
  const deliversOnPlus3 = moment(this.deliversOn).add(3, "hours").toDate();
  return this.orderEnds < now && now < deliversOnPlus3;
});
Meal.plugin(require("mongoose-autopopulate"));

Meal.methods.isSoldBy = function (userId) {
  return (
    (this.soldBy && this.soldBy._id.toString() === userId.toString()) || false
  );
};
module.exports = mongoose.model("Meal", Meal);
