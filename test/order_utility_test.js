const mongoose = require("mongoose");
const expect = require("expect");
const {
  createOrder,
  getOrderById,
  getOrdersForMeal,
  updateOrderById,
} = require("../utilities/order_utility");
const Menu = require("../models/menu");
const { connectTestDB, disconnectTestDb } = require("./config");
let mealWithoutOrders;
let mealWithOrders;

const getRandomObjectId = () => {
  return new mongoose.Types.ObjectId().toString();
};

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
    mealWithOrders = (
      await Menu.create({
        title: "meal item with orders",
        description: "meal item decription",
        deliversOn: new Date(),
        orderStarts: new Date(),
        orderEnds: new Date(),
        maxOrders: 20,
        cost: 1500,
        orders,
      })
    ).toJSON();
    mealWithoutOrders = (
      await Menu.create({
        title: "meal item without orders",
        description: "meal item decription",
        deliversOn: new Date(),
        orderStarts: new Date(),
        orderEnds: new Date(),
        maxOrders: 10,
        cost: 1000,
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
      const updatedMenuItem = await createOrder(mealWithOrders._id, newOrder);
      const { orders } = updatedMenuItem.toJSON();
      expect(orders.length).toBe(mealWithOrders.orders.length + 1);
    });
    it("should not accept the order without quantity", async () => {
      try {
        delete newOrder.quantity;
        await createOrder(mealWithOrders._id, newOrder);
      } catch (e) {
        expect(
          e.errors.orders.message.match(/Path `quantity` is required/)
        ).toBeDefined();
      }
    });
    it("should not accept the order with quantity 0", async () => {
      try {
        newOrder.quantity = 0;
        await createOrder(mealWithOrders._id, newOrder);
      } catch (e) {
        expect(
          e.errors.orders.message.match(/Atleast one meal must be ordered./)
        ).toBeDefined();
      }
    });
    it("should not accept the order without pickupAt value ", async () => {
      try {
        delete newOrder.pickupAt;
        await createOrder(mealWithOrders._id, newOrder);
      } catch (e) {
        expect(
          e.errors.orders.message.match(/Path `pickupAt` is required/)
        ).toBeDefined();
      }
    });
    it("should not accept the order without total value ", async () => {
      try {
        delete newOrder.total;
        await createOrder(mealWithOrders._id, newOrder);
      } catch (e) {
        expect(
          e.errors.orders.message.match(/Path `total` is required/)
        ).toBeDefined();
      }
    });
  });
  describe("getOrderById", () => {
    it("should find meal with order for given order id", async () => {
      const orderId = mealWithOrders.orders[0]._id;
      const mealWithOrder = await getOrderById(orderId);
      expect(mealWithOrder).toBeDefined();
      const { orders } = mealWithOrder;
      expect(orders).toBeDefined();
      expect(orders.length).toBe(1);
      const [order] = orders;
      expect(order._id.toString()).toBe(orderId.toString());
    });
    it("should return Null when non-existent orderId is passed", async () => {
      const orderId = getRandomObjectId();
      const mealWithOrder = await getOrderById(orderId);
      expect(mealWithOrder).toBeNull();
    });
  });
  describe("getOrdersForMeal", () => {
    it("should find meal with all orders", async () => {
      const mealId = mealWithOrders._id.toString();
      const foundMeal = await getOrdersForMeal(mealId);
      expect(foundMeal).toBeDefined();
      expect(foundMeal._id.toString()).toBe(mealId);
      expect(foundMeal.orders.length).toBe(mealWithOrders.orders.length);
    });
    it("should return Null for non existent meal id", async () => {
      const mealId = getRandomObjectId();
      const meal = await getOrdersForMeal(mealId);
      expect(meal).toBeNull();
    });
    it("should return Meal even when there are no orders", async () => {
      const mealId = mealWithoutOrders._id.toString();
      const foundMeal = await getOrdersForMeal(mealId);
      expect(foundMeal).toBeDefined();
      expect(foundMeal._id.toString()).toBe(mealId);
      expect(foundMeal.orders.length).toBe(0);
    });
  });
  describe("updateOrderById", () => {
    it("should update an existing order given order id and updates", async () => {
      const orderId = mealWithOrders.orders[0]._id.toString();
      const orderUpdates = {
        pickupAt: new Date().toISOString(),
        quantity: 5,
      };
      const mealWithUpdatedOrder = await updateOrderById(orderId, orderUpdates);
      expect(mealWithUpdatedOrder).toBeDefined();
      expect(mealWithUpdatedOrder._id.toString()).toBe(
        mealWithOrders._id.toString()
      );
      expect(mealWithUpdatedOrder.orders.length).toBe(1);
      expect(mealWithUpdatedOrder.orders[0]._id.toString()).toBe(orderId);
      expect(mealWithUpdatedOrder.orders[0].quantity).toBe(
        orderUpdates.quantity
      );
    });
    it("should return Null when non-existent order id is passed", async () => {
      const orderId = getRandomObjectId();
      const orderUpdates = {
        pickupAt: new Date().toISOString(),
        quantity: 5,
      };
      const meal = await updateOrderById(orderId, orderUpdates);
      expect(meal).toBeNull();
    });
  });
  it("should pass empty test", () => {});
});
