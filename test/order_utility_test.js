const mongoose = require("mongoose");
const expect = require("expect");
const { createOrder } = require("../utilities/order_utility");
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
    menuItem = await Menu.create({
      title: "menu item 1",
      description: "menu item decription",
      deliversOn: new Date(),
      orderStarts: new Date(),
      orderEnds: new Date(),
      maxOrders: 20,
      cost: 1500,
    });
    const order = {
      pickupAt: new Date(),
      quantity: 2,
      total: 3000,
    };
    menuItem = await Menu.findByIdAndUpdate(
      menuItem._id,
      {
        $push: {
          orders: order,
        },
      },
      {
        new: true,
      }
    ).exec();
  });
  afterEach(async () => {
    await mongoose.connection.db.dropCollection("menus");
  });
  describe("Create Order", () => {
    const newOrder = {
      pickupAt: new Date(),
      quantity: 1,
      total: 1500,
    };
    it("should add an order to given menu item", async () => {
      const updatedMenuItem = await createOrder(menuItem._id, newOrder);
      const { orders } = updatedMenuItem.toJSON();
      expect(orders.length).toBe(2);
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

  it("should pass empty test", () => {});
});
