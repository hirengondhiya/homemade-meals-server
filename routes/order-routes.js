const { Router } = require("express");
const {
  getOrder,
  updateOrder,
  cancelOrder,
} = require("../controllers/orders-controller");

const orderRoutes = Router();

orderRoutes.get("/:orderId", getOrder);
orderRoutes.put("/:orderId", updateOrder);
orderRoutes.delete("/:orderId", cancelOrder);

module.exports = orderRoutes;
