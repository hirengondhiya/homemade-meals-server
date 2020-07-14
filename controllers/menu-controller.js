const {
  createMenu,
  getMenuById,
  getMenu,
  getMenuOfTheDay,
  updateMenuById,
  deleteMenuById,
} = require("../utilities/menu-utility");

const createMenuItem = (req, res) => {
  const { body } = req;
  res.send({ operation: "createMenuItem", ...body });
};

const getAllMenuItems = (req, res) => {
  getMenu(req).exec((err, menu) => {
    if (err) {
      res.staus(500);
      return res.json({
        error: err.message,
      });
    }
    res.send(menu);
  });
};

// get menu by id
const getMenuItem = (req, res) => {
  getMenuById(req).exec((err, menuItem) => {
    if (err) {
      res.status(404);
      return res.send("Menu not found");
    }
    res.send(menuItem);
  });
};

const getMenuItemOfTheDay = (req, res) => {
  res.send("getMenuOfTheDay");
};

const updateMenuItem = (req, res) => {
  const { id } = req.params;
  const { body } = req;
  res.send({ operation: "updateMenuItem", id, ...body });
};

const deleteMenuItem = (req, res) => {
  const { id } = req.params;
  const { body } = req;
  res.send({ operation: "deleteMenuItem", id, ...body });
};

module.exports = {
  createMenuItem,
  getAllMenuItems,
  getMenuItem,
  getMenuItemOfTheDay,
  updateMenuItem,
  deleteMenuItem,
};
