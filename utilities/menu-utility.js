const Menu = require("../models/menu");

const createMenu = async (menu) => {};

const getMenuById = async (id) => {};

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
