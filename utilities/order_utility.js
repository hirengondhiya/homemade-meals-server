const Menu = require("../models/menu");

const createOrder = async (menuId, order) => {
  try {
    const updatedMenu = await Menu.findByIdAndUpdate(
      menuId,
      {
        $push: {
          orders: order,
        },
      },
      {
        new: true,
      }
    ).exec();
    return updatedMenu;
  } catch (err) {
    throw new Error("Cannot create order for provided menuId");
  }
};

module.exports = {
  createOrder,
};
