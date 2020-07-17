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

// delete specific meal with id
const deleteMealById = function (id) {
  return Meal.findByIdAndRemove(id);
};

// const getMealOfTheDay = async () => {};

const updateMealById = function (id, updatedMeal) {
  return Meal.findByIdAndUpdate(id, updatedMeal, {
    new: true,
  });
};

module.exports = {
  createMeal,
  getMealById,
  getMeal,
  // getMealOfTheDay,
  updateMealById,
  deleteMealById,
};
