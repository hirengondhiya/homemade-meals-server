const mongoose = require("mongoose");
const Meal = require("../models/meal");
const expect = require("expect");
const {
  createOrder,
  getOrderById,
  getOrdersForMeal,
  updateOrderById,
  cancelOrderById,
} = require("../utilities/order-utility");
const { connectTestDB, disconnectTestDb } = require("./config");
const {
  getMealDataWithOrders,
  getMealDataWihoutOrders,
  orderData,
} = require("./create-meal-data");
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
    mealWithOrders = await getMealDataWithOrders();
    mealWithoutOrders = await getMealDataWihoutOrders();
  });
  afterEach(async () => {
    await mongoose.connection.db.dropCollection("meals");
  });
  describe("createOrder", () => {
    let newOrder;
    let error;
    beforeEach(() => {
      newOrder = { ...orderData };
      error = {
        errors: {
          orders: {
            message: "",
          },
        },
      };
    });
    it("should add an order to given meal item", async () => {
      const mealWithNewOrder = await createOrder(mealWithOrders._id, newOrder);
      // console.log(mealWithNewOrder)
      expect(mealWithNewOrder.orders.length).toBe(1);
      expect(mealWithOrders.orders[0].quantity).toBe(newOrder.quantity);
      expect(mealWithOrders.orders[0].totalAmt).toBe(newOrder.totalAmt);
      expect(mealWithOrders.orders[0].pickupAt).toBeDefined();
      expect(mealWithOrders.orders.map((o) => o._id.toString())).not.toContain(
        mealWithNewOrder.orders[0]._id.toString()
      );
    });

    it("should not accept the order without quantity", async () => {
      expect.assertions(1);
      delete newOrder.quantity;
      error.errors.orders.message =
        "Validation failed: quantity: Path `quantity` is required.";
      await expect(
        createOrder(mealWithOrders._id, newOrder)
      ).rejects.toMatchObject(error);
    });

    it("should not accept the order with quantity 0", async () => {
      expect.assertions(1);
      newOrder.quantity = 0;
      error.errors.orders.message =
        "Validation failed: quantity: Atleast one meal must be ordered.";
      await expect(
        createOrder(mealWithOrders._id, newOrder)
      ).rejects.toMatchObject(error);
    });

    it("should not accept the order without pickupAt value ", async () => {
      expect.assertions(1);
      delete newOrder.pickupAt;
      error.errors.orders.message =
        "Validation failed: pickupAt: Path `pickupAt` is required.";
      await expect(
        createOrder(mealWithOrders._id, newOrder)
      ).rejects.toMatchObject(error);
    });

    it("should ignore other fields except quantity, pickupAt and totalAmout", async () => {
      newOrder.randomField = "some infor";
      const mealWithNewOrder = await createOrder(mealWithOrders._id, newOrder);
      expect(mealWithNewOrder.orders[0].randomField).toBeUndefined();
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
        ...orderData,
        quantity: 5,
        totalAmt: 75000,
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
      expect(mealWithUpdatedOrder.orders[0].totalAmt).toBe(
        orderUpdates.totalAmt
      );
    });
    it("should not modify other orders", async () => {
      const orderId = mealWithOrders.orders[0]._id.toString();
      const orderUpdates = {
        ...orderData,
        quantity: 5,
      };
      await updateOrderById(orderId, orderUpdates);
      const meal = await Meal.findById(mealWithOrders._id);
      expect(meal).toBeDefined();
      expect(meal.orders).toBeDefined();
      expect(meal.orders.length).toBe(mealWithOrders.orders.length);
      expect(meal.orders.map((o) => o._id.toString()).sort()).toEqual(
        expect.arrayContaining(
          mealWithOrders.orders.map((o) => o._id.toString()).sort()
        )
      );
      expect(
        meal.orders.find(
          (o) => o._id.toString() === mealWithOrders.orders[1]._id.toString()
        ).quantity
      ).toBe(mealWithOrders.orders[1].quantity);
    });
    it("should return Null when non-existent order id is passed", async () => {
      const orderId = getRandomObjectId();
      const orderUpdates = { ...orderData };
      const meal = await updateOrderById(orderId, orderUpdates);
      expect(meal).toBeNull();
    });
  });
  describe("cancelOrderById", () => {
    it("should cancel an existing order given order id", async () => {
      const orderId = mealWithOrders.orders[0]._id.toString();
      const mealWithCancelOrder = await cancelOrderById(orderId);
      expect(mealWithCancelOrder).toBeDefined();
      expect(mealWithCancelOrder._id.toString()).toBe(
        mealWithOrders._id.toString()
      );
      expect(mealWithCancelOrder.orders.length).toBe(1);
      expect(mealWithCancelOrder.orders[0]._id.toString()).toBe(orderId);
      expect(mealWithCancelOrder.orders[0].quantity).toBe(
        mealWithOrders.orders[0].quantity
      );
      expect(mealWithCancelOrder.orders[0].pickupAt.toISOString()).toBe(
        mealWithOrders.orders[0].pickupAt.toISOString()
      );
      expect(mealWithCancelOrder.orders[0].cancelAt).toBeDefined();
    });
    it("should not cancel other orders", async () => {
      const orderId = mealWithOrders.orders[0]._id.toString();
      await cancelOrderById(orderId);
      await cancelOrderById(orderId);
      const meal = await Meal.findById(mealWithOrders._id);
      expect(meal).toBeDefined();
      expect(meal.orders).toBeDefined();
      expect(meal.orders.length).toBe(mealWithOrders.orders.length);
      expect(meal.orders.map((o) => o._id.toString()).sort()).toEqual(
        expect.arrayContaining(
          mealWithOrders.orders.map((o) => o._id.toString()).sort()
        )
      );
      expect(
        meal.orders.find(
          (o) => o._id.toString() === mealWithOrders.orders[1]._id.toString()
        ).cancelAt
      ).toBeUndefined();
    });
    it("should return Null when non-existent order id is passed", async () => {
      const orderId = getRandomObjectId();
      const meal = await cancelOrderById(orderId);
      expect(meal).toBeNull();
    });
  });
  it("should pass empty test", () => {});
});
