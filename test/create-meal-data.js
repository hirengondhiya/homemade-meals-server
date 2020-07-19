const Meal = require("../models/meal");
const User = require("../models/user");
const moment = require("moment");

const mealData = {
  title: "meal item 1",
  description: "meal item decription",
  deliversOn: new Date().toISOString(),
  orderStarts: new Date().toISOString(),
  orderEnds: new Date().toISOString(),
  maxOrders: 10,
  cost: 1000,
};

const orderData = {
  pickupAt: new Date().toISOString(),
  quantity: 1,
  totalAmt: 1500,
};

const seller = {
  username: "seller",
  email: "seller@email.com",
  role: "seller",
};

const findOrCreateSeller = async () => {
  let mealSeller = await User.findOne({ role: "seller" });
  if (!mealSeller) {
    mealSeller = await User.create(seller);
  }
  return mealSeller;
};

const buyer = {
  username: "buyer",
  email: "buyer@email.com",
  role: "buyer",
};
const findOrCreateBuyer = async () => {
  let mealBuyer = await User.findOne({ role: "buyer" });
  if (!mealBuyer) {
    mealBuyer = await User.create(buyer);
  }
  return mealBuyer;
};

const createMealDataWithOrders = async () => {
  const orders = [orderData, { ...orderData, quantity: 2, totalAmt: 3000 }];
  const mealWithOrders = await Meal.create({
    ...mealData,
    title: "Meal With Orders",
    orders,
  });
  return mealWithOrders.toJSON();
};

const createMealDataWihoutOrders = async () => {
  const mealWithoutOrders = await Meal.create({
    ...mealData,
    title: "Meal Without Orders",
  });
  return mealWithoutOrders.toJSON();
};

const createMealOrderClosed = async () => {
  const mealOrderClosed = {
    ...mealData,
    title: "Meal With Orders Closed",
    orderStarts: moment().subtract(3, "days").toISOString(),
    orderEnds: moment().subtract(1, "days").toISOString(),
  };
  const meal = await Meal.create(mealOrderClosed);

  return meal.toJSON();
};

const createMealOrdersNotOpened = async () => {
  const mealOrdersNotOpened = {
    ...mealData,
    title: "Meal With Orders Not Opened",
    orderStarts: moment().add(1, "days").toISOString(),
    orderEnds: moment().add(3, "days").toISOString(),
  };
  const meal = await Meal.create(mealOrdersNotOpened);

  return meal.toJSON();
};

const createMealAcceptingOrder = async () => {
  await findOrCreateSeller();
  await findOrCreateBuyer();
  const mealAcceptingOrders = {
    ...mealData,
    title: "Meal Accepting Orders",
    orderStarts: moment().subtract(1, "days").toISOString(),
    orderEnds: moment().add(1, "days").toISOString(),
  };
  const meal = await Meal.create(mealAcceptingOrders);

  return meal.toJSON();
};

const createMealWithSeller = async () => {
  const mealSeller = await findOrCreateSeller();
  const mealWithSeller = {
    ...mealData,
    soldBy: mealSeller._id.toString(),
  };
  const meal = await Meal.create(mealWithSeller);
  return meal;
};

module.exports = {
  createMealAcceptingOrder,
  createMealDataWihoutOrders,
  createMealDataWithOrders,
  createMealOrderClosed,
  createMealOrdersNotOpened,
  createMealWithSeller,
  mealData,
  orderData,
  findOrCreateSeller,
  findOrCreateBuyer,
};
