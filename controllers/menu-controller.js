const { badRequest, internalServerError } = require("./controller_utils");

const {
  createMenu,
  getMenuById,
  getMenu,
  deleteMenuById,
  updateMenuById,
} = require("../utilities/menu-utility");

const createMenuItem = (req, res) => {
  try {
    createMenu(req.body).save((err, menu) => {
      if (err) {
        badRequest(req, res, err);
      }
      res.status(201).send(menu);
    });
  } catch (err) {
    internalServerError(req, res, err);
  }
};

const getAllMenuItems = (req, res) => {
  try {
    getMenu(req).exec((err, menus) => {
      if (err) {
        badRequest(req, res, err);
      }
      res.send(menus);
    });
  } catch (err) {
    internalServerError(req, res, err);
  }
};

// get menu by id
const getMenuItem = (req, res) => {
  try {
    getMenuById(req.params.id).exec((err, menuItem) => {
      if (err) {
        badRequest(req, res, err);
      }
      if (menuItem) {
        return res.send(menuItem);
      }
      res.status(404).send("Menu not found");
    });
  } catch (err) {
    internalServerError(req, res, err);
  }
};

// update Menu Item
const updateMenuItem = (req, res) => {
  try {
    const { id } = req.params;
    const { body } = req;
    updateMenuById(id, body).exec((err, updatedMenu) => {
      if (err) {
        badRequest(req, res, err);
      }
      if (updatedMenu) {
        res.status(200);
        res.send(updatedMenu);
      }
      res.status(404).send("Menu not found");
    });
  } catch (err) {
    internalServerError(req, res, err);
  }
};

// delete Menu
const deleteMenuItem = (req, res) => {
  try {
    deleteMenuById(req.params.id).exec((err, menu) => {
      if (err) {
        badRequest(req, res, err);
      }
      if (menu) {
        return res.sendStatus(204);
      }
      res.status(404).send("Menu not found");
    });
  } catch (err) {
    internalServerError(req, res, err);
  }
};

module.exports = {
  createMenuItem,
  getAllMenuItems,
  getMenuItem,
  // getMenuItemOfTheDay,
  updateMenuItem,
  deleteMenuItem,
};
