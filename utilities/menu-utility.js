const Menu = require("../models/menu");

// create new menu
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

// delete specific menu with id
const deleteMenuById = function (id) {
  return Menu.findByIdAndRemove(id);
};

// const getMenuOfTheDay = async () => {};

const updateMenuById = function (id, updatedMenu) {
  return Menu.findByIdAndUpdate(id, updatedMenu, {
    new: true,
  });
};

module.exports = {
  createMenu,
  getMenuById,
  getMenu,
  // getMenuOfTheDay,
  updateMenuById,
  deleteMenuById,
};
