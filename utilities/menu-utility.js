const Menu = require("../models/menu");

const createMenu = function (newMenu) {
  return new Menu(newMenu);
};

// get post by id
const getMenuById = function (id) {
  return Menu.findById(id);
};

// get all the menu
// return query
const getMenu = function () {
  return Menu.find();
};

const deleteMenuById = function (id) {
  return Menu.findByIdAndRemove(id);
};

// const getMenuOfTheDay = async () => {};

// const updateMenuById = async (id, menu) => {};

module.exports = {
  createMenu,
  getMenuById,
  getMenu,
  // getMenuOfTheDay,
  // updateMenuById,
  deleteMenuById,
};
