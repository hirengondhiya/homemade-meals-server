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
      res.status(404);
      return res.send("Menu not found");
    }
    res.send(menuItem);
  });
};

// const getMenuItemOfTheDay = (req, res) => {
// 	// let currentDate = "15/07/2020 14:30"
// 	// orderStarts >= currentDate <= orderEnds
// 	res.send('getMenuOfTheDay');
// };

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
    res.status(200);
    res.send(updatedMenu);
  });
};

const deleteMenuItem = (req, res) => {
  deleteMenuById(req.params.id).exec((err) => {
    if (err) {
      res.status(500);
      return res.json({
        error: err.message,
      });
    }
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
