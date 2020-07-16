const {
  createMenu,
  getMenuById,
  getMenu,
  deleteMenuById,
  updateMenuById,
} = require("../utilities/menu-utility");

const createMenuItem = (req, res) => {
  createMenu(req.body).save((err, menu) => {
    if (err) {
      res.status(500);
      res.json({
        error: err.message,
      });
    }
    res.status(201);
    res.send(menu);
  });
};

const getAllMenuItems = (req, res) => {
  getMenu(req).exec((err, menus) => {
    if (err) {
      res.staus(500);
      return res.json({
        error: err.message,
      });
    }
    res.send(menus);
  });
};

// get menu by id
const getMenuItem = (req, res) => {
  getMenuById(req.params.id).exec((err, menuItem) => {
    if (err) {
      res.status(500);
      return res.json({
        error: err.message,
      });
    }
    if (menuItem) {
      return res.send(menuItem);
    }
    res.status(404);
    res.send("Menu not found");
  });
};

// update Menu Item
const updateMenuItem = (req, res) => {
  const { id } = req.params;
  const { body } = req;
  updateMenuById(id, body).exec((err, updatedMenu) => {
    if (err) {
      res.status(500);
      return res.json({
        error: err.message,
      });
    }
    if (updatedMenu) {
      res.status(200);
      res.send(updatedMenu);
    }
    res.sendStatus(404);
  });
};

// delete Menu
const deleteMenuItem = (req, res) => {
  deleteMenuById(req.params.id).exec((err, menu) => {
    if (err) {
      res.status(500);
      return res.json({
        error: err.message,
      });
    }
    if (menu) {
      return res.sendStatus(204);
    }
    res.sendStatus(404);
  });
};

module.exports = {
  createMenuItem,
  getAllMenuItems,
  getMenuItem,
  // getMenuItemOfTheDay,
  updateMenuItem,
  deleteMenuItem,
};
