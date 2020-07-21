const Meal = require("../models/meal");

// create new meal
const createMeal = function (newMeal) {
  return new Meal(newMeal);
};

// get post by id
const getMealById = function (id) {
  return Meal.findById(id);
};

// get all the meal
// return query
const getMeal = function () {
  return Meal.find();
};

// get
const getMealsSoldBy = (sellerId) => {
  return Meal.find({ soldBy: sellerId.toString() });
};
const getMealSoldBy = (sellerId, mealId) => {
  return Meal.findOne({
    _id: mealId.toString(),
    soldBy: sellerId.toString(),
  });
};

// delete specific meal with id
const deleteMealById = function (id) {
  return Meal.findByIdAndRemove(id);
};

const getMealsAccpetingOrders = async () => {
  const now = new Date().toISOString();
  // console.log(now)
  const meals = await Meal.find({
    orderStarts: {
      $lte: now,
    },
    orderEnds: {
      $gt: now,
    },
  }).select("-orders");
  return meals;
};

const updateMealById = function (id, updatedMeal) {
  Object.keys(updatedMeal).forEach(
    (key) =>
      (updatedMeal[key] === undefined ||
        // do not allow _id, soldBy, orders to be updated while updating a meal
        key === "_id" ||
        key === "soldBy" ||
        key === "orders") &&
      delete updatedMeal[key]
  );
  return Meal.findByIdAndUpdate(
    id,
    {
      $set: updatedMeal,
    },
    {
      runValidators: true,
      new: true,
    }
  );
};

module.exports = {
  getMealSoldBy,
  getMealsSoldBy,
  createMeal,
  getMealById,
  getMeal,
  getMealsAccpetingOrders,
  updateMealById,
  deleteMealById,
};
