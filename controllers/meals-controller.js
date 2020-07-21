const { badRequest, internalServerError } = require("./controller-utils");

const {
  createMeal,
  getMealById,
  getMeal,
  getMealsAccpetingOrders,
  getMealSoldBy,
  getMealsSoldBy,
  deleteMealById,
  updateMealById,
} = require("../utilities/meal-utility");

const createMealItem = (req, res) => {
  try {
    if (req.user.isSeller()) {
      const {
        title,
        description,
        deliversOn,
        mealType,
        orderStarts,
        orderEnds,
        maxOrders,
        cost,
      } = req.body;
      const soldBy = req.user && req.user._id;
      createMeal({
        title,
        description,
        deliversOn,
        mealType,
        orderStarts,
        orderEnds,
        maxOrders,
        cost,
        soldBy,
      })
        .save()
        .then((meal) => {
          res.status(201).json(meal);
        })
        .catch((err) => {
          badRequest(req, res, err);
        });
    } else {
      res.sendStatus(403);
    }
  } catch (err) {
    internalServerError(req, res, err);
  }
};

const getAllMealItems = (req, res) => {
  try {
    getMeal()
      .exec()
      .then((meals) => {
        res.json(meals);
      })
      .catch((err) => {
        badRequest(req, res, err);
      });
  } catch (err) {
    internalServerError(req, res, err);
  }
};

const getMealSoldByMe = (req, res) => {
  try {
    const { id: mealId } = req.params;
    getMealSoldBy(req.user._id, mealId)
      .exec()
      .then((meal) => {
        res.send(meal);
      })
      .catch((err) => {
        badRequest(req, res, err);
      });
  } catch (err) {
    internalServerError(req, res, err);
  }
};

const getAllMealsSoldByMe = (req, res) => {
  try {
    if (req.user.isSeller()) {
      getMealsSoldBy(req.user._id)
        .exec()
        .then((meals) => {
          res.send(meals);
        })
        .catch((err) => {
          badRequest(req, res, err);
        });
    } else {
      res.sendStatus(403);
    }
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
        res.json(meals);
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
  getAllMealsSoldByMe,
  getMealSoldByMe,
  getMealsOpenForOrders,
  updateMealItem,
  deleteMealItem,
};
