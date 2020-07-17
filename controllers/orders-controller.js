const { badRequest, internalServerError } = require("./controller_utils");
const {
  cancelOrderById,
  createOrder,
  getOrderById,
  getOrdersForMeal,
  updateOrderById,
} = require("../utilities/order_utility");

const createOrderForMeal = (req, res) => {
  try {
    const { id: mealId } = req.params;
    const { body: order } = req;
    createOrder(mealId, order)
      .then((mealWithNewOrder) => {
        if (mealWithNewOrder) {
          return res.send(mealWithNewOrder.toObject());
        }
        res.status(404).send(new Error(`Meal with ${mealId} not found.`));
      })
      .catch((e) => {
        badRequest(req, res, e);
      });
  } catch (err) {
    internalServerError(req, res, err);
  }
};

const getOrder = (req, res) => {
  try {
    const { orderId } = req.params;
    getOrderById(orderId)
      .then((mealWithOrder) => {
        if (mealWithOrder) {
          return res.send(mealWithOrder.toObject());
        }
        res.status(404).send(new Error(`Order with ${orderId} not found.`));
      })
      .catch((e) => {
        badRequest(req, res, e);
      });
  } catch (err) {
    internalServerError(req, res, err);
  }
};

const getOrdersByMeal = (req, res) => {
  try {
    const { id: mealId } = req.params;
    getOrdersForMeal(mealId)
      .then((mealWithOrders) => {
        if (mealWithOrders) {
          return res.send(mealWithOrders.toObject());
        }
        res.status(404).send(new Error(`Meal with ${mealId} not found.`));
      })
      .catch((e) => {
        badRequest(req, res, e);
      });
  } catch (err) {
    internalServerError(req, res, err);
  }
};

const updateOrder = (req, res) => {
  try {
    const { orderId } = req.params;
    const { body: orderUpdates } = req;
    updateOrderById(orderId, orderUpdates)
      .then((mealWithOrder) => {
        if (mealWithOrder) {
          return res.send(mealWithOrder.toObject());
        }
        res.status(404).send(new Error(`Order with ${orderId} not found.`));
      })
      .catch((e) => {
        badRequest(req, res, e);
      });
  } catch (err) {
    internalServerError(req, res, err);
  }
};

const cancelOrder = (req, res) => {
  try {
    const { orderId } = req.params;
    cancelOrderById(orderId)
      .then((mealWithCancelOrder) => {
        if (mealWithCancelOrder) {
          return res.sendStatus(204);
        }
        res.status(404).send(new Error(`Order with ${orderId} not found.`));
      })
      .catch((e) => {
        badRequest(req, res, e);
      });
  } catch (err) {
    internalServerError(req, res, err);
  }
};

module.exports = {
  createOrderForMeal,
  getOrder,
  getOrdersByMeal,
  updateOrder,
  cancelOrder,
};
