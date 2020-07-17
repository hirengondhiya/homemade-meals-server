const { badRequest, internalServerError } = require("./controller-utils");

const {
  createMeal,
  getMealById,
  getMeal,
  getMealsAccpetingOrders,
  deleteMealById,
  updateMealById,
} = require("../utilities/meal-utility");

const createMealItem = (req, res) => {
  try {
    createMeal(req.body)
      .save()
      .then((meal) => {
        res.status(201).send(meal);
      })
      .catch((err) => {
        badRequest(req, res, err);
      });
  } catch (err) {
    internalServerError(req, res, err);
  }
};

const getAllMealItems = (req, res) => {
  try {
    getMeal(req)
      .exec()
      .then((meals) => {
        res.send(meals);
      })
      .catch((err) => {
        badRequest(req, res, err);
      });
  } catch (err) {
    internalServerError(req, res, err);
  }
};

// get meal by id
const getMealItem = (req, res) => {
  try {
    getMealById(req.params.id)
      .exec()
      .then((mealItem) => {
        if (mealItem) {
          return res.send(mealItem);
        }
        res.status(404).send({ errorMsg: "Meal not found" });
      })
      .catch((err) => {
        badRequest(req, res, err);
      });
  } catch (err) {
    internalServerError(req, res, err);
  }
};

const getMealsOpenForOrders = (req, res) => {
  try {
    getMealsAccpetingOrders()
      .then((meals) => {
        res.send(meals);
      })
      .catch((err) => {
        badRequest(req, res, err);
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
    updateMealById(id, body)
      .exec()
      .then((updatedMeal) => {
        if (updatedMeal) {
          res.status(200);
          res.send(updatedMeal);
        }
        res.status(404).send({ errorMsg: "Meal not found" });
      })
      .catch((err) => {
        badRequest(req, res, err);
      });
  } catch (err) {
    internalServerError(req, res, err);
  }
};

// delete Meal
const deleteMealItem = (req, res) => {
  try {
    deleteMealById(req.params.id)
      .exec()
      .then((meal) => {
        if (meal) {
          return res.sendStatus(204);
        }
        res.status(404).send({ errorMsg: "Meal not found" });
      })
      .catch((err) => {
        badRequest(req, res, err);
      });
  } catch (err) {
    internalServerError(req, res, err);
  }
};

module.exports = {
  createMealItem,
  getAllMealItems,
  getMealItem,
  getMealsOpenForOrders,
  updateMealItem,
  deleteMealItem,
};
