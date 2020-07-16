const Menu = require("../models/menu");

const createOrder = async (menuId, order) => {
  const updatedMenu = await Menu.findByIdAndUpdate(
    menuId,
    {
      $push: {
        orders: order,
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

module.exports = {
  createOrder,
  getOrderById,
};
