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

const getMenuItem = (req, res) => {
  const { id } = req.params;
  res.send({ operation: "getMenuItem", id });
};

const getMenuOfTheDay = (req, res) => {
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
  getMenuOfTheDay,
  updateMenuItem,
  deleteMenuItem,
};
