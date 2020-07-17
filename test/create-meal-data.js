const Meal = require("../models/meal");
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
  const mealAcceptingOrders = {
    ...mealData,
    title: "Meal Accepting Orders",
    orderStarts: moment().subtract(1, "days").toISOString(),
    orderEnds: moment().add(1, "days").toISOString(),
  };
  const meal = await Meal.create(mealAcceptingOrders);

  return meal.toJSON();
};

module.exports = {
  createMealAcceptingOrder,
  createMealDataWihoutOrders,
  createMealDataWithOrders,
  createMealOrderClosed,
  createMealOrdersNotOpened,
  mealData,
  orderData,
};
