const Menu = require("../models/menu");

const createMenu = function (menu) {
  return new Menu(menu);
};

// get post by id
const getMenuById = function (req) {
  return Menu.findById(req.params.id);
};

// get all the menu
// return query
const getMenu = function (req) {
  return Menu.find();
};

const getMenuOfTheDay = async () => {};

const updateMenuById = async (id, menu) => {};

const deleteMenuById = async (id) => {};

module.exports = {
  createMenu,
  getMenuById,
  getMenu,
  getMenuOfTheDay,
  updateMenuById,
  deleteMenuById,
};
