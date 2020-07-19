const Meal = require("../models/meal");

// creates order given mealId and order details
// order object must have pickupAt (date-time string) and quantity(natural number) fields
const createOrder = async (mealId, order) => {
  const { pickupAt, quantity, totalAmt, customer } = order;
  const mealWithAllOrders = await Meal.findByIdAndUpdate(
    mealId,
    {
      $push: {
        orders: { pickupAt, quantity, totalAmt, customer },
      },
    },
    {
      new: true,
      runValidators: true,
    }
  ).exec();
  const mealWithNewOrder = await getOrderById(
    mealWithAllOrders.orders[mealWithAllOrders.orders.length - 1]
  );

  return mealWithNewOrder;
};

// given orderId returns the order details encapsulated within the meal object that the order belongs to
// returns null if order not found
const getOrderById = async (orderId) => {
  const mealWithOrder = await Meal.findOne(
    {
      "orders._id": orderId,
    },
    {
      orders: {
        $elemMatch: {
          _id: orderId,
        },
      },
    }
  ).exec();
  return mealWithOrder;
};

// given mealId returns all the orders belonging to that meal encapsulated withing meal object
// returns null if mealId not found
const getOrdersForMeal = async (mealId) => {
  const mealWithAllOrders = await Meal.findOne({ _id: mealId })
    .select("orders")
    .exec();
  return mealWithAllOrders;
};

// given orderId and orderUpdates, updates the value of the order fields pickupAt and quantity and returns the new order object encapsulted within the meal object that it belongs to
// returns null if orderId not found
const updateOrderById = async (orderId, orderUpdates) => {
  const { pickupAt, quantity, totalAmt } = orderUpdates;
  const updates = {};
  if (pickupAt) {
    updates["orders.$.pickupAt"] = pickupAt;
  }
  if (quantity) {
    updates["orders.$.quantity"] = quantity;
  }
  if (totalAmt) {
    updates["orders.$.totalAmt"] = totalAmt;
  }
  const mealWithUpdatedOrder = await Meal.findOneAndUpdate(
    {
      "orders._id": orderId,
    },
    updates,
    {
      select: {
        orders: {
          $elemMatch: {
            _id: orderId,
          },
        },
      },
      new: true,
      runValidators: true,
    }
  ).exec();
  return mealWithUpdatedOrder;
};

// given valid orderId, sets cancelAt field within the order to indicate the order is cancelled and returns the cancelled order object encapsulated within the meal object it belongs to
// returns null if order not found
const cancelOrderById = async (orderId) => {
  const mealWithCancelledOrder = await Meal.findOneAndUpdate(
    {
      "orders._id": orderId,
    },
    {
      "orders.$.cancelAt": new Date().toISOString(),
    },
    {
      select: {
        orders: {
          $elemMatch: {
            _id: orderId,
          },
        },
      },
      new: true,
    }
  ).exec();
  return mealWithCancelledOrder;
};

module.exports = {
  cancelOrderById,
  createOrder,
  getOrderById,
  getOrdersForMeal,
  updateOrderById,
};
