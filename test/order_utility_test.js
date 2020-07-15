const mongoose = require("mongoose");
const expect = require("expect");
const { createOrder } = require("../utilities/order_utility");
const Menu = require("../models/menu");
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
    // console.log(menuItem.toJSON())
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
  });

  it("should pass empty test", () => {});
});
