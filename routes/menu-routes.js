const { Router } = require("express");
const {
  createMenuItem,
  getAllMenuItems,
  getMenuItem,
  // getMenuItemOfTheDay,
  updateMenuItem,
  deleteMenuItem,
} = require("../controllers/menu-controller");

const {
  getOrdersByMeal,
  createOrderForMeal,
} = require("../controllers/orders-controller");

const menuRoutes = Router();

menuRoutes.get("/", getAllMenuItems);
// menuRoutes.get("/oftheday", getMenuItemOfTheDay);
menuRoutes.get("/:id", getMenuItem);

menuRoutes.post("/", createMenuItem);
menuRoutes.put("/:id", updateMenuItem);
menuRoutes.delete("/:id", deleteMenuItem);

menuRoutes.get("/:id/orders", getOrdersByMeal);
menuRoutes.post("/:id/orders", createOrderForMeal);

module.exports = menuRoutes;
