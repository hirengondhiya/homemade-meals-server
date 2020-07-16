const Menu = require("../models/menu");

const createOrder = async (menuId, order) => {
  const { pickupAt, quantity } = order;
  const updatedMenu = await Menu.findByIdAndUpdate(
    menuId,
    {
      $push: {
        orders: { pickupAt, quantity },
      },
    },
    {
      new: true,
      runValidators: true,
    }
  ).exec();
  return updatedMenu;
};

const getOrderById = async (orderId) => {
  const mealWithOrder = await Menu.findOne(
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
const getOrdersForMeal = async (mealId) => {
  const mealWithAllOrders = await Menu.findOne({ _id: mealId })
    .select("orders")
    .exec();
  return mealWithAllOrders;
};

module.exports = {
  createOrder,
  getOrderById,
  getOrdersForMeal,
};
