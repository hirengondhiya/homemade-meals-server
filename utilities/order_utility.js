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

module.exports = {
  createOrder,
};
