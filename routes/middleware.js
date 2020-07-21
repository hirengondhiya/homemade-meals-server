const { badRequest } = require("../controllers/controller-utils");
const { getMealById } = require("../utilities/meal-utility");
const { getOrderById } = require("../utilities/order-utility");

const userAuthenticated = function (req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.sendStatus(403);
  }
};

const verifyMealSeller = function (req, res, next) {
  if (req.isAuthenticated()) {
    const { id: mealId } = req.params || {};
    const { _id: userId } = req.user || {};
    if (req.user.isSeller()) {
      getMealById(mealId)
        .exec()
        .then((meal) => {
          if (!meal) {
            return res.status(404).send({ errMsg: `Meal not found.` });
          }
          if (meal.isSoldBy(userId)) {
            req.meal = meal;
            return next();
          }
          return res.sendStatus(403);
        })
        .catch((err) => {
          badRequest(req, res, err);
        });
    } else {
      res.sendStatus(403);
    }
  } else {
    res.sendStatus(403);
  }
};

const verifyOrderByCustomer = function (req, res, next) {
  const { orderId } = req.params || {};
  const { _id: userId } = req.user || {};
  if (req.isAuthenticated()) {
    getOrderById(orderId)
      .then((meal) => {
        if (!meal) {
          return res.status(404).send({ errMsg: `Order not found.` });
        }
        if (meal.orders[0].isRequestedBy(userId)) {
          return next();
        }
        return res.sendStatus(403);
      })
      .catch((err) => {
        badRequest(req, res, err);
      });
  } else {
    res.sendStatus(403);
  }
};

module.exports = {
  userAuthenticated,
  verifyMealSeller,
  verifyOrderByCustomer,
};
