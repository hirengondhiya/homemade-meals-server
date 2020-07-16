const mongoose = require("mongoose");
const expect = require("expect");
const { createOrder, getOrderById } = require("../utilities/order_utility");
const Menu = require("../models/menu");
// getOrderById,
// getOrders,
// updateOrderById,
// cancelOrderById
const { connectTestDB, disconnectTestDb } = require("./config");
let menuItem;

describe("Order Utility", () => {
  before(async () => {
    await connectTestDB();
  });
  after(async () => {
    await mongoose.connection.db.dropDatabase();
    await disconnectTestDb();
  });
  beforeEach(async () => {
    const orders = [
      {
        pickupAt: new Date(),
        quantity: 1,
        total: 1500,
      },
      {
        pickupAt: new Date(),
        quantity: 2,
        total: 3000,
      },
    ];
    menuItem = (
      await Menu.create({
        title: "menu item 1",
        description: "menu item decription",
        deliversOn: new Date(),
        orderStarts: new Date(),
        orderEnds: new Date(),
        maxOrders: 20,
        cost: 1500,
        orders,
      })
    ).toJSON();
  });
  afterEach(async () => {
    await mongoose.connection.db.dropCollection("menus");
  });
  describe("createOrder", () => {
    const newOrder = {
      pickupAt: new Date(),
      quantity: 1,
      total: 1500,
    };
    it("should add an order to given menu item", async () => {
      const updatedMenuItem = await createOrder(menuItem._id, newOrder);
      const { orders } = updatedMenuItem.toJSON();
      expect(orders.length).toBe(menuItem.orders.length + 1);
    });
    it("should not accept the order without quantity", async () => {
      try {
        delete newOrder.quantity;
        await createOrder(menuItem._id, newOrder);
      } catch (e) {
        expect(
          e.errors.orders.message.match(/Path `quantity` is required/)
        ).toBeDefined();
      }
    });
    it("should not accept the order with quantity 0", async () => {
      try {
        newOrder.quantity = 0;
        await createOrder(menuItem._id, newOrder);
      } catch (e) {
        expect(
          e.errors.orders.message.match(/Atleast one meal must be ordered./)
        ).toBeDefined();
      }
    });
    it("should not accept the order without pickupAt value ", async () => {
      try {
        delete newOrder.pickupAt;
        await createOrder(menuItem._id, newOrder);
      } catch (e) {
        expect(
          e.errors.orders.message.match(/Path `pickupAt` is required/)
        ).toBeDefined();
      }
    });
    it("should not accept the order without total value ", async () => {
      try {
        delete newOrder.total;
        await createOrder(menuItem._id, newOrder);
      } catch (e) {
        expect(
          e.errors.orders.message.match(/Path `total` is required/)
        ).toBeDefined();
      }
    });
  });
  describe("getOrderById", () => {
    it("should find meal with order for given order id", async () => {
      const orderId = menuItem.orders[0]._id;
      const mealWithOrder = await getOrderById(orderId);
      expect(mealWithOrder).toBeDefined();
      const { orders } = mealWithOrder;
      expect(orders).toBeDefined();
      expect(orders.length).toBe(1);
      const [order] = orders;
      expect(order._id.toString()).toBe(orderId.toString());
    });
    it("should return Null when non-existent orderId is passed", async () => {
      const orderId = new mongoose.Types.ObjectId().toString();
      const mealWithOrder = await getOrderById(orderId);
      expect(mealWithOrder).toBeNull();
    });
  });
  it("should pass empty test", () => {});
});
