const { Router } = require("express");
const {
  createMenuItem,
  getAllMenuItems,
  getMenuItem,
  getMenuOfTheDay,
  updateMenuItem,
  deleteMenuItem,
} = require("../controllers/menu-controller");

const menuRoutes = Router();

menuRoutes.get("/", getAllMenuItems);
menuRoutes.get("/oftheday", getMenuOfTheDay);
menuRoutes.get("/:id", getMenuItem);

menuRoutes.post("/", createMenuItem);
menuRoutes.put("/:id", updateMenuItem);
menuRoutes.delete("/:id", deleteMenuItem);

module.exports = menuRoutes;
