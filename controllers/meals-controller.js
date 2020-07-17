const { badRequest, internalServerError } = require("./controller-utils");

const {
  createMeal,
  getMealById,
  getMeal,
  deleteMealById,
  updateMealById,
} = require("../utilities/meal-utility");

const createMealItem = (req, res) => {
  try {
    createMeal(req.body).save((err, meal) => {
      if (err) {
        badRequest(req, res, err);
      }
      res.status(201).send(meal);
    });
  } catch (err) {
    internalServerError(req, res, err);
  }
};

const getAllMealItems = (req, res) => {
  try {
    getMeal(req).exec((err, meals) => {
      if (err) {
        badRequest(req, res, err);
      }
      res.send(meals);
    });
  } catch (err) {
    internalServerError(req, res, err);
  }
};

// get meal by id
const getMealItem = (req, res) => {
  try {
    getMealById(req.params.id).exec((err, mealItem) => {
      if (err) {
        badRequest(req, res, err);
      }
      if (mealItem) {
        return res.send(mealItem);
      }
      res.status(404).send({ errorMsg: "Meal not found" });
    });
  } catch (err) {
    internalServerError(req, res, err);
  }
};

// update Meal Item
const updateMealItem = (req, res) => {
  try {
    const { id } = req.params;
    const { body } = req;
    updateMealById(id, body).exec((err, updatedMeal) => {
      if (err) {
        badRequest(req, res, err);
      }
      if (updatedMeal) {
        res.status(200);
        res.send(updatedMeal);
      }
      res.status(404).send({ errorMsg: "Meal not found" });
    });
  } catch (err) {
    internalServerError(req, res, err);
  }
};

// delete Meal
const deleteMealItem = (req, res) => {
  try {
    deleteMealById(req.params.id).exec((err, meal) => {
      if (err) {
        badRequest(req, res, err);
      }
      if (meal) {
        return res.sendStatus(204);
      }
      res.status(404).send({ errorMsg: "Meal not found" });
    });
  } catch (err) {
    internalServerError(req, res, err);
  }
};

module.exports = {
  createMealItem,
  getAllMealItems,
  getMealItem,
  // getMealItemOfTheDay,
  updateMealItem,
  deleteMealItem,
};
