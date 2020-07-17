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

const getMealDataWithOrders = async () => {
  const orders = [orderData, { ...orderData, quantity: 2, totalAmt: 3000 }];
  const mealWithOrders = await Meal.create({ ...mealData, orders });
  return mealWithOrders.toJSON();
};

const getMealDataWihoutOrders = async () => {
  const mealWithoutOrders = await Meal.create(mealData);
  return mealWithoutOrders.toJSON();
};

const getMealOrderClosed = async () => {
  const mealOrderClosed = {
    ...mealData,
    orderStarts: moment().subtract(3, "days").toISOString(),
    orderEnds: moment().subtract(1, "days").toISOString(),
  };
  const meal = await Meal.create(mealOrderClosed);

  return meal.toJSON();
};

const getMealOrdersNotOpened = async () => {
  const mealOrdersNotOpened = {
    ...mealData,
    orderStarts: moment().add(1, "days").toISOString(),
    orderEnds: moment().add(3, "days").toISOString(),
  };
  const meal = await Meal.create(mealOrdersNotOpened);

  return meal.toJSON();
};

const getMealAcceptingOrder = async () => {
  const mealAcceptingOrders = {
    ...mealData,
    orderStarts: moment().subtract(1, "days").toISOString(),
    orderEnds: moment().add(1, "days").toISOString(),
  };
  const meal = await Meal.create(mealAcceptingOrders);

  return meal.toJSON();
};

module.exports = {
  getMealAcceptingOrder,
  getMealDataWihoutOrders,
  getMealDataWithOrders,
  getMealOrderClosed,
  getMealOrdersNotOpened,
  mealData,
  orderData,
};
