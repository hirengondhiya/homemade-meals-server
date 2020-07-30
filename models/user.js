const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const User = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enumValues: ["seller", "buyer"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

User.plugin(passportLocalMongoose);

User.methods.isBuyer = function () {
  return this.role === "buyer";
};
User.methods.isSeller = function () {
  return this.role === "seller";
};

module.exports = mongoose.model("User", User);
