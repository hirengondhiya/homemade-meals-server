const { Router } = require("express");
const {
  createMealItem,
  getAllMealItems,
  getMealItem,
  getMealsOpenForOrders,
  updateMealItem,
  deleteMealItem,
} = require("../controllers/meals-controller");

const {
  getOrdersByMeal,
  createOrderForMeal,
} = require("../controllers/orders-controller");

const mealRoutes = Router();

mealRoutes.get("/", getAllMealItems);
mealRoutes.get("/openfororders", getMealsOpenForOrders);
mealRoutes.get("/:id", getMealItem);

mealRoutes.post("/", createMealItem);
mealRoutes.put("/:id", updateMealItem);
mealRoutes.delete("/:id", deleteMealItem);

mealRoutes.get("/:id/orders", getOrdersByMeal);
mealRoutes.post("/:id/orders", createOrderForMeal);

module.exports = mealRoutes;
