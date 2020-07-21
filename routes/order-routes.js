const { Router } = require("express");
const {
  cancelOrder,
  createOrderForMeal,
  getOrder,
  getOrdersPlacedByMe,
  updateOrder,
} = require("../controllers/orders-controller");
const { userAuthenticated, verifyOrderByCustomer } = require("./middleware");

const orderRoutes = Router();

orderRoutes.use(userAuthenticated);
orderRoutes.post("/", createOrderForMeal);
orderRoutes.get("/", getOrdersPlacedByMe);

orderRoutes.use("/:orderId", verifyOrderByCustomer);

orderRoutes.get("/:orderId", getOrder);
orderRoutes.put("/:orderId", updateOrder);
orderRoutes.delete("/:orderId", cancelOrder);

module.exports = orderRoutes;
